var router = require('express').Router(),
    result=require('../util/util').result,
    configAction = require('../controller/configAction'),
    alimama = require('../controller/alimama');

//页面路由
router.get("/login.html", function (req, res) {
    alimama.loginTest(function(data){
        if(data){
            res.render("admin/alimm/login",{status:true,cookie:cache.get("Cookie")});
        }else{
            res.render("admin/alimm/login",{status:false,cookie:""});
        }
    });

});

//页面路由
router.get(/(.*).html/, function (req, res) {
    res.render("admin/alimm/"+req.params[0]);
});


router.post("/loginTest.do", function (req, res) {
    var token=req.body.token,
        cookie=req.body.cookie;
    configAction.set("_tb_token_",token,function(err,data){
        if (err) {
            res.send(result.fail());
        }else{
            cache.set("_tb_token_", token);
            configAction.set("Cookie",cookie,function(err,data){
                if (err) {
                    res.send(result.fail());
                }
                else{
                    cache.set("Cookie", cookie);
                    alimama.loginTest(function(data){
                        if(data){
                            res.send(result.ok());
                        }else{
                            res.send(result.fail());
                        }
                    });
                }
            });
        }
    });
});

//获取接口集合
router.get(/\/(getGroupList|getList|getLink|getUnionList).do/, function (req, res) {
    alimama[req.params[0]]({
        success:function(data,status,headers){
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