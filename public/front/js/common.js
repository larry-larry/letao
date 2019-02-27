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