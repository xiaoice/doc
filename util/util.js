var crypto = require('crypto');

var util={
    getMd5:function(name,length){
        var time=new Date().getTime().toString();
        return crypto.createHash('md5').update(name||time).digest('hex').slice(0, length||8);
    }
};

module.exports = util;