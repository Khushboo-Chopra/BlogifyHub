const {Router} = require('express');
const User =require('../models/user');
const router = Router();

router.get('/signin',(req,res)=>{
return res.render("signin");
});

router.get('/signup',(req,res)=>{
    return res.render("signup");
    });
  
    router.post('/signup',async (req,res)=>
    {
const {fullName,email,password} = req.body;
try {
    await User.create({
        fullName:fullName,
        email:email,
        password:password
    });
} catch (error) {
    return res.render('signup',{
        error: 'Email already exists'
    })
}
return res.redirect("/");
    })

    router.post('/signin',async (req,res)=>{
        const {email,password} = req.body;
     try {
         const token = await User.matchPasswordAndGenerateToken(email,password);
         return res.cookie('token',token).redirect("/");
     } catch (error) {
        return res.render('signin',{
            error: 'Incorrect Email or Password'
        })
     }
    })

    router.get('/logout',(req,res)=>{
        res.clearCookie('token').redirect('/');
    })
module.exports = router;
