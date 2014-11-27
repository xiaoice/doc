
var baseDao={};
//获取字段字符串
baseDao.getFields=function(vo){
    var i,fields=[],values=[],args=[];
    for(i in vo){
        if(typeof vo[i] !="undefined"){
            fields.push(i);
            values.push('?');
            args.push(vo[i]);
        }
    }
    return {
        fields:fields,
        values:values,
        args:args
    };
};

module.exports=baseDao;