/**
 * 提交的博客的一些信息 数据库中的表:blog
 *
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlogSchema = new Schema({
    author: {type:String,require:true},
    title: {type:String,require:true},
    tags: Array,
    post: String,
    comments:Array,
    time:{type:JSON,require:true},
    pv:{type:Number,require:true}
});
mongoose.model('Blog', BlogSchema);