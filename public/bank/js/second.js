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

        // button是没法提交数据,需要用到隐藏域进行提交,需要给隐藏域赋值
        // 在点击的时候就获取id设置给隐藏域
        var id = $(this).data('id');
        $('[name="categoryId"]').val(id);

        // 只要给隐藏域赋值了, 此时校验状态应该更新成成功
        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
    });

    // 4. 完成文件上传初始化
    $('#fileupload').fileupload({
        dataType: 'json',
        // 回调函数
        done: function (e, data) {
            console.log(data);
            // 点击之后就会触发回调函数,data里面存了一些参数
            var result = data.result;     // 后台返回的结果
            var picUrl = result.picAddr;   // 获取返回的图片路径
            console.log(picUrl);

            // 把图片路径设置给img
            $('#imgBox img').attr('src', picUrl);

            // img没有提交数据的功能,需要借助隐藏域,把路径设置给隐藏域
            $('[name="brandLogo"]').val(picUrl);

            // 只要隐藏域有值了, 就是更新成成功状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
    });

    // 5.进行表单校验
    $('#form').bootstrapValidator({
        // 配置 excluded 排除项, 对隐藏域完成校验,
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 配置校验字段
        fields: {
            // 选择一级分类
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            // 输入二级分类名称
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            // 二级分类图片
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请选择图片'
                    }
                }
            }
        }
    });

    // 6. 注册表单校验成功事件, 阻止默认的提交, 通过ajax提交
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('#form').serialize(),    //表单序列化,把表单中所有要上传的数据打包
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 添加成功,关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染页面到第一页
                    currentPage = 1;
                    render();

                    // 将表单元素重置 (内容和状态都重置)   
                    $('#form').data('bootstrapValidator').resetForm(true);

                    // button 和 img 不是表单元素, 手动重置
                    $('#dropdownText').text('请选择一级分类');
                    $('#imgBox img').attr('src', './images/none.png');
                }
            }
        })
    })
})