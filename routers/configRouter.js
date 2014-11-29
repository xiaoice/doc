var express = require('express'),
    router = express.Router(),
    util = require('../util/util'),
    baseDao = require('../dao/baseDao'),
    configDao = new baseDao("menu");

var configAction={};


//保存数据

//获取列表页面
router.get('/insert.do', function (req, res) {
    var vo=configDao.getVo();
    vo.text=req.query.text;
    vo.comment=req.query.comment;
    vo.sort=req.query.sort;
    configDao.insert(vo,function(err,result){
        res.send("ok");
    });
});

//根据id修改数据
configAction.updateById=function(args,callback){
    configDao.updateById(args,callback);
};

//根据id删除数据
configAction.deleteById=function(args,callback){
    configDao.deleteById(args,callback);
};

//根据id获取对象
configAction.findById=function(args,callback){
    configDao.findById(args,callback);
};

//根据id获取对象
configAction.findAll=function(callback){
    configDao.findAll({
        wheres:null
    },callback);
};


module.exports=configAction;