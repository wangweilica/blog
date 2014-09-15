/**
 * 提交的博客的一些信息 数据库中的表:posts
 *
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */
var markdown = require('markdown').markdown,
    BlogModel = require("./../models").Blog,
    blogDao = require("../dao/BlogDao"),
    User = require("./user.js"),
    path = require('path');
exports.index = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
    var query = {};
    if (req.params.author != undefined) {
        query.author = req.params.author;
    }
    // 拉取所有的博客信息
    //查询并返回第 page 页的10篇文章
    blogDao.countByQuery(query, function (err, total) {
        blogDao.getByQuery(query, null, {skip:(page - 1) * 10,sort:{'time.date': -1},limit: 10}, function (err, blogs) {
            //解析markdown为html
            blogs.forEach(function (blog) {
                blog.post = markdown.toHTML(blog.post);
            });
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: blogs,
                page: page,
                isFirstPage: (page - 1) === 0,
                isLastPage: ((page - 1) * 10 + blogs.length) === total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
};
//发布博文页面
exports.toPost = function(req, res){
    res.render('post', {
        title: '发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};
//发布博文
exports.doPost = function(req, res){
    var currentUser = req.session.user;
    var blog = new BlogModel(req.body);
    blog.author = currentUser.name;
    blog.time = getNowTime();
    /* tags = [
         {"tag": req.body.tag1},
         {"tag": req.body.tag2},
         {"tag": req.body.tag3}
     ]*/
    blog.save(function (err, blog) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发布成功!');
        res.redirect('/');
    });
};
//获取标签列表
exports.getTags = function(req, res){
    blogDao.getByQuery({}, {"tags":1}, {distinct:"tags"}, function (err,posts) {
        res.render('tags', {
            title: '标签',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}
//获取标签列表
exports.getTag = function(req, res){
    blogDao.getByQuery({tags:req.params.tag}, {"author": 1, "time": 1, "title": 1}, {sort:{'time.date': -1}}, function (err,posts) {
        res.render('tag', {
            title: 'TAG:' + req.params.tag,
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}
//获取目录
exports.getArchive = function(req, res){
    blogDao.getByQuery({}, {"author": 1, "time": 1, "title": 1}, {sort:{'time.date': -1}}, function (err,posts) {
        res.render('archive', {
            title: '存档',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}
//博文搜索
exports.search = function(req, res){
    // 创建一个正则表达式，用于搜索的
    var pattern = new RegExp("^.*" + req.query.keyword + ".*$", "i");
    blogDao.getByQuery({'title': pattern}, {"author": 1, "time": 1, "title": 1}, {sort:{'time.date': -1}}, function (err,posts) {
        res.render('search', {
            title: "SEARCH:" + req.query.keyword,
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
}
//获取用户博文信息
exports.getBlogs = function(req, res){
    var user = User.getInfo;
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
    var query = {};
    if (req.params.author != undefined) {
        query.author = req.params.author;
    }
    if(!user){
        req.flash('error', '用户不存在！');
        return res.redirect('/');
    }
    // 拉取所有的博客信息
    //查询并返回第 page 页的10篇文章
    blogDao.countByQuery(query, function (err, total) {
        blogDao.getByQuery(query, null, {skip:(page - 1) * 10,sort:{'time.date': -1},limit: 10}, function (err, blogs) {
            //解析markdown为html
            blogs.forEach(function (blog) {
                blog.post = markdown.toHTML(blog.post);
            });
            res.render('user', {
                title: user.name,
                posts: blogs,
                page: page,
                isFirstPage: (page - 1) === 0,
                isLastPage: ((page - 1) * 10 + blogs.length) === total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
}
//查看具体博文
exports.view = function(req, res){
    //查找博文
    BlogModel.findOne({"author": req.params.author, "time.day": req.params.day, "title": req.params.title}, null, {}, function (err,blog) {
        //解析 markdown 为 html
        if (blog) {
            blog.post = markdown.toHTML(blog.post);
            blog.comments.forEach(function (comment) {
                comment.content = markdown.toHTML(comment.content);
            });
        }
        //判断不是博主浏览
        if(req.session.user==null || req.session.user.name!=req.params.author){
            //每访问1次，pv 值增加1
            BlogModel.update({"author": req.params.author, "time.day": req.params.day, "title": req.params.title},{$inc: {"pv": 1}},function(err){
                console.log("--------------------"+err);
                if(err){
                    return res.redirect('/');
                }
            })
        }
        res.render('article', {
            title: req.params.title,
            post: blog,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}
//留言
exports.comment = function(req, res){
    var comment = getComment(req);
    BlogModel.findAndModify({"author": req.params.author, "time.day": req.params.day, "title": req.params.title} ,[ ['time.date',-1] ],{$push:{"comments":comment}}, {new: true}, function (err,comment) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '留言成功!');
        res.redirect('back');
        });
}
/**
 * 格式化当前时间
 * @returns {{date: Date, year: number, month: string, day: string, minute: string}}
 */
function getNowTime() {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,  // 真个data类型
        year: date.getFullYear(), // 年
        month: date.getFullYear() + "-" + (date.getMonth() + 1),  // 年-月
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), // 年-月-日
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    }
    return time;
}
//获取留言
function getComment(req) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    var comment = {"name": req.body.name, "email": req.body.email, "website": req.body.website, "time": time, "content": req.body.content};
    return comment;
}
