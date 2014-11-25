var nodegrass = require('nodegrass');

var alimama={};


//获取headers
function gerHeaders(opts){
    opts=opts||{};
    opts.Cookie=opts.Cookie||"t=2c99643d124c20491f6c832d01a0a55b; cna=Lou7DIJD3nUCAbcMQvy5uLHr; isg=B9C0DE8B0D7E2BC9AEF1748E8250FAE3; pub-message-center=1; lzstat_uv=29375684571046627047|1774292@1774054@2650839@2650835@633924@2876347; cookie2=5e9373f7efb81f19d6099f3a103b840d; v=0; _tb_token_=ae4CWYFIBtn; lzstat_ss=1014261419_0_1416911655_2876347; cookie32=48e7d7ed68560503fa6fbec4df0962cb; cookie31=NDcyNTc4MzUseGwzNjMyMjcwMDYsMzYzMjI3MDA2QHFxLmNvbSxUQg%3D%3D; alimamapwag=TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4xOyBXT1c2NDsgcnY6MzMuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC8zMy4w; login=UtASsssmOIJ0bQ%3D%3D; alimamapw=SFgEAQYEBQFSUw8xCFFQB1IFBwMHVQABDgQBBQlbC1MHAAZVBwVRAwRSUlQ%";
    opts.Cookie=opts.Cookie.replace('ae4CWYFIBtn',opts._tb_token_||'ae4CWYFIBtn');
    return {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
        "Connection": "keep-alive",
        "Cookie":opts.Cookie,
        "Host": opts.Host||"pub.alimama.com",
        "User-Agent": opts.UserAgent||"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20100101 Firefox/33.0"
    };
}

//获取headers
function get(opts){
    var urls=[], i;
    for(i in opts.querys){
        urls.push(i+"="+opts.querys[i]);
    }
    opts.fullUrl=opts.url+urls.join("&");
    nodegrass.get(opts.fullUrl,function(data,status,headers){
        opts.success&&opts.success(data,status,headers,opts);
    },gerHeaders(opts),opts.charset||'utf8').on('error', function(err) {
        opts.error&&opts.error(err,opts);
    });
}

//获取群组列表
alimama.getGroupList=function(opts){
    opts=opts||{};
    opts.url=opts.url||'http://pub.alimama.com/group/getGroupInfoList.json?';
    opts.querys={
        _input_charset:opts._input_charset||'utf-8',
        _tb_token_:opts._tb_token_||'ae4CWYFIBtn',
        t:new Date().getTime()
    };
    get(opts);
};

//获取数据列表
alimama.getList=function(opts){
    opts=opts||{};
    opts.url=opts.url||'http://pub.alimama.com/group/searchGroupAuctionList.json?';
    opts.querys={
        _input_charset:opts._input_charset||'utf-8',
        _tb_token_:opts._tb_token_||'ae4CWYFIBtn',
        groupId:opts.adzoneid||1375950175666,                   //群组id
        sort:opts.auctionid||'_totalnum',                       //排序
        toPage:opts.groupid||1,                                 //第几页
        spm:opts.siteid||'a2320.7388781.a214tr8.d006.aIIZue',
        t:new Date().getTime()
    };
    get(opts);
};

//获取推广链接
alimama.getLink=function(opts){
    opts=opts||{};
    opts.url=opts.url||'http://pub.alimama.com/common/code/getAuctionCode.json?';
    opts.querys={
        _input_charset:opts._input_charset||'utf-8',
        _tb_token_:opts._tb_token_||'ae4CWYFIBtn',
        adzoneid:opts.adzoneid||23818860,           //推广位名称 贴纸
        auctionid:opts.auctionid||38349612018,      //产品id
        groupid:opts.groupid||1375950175666,        //群组id
        siteid:opts.siteid||6112277,                //媒体类型 qq
        t:new Date().getTime()
    };
    get(opts);
};

//获取推广列表
alimama.getUnionList=function(opts){
    opts=opts||{};
    opts.url=opts.url||'http://pub.alimama.com/report/getTbkPaymentDetails.json?';
    querys={
        _input_charset:opts._input_charset||'utf-8',
        _tb_token_:opts._tb_token_||'ae4CWYFIBtn',
        startTime:opts.startTime||'2014-11-19',             //开始时间
        endTime:opts.endTime||'2014-11-25',                 //结束时间
        payStatus:opts.payStatus||'',                       //订单状态
        queryType:opts.queryType||1,                        //1：创建时间；2：结算时间
        perPageSize:opts.perPageSize||20,                   //每页显示条数 不可更改
        toPage:opts.toPage||1,                              //第几页
        total:opts.total||'',
        t:new Date().getTime()
    };
    get(opts);
};


//登录
alimama.login=function(opts){
    opts=opts||{};
    opts.url=opts.url||'https://login.taobao.com/member/login.jhtml?style=minisimple&from=alimama';
    nodegrass.get(opts.url,function(data,status,headers){
        opts.success&&opts.success(data,status,headers);
    },gerHeaders(opts),opts.charset||'gbk');
};


module.exports=alimama;