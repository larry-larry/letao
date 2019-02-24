$(function () {
    // 1. 一进入页面, 应该发送 ajax 请求, 获取数据, 动态渲染 (模板引擎)
    // template(模板id, 数据对象)  返回一个 htmlStr
    // 全局声明一下当前页,每条页数,方便各个函数都可以拿到
    var currentPage = 1;  //当前页
    var pageSize = 5      //每条页数
    var currentId;  // 标记当前正在编辑的用户 id
    var isDelete;  // 标记修改用户成什么状态
    render();
    // 封装
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                // info 就是数据对象, 所以在模板中 对象中的所有属性都可以直接使用
                var htmlStr = template('tpl', info);
                // 渲染 tbody
                $('tbody').html(htmlStr);


                // 根据请求回来的数据, 完成分页的初始化显示
                $('#paginator').bootstrapPaginator({
                    // 版本号  默认是2，如果是bootstrap3版本，这个参数必填
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数    后台返回的total是总条数,size是一页多少条,前者除以后者,但是怕有小数,所以向上取整
                    totalPages: Math.ceil(info.total / info.size),
                    // 给页码添加点击事件   第一个参数是封装后的事件对象,第二个是原始的事件对象就是未封装的,
                    // 第三是点击的页码的类型,一般都不用,但是不能删,为了方便开发,就直接写三个值占位
                    // 最后一个参数表示当前点击的page值,点第几页就显示数字几
                    onPageClicked: function (a, b, c, page) {
                        console.log(page);
                        // 现在点击分页还无法渲染页面,所以需要根据点击分页发送ajax请求,因为需要重复发送
                        // ajax请求，所以需要封装一下当前的ajax请求的过程，可以复用
                        // 点击之后 更新 currentPage, 并且重新渲染即可
                        currentPage = page;    //等于最后一个参数
                        render();
                    }
                })
            }
        })
    }


    // 分页初始化测试
    // $('#paginator').bootstrapPaginator({
    //   // 配置版本号
    //   bootstrapMajorVersion: 3,
    //   // 当前页
    //   currentPage: 1,
    //   // 总页数
    //   totalPages: 4,
    //   // 控制控件大小
    //   // size: 'mini',
    //   onPageClicked:function(a, b, c, page){
    //     //为按钮绑定点击事件 page:当前点击的按钮值
    //     console.log('页码被点击了')
    //     console.log(page);
    //   }
    // })


    // 2. 点击表格中的按钮, 显示模态框
    // 事件委托的作用:
    // 1. 给动态创建的元素绑定点击事件
    // 2. 批量绑定点击事件 (效率比较高的)
    // 思路: 使用事件委托绑定按钮点击事件
    // 我需要在点击按钮的时候获取到用户的id,在模态框里点击确认键发送ajax请求,因为我如果在
    // 模态框里点击确定也不知道你点的是哪一个用户的id,点击按钮进入模态框的这一步又不能直接
    // 发送请求修改状态
    $('tbody').on('click', '.btn', function () {
        // 显示模态框
        $('#userModal').modal('show');

        // 获取到当前用户的id,但是需要在发送ajax请求的时候用这个id,所以需要在全局声明
        currentId = $(this).parent().data('id');

        // 获取启用禁用状态
        // 有btn-danger类 => 禁用按钮
        // 禁用按钮 ? 改成禁用状态 0 : 改成启用状态 1
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    });

    // 给模态框的确定按钮, 添加点击事件
    $('#confirmBtn').click(function () {
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#userModal').modal('hide');
                    // 重新调用 render 完成渲染
                    render();
                }
            }
        })
    })
})