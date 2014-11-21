var crypto = require('crypto'),
    fs=require("fs");

//返回结果组件
function result(status,msg,data){
    return new function(){
        return {
            status:status||0
            ,msg:msg||"FAIL"
            ,data:data||{}
        }
    };
}

var util={
    getRandom:function(length){
        var number=Math.floor(new Date().getTime()*Math.random()*0x10000).toString(16);
        return crypto.createHash('md5').update(number).digest('hex').slice(0, length||10);
    },
    result:{
        error:function(msg,data){
            if(arguments.length===1&& typeof arguments[0]==="object"){
                return result(0,"FAIL",arguments[0]||{})
            }else{
                return result(0,msg||"FAIL",data||{})
            }
        },
        ok:function(msg,data){
            if(arguments.length===1&& typeof arguments[0]==="object"){
                return result(1,"SUCCESS",arguments[0]||{})
            }else{
                return result(1,msg||"SUCCESS",data||{})
            }
        }
    },
    parseJson:function(data){
        return JSON.parse(JSON.stringify(data));
    },
    //美化json格式
    formatBeautifyJSON: function (JSON,k) {
        return (function(JSON){
            function __formatSpace(length){
                var val="",length=+length||1;
                for(var i=0;i<length;i++){
                    val+="    ";
                }
                return val;
            }

            function __formatJson(json,index){
                var i, j, k,result="",tmpLeft="",tmpRight="",results=[],index=index|| 1;
                if(Array.isArray(json)){
                    for(i=0,j=json.length;i<j;i++){
                        if(Array.isArray(json[i])){
                            tmpLeft="[";
                            tmpRight="]";
                        }else{
                            tmpLeft="{";
                            tmpRight="}";
                        }
                        results.push("\r\n"+__formatSpace(index)+tmpLeft+__formatJson(json[i],index+1)+"\r\n"+__formatSpace(index)+tmpRight);
                    }
                    result+=results.join(",");
                }else{
                    for(i in json){
                        k=json[i];
                        if(typeof k!=="object"){
                            results.push("\r\n"+__formatSpace(index)+'"'+i+'"'+':"'+k+'"');
                        }else if(typeof k==="object"){
                            if(Array.isArray(k)){
                                tmpLeft="[";
                                tmpRight="]";
                            }else{
                                tmpLeft="{";
                                tmpRight="}";
                            }
                            results.push("\r\n"+__formatSpace(index)+'"'+i+'"'+':'+tmpLeft+__formatJson(k,index+1)+"\r\n"+__formatSpace(index)+tmpRight);
                        }
                    }
                    result+=results.join(",");
                }
                return result;
            }

            return (function(){
                var result="";

                if(typeof JSON=="object"){
                    if(Array.isArray(JSON)){
                        result="["+__formatJson(JSON)+"\r\n]";
                    }else{
                        result="{"+__formatJson(JSON)+"\r\n}";
                    }
                }
                return result;
            })()
        })(JSON);
    },
    //对配置文件config.json进行读写操作
    setConfig:function(doBefore,callback){
        var doBefore=doBefore,callback=callback
            ,config=require("../data/config.json");
        if(arguments.length==1){
            callback=doBefore;
        }else{
            if(doBefore){
                config=doBefore(config);
            }
        }
        fs.writeFile("./data/config.json",util.formatBeautifyJSON(config),"utf-8",function(err){
            callback&&callback(err,config);
        });
    }
};

module.exports = util;