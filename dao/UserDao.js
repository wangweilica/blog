/**
 * User: Jack Wang
 * Date: 14-9-12
 * Time: 5:37pm
 */

var models = require('./../models'),
    User = models.User;

var UserDAO = function (user) {
    this.user = user || {};
};
module.exports = UserDAO;

UserDAO.prototype.findOne = function (userName, callback) {
    User.findOne({name:userName},function(error,model){
        if(error) return callback(error,null);
        return callback(null, model);
    });
};