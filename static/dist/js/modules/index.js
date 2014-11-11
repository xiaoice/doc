/*
首页
 */

define('modules/index', ['jquery','util'],function (require, exports, module) {
    var $=require('jquery');
    var util=require('modules/util');

    //调整页面大小
    resize();

    function resize() {
        var index=window.location.hash.replace("#","");
        $(".section").height($(window).height());
        $(".body-wrapper").css("transform","translateY("+$(window).height()*(-index)+"px");
        $(".aside .item").removeClass("active").eq(index).addClass("active");
    }


    //添加滚轮事件
    util.addScrollEvent(document, "mousewheel", function(event) {
        var index=$(".aside .active").index(),length=$(".aside .item").size();
        util.processHandle.process(function(){
            if(event.delta > 0){
                if(index==0){
                    return;
                }else{
                    index-=1;
                }
            }else{
                if(index>=length-1){
                    return;
                }else{
                    index+=1;
                }
            }
            $(".aside .item").removeClass("active").eq(index).addClass("active");
            //$(".body-wrapper").css("transform","translate3d(0px, -"+$(window).height()*(index)+"px, 0px)");
            $(".body-wrapper").addClass("linear").css("transform","translateY("+$(window).height()*(-index)+"px");
            window.location.hash=index;
        });
    });

    //点击右侧 小圆点导航
    $(document).on("click",".aside .item", function () {
        var index=$(this).index();
        $(".body-wrapper").removeClass("linear").css("transform","translateY("+$(window).height()*(-index)+"px");
        $(this).addClass("active").siblings().removeClass("active");
    });

    //页面大小更改时，重置
    $(window).resize(resize);
});