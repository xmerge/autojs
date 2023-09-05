// 设备分辨率宽度
var deviceWidth = device.width
// 设备分辨率高度
var deviceHeight = device.height
var widthRatio = deviceWidth / 1440
var heightRatio = deviceHeight / 3040
console.show()
setScreenMetrics(deviceWidth, deviceHeight);

console.log(deviceHeight / heightRatio)
// swipe(
//     deviceWidth / (2*widthRatio),
//     // deviceHeight / heightRatio,
//     3010,
//     deviceWidth / (2*widthRatio),
//     deviceHeight / (2*heightRatio),
//     300
// );
swipe(540, 2375, 540, 1500, 100);
// swipe(720, 3039, 720, 1888, 300);