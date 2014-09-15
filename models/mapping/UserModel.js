/**
 * 提交的博客的一些信息 数据库中的表:posts
 *
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    password: String,
    email: String
});

mongoose.model('User', schema);