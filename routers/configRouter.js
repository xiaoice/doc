var router = require('express').Router(),
    util = require('../util/util'),
    result=util.result,
    cache = require('../dao/cache');

//获取列表页面
router.get('/add.html', function (req, res) {
    res.render("admin/config/add");
});

//添加
router.get('/add.do', function (req, res) {
    cache.set(req.query.key,req.query.value, function (err,data) {
        if(err){
            res.send(result.error());
        }else{
            res.send(result.ok(data));
        }
    })
});

//获取列表
router.get('/findList.do', function (req, res) {
    res.send({rows:cache.list});
});

module.exports=router;