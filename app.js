const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path =require("path")
const ejs= require('ejs');
const session = require("express-session")
const middleware=require('./middleware/middleware');
const nodemailer=require("nodemailer");
const stripe = require('stripe')('sk_test_51MeWNWSFJfsNtxc8HbcRkFqIAMALQd8W0dZFJJIr9RiaijJJa9W0SnNzp9V5d9klNse1n7ZNpjI2J5HvaCcYnuEq00yUJmTZvo');
const jwt = require('jsonwebtoken');
const mongoose= require("mongoose");
const mongoschema=require("./mongoSchema/mongoschema");
const ngoschema= require("./mongoSchema/mongoschemango");
const ngoschemaregist= require("./mongoSchema/ngoschema")
const reviewschema= require("./mongoSchema/reviewschema");
const reportschema= require("./mongoSchema/reportschema");
const cookieParser = require('cookie-parser');
const db= require("./mongoSchema/database");
const multer = require("multer");
const { MongoClient, ServerApiVersion } = require('mongodb');
const Blog = require('./mongoSchema/blog');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const {config} = require('dotenv');
config();


app.use(express.static("uploads"));
app.use(express.static("registrationproof"));
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));
app.use(express.static("profile_pic"));

app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs");
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'keyboardaksn',
  resave: false,
  saveUninitialized: true
}))



//////ngoschema

var upload = multer({ 
    storage: multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, './uploads')
     },
     filename: (req, file, cb) => {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
     } 
   })
 });
 
 //home
 app.get("/ngo",middleware.requireLogin_ngo,function(req, res) {
    console.log(req.session.ngo);
     res.render("ngo_home", {ngoname: req.session.ngo});
     });
     
 
  // post
  app.post('/post', upload.single('image'), async(req, res) => {
  // console.log(req.file);
  var x= new ngoschema();
  x.username=req.session.ngo;
  x.name=req.body.name;
  x.image=req.file.filename;
  x.desc=req.body.desc;
console.log(x.name);
console.log(x.username);
console.log(x.desc);
console.log(req.body.desc);


  x.save()
  .then( (doc)=>
  {
    console.log("bloody pass");
    res.redirect("/users"); 
  })
  .catch(function (err) {
    console.log(err);
   
 })
 }); 
 
 ///delete
 
 app.post("/delete", function(req, res){
   const it=req.body.checkbox;
   ngoschema.findByIdAndDelete(it)
   .then(function (it) {
    console.log("bloody pass");
    res.redirect("/users"); 
     })
     .catch(function (err) {
      console.log(err);
     
   })
   
   });
   ////images web
   app.post("/images", function(req, res){
         // console.log("bloody pass");
         res.redirect("/users");    
     });
   
 
 ///
 app.get('/users', async(req, res)=>{

  const ngo = await ngoschema.find({
    $and: [
        { username: req.session.ngo }
    ]
})
    .catch((error) => {
        console.log(error);
        console.log("errorr in fetching data in register routes in ngo part");
    });

      if(ngo!=null)
      {
        res.render('ngo_image',{
          item:ngo
        })
      }
      else res.send("error in images of ngo");
 })
   
const port = 3000;

// const YOUR_DOMAIN = 'http://localhost:4242';



app.get("/", async function (req, res) {
  const pipeline = [{$group:{_id: '$username',doc:{$first: '$$ROOT'} }}];
  let  obj =  await ngoschema.aggregate(pipeline);
      
  if(obj!=null)
  {
   res.status(200).render('landingPageIndex', {ngos:obj});
  }
  else{
    res.send("error in /user app.js");
   }
});

const Contact = require('./mongoSchema/contactSchema.js');

app.post('/contact', (req, res) => {
  const {
    name,
    email,
    message
  } = req.body;

  const contact = new Contact({
    name,
    email,
    message
  });

  contact.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      res.send('error');
    });
});

// app.get("/", function (req, res) {
//     res.render("AboutUs2")
// });
// app.get("/", function (req, res) {
//     res.render("nonProfit")
// });
app.get("/about_us", (req, res)=>{
res.render("about_us");
})
app.get("/services", (req, res)=>{
    res.render("services");
})

app.get('/contactsDetails', async (req, res) => {
const contacts = await Contact.find();
res.render('contactsDetails', {
  contacts
});
});
app.post('/deleteContact', async (req, res) => {
  const id = req.body.id;
  try {
    await Contact.findByIdAndDelete(id);
    res.redirect('/contactsDetails');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});
app.get("/ngos", async(req, res)=>{
  const pipeline = [{$group:{_id: '$username',doc:{$first: '$$ROOT'} }}];
  let  obj =  await ngoschema.aggregate(pipeline);


    if(obj!=null)
    {
    res.render('ngos', {
      ngos:obj,length:obj.length
    });
  }

else{
  res.send('Error Searching');
}
})


app.get("/contact", (req, res)=>{
    res.render("contact");
})
// app.get("/log", (req, res)=>{
//     res.render("log");
// })
// app.get("/register", (req, res)=>{
//     res.render("register-layout");
// })
app.get("/Faq", (req, res)=>{
    res.render("faq");
})
app.get("/TermsCondition", (req, res)=>{
    res.render("TermsCondition");
})


const loginRoute=require("./routes/loginRoutes");
app.use("/log", loginRoute);

app.get("/user",middleware.requireLogin, async(req, res)=>{  
        console.log(req.session.user);
        var username=req.session.user;
        const pipeline = [{$group:{_id: '$username',doc:{$first: '$$ROOT'} }}];
        let  obj =  await ngoschema.aggregate(pipeline);
        var arrofngo=[]
   
    const reportschemaobj = await reportschema.findOne({
      $and: [
        { username: req.session.user.username }
    ]
    })
  if( reportschemaobj!=null )
  {
    arrofngo.push(reportschemaobj.ngoname);
  }
  //  console.log(typeof(reportschemaobj));
   console.log((arrofngo));

     const userobj = await mongoschema.findOne({
      $and: [
          { username: req.session.user.username }
      ]
  })
      .catch((error) => {
          console.log(error);
          console.log("errorr in fetching data ");
      });
      const review = await reviewschema.find().catch((error)=>{
        console.log(error);
          console.log("errorr in fetching data /user ");
      })
         
     try {
       if(obj!=null)
       {
        if(arrofngo.length>0)
        {
        res.status(200).render('User',{name:req.session.user.username, email: req.session.user.email,item:obj,length:obj.length,useritem:userobj, reviews: review,arrofngo:reportschemaobj.ngoname});
      }
      else{
      res.status(200).render('User',{name:req.session.user.username, email: req.session.user.email,item:obj,length:obj.length,useritem:userobj, reviews: review,arrofngo:arrofngo});
      }
          // res.status(200).render('User',{name:req.session.user.username, email: req.session.user.email,item:obj,length:obj.length, reviews,
          //   avgRating});
       }
       else{
        res.send("error in /user app.js");
       }

      } catch (err) {
        console.error(err);
        res.send('Error loading reviews');
    }
});


////searching

app.post('/user',async(req,res)=>{
  
  console.log("/user running");
  
  try{
    let sear = req.body.payload;
    const rating =req.body.payloadr;
    console.log(rating);
    if(sear==undefined)
    {
      sear='';
    }
    console.log(sear);
    const pipeline = [
      { $match : {username:new RegExp(`^${sear}`,"i")} },
      {$group:{_id: '$username',doc:{$first: '$$ROOT'} }}];
    let  obj =  await ngoschema.aggregate(pipeline);
    if(rating==undefined)
    {
      console.log(obj);
      res.status(200).send({payload: obj});
    }
    else{
    await reviewschema.find({ rating: rating })
  .then(reviews => {
    console.log(reviews);
      const reviewslist=[];
      reviews.forEach(Element=>{
      reviewslist.push(Element.ngoname);
    })
    console.log(reviewslist);
    const result=[];
    const distinctArr = reviewslist.filter((ob, index, self) =>
    index === self.findIndex((t) => (
      t === ob
    ))
  );
  
console.log(distinctArr);

    // const result = obj.filter(p => reviewslist.includes(p.username));
    obj.forEach(Element=>{
      for(i = 0; i<distinctArr.length;i++)
      {
        if(Element.doc.username==distinctArr[i])
        {
          result.push(Element);
        }
      }
    })
    // console.log(obj);
    res.status(200).send({payloadr: result});
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });

    }
    
    // }
    // else{
    // res.status(200).render('User',{name:req.session.user.username, email: req.session.user.email,item:obj,length:obj.length,useritem:userobj, reviews: reviewschema,arrofngo:arrofngo});
    // }
  
  }
  catch(err){
    console.log(err);
    res.send('Error Searching'); 
  }
  });



app.post('/reviews',async(req,res)=>{
  const payload = req.body;
  console.log(payload);
  const reviewdata=new reviewschema();
    reviewdata.ngoname = payload.ngoname.trim() ;
    reviewdata.username = payload.username;
    reviewdata.rating = payload.rating;
    reviewdata.comment= payload.comment;
    console.log("didn work");
    await reviewdata.save();
    console.log("didn work");
  return res.status(200).redirect('/');
});

 












//data parsing
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.post('/email',(req,res)=>{
    console.log('Data: ',req.body);
    res.json({message: 'Message recieved'});
})


const registerRoute=require("./routes/registerRoutes");
app.use("/register", registerRoute);

const forgetp=require("./routes/forgot_password_route");
app.use("/forgetpassword", forgetp);


app.get("/forgetpassword", (req, res)=>{
    res.render("forgetpassword");
})



const resetpasswordroute=require("./routes/resetpasswordroute");
const { error } = require("console");
app.use("/reset-password", resetpasswordroute);




// Edit details

// const editRoute=require("./routes/editRoutes");
// app.use("/edituser", editRoute);





app.listen(port, () => console.log(`Example app listening on port ${port}!`));




app.get("/chat", (req, res)=>{
    res.render("chat")
})


// 

app.get("/checkout",middleware.requireLogin, (req, res)=>{
    res.render("checkout")
})


const userinfo=require("./routes/userinfo");
app.use("/userinfo", userinfo);


app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {currency: 'inr', product_data: {name: 'NGO-DONATION'}, unit_amount: 257619},
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/user',
    });
  
    res.redirect(303, session.url);
  });

  app.post('/getreviews',async(req,res)=>{
    let payload = req.body.payload;
    console.log(payload);
    let result  = await reviewschema.find({ngoname:payload});
    if(result!=null)
    {
      console.log("result data");
      console.log(result);
      console.log(result.length);
      const obj ={
        payload : result,
        
      }
     res.status(200).send(obj);
    }
  })




  const AdminRoute=require("./routes/adminRoutes");
const { map } = require("jquery");
app.use("/admin", AdminRoute);




app.get("/ngodetails", async(req, res)=>{
  // const pipeline = [{$group:{_id: '$username',doc:{$first: '$$ROOT'} }}];
  // let  ngod =  await ngoschema.aggregate(pipeline);
  const ngod= await ngoschemaregist.find();
  res.render("ngodetails", {ngod:ngod});
})
app.post("/ngodetails", (req, res)=>{
  console.log("post ho taha hai");
  const it=req.body.checkbox;
  ngoschemaregist.findByIdAndDelete(it)
  .then(function (it) {
   console.log("bloody pass");
   res.redirect("/ngodetails"); 
    })
    .catch(function (err) {
     console.log(err);
    
  })
})




app.get("/userdetails", async(req, res)=>{
  const userd=await mongoschema.find();
  res.render("userdetails", {userd:userd});
})

app.post("/userdetails", (req, res)=>{
  console.log("post ho taha hai");
  const it=req.body.checkbox;
  mongoschema.findByIdAndDelete(it)
  .then(function (it) {
   console.log("bloody pass");
   res.redirect("/userdetails"); 
    })
    .catch(function (err) {
     console.log(err);
    
  })
})


app.get("/reviewdetails", async(req, res)=>{
  const reviewd=await reviewschema.find();
  res.render("reviewdetails", {reviewd:reviewd});
})

app.post("/reviewdetails", (req, res)=>{
  console.log("post ho taha  review me hai");
  const it=req.body.checkbox;
  reviewschema.findByIdAndDelete(it)
  .then(function (it) {
   console.log("bloody pass");
   res.redirect("/reviewdetails"); 
    })
    .catch(function (err) {
     console.log(err);
    
  })
})


app.get("/reportdetails", async(req, res)=>{

  var mp = new Map();
  const doc = await reportschema.find({});
  for(let  i=0;i<doc.length;i++)
  {
    for(let j = 0;j<doc[i].ngoname.length;j++)
  if(!mp.has(doc[i].ngoname[j]))
  {
    let arr =[];
    arr = doc[i].username;
    mp.set(doc[i].ngoname[j], arr);
    // console.log(arr);
    // console.log(doc[i].ngoname[j]);
    // console.log(mp.get(doc[i].ngoname[j]));
   
  }
  else{

    let arr=[];
     arr.push(mp.get(doc[i].ngoname[j]));
    arr.push(doc[i].username);
        mp.set(doc[i].ngoname[j],arr);
  }
 
}
console.log('total reports');
console.log(mp.size);
mp.forEach((key,value)=>{
  console.log(key , value);
})
// console.log(mp);
  res.render("reportdetails", {mp:mp});
})

app.post("/reportdetails", async(req, res)=>{
  console.log("register ngo5 deleted");
  await ngoschema.deleteMany({username: req.body.checkbox})

     .catch(function (err) {
      console.log(err);
   })
 
  await reviewschema.deleteMany({ngoname: req.body.checkbox})
        
     .catch(function (err) {
      console.log(err);
   })


   await ngoschemaregist.deleteOne({username: req.body.checkbox})
      .catch(function (err) {
       console.log(err);
    })
    console.log("register deleted "+req.body.checkbox);

  await reportschema.updateMany(
    {},
    {$pull :{ ngoname :{ $in: req.body.checkbox}}}
    );

    res.redirect("/reportdetails");

})


app.post("/reportdata", async(req, res)=>{
  console.log("me chala");
  const username = req.session.user.username;
  console.log(username);
  const ngoname = req.body.htmlcontent;
  const color = req.body.color;
  const check_username_exists = await reportschema.findOne({username:username});
  console.log("this "+check_username_exists);
  if(check_username_exists)
  {
  console.log(ngoname+" : color : "+color);
  //if black
  if(color==='black')
  {
  await reportschema.findOne({username: username}).updateOne( 
    { $pull: { ngoname:  ngoname } }
    // { new: true }
   )
  }
  else{
  //if red
  await reportschema.findOne({username: username}).updateOne( 
  { $push: { ngoname: ngoname } }
  )
  }
}
else {
  let temparr=[];
  temparr.push(ngoname);
  const obj = new reportschema();
  obj.username=username;
  obj.ngoname = temparr;
  await obj.save();
  console.log(obj.ngoname[0]);
  
  console.log("report saved successfully");

}
})

app.post('/getrating',async(req,res)=>{

  const rating = await reviewschema.find({ngoname:req.body.payload});
  const obj ={
    payload : rating,
    
  }
  console.log(rating);
  res.status(200).send(obj);
})

app.get("/bloghome", async (req, res) => {
  const allBlogs = await Blog.find({});                                       
  res.render("home", {
      user: req.user,
      blogs: allBlogs,
      editing: false
  });  
});

app.use('/bloguser', userRoute);
app.use('/blog', blogRoute);





const userdataRouter=require('./routes/sitedata');
app.use('/sitedata', userdataRouter);
