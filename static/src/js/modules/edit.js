define('modules/edit', ['jquery','codemirror','codemirrorHtml'],function (require, exports, module) {
    window.CodeMirror=require('codemirror');
    require('codemirrorHtml');
    require('codemirrorCss');
    require('codemirrorXml');
    require('codemirrorJavascript');
    var $=require('jquery');
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/html",
        matchBrackets: false,
        //keyMap: "sublime",
        theme: "monokai",
        styleActiveLine: true, //line选择是是否加亮
        lineWrapping: true //是否自动换行
    });

    $(document).on("click","#btn_save,#btn_save_preview",function(){
        $.post("writeFile.do",{url:$("#input_url").val(),data:editor.getValue()},function(result){
            console.log(result);
        });
    });

});