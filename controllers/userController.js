const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require('dotenv')
const nodemailer = require("nodemailer");
const contactModel = require("../models/contactModel");
dotenv.config()

const SECRET_KEY=process.env.SECRET_KEY

const signup= async (req,res)=>{
    const {username,email,password}=req.body;
    try {
        const existingUser= await userModel.findOne({email:email})
        if(existingUser){
            return res.status(400).json({message:"User already Exist"})
        }
        const hashedPass= await bcrypt.hash(password,12)
        const result= await userModel.create({
            username:username,
            email:email,
            password:hashedPass
        })
       
        res.status(201).json({success:true,user:result})
        console.log("New User Created")
    } catch (error) {
       console.log(error)
       res.status(500).json({message:"Server Error Occured"})
    }
}

const signin=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user= await userModel.findOne({email:email});
        if(!user){
           return res.status(404).json({message:"User Doesn't Exist!"})
        }
        
        const matchpass= await bcrypt.compare(password,user.password);
        if(!matchpass){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const token=jwt.sign({username:user.username,id:user._id},SECRET_KEY)
        res.cookie('token',token,{ sameSite: 'None', secure: true }).json({message:'Login Successfull',username:user.username})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error Occured"}) 
    }

}

const logout = async (req,res)=>{
    res.cookie('token','').json("Logout SuccessFull")
}


const auth= async (req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,SECRET_KEY,{},(err,data)=>{
    if(data){
        res.json({data:data,ok:true})
    }
    if(err){
        res.json({message:"Not Authorized!",ok:false})
    }
    })
}

const contact= async (req,res)=>{
    const{name,email,message}=req.body
    try {

        const contact= await contactModel.create({
            name:name,
            email:email,
            message:message
        })
       
        res.status(200).json({staus:"Message Sent!"})
    } catch (error) {
       console.log(error)
       res.status(500).json({message:"Server Error Occured"})
    }

}


const resetToken=async (req,res)=>{
    const {email}=req.body
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:587,
        secure: false,
        auth: {
          user: "sarthakpatel230204@gmail.com",
          pass: "bwea kvgy ajld pfst",
        },
      });

      async function sendmail(username,resetlink,email) {
       
        const info = await transporter.sendMail({
          from: 'sarthakpatel230204@gmail.com', 
          to: email, 
          subject: "SnapNotes Password Reset", 
         
          html: `
                Dear ${username},
                <br><br>
                We received a request to reset the password associated with your account. If you did not make this request, please ignore this email.
                <br><br>
                To reset your password, click on the following button:
                <br><br>
                <button style='background-color:#00DB82; padding:8px; border: 1px solid #00985D;
                border-radius: 5px;'>
                <a  style='color:black; text-decoration:none;' href='${resetlink}'>Reset Password</a>
                </button>
                <br><br>
                Please note that this link is valid for 5 minutes only.
                <br><br>
                If you're having trouble clicking the link, you can copy and paste it into your browser's address bar.
                <br><br>
                If you did not request a password reset or if you have any questions, please contact our support team at [Support Email Address].
                <br><br>
                Thank you,
                SnapNotes
          `, 
        });
        console.log("Message sent: %s", info.messageId);
    }
    try {
        const user= await userModel.findOne({email:email})
        if(!user){
            return res.status(404).json({message:"User Doesn't Exist!"})
        }
        else{
            const token=jwt.sign({email:user.email,username:user.username},SECRET_KEY,{ expiresIn: 300 })
            const resetlink=`http://127.0.0.1:5050/user/resetpassword/${token}`
            sendmail(user.username,resetlink,email)
            res.status(200).json({message:"User Exist!"})
        }
    } catch (error) {
        res.status(500).json({message:"Internal Server Error Occured"}) 
    }


}

const verifyResetToken=async(req,res)=>{
    const token=req.params.id;
    jwt.verify(token,SECRET_KEY,{},(err,data)=>{
        if(data){
            res.render('reset_password', { token: token, email:data.email,username:data.username});
        }
        if(err){
            if (err.name === 'TokenExpiredError') {
                res.render('error')
              } else {
                res.render('error')
              }
        }
        })
}


const updatePassword=async(req,res)=>{
    const {token}= req.body;
    const {newpassword} = req.body;
    // console.log(token,new_password)
    if(!token){
        res.status(401).json({ message: 'Unauthorized: Token not provided!' });
    }
    else{
        jwt.verify(token,SECRET_KEY,{},async(err,data)=>{
            if(data){
                const user= await userModel.findOne({email:data.email})
                const newPass= {
                    password:await bcrypt.hash(newpassword,12)
                }
                try {
                    await userModel.findByIdAndUpdate(user._id,newPass,{new:true})
                    res.status(200).json({message:"Password Updated Successfully!"})
                } catch (error) {
                    console.log(error)
                    res.status(500).json({message:"Server error"})
                    
                }
                
            }
            if(err){
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized: Token has expired' });
                  } else {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                  }
            }
            })
    }
    
}


module.exports={signup,signin,auth,logout,resetToken,verifyResetToken,updatePassword,contact}