var db = require("./db");

/**
 * 缓存模块-全局参数,本地起效
 */
global.cache = {};

var cache = global.cache;

cache.init=function(callback){
    var i,length,item;
    db.execQuery({
        "sql": "SELECT * FROM CONFIG",
        "callback": function(err,results){
            if(err){
                callback&&callback(err);
            }else{
                for(i=0,length=results.length;i<length;i++){
                    item=results[i];
                    cache[item.key]=item.value;
                }
                callback&&callback(null,cache);
            }
        }
    });
    return cache;
}

cache.get = function(key) {
    return cache[key];
};
cache.set = function(key, obj) {
    cache[key] = obj;
};
cache.exist = function(key) {
    return cache[key] != undefined;
};
cache.delete = function(key) {
    delete cache[key];
};

cache.removeAll = function() {
    for(key in cache) {
        delete cache[key];
    }
};

module.exports=cache;