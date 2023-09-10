const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require("body-parser");
const { urlencoded } = require('body-parser');
const ngoschema= require("../mongoSchema/ngoschema");
const mongoschema=require("../mongoSchema/mongoschema");
const reviewschema= require("../mongoSchema/reviewschema");

app.set("view engine", "ejs");
app.set("views", "./views");


app.use(bodyparser, urlencoded({ extended: false }));
router.get("/", async(req, res, next) => {
    const ngodata = await ngoschema.find();
const userdata = await mongoschema.find();
const reviewdata = await reviewschema.find();
    return res.status(200).render("admin", {ngodata: ngodata, userdata: userdata, reviewdata:reviewdata});
})
module.exports = router;