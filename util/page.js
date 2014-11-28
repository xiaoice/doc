
module.exports=function(opts){
    opts={
        pageIndex:parseInt(opts.pageIndex)
        ,pageSize:parseInt(opts.pageSize)
        ,total:parseInt(opts.total)
    };

    opts.pageTotal=Math.ceil(opts.total/opts.pageSize);
    opts.start=Math.max(0,(opts.pageIndex-1))*opts.pageSize;
    opts.end=Math.min(opts.total,(opts.pageIndex)*opts.pageSize);
    opts.data=null;
    return opts;
}