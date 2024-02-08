require('dotenv').config();

//for setting views folder  we require path
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT ||  5000;
const Blog = require('./models/blog');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("MongoDB Connected"));


//middlewares
app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({extended:false}));
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));



//route
app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
res.render('home',{
    user:req.user,
    blogs:allBlogs
});
})

app.listen(port,()=>{
    console.log(`server connected succesfully at port: ${port}`);
})