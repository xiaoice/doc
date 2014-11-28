var express = require('express'),
    router = express.Router(),
    fs=require("fs"),
    util = require('../util/util'),
    productAction = require('../controller/productAction');
    alimama = require('../controller/alimama'),
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

//更新
router.get('/updateById.do', function (req, res) {
    var id=req.query.id;
    productAction.updateById(id,function(err,data){
        res.send(result.ok(data));
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


//获取接口集合
router.get(/\/(getGroupList|getList|getLink|getUnionList).do/, function (req, res) {
    alimama[req.params[0]]({
        success:function(data,status,headers){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});

/*//获取群组列表
router.get('/getGroupList.do', function (req, res) {
    alimama.getGroupList({
        success:function(data,status,headers){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});

//获取数据列表
router.get('/getList.do', function (req, res) {
    alimama.getList({
        success:function(data,status,headers){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});

//获取最新商品列表
router.get('/getLink.do', function (req, res) {
    alimama.getLink({
        success:function(data,status,headers){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});

//获取推广列表
router.get('/getUnionList.do', function (req, res) {
    alimama.getUnionList({
        success:function(data,status,headers){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.redirect('/alimamaLogin.html');
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});*/

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