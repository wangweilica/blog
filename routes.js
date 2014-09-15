/**
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 10:37pm
 */
var blog = require('./controller/blog');
var user = require('./controller/user');
module.exports = function (app) {
    app.get('/', blog.index);
    app.get('/reg', user.checkNotLogin);
    app.get('/reg', user.toRegister);
    app.post('/reg', user.checkNotLogin);
    app.post('/reg', user.doRegister);
    app.get('/login', user.checkNotLogin);
    app.get('/login', user.toLogin);
    app.post('/login', user.checkNotLogin);
    app.post('/login', user.doLogin);
    app.get('/logout', user.checkLogin);
    app.get('/logout', user.logout);
    app.get('/post', user.checkLogin);
    app.get('/post', blog.toPost);
    app.post('/post', user.checkLogin);
    app.post('/post', blog.doPost);
    app.get('/tags', blog.getTags);
    app.get('/tags/:tag', blog.getTag);
    app.get('/archive', blog.getArchive);//目录
    app.get('/search', blog.search);//搜索
    app.get('/about', user.about);//关于作者
    app.get('/u/:author', blog.getBlogs);//获取作者的所有博文
    app.get('/u/:author/:day/:title',blog.view);//查看具体博文
    app.post('/u/:author/:day/:title',blog.comment);//留言
};