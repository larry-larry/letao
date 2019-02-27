$(function () {

    // 发送ajax请求,渲染左侧一级分类页面
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function (info) {
            console.log(info);
            var htmlStr = template('leftTpl', info);
            $('.lt_category_left ul').html(htmlStr);

            // 默认一进入页面, 渲染第一个一级分类对应的二级分类
            renderById(info.rows[0].id);
        }
    });

    // 实现左侧一级分类的点击切换类高亮的效果,事件委托
    $('.lt_category_left').on('click', 'a', function () {
        // 移除所有a的current类
        $('.lt_category_left a').removeClass('current');
        // 给点击的那个a加上类
        $(this).addClass('current');

        // 点击的时候,获取到当前一级分类a的id
        var id = $(this).data('id');
        // 点击的时候渲染对应的二级分类
        renderById(id);
    });

    // 根据一级分类的id,请求二级分类的数据,并且渲染右边二级分类的页面
    function renderById(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            success: function (info) {
                console.log(info);
                var htmlStr = template('rightTpl', info);
                $('.lt_category_right ul').html(htmlStr);
            }
        })
    }
})