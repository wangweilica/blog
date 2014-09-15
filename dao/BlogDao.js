/**
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models'),
    Blog = models.Blog;

var BlogDao = new DaoBase(Blog);

module.exports = BlogDao;