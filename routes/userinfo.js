const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const bcrypt =require('bcrypt');
const mongoose = require("mongoose");
const User = require("../mongoSchema/mongoschema");
const middleware = require("../middleware/middleware");
const multer = require("multer");
const path =require("path");


app.use(express.static("profile_pic"));
app.use(bodyparser.json())

app.set("view engine", "ejs");
app.set("views", "./views");
///user folder

var upload = multer({ 
    storage: multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, './profile_pic')
     },
     filename: (req, file, cb) => {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
     } 
   })
 });
 



app.use(bodyparser, urlencoded({ extended: false }));
router.get("/",middleware.requireLogin, (req, res, next) => {
    return res.status(200).render("edituser");
})

router.post("/", upload.single('image'), async (req, res, next) => {
    // console.log(req.body);
    var payload = req.body;
    console.log(payload);

   

    const user = await User.findOne({
      $or:   [{username : payload.username},
            {email: payload.email}]
    })
    .catch((error)=>{
        console.log(error);
        console.log("error in userinfo js");
    })
    if(user)
    {
        res.send("username or email already in use");
    }
    else{

      console.log("i am working");

        let newvalues = {$set:{username : payload.username ,
             email: payload.email ,
             phone:payload.phone ,
             dob:payload.dob,
             gender:payload.gender,
             details:payload.details,
             profilePic: req.file.filename
            }};
        let filter = {username : req.session.user.username};
        console.log(filter);
        const result = await User.updateOne(filter,newvalues);
        
        if(result)
        {
            console.log(result);
            console.log("successfully updated");
            req.session.user = payload;
            res.redirect('/user');
        }
        else {
            console.log("error in updation");
        }

    }
});



module.exports = router;



