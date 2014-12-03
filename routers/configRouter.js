var router = require('express').Router(),
    util = require('../util/util'),
    result=util.result,
    configAction = require('../controller/configAction'),
    cache = require('../dao/cache');

//获取列表页面
router.get('/index.html', function (req, res) {
    res.render("admin/config/index");
});

//添加/修改
router.post(/(insert|update).do/, function (req, res) {
    var vo={
        id:req.body.id,
        key:req.body.key,
        value:req.body.value
    },type=req.params[0];

    if(!vo.id&&cache.exist(vo.key)){
        res.send(result.error("新增失败，该键已经存在"));
    }else {
        configAction[type](vo,function(err,data){
            if (err) {
                res.send(result.error());
            } else {
                cache.set(vo.key, vo.value);
                vo.id = vo.id || data.insertId;
                res.send(result.ok(vo));
            }
        });
    }
});

//删除
router.post('/delete.do', function (req, res) {
    var id=req.body.id,key=req.body.key;
    configAction.deleteById(id,function(err){
        if(err){
            res.send(result.error());
        }else{
            cache.delete(key);
            res.send(result.ok());
        }
    });
});

//获取列表
router.get('/findList.do', function (req, res) {
    configAction.findAll(null,function(err,result){
        if(err){
            res.send(result.error());
        }else{
            res.send({rows:result,totle:result.length});
        }
    });
});

module.exports=router;