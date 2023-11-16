const express=require('express');
const mongoose=require('mongoose');
const userRoute=require('./routes/userRoutes')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const dotenv=require('dotenv');
const noteRouter = require('./routes/noteRoutes');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');

const app=express();
dotenv.config()

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname)

app.use(cors({credentials:true,origin: process.env.CROSS_ORIGIN_URL}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',userRoute)
app.use('/note',noteRouter)

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.send("SnapNotes-Backend")
})
mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
.then(()=>{
    
    app.listen(5050,()=>{
        console.log("Server started and Connected To database")
    })
})
.catch((error)=>{
    console.log(error)
})
