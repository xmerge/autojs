/**
 * 执行edge的bing搜索奖励，完成一次循环后退回桌面重新打开（部分手机第二次执行不能find控件）
 * @param {*} packageName 包名，"com.microsoft.emmx"
 * @param {*} loopTimes  循环次数
 */
function edgeReward(packageName, loopTimes) {
    var count = 0;
    var app_edge = app.getAppName(packageName);

    for (var i = 0; i < loopTimes; i++) {
        if (app_edge) {
            app.launch(packageName)
            toastLog("已打开:" + packageName);
        } else {
            toastLog(packageName + " not found! 请安装");
        }
        toastLog("edgeReward执行次数: " + (count + 1));
        if (id("search_box_text").findOne().click()) {
            // toastLog("found box text");
        } else {
            toastLog("搜索框not found ");
        }
        let searchText = "hey" + random(1, 100);
        // 此处不能sleep
        id("url_bar").findOne().setText(searchText);
        sleep(500);
        click(text(searchText).depth(11).findOne().bounds().centerX(), text(searchText).depth(11).findOne().bounds().centerY());
        // if (text(searchText).depth(11).findOne().click()) {
        //     toastLog("执行搜索")
        // } else {
        //     toastLog("未找到搜索点击按钮");
        // }
        sleep(2000);
        // 点击返回键坐标
        click(150, 2280);
        sleep(1000);
        count++;
        // 滑动返回桌面
        swipe(540, 2375, 540, 1500, 300);
        // refresh();
        sleep(2000);
    }

}

/**
 * 学习强国积分
 */
function xxqg() {

}

/**
 * 淘宝签到
 * @param {*} userNames 签到的用户名称
 */
function taobaoAttendance(userNames) {

}


edgeReward("com.microsoft.emmx", 20)