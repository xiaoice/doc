/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express');
var router = express.Router();
var fs=require("fs");

//注销
router.get('/loginOut.do', function (req, res) {
    if(req.session.user){
        var user=JSON.parse(JSON.stringify(req.session.user));
        req.session.destroy(function(err) {
            return res.redirect("login.html");
        })
    }
});

//写入数据
router.post('/writeFile.do', function (req, res) {
    var data=req.body.data;
    var url=req.body.url;
    fs.writeFile("data"+url,data,"utf-8",function(err,data){
        if(err){
            res.send("写入失败");
        }else{
            return res.send({msg:"ok"});
        }
    });
});


//编辑页面源代码
router.get('/edit.html', function (req, res) {
    var url=req.query.url,
        title=req.query.title;
    fs.readFile("data/"+url,"utf-8",function(err,data){
        if(err){
            res.send("读取失败");
        }else{
            return res.render("edit",{url:url,title:title,reader:data});
        }
    });
});


//规范文档
router.get(/(doc|plugin|lib|tool)\/(.*).html/, function (req, res) {
    fs.readFile("data/"+req.params[0]+"/"+req.params[1]+".html","utf-8",function(err,data){
        if(err){
            res.send("404");
        }else{
            res.render("render",{title:"规范文档",render:data});
        }
    });
});

router.get(/(.*)/, function (req, res) {
    //console.log(req.params[0].slice(1).replace(".html",""));
    res.render(req.params[0].slice(1).replace(".html",""));
});

module.exports = router;