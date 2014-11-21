/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express'),
    router = express.Router(),
    fs=require("fs"),
    util = require('../util/util'),
    result=util.result;

//注销
router.get('/loginOut.do', function (req, res) {
    if(req.session.user){
        var user=JSON.parse(JSON.stringify(req.session.user));
        req.session.destroy(function(err) {
            return res.redirect("login.html");
        });
    }
});

//删除文件
router.post(/(doc|plugin|lib|tool)\/delFile.do/, function (req, res) {
    var module=req.params[0]                                //模块名称
        ,basePath="data/"+module+".html"              //当前文件路径
        ,filePath="data/"+req.body.url
        ,id=req.body.url.replace(/\//g,"").replace(".html","").replace(module,"")
        ,reg=new RegExp('(?:\r\n)?<li[^>]+><a(?=[^>]+'+req.body.url+')[^>]+>[^<]+<\/a><\/li>','ig');

    function deleteModuleHtml(callback){
        fs.readFile(basePath,"utf-8",function(err,data){
            if(err){
                return res.send(result.error("删除文件失败，读取模块文件失败"));
            }else{
                data=data.replace(reg,'');
                fs.writeFile(basePath,data,"utf-8",function(err){
                    if(err){
                        return res.send(result.error("删除文件失败，写入模块文件失败"));
                    }else{
                        util.setConfig(function(config){
                            delete config[id];
                            return config;
                        },function(err){
                            if(err){
                                return res.send(result.error("删除文件失败，写入配置文件失败"));
                            }else{
                                callback&&callback();
                            }
                        });
                    }
                });
            }
        });
    }

    if(filePath.indexOf(module)>0){
        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return res.send(result.error("删除文件失败"));
                    } else {
                        deleteModuleHtml(function () {
                            return res.send(result.ok("删除文件成功"));
                        });
                    }
                });
            } else {
                deleteModuleHtml(function () {
                    return res.send(result.ok("文件已被删除"));
                });
            }
        });
    }else{
        return res.send(result.error("删除文件失败,参数错误"));
    }

});

//新增文件
router.post(/(doc|plugin|lib|tool)\/addFile.do/, function (req, res) {
    var name=req.body.name,                        //文件名称
        module=req.params[0],                      //模块名称
        id=util.getRandom(),                   //随机id名称
        filePath="data/"+module+"/"+id+".html",      //新建的文件完整路径
        basePath="data/"+module+".html",     //当前文件路径
        baseHtml='\r\n<li class="list-group-item"><a class="item" href="'+filePath.replace('data','')+'" target="_blank">'+name+'</a></li>';
    if(typeof name!=="undefined" && name!==""){
        fs.exists(filePath, function(exists){
            //出现重复的概率非常低
            if(exists){
                filePath="data/"+module+"/"+id+".html";
            }
            fs.writeFile(filePath,"","utf-8",function(err){
                if(err){
                    return res.send(result.error("新建文件失败，无法创建文件"));
                }else{
                    fs.appendFile(basePath,baseHtml,"utf-8",function(err,data){
                        if(err){
                            return res.send(result.error("新建文件失败，无法写入内容"));
                        }else{
                            util.setConfig(function(config){
                                config[id]={
                                    title:name
                                    ,module:module
                                };
                                return config;
                            },function(err){
                                if(err){
                                    return res.send(result.error("新建文件失败，写入配置文件失败"));
                                }else{
                                    return res.send(result.ok("新建文件成功",{id:id,html:baseHtml}));
                                }
                            })
                        }
                    });
                }
            });
        });
    }else{
        return res.send(result.error("新建文件失败，参数异常"));
    }
});

//保存数据
router.post('/writeFile.do', function (req, res) {
    var data=req.body.data;
    var url=req.body.url;
    fs.writeFile("data"+url,data,"utf-8",function(err,data){
        if(err){
            return res.send(result.error("保存失败"));
        }else{
            return res.send(result.ok("保存成功"));
        }
    });
});

module.exports = router;