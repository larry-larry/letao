$(function () {

    // 获取地址栏的商品id
    var productId = getSearch('productId');

    // 一进入页面就发送ajax请求,根据地址栏传递的商品详情的id渲染页面
    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (info) {
            console.log(info);
            var htmlStr = template('productTpl', info);
            $('.lt_main .mui-scroll').html(htmlStr);


            // 初始化轮播图, 获得slider插件对象   没有这一步,轮播图是动不了的
            // 因为数据都是动态渲染的,所以要重新初始化轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            // 初始化数字框    动态添加的numbox组件需要手动初始化
            mui('.mui-numbox').numbox();
        }
    });


    // 给页码添加可选功能 (事件委托)
    $('.lt_main').on('click', '.lt_size span', function () {
        // 给自己加上current类,移除其它
        $(this).addClass('current').siblings().removeClass('current');
    })


    // 加入购物车功能, 正常发请求, 如果后面返回 400 用户未登录, 跳转到登录页即可
    $('#addCart').click(function () {
        // 后台需要传递三个参数,尺码,数量,以及商品的id,商品id在渲染当前页面的时候就已经从地址栏获取到了
        // 获取 size 尺码, 和 num 数量
        var size = $('.lt_size  span.current').text();   //找到有current类的span的文本对应的就是用户选择的尺码
        // 如果用户没有选择尺码，就获取不到尺码的，获取到的是null，所以要提示用户
        // null取反为true
        if (!size) {
            mui.toast('请选择尺码');
            return;
        }

        // 获取数量,就是input框里的值
        var num = $('.mui-numbox-input').val();

        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/cart/addCart',
            data: {
                size: size,
                num: num,
                productId: productId
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.error === 400) {
                    // 如果未登录,跳到登录页    由于将来还要跳回来, 所以需要将当前页的地址作为参数传递过去
                    // retUrl是要跳转页面的意思,后面跟要跳的地址,,,,location.href可以获取到当前
                    location.href = 'login.html?retUrl=' + location.href;
                    return;
                }

                if (info.success) {
                    // 已登录, 加入购物车成功, 给用户成功提示
                    mui.confirm('加入成功', '温馨提示', ['去购物车', '继续浏览'], function (e) {
                        // e.index 标记用户点击的按钮的下标
                        if (e.index === 0) {
                            location.href = 'cart.html';
                        }
                    })
                }
            }
        })
    })
})