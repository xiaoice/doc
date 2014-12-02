var router = require('express').Router(),
    result=require('../util/util').result,
    configAction = require('../controller/configAction'),
    alimama = require('../controller/alimama');

//页面路由
router.get("/login.html", function (req, res) {
    var opts={status:false,cookie:"",token:"",spm:""};
    alimama.loginTest(function(data){
        if(data){
            opts.status=true;
            opts.cookie=cache.get("Cookie")||"";
            opts.token=cache.get("_tb_token_")||"";
            opts.spm=cache.get("spm")||"";
        }
        res.render("admin/alimm/login",opts);
    });

});

//页面路由
router.get("/jiukuaijiu.html", function (req, res) {
    var url="admin/alimm/jiukuaijiu",group=[];
    alimama.getGroupList({
        success:function(data){
            if(data&&JSON.parse(data)){
                group=JSON.parse(data).data.groupInfoList;
            }
            res.render(url,{group:group});
        },
        error:function(err){
            res.render(url,{group:group});
        }
    });
});

//页面路由
router.get(/(.*).html/, function (req, res) {
    res.render("admin/alimm/"+req.params[0]);
});


router.post("/loginTest.do", function (req, res) {
    var token=req.body.token,
        cookie=req.body.cookie,
        spm=req.body.spm;
    configAction.set("_tb_token_",token,function(err,data){
        if (err) {
            res.send(result.error());
        }else{
            cache.set("_tb_token_", token);
            configAction.set("Cookie",cookie,function(err,data){
                if (err) {
                    res.send(result.error());
                }
                else{
                    cache.set("Cookie", cookie);
                    configAction.set("spm",spm,function(err,data) {
                        if (err) {
                            res.send(result.error());
                        }
                        else {
                            cache.set("spm", spm);
                            alimama.loginTest(function(data){
                                if(data){
                                    res.send(result.ok());
                                }else{
                                    res.send(result.error());
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//获取接口集合
router.get("/findListByPage.do", function (req, res) {
    var dataObj, i, j,linkVo,resultList=[],totle;
    alimama.getList({
        groupId:req.query.groupId||"",
        sort:req.query.sort||"",
        q:req.query.q||"",
        toPage:req.query.page,
        perPagesize:req.query.rows,
        success:function(data){
            if(data){
                dataObj=JSON.parse(data).data;
                totle=dataObj.paginator.items;
                if(req.query.linkable){
                    for(i=0,j=dataObj.pagelist.length;i<j;i++){
                        (function(vo,length){
                            alimama.getLink({
                                groupId:vo.groupId||"",
                                auctionid:vo.auctionId||"",
                                success:function(linkData){
                                    if(linkData){
                                        linkVo=JSON.parse(linkData).data;
                                        vo.clickUrl=linkVo.clickUrl;
                                        vo.eliteUrl=linkVo.eliteUrl;
                                        resultList.push(vo);
                                        if(resultList.length===length){
                                            res.send(result.ok({rows:resultList,total:totle}));
                                        }
                                    }
                                }
                            });
                        })(dataObj.pagelist[i],j);
                    }
                }else{
                    res.send(result.ok({rows:dataObj.pagelist,total:totle}));
                }
            }else{
                res.send(result.error("请登录"));
            }
        },
        error:function(err){
            res.send(result.error("网络异常"));
        }
    });
});

//获取接口集合
router.get("/getLink.do", function (req, res) {
    alimama.getLink({
        groupId:req.query.groupId||"",
        auctionid:req.query.auctionid||"",
        success:function(data){
            if(data){
                res.send(result.ok(JSON.parse(data).data));
            }else{
                res.send(result.error());
            }
        },
        error:function(err){
            res.send(result.error(err));
        }
    });
});


module.exports=router;