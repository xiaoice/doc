var rf=require("fs");
rf.readFile("app.js",'utf-8',function(err,data){
    if(err){
        console.log("error");
    }else{
        console.log(data);
    }
});
console.log("READ FILE ASYNC END");