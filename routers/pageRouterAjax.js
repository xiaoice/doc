var express = require('express'),
    router = express.Router(),
    fs=require("fs"),
    util = require('../util/util'),
    productDao = require('../dao/productDao'),
    productVo = require('../vo/productVo'),
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
    //需要的字段名称
    var fields="reservePrice,zkPrice,zkRate,zkType,calCommission,commissionRatePercent,userId,userType,userNumberId,nick,title,shopUrl,auctionUrl,pictUrl,groupIds,groupId,groupRate,groupCommission,totalNum,totalFee,auctionId,auctionType,auctionTag".split(',')
        ,pagelist,pageIndex,pageLength,pageVo,value
        ,vo
        , i, j,field,resultOks=[],resultErrors=[],voClick
        ,done=function(resultErrors,resultOks){
            res.send(result.ok({resultErrors:resultErrors,resultOks:resultOks}));
        };
    alimama.getList({
        success:function(result,status,headers){
            if(result){
                pagelist=JSON.parse(result).data.pagelist,pageLength=pagelist.length;
                for(pageIndex= 0;pageIndex<pageLength;pageIndex++){
                    pageVo=pagelist[pageIndex];
                    vo=productVo.getVo();
                    vo.id=null;
                    for(i=0,j=fields.length;i<j;i++){
                        field=fields[i],value=pageVo[field];
                        if(typeof value!=="undefined"){
                            vo[field]=value;
                        }
                    }
                    (function(vo){
                        alimama.getLink({
                            auctionid:vo.auctionId,
                            groupid:vo.groupId,
                            success:function(data){
                                if(data){
                                    voClick=JSON.parse(data).data;
                                    vo.clickUrl=voClick.clickUrl;
                                    vo.eliteUrl=voClick.eliteUrl;
                                    productDao.insert(vo, function (err, results) {
                                        if (err) {
                                            resultErrors.push(vo);
                                        } else {
                                            resultOks.push(vo);
                                        }
                                        if ((resultErrors.length + resultOks.length) === pageLength) {
                                            done(resultErrors, resultOks);
                                        }
                                    });
                                }
                            }
                        });
                    })(vo);
                }
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