var baseDao = require('../dao/baseDao'),
    cache = require('../dao/cache')
    configDao = new baseDao("config");

var configAction=configDao.extend();
//获取翻页数据列表
configAction.findListByPage=function (args,callback) {
    //需要的字段名称
    configDao.findListByPage({
        fields:"*"
        ,wheres:null
        ,pageIndex:args.pageIndex||1
        ,pageSize:args.pageSize||10
    }, callback);
};

//更新数据
configAction.set=function (key,value,callback) {
    if(cache.exist(key)){
        configDao.excute({
            sql:"update config set `value` = ? where `key` = ?",
            params:[value,key]
        },callback);
    }else {
        configDao.excute({
            sql:"insert into config(`key`,`value`) values(?,?)",
            params:[key,value]
        },callback);
    }
};


module.exports=configAction;