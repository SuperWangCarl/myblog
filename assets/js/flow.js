/**
 * @Description: 流程图的js
 * @Auther: SuperWang
 * @Date: 2019/4/12 17:22
 * @Vsersion: 0.0.1
 */
function flow(name, f) {
    var chart = flowchart.parse(f);
    chart.drawSVG(name,
        {
            'x': 30,
            'y': 50,
            'line-width': 3,
            'maxWidth': 500,//ensures the flowcharts fits within a certian width
            'line-length': 50,
            'text-margin': 10,
            'font-size': 14,
            'font': 'normal',
            'font-family': 'Helvetica',
            'font-weight': 'normal',
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'white',
            'yes-text': 'yes',
            'no-text': 'no',
            'arrow-end': 'block',
            'scale': 1,
            'symbols': {
                'start': {
                    'font-color': 'red',
                    'element-color': 'green',
                    'fill': 'yellow'
                },
                'end': {
                    'class': 'end-element'
                }
            },
            'flowstate': {
                'past': {'fill': '#CCCCCC', 'font-size': 12},
                'current': {'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold'},
                'future': {'fill': '#FFFF99'},
                'request': {'fill': 'blue'},
                'invalid': {'fill': '#444444'},
                'approved': {'fill': '#58C4A3', 'font-size': 12, 'yes-text': 'APPROVED', 'no-text': 'n/a'},
                'rejected': {'fill': '#C45879', 'font-size': 12, 'yes-text': 'n/a', 'no-text': 'REJECTED'}
            }
        });
}

$(function () {
    $(".language-flow").each(function (index) {
        let f = $(this);
        let text = f.text();
        var canvas = "canvas" + index;
        f.html("<div id=\"" + canvas + "\"></div>");
        flow(canvas, text);
        //将流程图居中
        $("#"+canvas).css("text-align","center");
        //是否 去除背后的阴影,如果使用 unwrap这去除(将父节点去除,保留子节点)
        // f.unwrap();
    })
})