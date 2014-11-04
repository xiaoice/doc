/**
 * Created by xiaoice on 2014/10/23.
 */
var express = require('express');
var router = express.Router();

//注销
router.get('/loginOut.do', function (req, res) {
    if(req.session.user){
        var user=JSON.parse(JSON.stringify(req.session.user));
        req.session.destroy(function(err) {
            return res.redirect("login.html");
        })
    }
});

router.get('/index.html', function (req, res) {
    res.render('index');
});
router.get('/doc.html', function (req, res) {
    res.render('doc');
});
module.exports = router;