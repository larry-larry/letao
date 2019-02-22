// 测试进度条功能
// 开始
// NProgress.start();
// setTimeout(function () {
//     // 结束
//     NProgress.done();
// }, 2000);


// 在发送第一个ajax请求, 开启进度条
// 在全部的ajax回来, 关闭进度条

// ajax全局事件
// .ajaxComplete(fn);   每个ajax完成时, 都会调用fn回调函数   (完成: 不管成功还是失败)
// .ajaxSuccess(fn);    每个ajax只要成功了, 就会调用fn
// .ajaxError(fn);      每个ajax只要失败了, 就会调用fn
// .ajaxSend(fn);       每个ajax发送前, 都会调用fn

// .ajaxStart(fn);      在第一个ajax开始发送时, 调用fn
// .ajaxStop(fn);       在全部的ajax完成时, 调用fn  (不管成功还是失败)

// 在第一个ajax发送请求时.开启进度条
$(document).ajaxStart(function () {
    // 开启进度条
    NProgress.start();
})
// 在全部的ajax完成时, 关闭进度条
$(document).ajaxStop(function () {
    // 模拟网络延迟
    setTimeout(function () {
        // 结束进度条
        NProgress.done();
    }, 600);
});



// 公用的功能:
// 1. 左侧二级菜单的切换
// 2. 左侧整体菜单的切换
// 3. 公共的退出功能 

// 等待 dom 结构加载完成后, 才会执行
$(function () {
    // 1. 左侧二级菜单的切换
    // 点击category让它的兄弟元素切换显示
    $('.lt_aside .category').click(function () {
        $(this).siblings().stop().slideToggle();
    })

    // 2. 左侧整体菜单的切换
    $('.lt_topbar .icon_menu').click(function () {
        // 让左侧整个菜单切换显示, 改左侧菜单的 left 值
        // 点击的时候给整个侧边栏加类,这个类我们再css设置样式,设成0
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    })
});