/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express'),
    router = express.Router(),
    util = require('../util/util'),
    fs=require("fs");

//编辑页面源代码
router.get('/edit.html', function (req, res) {
    var id=req.query.id,module,title,url;
    if(id){
        util.setConfig(function(err,config){
            if(!err&&config[id]){
                module=config[id].module;
                title=config[id].title;
                if(id===module){
                    url="/"+module+".html";
                }else{
                    url="/"+module+"/"+id+".html";
                }
                fs.readFile("data"+url,"utf-8",function(err,data){
                    if(err){
                        return res.send(404);
                    }else{
                        return res.render("edit",{url:url,title:title,module:module,reader:data});
                    }
                });
            }else{
                return res.send(404);
            }
        });
    }else{
        return res.send(404);
    }
});


//主页-一级页面
router.get(/(doc|plugin|lib|tool).html/, function (req, res) {
    fs.readFile("data/"+req.params[0]+".html","utf-8",function(err,data){
        if(err){
            res.send(404);
        }else{
            res.render(req.params[0],{render:data});
        }
    });
});


//模块-二级页面
router.get(/(doc|plugin|lib|tool)\/(.*).html/, function (req, res) {
    var module=req.params[0],url="data/"+module+"/"+req.params[1]+".html";
    fs.readFile(url,"utf-8",function(err,data){
        if(err){
            res.send("404");
        }else{
            res.render("render",{module:module,title:"规范文档",render:data});
        }
    });
});

//数据-jquery文档
router.get(/jquery\/(.*).html/, function (req, res) {
    var url="tpl/jquery/"+req.params[0]+".ejs";
    res.render(url,{module:"doc",title:"jquery"});
});

router.get(/(.*)/, function (req, res) {
    res.render(req.params[0].slice(1).replace(".html",""));
});

module.exports = router;