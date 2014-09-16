/**
 * Created with JetBrains WebStorm.
 * User: Jack Wang
 * Date: 9/16/14
 * Time: 10:05 PM
 * To change this template use File | Settings | File Templates.
 */
Array.prototype.delRepeat=function(){
    var newArray=new Array();
    var len=this.length;
    for (var i=0;i<len ;i++){
        for(var j=i+1;j<len;j++){
            if(this[i]===this[j]){
                j=++i;
            }
        }
        newArray.push(this[i]);
    }
    return newArray;
}