$(function () {

    // 获取到搜索的关键字
    var key = getSearch('key');
    console.log(key);

    // 1.把获取到的关键字设置给搜索框
    $('.search_input').val(key);

    // 2.一进入页面发送ajax请求,渲染页面,应该以搜索框里面的名称来发送请求,而不是地址栏,因为
    //   用户会改搜索框的内容去搜内容,那么用地址栏的关键字就不合适了    调用函数即可
    render();

    // 3. 点击搜索按钮, 可以搜索渲染数据,有需要发送ajax请求,所以封装ajax复用
    $('.search_btn ').click(function () {
        // 调用函数即可
        render();

    });

    // 4. 先实现点击切换高亮效果
    //    (1) 如果本身没有 current 类, 添加上 current 类, 排他
    //    (2) 如果本身有 current 类, 切换箭头的方向, 切换箭头类名 fa-angle-up  fa-angle-down
    $('.lt_sort a[data-type]').click(function () {
        if ($(this).hasClass('current')) {
            // 有类,切换箭头方向
            $(this).find('i').toggleClass('fa-angle-up').toggleClass('fa-angle-down');
        } else {
            $(this).addClass('current').siblings().removeClass('current');
        }
        // 修改了排序规则后, 重新渲染页面
        render();
    })

    // 封装ajax请求
    // 发送ajax请求, 完成页面渲染, 如果有排序的话, 需要添加排序的参数 
    // 如何判断是否需要排序?  就看有没有高亮的 a
    function render() {
        // 在渲染前, 应该展示的是 loading 的盒子    等数据回来就会覆盖掉这个盒子
        $('.lt_product').html('<div class="loading"></div>');

        // 放一个对象,待会打包传参数给后台,因为后台有要求传入多个参数
        var paramsObj = {};
        // 有三个必传参数
        paramsObj.proName = $('.search_input').val();   //产品名称
        paramsObj.page = 1;                             //第几页
        paramsObj.pageSize = 100;                       //每页的条数

        // 可传的参数, 根据是否需要排序, 决定是否传参
        // 根据是否有高亮的 a, 决定是否需要传参, 进行排序
        var $current = $('.lt_sort a.current');    //看看页面上有没有current类的a   

        if ($current.length === 1) {    //jquery对象是有长度,页面上的a的长度只有两种情况,一种是0,一种是1,
            // 如果为1就是由高亮的a
            // 获取给后台传递的参数名,根据高亮的a身上存的自定义属性data-type的值
            var sortName = $current.data('type');    //哪个a高亮了,就去找它身上的自定义属性值

            // 获取给后台传递的参数值, 根据箭头的方向决定  1升序，2降序   下箭头就传2,反之就是上箭头,传1
            var sortValue = $current.find('i').hasClass('fa-angle-down') ? 2 : 1;

            // 将参数拼接到对象中
            paramsObj[sortName] = sortValue;
        }
        console.log(paramsObj);

        // 发送ajax请求  
        // 让ajax延时1秒执行  为了动画
        setTimeout(function () {
            $.ajax({
                type: 'get',
                url: '/product/queryProduct',
                data: paramsObj,        //上面的打包参数
                dataType: 'json',
                success: function (info) {
                    console.log(info);
                    var htmlStr = template('searchTpl', info);
                    $('.lt_product').html(htmlStr);
                }
            })
        }, 1000)
    }
})