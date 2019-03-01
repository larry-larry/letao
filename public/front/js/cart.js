$(function () {

    // 一进入页面发送ajax请求, 获取购物车数据
    // 如果已登录, 返回购物车数据
    // 如果未登录, 后台返回 error: 400, 跳转到登陆页
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.error === 400) {
                    // 希望登录后, 再跳回来, 跳转时需要传递地址参数
                    location.href = 'login.html?retUrl=' + location.href;
                    return;
                }

                // 注意: 后台返回的是一个数组, 需要包装成对象
                // 通过模板引擎渲染
                var htmlStr = template('cartTpl', { list: info });
                $('#cartList').html(htmlStr);
            }
        });
    }


    // 删除功能
    // 1. 事件委托给所有删除按钮, 添加点击事件
    // 2. 点击删除按钮时, 获取 id
    // 3. 发送 ajax 请求, 进行删除
    // 4. 重新渲染
    $('.lt_main').on('click', '.btn_delete', function () {
        // 获取点击的a身上设置的自定义属性
        var id = $(this).data('id');

        $.ajax({
            type: 'get',
            url: '/cart/deleteCart',
            data: {
                id: [id]     //后台要求传一个数组
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                // 删除成功,重新渲染页面即可
                render();
            }
        })
    })
})