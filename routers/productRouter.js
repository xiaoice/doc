var express = require('express'),
    router = express.Router(),
    result=require('../util/util').result,
    productAction = require('../controller/productAction'),
    alimama = require('../controller/alimama');

//添加
router.get('/add.do', function (req, res) {
    productAction.insertList(function(err,data){
        if(err){
            res.redirect('/alimamaLogin.html');
        }else{
            res.send(result.ok(data));
        }
    });
});

//添加
router.post('/insert.do', function (req, res) {
    var vo=req.body;
    productAction.insert(vo,function(err,data){
        if(err){
            if(err.code==='ER_DUP_ENTRY'){
                res.send(result.error("商品已经存在"));
            }else{
                res.send(result.error("系统错误"));
            }
        }else{
            res.send(result.ok("添加成功！",vo));
        }
    });
});

//更新
router.post('/updateById.do', function (req, res) {
    var vo=req.body;
    productAction.updateById(vo,function(err,data){
        res.send(result.ok(data));
    });
});

//获取分页列表
router.get('/findListByPage.do', function (req, res) {
    productAction.findListByPage({
            pageIndex:req.query.page||1
            ,pageSize:req.query.rows||10
        }
        ,function(err,data){
            res.send({total:data.total,rows:data.data});
        });
});

//根据id获取数据
router.get('/findById.do', function (req, res) {
    var id=req.query.id;
    productAction.findById(id,function(err,data){
        res.send(result.ok(data));
    });
});

//删除
router.get('/deleteById.do', function (req, res) {
    productAction.deleteById(function(err,data){
        res.send(result.ok(data));
    });
});

//获取列表页面
router.get('/index.html', function (req, res) {
    res.render('admin/product');
});

module.exports = router;