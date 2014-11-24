/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express'),
    router = express.Router(),
    util = require('../util/util'),
    nodegrass = require('nodegrass'),
    FORMDATA = require("form-data"),
    fs=require("fs");

router.get('/alimama.json', function (req, res) {
    var username = "";
    var password = "";
    var form = new FORMDATA();
    form.append("TPL_username", username);
    form.append("TPL_password", password);
    var options = {
        hostname: 'pub.alimama.com',
        path: '/member/login.jhtml',
        method: 'POST',
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Cookie":"t=c8617f97cf53c70a3cb3c35df79f48e0; cna=Jir6DPR7rzYCAXeJEKg9SAqu; isg=3BEE4DED85B87BE0632F1C3C9BA0C144; lzstat_uv=7149425371654599793|2650839@2650835@1774292@1774054@2876347; cookie2=cf5976fa82f37647b9f954f7a21fbfa6; _tb_token_=kvh7rimM5tn; v=0; lzstat_ss=3469985265_6_1416872800_2876347; cookie32=48e7d7ed68560503fa6fbec4df0962cb; cookie31=NDcyNTc4MzUseGwzNjMyMjcwMDYsMzYzMjI3MDA2QHFxLmNvbSxUQg%3D%3D; alimamapwag=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgcnY6MzMuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC8zMy4w; login=UIHiLt3xD8xYTw%3D%3D; alimamapw=SFgEAQYEBQFSUw8xCFFQB1IFBwMHVQABDgQBBQlbC1MHAAZVBwVRAwRSUlQ%3D; rurl=aHR0cDovL3d3dy5hbGltYW1hLmNvbQ%3D%3D; pub-message-center=1",
            "Host": "pub.alimama.com",
            "Referer": "https://login.taobao.com/member/login.jhtml?style=minisimple&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true&disableQuickLogin=true",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0"
        }
    };
    // 发送带表单请求
    form.submit(options, function(err){
        if(err){
            res.send("请求失败。");
        }else{
            nodegrass.get('http://pub.alimama.com/group/searchGroupAuctionList.json?spm=a2320.7388781.a214tr8.d006.j72T1Y&groupId=1375950175666&toPage=1&sort=&t=1416833728095&_tb_token_=stDBbf1U4tn&_input_charset=utf-8',function(body,status,headers){
                console.log(status);
                res.send(body);
            },options.headers,'utf8');
        }
    });
});


router.get('/alimama1.do', function (req, res) {
    var headers={
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Cookie":"t=c8617f97cf53c70a3cb3c35df79f48e0; cna=Jir6DPR7rzYCAXeJEKg9SAqu; isg=3BEE4DED85B87BE0632F1C3C9BA0C144; lzstat_uv=7149425371654599793|2650839@2650835@1774292@1774054@2876347; cookie2=cf5976fa82f37647b9f954f7a21fbfa6; _tb_token_=kvh7rimM5tn; v=0; lzstat_ss=3469985265_6_1416872800_2876347; cookie32=48e7d7ed68560503fa6fbec4df0962cb; cookie31=NDcyNTc4MzUseGwzNjMyMjcwMDYsMzYzMjI3MDA2QHFxLmNvbSxUQg%3D%3D; alimamapwag=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgcnY6MzMuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC8zMy4w; login=UIHiLt3xD8xYTw%3D%3D; alimamapw=SFgEAQYEBQFSUw8xCFFQB1IFBwMHVQABDgQBBQlbC1MHAAZVBwVRAwRSUlQ%3D; rurl=aHR0cDovL3d3dy5hbGltYW1hLmNvbQ%3D%3D; pub-message-center=1",
            "Host": "pub.alimama.com",
            "Referer": "https://login.taobao.com/member/login.jhtml?style=minisimple&from=alimama&redirectURL=http%3A%2F%2Flogin.taobao.com%2Fmember%2Ftaobaoke%2Flogin.htm%3Fis_login%3d1&full_redirect=true&disableQuickLogin=true",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0"
    }
    nodegrass.get('http://pub.alimama.com/group/searchGroupAuctionList.json?spm=a2320.7388781.a214tr8.d006.j72T1Y&groupId=1375950175666&toPage=1&sort=&t=1416833728095&_tb_token_=stDBbf1U4tn&_input_charset=utf-8',function(body,status,headers){
        res.send(body);
    },headers,'utf8');
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