/**
 * 提交的博客的一些信息 数据库中的表:posts
 *
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */
var UserModel = require("./../models").User,
    crypto = require('crypto'),
    path = require('path');

// Express提供了路由控制权转移的方法，即回调函数的第三个参数next，通过调用next()方法，会将路由控制权转移给后面的规则。
// /检查是否已登录
exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        return res.redirect('/login');
    }
    next();
};
//检查是否已登录
exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        return res.redirect('/');
    }
    next();
};
//注册页面
exports.toRegister = function (req, res) {
    res.render('reg', {
        title: '注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};
//注册用户
exports.doRegister = function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!');
        //req.flash('');
        return res.redirect('/reg');
    }
    //生成密码的散列值

    var createUser = new UserModel(req.body);
    createUser.password = encryptPassword(req.body.password);
    //检查用户名是否已经存在
    UserModel.findOne({name:createUser.name}, function (err, user) {
        if (user) {
            err = '用户已存在!';
        }
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        createUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = user;//用户信息存入session
            req.flash('success', '注册成功!');
            res.redirect('/');
        });
    });
};

//登录页面
exports.toLogin = function (req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};
//登录用户
exports.doLogin = function (req, res) {
    //生成密码的散列值
    var password = encryptPassword(req.body.password);
    //检查用户是否存在
    UserModel.findOne({name: req.body.name}, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在!');
            return res.redirect('/login');
        }
        //检查密码是否一致
        if (user.password != password) {
            req.flash('error', '密码错误!');
            return res.redirect('/login');
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        req.flash('success', '登陆成功!');
        res.redirect('/');
    });
};
//注销
exports.logout = function(req, res){
    req.session.user = null;
    req.flash('success', '注销成功!');
    res.redirect('/');
};
//关于作者
exports.about = function(req, res){
    res.render('about', {
        title: '关于作者',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    })
}
//MD5加密
function encryptPassword(password) {
    return crypto.createHash("md5").update(password).digest("base64");
}

//用户信息
exports.getInfo = function(req, res, next){
    //检查用户是否存在
    UserModel.findOne({name:req.params.name}, function (err, user) {
       return user;
        next();
    });
    next();
}