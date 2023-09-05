
//脚本的其他代码

// 设备分辨率宽度
var deviceWidth = device.width
// 设备分辨率高度
var deviceHeight = device.height
var widthRatio = deviceWidth / 1440
var heightRatio = deviceHeight / 3040
// 观演人数
var audienceCount
// 观演人列表，因性能因素，暂时弃用
var audienceAray = []

init();
handlePurchase()

/**
 * 初始化
 */
function init() {
    checker_Permission();
    console.show();   // 显示控制台，结束不自动关闭
    console.setPosition(100, 100);
    console.setTitle("大麦抢票脚本-by XYin", "#FFFFFF", 40);
    console.setCanInput(false);
    sleep(10)
    console.setSize(deviceWidth / 1.2, deviceHeight / 4);
    console.log("初始化完成，设备宽" + deviceWidth + "px, 高" + deviceHeight + "px")
    config_audience()
}

/**
 * 检查权限是否已全部开启
 */
function checker_Permission() {
    // 悬浮窗权限
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        floaty.requestPermission();
        exit();
    } else {
        toastLog('已有悬浮窗权限');
    }
    // 等待无障碍开启
    auto.waitFor();
    // auto.setMode("normal");
}


/**
 * 立即购票
 */
function handlePurchase() {
    var purchaseButton = checker_Begin()
    uiObjParentTraverse(purchaseButton)
    // 选择场次，默认从内场到看台
    selector_Ground()
    var confirmButton = id("btn_buy").findOne();
    if (confirmButton) {
        checker_audienceNum() // 选择观演人数
        uiObjParentTraverse(confirmButton) // 点击提交按钮
    }
    console.log("正在进入确认订单页面...")
    // 确保页面已加载完成
    if (textStartsWith("实名观演人").untilFind()) {
        console.log("已进入提交订单页面")
        selector_CheckBox() // 选择观演人
        submitOrder() // 提交订单
        var bounds_wrapper = validator_busyPage() // 验证是否操作频繁
        if (bounds_wrapper) {
            setScreenMetrics(deviceWidth, deviceHeight);
            swipe(
                bounds_wrapper.left,
                bounds_wrapper.bottom,
                bounds_wrapper.right,
                bounds_wrapper.bottom,
                50
            );
        }
    }
}
/**
 * 如果找到的控件无法点击，寻找父组件直到可以点击
 * @param {*} uiObj uiObject
 * @returns 
 */
function uiObjParentTraverse(uiObj) {
    if (uiObj.click()) {
        return
    }
    while (uiObj.parent()) {
        if (uiObj.click()) {
            // console.log('点击成功');
            return
        } else {
            uiObj = uiObj.parent();
        }
    }
}
/**
 * 
 * @param {*} text 校验是否处于演唱会详情界面
 * @returns 找到的控件 uiObj
 */
function checker_Begin() {
    var text = "已预约";
    let uiButton = textContains(text).findOnce();
    if (uiButton) {
        return uiButton;
    }
    while (!uiButton) {
        toastLog('请进入演唱会详情界面...');
        uiButton = textContains(text).findOne(10000);
    }
    toastLog('已进入演唱会详情界面，等待开始');
    var purchaseButton = null
    while(!purchaseButton) {
        purchaseButton = textContains("立即").findOne(3000);
        console.log("等待开始...")
    }
    return purchaseButton
}
function checker_Clickable(uiObj) {
    if (uiObj.clickable()) {
        uiObj.click()
        console.log("已点击")
        return
    } else {
        uiObjParentTraverse(uiObj)
    }
}
/**
 * 提交订单前选择观影人数
 */
function checker_audienceNum() {
    var addButton = idEndsWith("img_jia").findOne()
    for (let i = 1; i < audienceCount; i++) {
        uiObjParentTraverse(addButton)
    }
}
function validator_busyPage() {
    console.log("开始验证是否操作频繁")
    var busyText = textContains("操作过于").findOne(20000)
    if (busyText) {
        console.log("操作频繁")
        // var butn = textContains("").findOne(2000)
        // var butn = idContains("").findOne(2000)
        var wrapper = idContains("_wrapper").findOne(1000)
        if (wrapper) {
            // var bounds_butn = butn.bounds();
            var bounds_wrapper = wrapper.bounds();
            console.log("已找到滑动控件")
            return bounds_wrapper
            // swipe(
            //     bounds_wrapper.left,
            //     bounds_wrapper.bottom,
            //     bounds_wrapper.right,
            //     bounds_wrapper.bottom,
            //     1000
            // );
        } else {
            console.warn("未找到")
        }
    } else {
        console.log("没有操作频繁")
    }
    return null
}
/**
 * 选择场次，依次递减
 */
function selector_Ground() {
    var butnArray = textContains("内场").untilFind();
    var len = butnArray.length
    for (let i = 0; i < len; i++) {
        let element = butnArray[len - i -1]
        // console.log(element.text())
        uiObjParentTraverse(element);
        if (textContains("提交缺货登记").findOnce()) {
            continue
        } else {
            return
        }
    }
    var butnArray = textContains("看台").untilFind();
    var len = butnArray.length
    for (let i = 0; i < len; i++) {
        let element = butnArray[len - i - 1]
        // console.log(element.text())
        uiObjParentTraverse(element);
        if (textContains("提交缺货登记").findOnce()) {
            continue
        } else {
            return
        }
    }

}
/**
 * 选择观影人
 */
function selector_CheckBox() {
    var checkBoxArray = idContains("checkbox").find()
    // var checkBoxArray = id("checkbox").find()
    if (checkBoxArray.empty()) {
        console.log("没有找到选择框");
        selector_CheckBox();
    } else {
        var checkBoxArrayLen = checkBoxArray.length
        for (let i = 0; i < audienceCount; i++) {
            if (i >= checkBoxArrayLen) {
                console.error("已有观演人超过可选观影人限制")
                break
            }
            let checkbox = checkBoxArray[i];
            uiObjParentTraverse(checkbox);
            console.log("已勾选观影人" + (i + 1));
        }
    }
}
/**
 * 查找输入控件并填入内容
 * @param {string} text 查找的控件placeholder
 * @param {string} content 填写内容
 */
function inputer(text, content) {
    var textObj = textContains(text).editable().findOne(1000)
    if (textObj) {
        textObj.setText(content)
        console.log("已填写联系人: ", content)
    }
}
function config_submitButtonPos() {
    var textObj = null;
    while (!textObj) {
        toastLog('请进入演唱会提交界面...');
        textObj = textContains("实名观演人").findOne(10000);
    }
    textStartsWith("实名观演人").untilFind();
    alert("位置确认", "请在按下确定后，手动点击“提交订单”按钮");
}
/**
 * 设置观影人数
 * 为了提升性能，默认不校验观影人姓名，而是直接选择最前面的观影人
 */
function config_audience() {
    audienceCount = dialogs.input("请输入观演人数", "1")
    console.log("观影人数: ", audienceCount)
    // for (let i = 0; i < audienceCount; i++) {
    //     let title = "请输入观演人" + (i + 1) + "姓名"
    //     let audienceName = dialogs.prompt(title)
    //     console.log("观演人" + (i+1) + ": " +  audienceName)
    //     audienceAray.push(
    //         audienceName
    //     )
    // }
}


/**
 * 提交订单
 */
function submitOrder() {
    setScreenMetrics(1440, 3040);
    click((1016 + 1366) / 2, (2809 + 2949) / 2);
}