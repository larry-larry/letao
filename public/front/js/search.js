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

    // 读取本地存储的数据,并把历史记录数组返回出去,方便数据渲染的时候拿到这个数组
    var jsonStr = localStorage.getItem('search_list');
    // 得到的是json格式的字符串,需要转成数组才可以用
    var arr = JSON.parse(jsonStr);

    // 渲染数据,第二个参数要包装成对象才可以传
    var htmlStr = template('searchTpl', { arr: arr });
    $('.lt_history').html(htmlStr);
})