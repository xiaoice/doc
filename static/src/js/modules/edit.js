define('modules/edit', ['jquery','codemirror','codemirrorHtml','codemirrorFullscreen'],function (require, exports, module) {
    window.CodeMirror=require('codemirror');
    require('codemirrorHtml');
    require('codemirrorCss');
    require('codemirrorXml');
    require('codemirrorJavascript');
    require('codemirrorFullscreen');
    var $=require('jquery');
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/html",
        matchBrackets: false,
        //keyMap: "sublime",
        extraKeys: {
            "Ctrl-S": function(opts){
                $("#btn_save").trigger("click");
            },
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Alt-Enter": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        },
        theme: "monokai",
        styleActiveLine: true, //line选择是是否加亮
        lineWrapping: false //是否自动换行
    });
    //editor.foldCode(CodeMirror.Pos(13, 0));

    CodeMirror.commands.runcode = function (cm) {
        console.log(cm);
    };

    $(document).on("click","#btn_save,#btn_save_preview",function(){
        $.post("writeFile.do",{url:$("#input_url").val(),data:editor.getValue()},function(result){
            console.log(result);
        });
    });

});