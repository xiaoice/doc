
define('modules/render', ['jquery'],function(require,exports,module){
    var $=require("jquery");

    $(document).on("mouseenter",".list-group-item",function(){
        var url,item=$(this).find(".item");
        url="/edit.html?url="+item.attr("href")+"&title="+item.html();
        $(this).append('<a href="'+url+'" class="label label-primary">修改</a><a class="label label-danger">删除</a>');
    }).on("mouseleave",".list-group-item",function(){
        $(this).find('.label').remove();
    }).on("click",".list-group-item .label-danger",function(){
        $(this).parent().remove();
    });
});