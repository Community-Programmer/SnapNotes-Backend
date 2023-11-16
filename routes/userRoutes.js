const express=require('express');
const { signup, signin, auth, logout, resetToken, verifyResetToken, updatePassword, contact} = require('../controllers/userController');


const userRoute=express.Router();

userRoute.post('/signup',signup)
userRoute.post('/login',signin)
userRoute.post('/logout',logout)
userRoute.post('/contact',contact)
userRoute.get('/verify',auth)
userRoute.post('/forgotpassword',resetToken)
userRoute.get('/resetpassword/:id',verifyResetToken)
userRoute.patch('/updatepassword',updatePassword)
module.exports=userRoute