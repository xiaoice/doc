var express = require('express'),
    router = express.Router(),
    alimama = require('../controller/alimama');

//获取列表页面
router.get('/t9.html', function (req, res) {
    res.render('t9');
});

//获取列表页面
router.get('/', function (req, res) {
    res.render('admin/index');
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

module.exports = router;