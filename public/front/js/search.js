$(function () {

    // 功能使用 localStorage 完成, 使用数组存储
    // localStorage( key, value ); 约定 key 键名: search_list

    // 以下3行代码, 在控制台执行, 可以添加假数据
    // var arr = ['耐克', '阿迪', '老北京', '耐克王'];
    // var jsonStr = JSON.stringify(arr);
    // localStorage.setItem('search_list', jsonStr);

    // 分析功能:
    // 功能1: 历史记录渲染功能
    // 功能2: 清空全部的历史记录
    // 功能3: 删除单个历史记录
    // 功能4: 添加单个历史记录


    // 功能1: 历史记录渲染功能
    // 思路:
    // (1) 获取本地历史
    // (2) 获取得到的是 jsonStr, 需要转成数组
    // (3) 渲染搜索历史列表  (模板引擎: template(模板id, 数据对象) )

    // 一进入页面就渲染页面
    render();

    // 读取本地存储的数据,并把历史记录数组返回出去,方便数据渲染的时候拿到这个数组
    // 逻辑或运算处理获取本地存储为null的时候的报错,||(或)是从左到右找真值,遇到真值
    // 逻辑中断,后面代码不执行,如果没有找到真值,返回最后一个值,因为要求是返回字符串
    // 类型的数据,所以给数组加个引号
    // 把拿到本地存储数据的这一过程封装一下,方便其它地方复用
    function getHistory() {
        var jsonStr = localStorage.getItem('search_list') || '[]';
        // 得到的是json格式的字符串,需要转成数组才可以用
        var arr = JSON.parse(jsonStr);
        // 把arr返回出去
        return arr;
    }

    // 渲染数据,第二个参数要包装成对象才可以传
    // 封装渲染过程,方便复用
    function render() {
        // 获取本地存储数据,也就是得到数组
        var arr = getHistory();
        // 通过模板引擎渲染
        var htmlStr = template('searchTpl', { arr: arr });
        $('.lt_history').html(htmlStr);
    }


    // 功能2: 清空历史记录功能
    // 思路:
    // (1) 点击清空按钮 (事件委托绑定)
    // (2) 移除本地历史的数据 使用 removeItem
    // (3) 页面重新渲染
    $('.lt_history').on('click', '.btn_empty', function () {

        // 参数1: message 内容
        // 参数2: title   标题
        // 参数3: btnArr  按钮文本数组
        // 参数4: callback 按钮点击的回调函数
        mui.confirm('你确认要清空历史记录吗?', '温馨提示', ['取消', '确认'], function (e) {
            // 可以通过 e.index 确定用户的选择, 就是点击的按钮在数组中的下标
            console.log(e);
            if (e.index === 1) {
                localStorage.removeItem('search_list');
                // 重新渲染页面,调用函数即可
                render();
            }
        })
    });



    // 功能3: 删除单个历史记录
    // 思路:
    // (1) 给删除按钮添加点击事件 (事件委托)
    // (2) 从本地获取对应的数组
    // (3) 将该条数据 根据下标 从数组中删除
    // (4) 将已经修改后的数组, 存回本地
    // (5) 页面重新渲染
    $('.lt_history').on('click', '.btn_delete ', function () {

        mui.confirm('你确认要删除该条记录吗?', '温馨提示', ['取消', '确认'], function (e) {
            if (e.index === 1) {
                // 获取到数据,是一个数组
                var arr = getHistory();

                // 获取当前点击项的下标
                var index = $(this).data('index');
                console.log(index);

                // 从数组中删除对应下标的项, 
                // arr.splice(start, deleteCount, item1, item2, item3, ..... );
                // arr.splice(从哪开始删, 删几个, 替换的项1, 替换的项2, 替换的项3, ...);
                arr.splice(index, 1);

                // 将修改后的数组转成json格式字符串再存回本地
                localStorage.setItem('search_list', JSON.stringify(arr));
                // 重新渲染页面
                render();
            }
        })

    });


    // 功能4: 添加单个历史记录功能
    // 思路:
    // (1) 给搜索按钮, 添加点击事件
    // (2) 获取输入框的值, 往数组的最前面加 unshift
    // (3) 转成 jsonStr, 存到本地
    // (4) 重新渲染
    $('.search_btn ').click(function () {

        // 点击获取input框的文本内容
        var key = $('.search_input').val().trim();

        // 如果输入为空,调用插件方法提示一下
        if (key === '') {
            mui.toast('请输入搜索关键字');
            // 并且不执行后面的代码
            return;
        }

        // 调用函数,获取数组
        var arr = getHistory();

        // 判断输入的是否是本地存储数组里的重复项   从头到尾找重复项,找到第一次出现的位置,返回其下标
        // 如果没有找到就返回-1
        var index = arr.indexOf(key);

        if (index != -1) {
            // 说明找到了重复项的下标,就根据下标,删除一项即可
            arr.splice(index, 1);
        }

        // 做一个最多显示多少条历史记录的判断
        if (arr.length >= 6) {
            // 如果超过6,删除数组中最后一项
            arr.pop();
        }

        // 把文本内容存到数组的最前面
        arr.unshift(key);

        // 然后再转成json格式的字符串存到本地区
        localStorage.setItem('search_list', JSON.stringify(arr));

        // 重新渲染页面
        render();

        // 把文本框内容清空
        $('.search_input').val('');
    });
})