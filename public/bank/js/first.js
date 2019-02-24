$(function () {

    // 1. 发送ajax请求, 获取数据, 完成渲染
    var currentPage = 1;  // 当前页
    var pageSize = 5; // 每页多少条
    // 进入页面就渲染
    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('firstTpl', info);
                $('tbody').html(htmlStr);

                // 完成分页初始化
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        console.log(page);
                        // 更新当前页, 并且重新渲染
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    // 2. 点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function () {
        // 显示添加模态框
        $('#addModal').modal('show');
    });


    // 进行表单校验初始化
    $('#form').bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            // 用户名
            categoryName: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        // 提示信息
                        message: '请输入一级分类名称'
                    }
                }
            }
        }
    });


    // 4. 注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交即可
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认的提交
        e.preventDefault();

        // 通过ajax提交
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),   //表单序列化,打包整个表单的数据
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 说明添加成功
                    // 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染页面, 重新渲染第一页   因为添加成功是添加到第一页,那么需要让用户看到自己添加的东西
                    currentPage = 1;
                    render();

                    // 将表单的内容和状态都要重置
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })
})