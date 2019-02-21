$(function () {
    // 1. 进行表单校验配置
    // 校验要求:
    //     (1) 用户名不能为空, 长度为2 - 6位
    //     (2) 密码不能为空, 长度为6 - 12位

    // 进行表单校验初始化
    $('#form').bootstrapValidator({
        // 首先要传的就是fields,它是字段列表,字段列表就是input中name中写的username,password就是字段
        fields: {
            // 用户名
            username: {
                // 校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        // 提示信息
                        message: '用户名不能为空'
                    },
                    // 长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度为2-6位'
                    }
                }
            },
            password: {
                // 配置校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须是6-12位'
                    }
                }
            }
        }
    })
})