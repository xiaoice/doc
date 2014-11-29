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
                cache.list=results;
                callback&&callback(null,cache);
            }
        }
    });
    return cache;
}

cache.get = function(key) {
    if(typeof key=="undefined") {
        var obj = {};
        for (var i in cache) {
            if (typeof cache[i] != "function") {
                obj[i]=cache[i];
            }
        }
        return obj;
    }
    else{
        return cache[key];
    }
};
cache.set = function(key, obj,callback) {
    var done=function(err,data){
        if(err){
            callback&&callback(err);
        }else{
            callback&&callback(null,data);
            cache[key] = obj;
        }
    };

    if(cache.exist(key)){
        db.execQuery({
            "sql": "UPDATE CONFIG SET `value` = ? where `key` = ?",
            "args": [obj,key],
            "callback": done
        });
    }else{
        db.execQuery({
            "sql": "INSERT INTO CONFIG VALUE(?,?)",
            "args": [key,obj],
            "callback": done
        });
    }
};
cache.exist = function(key) {
    return cache[key] != undefined;
};
cache.delete = function(key,callback) {
    delete cache[key];
    db.execQuery({
        "sql": "DELETE FROM CONFIG WHERE "+key+" = ?",
        "args": key,
        "callback": callback
    });
};
cache.removeAll = function() {
    for(key in cache) {
        delete cache[key];
    }
};

module.exports=cache;