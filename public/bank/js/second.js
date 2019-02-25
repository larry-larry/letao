$(function () {

    // 一进入页面先调用函数进行渲染页面
    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页条数
    render();

    // 发送ajax请求动态渲染数据
    // 封装ajax,需要复用
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('secondTpl', info);
                // 渲染tbody
                $('tbody').html(htmlStr);

                // 实现分页插件的初始化
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    //为按钮绑定点击事件 page:当前点击的按钮值,abc是占位的
                    onPageClicked: function (a, b, c, page) {
                        console.log(page);
                        // 点击更新当前页
                        currentPage = page;
                        // 重新渲染新的页面
                        render();
                    }
                })
            }
        })
    }

    // 点击添加按钮显示模态框
    $('#addBtn').click(function () {
        // 显示模态框的时候就应该发送ajax请求获取到一级分类的数据,因为网络大概有500ms的延时
        // 你在点击选择一级分类的时候再请求就会有可能部分数据没回来,那么下拉框有可能有空白
        $('#addModal').modal('show');

        // 发送ajax请求, 获取一级分类的全部数据, 将来用于渲染
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('dropdownTpl', info);
                // 渲染下拉框
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    // 3. 给下拉菜单添加可选功能,点击下拉菜单里面的a,获取到a的文本值,赋值给button即可
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取a的文本
        var txt = $(this).text();
        // 赋值给button
        $('#dropdownText').text(txt);
    })
})