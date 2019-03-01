$(function () {

    // 一进入用户页面,渲染用户数据
    $.ajax({
        type: 'get',
        url: '/user/queryUserMessage',
        dataType: 'json',
        success: function (info) {
            console.log(info);

            // 先处理错误
            if (info.error === 400) {
                // 说明未登录, 跳转到登录页
                location.href = 'login.html';
                return;
            }

            // 已登录, info中就是用户信息
            var htmlStr = template('userTpl', info);
            $('#userInfo').html(htmlStr);
        }
    });

    // 退出功能
    $('#logout').click(function () {
        // 发ajax请求
        $.ajax({
            type: 'get',
            url: '/user/logout',
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 退出成功跳转回到登录页面
                    location.href = 'login.html';
                }
            }
        })
    })
})