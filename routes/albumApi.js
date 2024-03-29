var express=require('express');
const router = express.Router();
var multer=require('multer');
var memberModel=require('../models/memberModel.js');

//設定儲存檔案格式
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/photos');
    },
    filename: function(req,file,cb){
        var str = file.originalname.split('.');
        cb(null,Date.now()+'.'+str[1]);
    }
});

//未來與相簿功能的API會新增在此
var upload = multer({storage:storage});
router.post('/upload',upload.single("file"),function(req,res,next){
    memberModel.findOne({account:req.query.account},function
        (err,data){
            data.photos.push(req.file.filename);
            data.markModified('photos');
            data.save(function (err){
                if(err){
                    res.json({"status":1,"msg":"error"});
                }
                else{
                    res.json({"status":0,"msg":"success","photos":data.photos});
                }
            });
        });
});

router.post('/getAlbum',function(req,res,next){
    memberModel.findOne({account:req.body.account},
        function(err,data){
            if(err){
                res.json({"status":1,"msg":"error"});
            }
            else{
                res.json({"status":0,"msg":"success","data":data});
            }
        });
});

router.post("/delete",function(req,res,next){
    memberModel.findOne({account:req.body.account},function(err,data){
        if(err) {
            res.json({"status":1,"msg":"error"});
        }
        else{
            var images =req.body.images;
            for(var i in images) {
                var index =data.photos.indexOf(images[i]);
                if(index >-1){
                    data.photos.splice(index,1);
                }
            }
            data.markModified('photos');
            data.save(function(err){
                if(err){
                    res.json({"status":1,"msg":"error"});
                }
                else{
                    res.json({"status":0,"msg":"success","photos":data.photos});
                }
            });
        }
    });
});

module.exports=router;