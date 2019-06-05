/**
 * @Description:动漫图
 * @Auther: SuperWang
 * @Date: 2019/6/5 23:48
 * @Vsersion: 0.0.1
 */
$(function () {
    setTimeout(function () {
        L2Dwidget.init({
            "pluginRootPath": "assets/live2dw/",
            "pluginJsPath": "lib/",
            "pluginModelPath": "assets/",
            "tagMode": false,
            "debug": false,
            "model": {"jsonPath": "{{ site.smartcdn }}/assets/live2dw/assets/Epsilon2.1.model.json"},
            "display": {"position": "right", "width": 150, "height": 300},
            "mobile": {"show": true},
            "log": false
        })
    }, 1000)
})


