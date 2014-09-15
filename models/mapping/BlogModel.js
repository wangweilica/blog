/**
 * 提交的博客的一些信息 数据库中的表:blog
 *
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var schema = new Schema({
    author: String,
    title: String,
    tags: Array,
    post: String,
    comments:Array,
    time:JSON,
    pv:Number
});
mongoose.model('Blog', schema);