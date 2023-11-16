const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()

const SECRET_KEY=process.env.SECRET_KEY

const auth = (req,res,next) =>{
    try {
        let {token}=req.cookies;
        if(token){

            const user= jwt.verify(token,SECRET_KEY)
            req.userID=user.id
        }
        else{
            res.status(401).json({message:"Unauthorized User"})
        }
    
        next()
    } catch (error) {
        res.status(500).json({message:"Server Error Occured"})
    }
        
    
}




module.exports = auth



    