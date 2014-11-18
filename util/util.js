var crypto = require('crypto');

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
    formatJson:function(data){
        return JSON.parse(JSON.stringify(data));
    }
};

module.exports = util;