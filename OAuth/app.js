const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const PORT = process.env.PORT || 5000;
const app=express();
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/index.html"));
});

app.listen(PORT,(err)=>{
    console.log(PORT);
    if(err){
        console.log(err);
    }
});