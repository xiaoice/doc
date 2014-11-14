;(function(){
    define.amd=define.cmd;
    window.lib=seajs;

    //seajs的配置
    lib.config({
        alias: {
            'jquery': 'jquery.js',
            'global': 'modules/global.js',
            'util': 'modules/util.js',
            'render': 'modules/render.js',
            'codemirror': '/plugin/codemirror/lib/codemirror.js',
            'codemirrorHtml': '/plugin/codemirror/mode/htmlmixed/htmlmixed.js',
            'codemirrorXml': '/plugin/codemirror/mode/xml/xml.js',
            'codemirrorJavascript': '/plugin/codemirror/mode/javascript/javascript.js',
            'codemirrorCss': '/plugin/codemirror/mode/css/css.js',
            'codemirrorSublime': '/plugin/codemirror/keymap/sublime.js'
        }
    });

    // 加载入口模块
    lib.use("modules/global");
})();
