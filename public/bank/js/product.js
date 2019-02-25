$(function () {

    var currentPage = 1;   //当前页
    var pageSize = 2;      //每页总数
    // 进入页面就调用函数渲染页面
    render();

    function render() {
        // 发送ajax请求,获取数据,动态渲染页面
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('productTpl', info);
                // 渲染tbody
                $('tbody').html(htmlStr);

                // 实现分页    先初始化
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        console.log(page);
                        // 点击分页发送ajax请求,获取数据重新渲染当前页,封装ajax,复用
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }


    // 2. 点击添加按钮, 显示添加模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');

        // 当点击添加按钮的时候就立即发送ajax请求,获取全部二级分类的数据
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
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


    // 3. 给下拉菜单下面的 a 添加点击事件 (事件委托)
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取到a的文本内容
        var txt = $(this).text();
        // 设置给下拉框
        $('#dropdownText').text(txt);

        // button没法提交数据,交给隐藏域去提交
        // 点击获取到当前a的id
        var id = $(this).data('id');
        // 把id设置给隐藏域
        $('[name="brandId"]').val(id);
    });


    // 4. 进行文件上传初始化
    // $('#fileupload').fileupload({
    //     dataType: 'json',
    //     // 图片上传完成的回调函数
    //     done: function (e, data) {
    //         console.log(data);
    //         // 点击之后就会触发回调函数,data里面存了一些参数
    //         // 获取后台返回的图片路径
    //         var picObj = data.result;
    //         var picUrl = picObj.picAddr;
    //     }
    // })
})