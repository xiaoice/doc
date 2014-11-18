/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express'),
    router = express.Router(),
    fs=require("fs");

//编辑页面源代码
router.get('/edit.html', function (req, res) {
    var url=req.query.url,
        title=req.query.title;
    fs.readFile("data/"+url,"utf-8",function(err,data){
        if(err){
            res.send(404);
        }else{
            return res.render("edit",{url:url,title:title,reader:data});
        }
    });
});


//主页-一级页面
router.get(/(doc|plugin|lib|tool).html/, function (req, res) {
    fs.readFile("data/"+req.params[0]+"/index.html","utf-8",function(err,data){
        if(err){
            res.send(404);
        }else{
            res.render(req.params[0],{render:data});
        }
    });
});


//模块-二级页面
router.get(/(doc|plugin|lib|tool)\/(.*).html/, function (req, res) {
    var module=req.params[0];
    fs.readFile("data/"+module+"/"+req.params[1]+".html","utf-8",function(err,data){
        if(err){
            res.send("404");
        }else{
            res.render("render",{module:module,title:"规范文档",render:data});
        }
    });
});

router.get(/(.*)/, function (req, res) {
    //console.log(req.params[0].slice(1).replace(".html",""));
    res.render(req.params[0].slice(1).replace(".html",""));
});

module.exports = router;