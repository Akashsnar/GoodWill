const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User = require("../mongoSchema/mongoschema");
const Ngo = require("../mongoSchema/ngoschema");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyparser, urlencoded({ extended: false }));
router.get("/", (req, res, next) => {

    return res.status(200).render("log", {success: false});
})

router.post("/", async (req, res, next) => {
    // console.log(req.body);
    var payload = req.body;
    let username = req.body.logUsername.trim();
    let password = req.body.logPassword;
    let role = req.body.role;

    if (role == 'User') {
        const user = await User.findOne({
            $and: [
                { username: username }
            ]
        })
            .catch((error) => {
                console.log(error);
                console.log("errorr in fetching data in register routes in user part");
            });
        if (user != null) {
            const data = req.body;
            console.log(data);
            var result = await bcrypt.compare(password, user.password);
            if (result) {
                req.session.user = user;
                return res.redirect('/user');

            }
            return  res.render('log', {
                success: true
            });
        }
        else {
            // res.status(400).send('invalid username in user part');
            res.render('log', {
                success: true
            });
        }
    }

// NGO

        else if(role=='NGOs'){

            const ngo = await Ngo.findOne({
                $and: [
                    { username: username }
                ]
            })
                .catch((error) => {
                    console.log(error);
                    console.log("errorr in fetching data in register routes in ngo part");
                });
            if (ngo != null) {
                const data = req.body;
                console.log(data);
                var result = await bcrypt.compare(password, ngo.password);
                if (result) {
                    req.session.ngo = ngo.username;
                    console.log(req.session.ngo);
                    return res.redirect('/ngo');
    
                }
                return  res.render('log', {
                    success: true
                });
            }
            else {
                res.render('log', {
                    success: true
                });
            }

        }

   else{
    if(username=="Admin2505" && password=="4DM1N10g"){
              return res.redirect('/admin');
    }   
    else{
        let name=req.body.formname;
        res.render('log', {
            success: true
        });
    }
   }




});



module.exports = router;

