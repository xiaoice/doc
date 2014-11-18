/*
global 基类
 */

define('modules/global', ['jquery'],function(require,exports,module){
    var $=require("jquery");

    exports.nav=function(name){
        $('.header-navbar [href="/'+name+'.html"]').addClass('active');
    };

    exports.nav($("#input_nav").val());

});