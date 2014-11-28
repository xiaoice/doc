var express = require('express'),
    router = express.Router(),
    util = require('../util/util'),
    pageRouterAjax = require('./pageRouterAjax'),
    alimama = require('../controller/alimama'),
    fs=require("fs");

router.use(pageRouterAjax);

//获取列表页面
router.get('/t9.html', function (req, res) {
    res.render('t9');
});

//获取详细信息页面
router.get('/buy.html', function (req, res) {
    var id=req.query.id;
    alimama.getLink({
        auctionid:id,
        success:function(data,status,headers){
            if(data){
                //res.redirect(JSON.parse(data).data.eliteUrl);
                res.redirect(JSON.parse(data).data.clickUrl);
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});

//登录
router.get('/alimamaLogin.html', function (req, res) {
    res.redirect('https://login.taobao.com/member/login.jhtml?style=minisimple&from=alimama');
});

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