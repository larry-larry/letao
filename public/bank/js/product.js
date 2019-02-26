$(function () {

    var currentPage = 1;   //当前页
    var pageSize = 2;      //每页总数
    var picArr = [];  // 存放所有用于提交的图片
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

        // 隐藏域有值了之后就把校验状态手动更新为VALID成功
        $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
    });


    // 4. 进行文件上传初始化
    $('#fileupload').fileupload({
        dataType: 'json',
        // 图片上传完成的回调函数
        done: function (e, data) {
            console.log(data);
            // 点击之后就会触发回调函数,data里面存了一些参数
            // 获取后台返回的图片路径
            var picObj = data.result;
            var picUrl = picObj.picAddr;
            console.log(picObj);

            // 将后台返回的图片对象,放到我自己定义数组的最前面
            picArr.unshift(picObj);
            console.log(picArr);

            // 动态创建img显示在预览区域   并且每添加一张图片就添加到最前面
            $('#imgBox').prepend(' <img style="height: 100px;" src="' + picUrl + '" alt="">');

            // 限制最多只能上传三张图片
            if (picArr.length > 3) {
                // 删除数组的最后一项,图片结构的最后一张图也要删除
                picArr.pop();
                // 找到最后一张图片,并删除,找最后一个img类型的元素
                $('#imgBox img:last-of-type').remove();
            }

            // 如果数组里的图片有三张了,就手动更新校验成功状态
            if (picArr.length === 3) {
                $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    });


    // 5. 添加表单校验功能
    $('#form').bootstrapValidator({
        // 配置excluded 排除项, 对隐藏域完成校验
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置字段列表
        fields: {
            brandId: {
                // 校验规则
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 1  10  111  1111
                    // 正则校验, 必须非零开头的数字
                    // \d  0-9 数字
                    // ?   表示 0 次 或 1 次
                    // +   表示 1 次 或 多次
                    // *   表示 0 次 或 多次
                    // {n} 表示 出现 n 次
                    // {n, m}  表示 出现 n ~ m 次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    // 尺码格式, 必须是 xx-xx 格式,  xx 是两位的数字
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40 '
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    });


    // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交数据进行添加
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 接口文档要求上传表单的基本数据并且还要上传三张图片,并且有固定的的格式
        // 获取基本表单数据
        var paramsStr = $('#form').serialize();


        // 还需要拼接上图片数据  也就是数组里面的图片 picArr
        // 也就是类似这种格式:key=value&key1=value1&key2=value2
        paramsStr += '&picArr=' + JSON.stringify(picArr);
        console.log(paramsStr);

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染页面,并且是第一页
                    currentPage = 1;
                    render();

                    // 重置表单元素的状态以及内容
                    $('#form').data('bootstrapValidator').resetForm(true);

                    // 手动重置文本以及图片的内容
                    $('#dropdownText').text('请选择二级分类');
                    $('#imgBox img').remove();
                    // 并把数组清空
                    picArr = [];
                }
            }
        })
    })
})