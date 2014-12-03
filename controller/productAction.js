var baseDao = require('../dao/baseDao'),
    productDao = new baseDao("product"),
    alimama = require('../controller/alimama');

var productAction=productDao.extend();

//批量添加组数据
productAction.insertList=function (callback) {
    //需要的字段名称
    var fields="reservePrice,zkPrice,zkRate,zkType,calCommission,commissionRatePercent,userId,userType,userNumberId,nick,title,shopUrl,auctionUrl,pictUrl,groupIds,groupId,groupRate,groupCommission,totalNum,totalFee,auctionId,auctionType,auctionTag".split(',')
        ,pagelist,pageIndex,pageLength,pageVo,value
        ,vo
        , i, j,field,resultOks=[],resultErrors=[],voClick
        ,done=function(resultErrors,resultOks){
            callback(null,{resultErrors:resultErrors,resultOks:resultOks});
        };
    alimama.getList({
        success:function(result){
            if(result){
                pagelist=JSON.parse(result).data.pagelist,pageLength=pagelist.length;
                for(pageIndex= 0;pageIndex<pageLength;pageIndex++){
                    pageVo=pagelist[pageIndex];
                    vo=productDao.getVo();
                    vo.id=null;
                    for(i=0,j=fields.length;i<j;i++){
                        field=fields[i],value=pageVo[field];
                        if(typeof value!=="undefined"){
                            vo[field]=value;
                        }
                    }
                    (function(vo){
                        alimama.getLink({
                            auctionid:vo.auctionId,
                            groupid:vo.groupId,
                            success:function(data){
                                if(data){
                                    voClick=JSON.parse(data).data;
                                    vo.clickUrl=voClick.clickUrl;
                                    vo.eliteUrl=voClick.eliteUrl;
                                    productDao.insert(vo, function (err, dbResult) {
                                        if (err) {
                                            resultErrors.push(vo);
                                        } else {
                                            resultOks.push(vo);
                                        }
                                        if ((resultErrors.length + resultOks.length) === pageLength) {
                                            done(resultErrors, resultOks);
                                        }
                                    });
                                }
                            }
                        });
                    })(vo);
                }
            }else{
                callback&&callback(new Error("请登录！"));
            }
        },
        error:function(err){
            callback&&callback(new Error("请登录！"));
        }
    });
};

//获取翻页数据列表
productAction.findListByPage=function (args,callback) {
    //需要的字段名称
    productDao.findListByPage({
        fields:"*"
        ,wheres:null
        ,pageIndex:args.pageIndex||1
        ,pageSize:args.pageSize||10
    }, callback);
};

module.exports=productAction;