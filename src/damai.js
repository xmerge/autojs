
//脚本的其他代码

// 设备分辨率宽度
var deviceWidth = device.width
// 设备分辨率高度
var deviceHeight = device.height
var widthRatio = deviceWidth / 1440
var heightRatio = deviceHeight / 3040
// 观演人数
var audienceCount
// 场次购买顺序
var groundRank = []
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
    config_ground()
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
    var confirmButton = id("btn_buy").findOnce();
    if (!confirmButton) {
        // 选择场次，默认从内场到看台
        selector_Ground()
        var confirmButton = id("btn_buy").findOne();
    }
    if (confirmButton) {
        checker_audienceNum() // 选择观演人数
        uiObjParentTraverse(confirmButton) // 点击提交按钮
    }
    console.log("正在进入确认订单页面...")
    // 确保页面已加载完成
    if (textStartsWith("实名观演人").untilFind()) {
        console.log("已进入提交订单页面")
        selector_CheckBox() // 选择观演人
        // submitOrder() // 提交订单
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
 * 校验是否处于演唱会详情界面
 * @param {*} text 
 * @returns 找到的控件 uiObj
 */
function checker_Begin() {
    var counter = 1;
    var text = "已预约";
    let uiButton = textContains(text).findOnce();
    let likeText = textContains("帮助").findOnce();
    toastLog('请进入演唱会详情界面...');
    while (!(uiButton && likeText)) {
        likeText = textContains("帮助").findOnce();
        uiButton = textContains(text).findOnce();
        if (uiButton && likeText) break
        uiButton = textContains("立即预订").findOnce();
        if (uiButton && likeText) break
        uiButton = textContains("立即购买").findOnce();
        if (uiButton && likeText) break
        uiButton = textContains(text).findOnce();
    }
    toastLog('已进入演唱会详情界面，等待开始...');
    var purchaseButton = textContains("立即预订").findOnce();
    while (!purchaseButton) {
        purchaseButton = textContains("立即预订").findOnce();
        if (purchaseButton) break
        purchaseButton = textContains("立即购买").findOnce();
        if (purchaseButton) break
        // 测试
        // purchaseButton = textContains("已预约").findOnce();
        // if (purchaseButton) break
        // console.log("脚本运行中，等待开始...", counter++)
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
    // var butnArray = textContains("内场").untilFind();
    // // var butnArray = textContains("內场").untilFind();
    // var len = butnArray.length
    // for (let i = 0; i < len; i++) {
    //     let element = butnArray[len - i - 1]
    //     console.log(element.text())
    //     uiObjParentTraverse(element);
    //     if (textContains("提交缺货登记").findOnce()) {
    //         continue
    //     } else {
    //         return
    //     }
    // }
    // var butnArray = textContains("看台").untilFind();
    // var len = butnArray.length
    // for (let i = 0; i < len; i++) {
    //     let element = butnArray[len - i - 1]
    //     console.log(element.id())
    //     uiObjParentTraverse(element);
    //     if (textContains("提交缺货登记").findOnce()) {
    //         continue
    //     } else {
    //         continue
    //     }
    // }
    var len = groundRank.length
    for (let i = 0; i < len; i++) {
        let element = textContains(groundRank[i]).findOne(1000)
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
    console.log("已设置观影人数: ", audienceCount)
    console.log("当前为快速模式，将默认选择前" + audienceCount + "位观演人")
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
 * 设置抢票优先票档
 */
function config_ground() {
    console.log("请进入场次票档界面...")
    var txtArray = idContains("item_text").untilFind();
    groundArray = txtArray.filter(item => item.text().includes('元'))
    var len = groundArray.length
    for (let i = 0; i < len; i++) {
        // let options = groundArray.map(item => item.text());
        let options = groundArray
            .filter(item => !groundRank.includes(item.text()))
            .map(item => item.text());
        let selectedGround = options[dialogs.singleChoice("请选择优先级为" + (i + 1) + "的票档", options)];
        groundRank.push(selectedGround)
    }
    console.log("票档优先级设置完成")
    console.log("优先购买票档为：", groundRank[0])
    console.log("请选择优先票档后在下方点击预约")
}


/**
 * 提交订单
 */
function submitOrder() {
    setScreenMetrics(1440, 3040);
    click((1016 + 1366) / 2, (2809 + 2949) / 2);
}