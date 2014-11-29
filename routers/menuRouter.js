var express = require('express'),
    router = express.Router(),
    util = require('../util/util'),
    baseDao = require('../dao/baseDao'),
    menuDao = new baseDao("menu");

var menuAction={};


//保存数据

//获取列表页面
router.get('/insert.do', function (req, res) {
    var vo=menuDao.getVo();
    vo.text=req.query.text;
    vo.comment=req.query.comment;
    vo.sort=req.query.sort;
    menuDao.insert(vo,function(err,result){
        res.send("ok");
    });
});

//根据id修改数据
menuAction.updateById=function(args,callback){
    menuDao.updateById(args,callback);
};

//根据id删除数据
menuAction.deleteById=function(args,callback){
    menuDao.deleteById(args,callback);
};

//根据id获取对象
menuAction.findById=function(args,callback){
    menuDao.findById(args,callback);
};

//根据id获取对象
menuAction.findAll=function(callback){
    menuDao.findAll({
        wheres:null
    },callback);
};


module.exports=menuAction;