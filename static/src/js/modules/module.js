
define('modules/module', ['jquery'],function(require,exports,module){
    var $=require("jquery"),moduleName=$("#input_nav").val();

    $(document).on("mouseenter",".list-group-item",function(){
        var $this=$(this),id,item=$this.find(".item");
        if(item.attr("href")){
            id=item.attr("href").replace(/\/(.*)\//,"").replace(".html","");
            $("#toolbar").remove();
            $this.append('<span id="toolbar" class="toolbar"><a href="/edit.html?id='+id+'" class="label label-primary">修改</a><a class="label label-danger">删除</a></span>');
        }
    }).on("click",".list-group-item .label-danger",function(){
        var $this=$(this)
            ,url=$this.parent().prev().attr("href")
            ,$item=$this.parents(".list-group-item")
            ,html;
        if(confirm("确定要删除吗？")){
            $.post("/"+moduleName+"/delFile.do",{url:url},function(result){
                if(result&&result.status===1){
                    alert(result.msg);
                    $item.remove();
                }else{
                    alert(result.msg);
                }
            });
        }
    }).on("click","#btn_add",function(){
        var name=prompt("请输入文件名","");
        if(name){
            $.post("/"+moduleName+"/addFile.do",{name:name},function(result){
                if(result&&result.status===1){
                    alert(result.msg);
                    $(".list-group").append(result.data.html);
                }else{
                    alert(result.msg);
                }
            });
        }
    })
});