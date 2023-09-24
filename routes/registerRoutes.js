const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
// const User = require("../schemas/Userschema");
// const databasequeries= require("../sqldbs/databasequeries");
// const db =require("../sqldbs/database");
const emailvalidator = require('deep-email-validator');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../mongoSchema/mongoschema");
const session = require('express-session');
const Ngo = require("../mongoSchema/ngoschema");
const multer = require("multer");
const path =require("path");


app.use(express.static("registrationproof"));
var upload = multer({ 
    storage: multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, './registrationproof')
     },
     filename: (req, file, cb) => {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
     } 
   })
 });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register-layout");
})
router.post("/", upload.single('registrationproof'), async (req, res, next) => {
    // console.log("hi");
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    const role = req.body.role;
    var payload = req.body;

    // const { valid, reason, validators } = await isEmailValid(email);

    console.log(username);
    console.log(password);
    console.log(email);
    // console.log(valid);
    if (role == 'User') {
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                console.log("error in fetching data in register routes in user part");
            });
        if (user == null) {
            const data = req.body;

            data.password = await bcrypt.hash(password, 10);
            await User.create(data);
            console.log(data);
            req.session.user = user;
            return res.status(200).redirect('/');
        }
        else {
            if (email == user.email) {
                console.log("email already in use in user part");
            }
            else {
                console.log('username already in use in user part');
            }
        }
    }
    else {

        const ngo = await Ngo.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                console.log("error in fetching data in register routes in ngo part");
            });
        if (ngo == null) {
            
            const ngoobj = new Ngo();
            ngoobj._id=Math.random();
          ngoobj.username=req.body.username;
          ngoobj.email=req.body.email;
          let pass=req.body.password;
          ngoobj.password= await bcrypt.hash(password, 10);
          ngoobj.registrationproof=req.file.filename;
        await  ngoobj.save();


            // const data = req.body;
            // data.password = await bcrypt.hash(password, 10);
            
            // console.log(data);
            req.session.ngo = req.body.username;
            return res.status(200).redirect('/ngo');
        }
        else {
            if (email == ngo.email) {
                console.log("email already in use in ngo part");
            }
            else {
                console.log('username already in use in ngo part');
            }
        }

    }

})

async function isEmailValid(email) {
    return emailvalidator.validate(email);
}

// export {username, email, password};
// module.exports.username=5;
module.exports = router;