// 实例化录播图,调用方法,让图片自动轮播
var gallery = mui('.mui-slider');
gallery.slider({
    interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
});

// 区域滚动实例化
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, // 阻尼系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false, //是否显示滚动条
});

// 这个方法专门用于获取地址栏传参
function getSearch(k) {
    // 获取地址栏参数
    var str = location.search;

    //有中文进行解码
    str = decodeURI(str);     // ?key=匡威&name=pp&age=18

    // 去掉最前面的问号
    // str.slice(start, end);  // 包括start, 不包括end
    // str.slice(start);  // 表示从 start 开始截取到最后
    str = str.slice(1);       //  key=匡威&name=pp&age=18

    // 去掉之间的&   会变成一个数组
    var arr = str.split('&');   // ["key=匡威", "name=pp", "age=18"]

    // 去掉之间的=  需要遍历数组
    // 用一个空对象接收待会遍历之后的值
    var obj = {};
    arr.forEach(function (v, i) {
        var key = v.split('=')[0];   //截取之后又是一个数组,所以取得第0项的键
        var value = v.split('=')[1];   //取第一项的值
        obj[key] = value;    //将键值对添加到对象当中
    })
    // 返回出去
    return obj[k];
} 