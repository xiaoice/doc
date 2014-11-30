;(function(){
    define.amd=define.cmd;
    window.lib=seajs;

    //seajs的配置
    lib.config({
        alias: {
            'jquery': 'jquery.js',
            'global': 'modules/global.js',
            'util': 'modules/util.js',
            'module': 'modules/module.js',
            'render': 'modules/render.js',
            "easyui": "/plugin/jquery-easyui/jquery.easyui.min.js",
            "easyui-extend": "modules/easyui-extend.js",
            "admin-config": "modules/admin-config.js",
            "admin-util": "modules/admin-util.js",
            'codemirror': '/plugin/codemirror/lib/codemirror.js',
            'codemirrorHtml': '/plugin/codemirror/mode/htmlmixed/htmlmixed.js',
            'codemirrorXml': '/plugin/codemirror/mode/xml/xml.js',
            'codemirrorJavascript': '/plugin/codemirror/mode/javascript/javascript.js',
            'codemirrorCss': '/plugin/codemirror/mode/css/css.js',
            'codemirrorMarkdown': '/plugin/codemirror/mode/markdown/markdown.js',
            'codemirrorSublime': '/plugin/codemirror/keymap/sublime.js',
            'codemirrorFullscreen': '/plugin/codemirror/addon/display/fullscreen.js'
        }
    });

    // 加载入口模块
    lib.use("modules/global");
})();
