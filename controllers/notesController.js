const noteModel=require('../models/noteModel')

//To create Note
const createNote = async (req,res)=>{
    try {
        const {title,tag,description,color}=req.body;
        const newNote= new noteModel({
            title:title,
            tag:tag,
            color:color,
            description:description,
            userID:req.userID
        })
        await newNote.save()
        res.status(201).json({message:"Note Created Successfully!"})
    } catch (error) {
        console.log(error.title)
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
              errors[field] = error.errors[field].message;
            }
            console.log(errors)
            res.status(422).json({ errors });
          }
          else{

              res.status(400).json({message:"Internal Server error occurred!"})
          }
    }
}


//To Fetch Notes Of Users
const getNotes=async (req,res)=>{
    try {
        const notes = await noteModel.find({userID:req.userID})
        res.status(200).json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
        
    }
}

// To delete Note of user
const deleteNote=async (req,res)=>{
    const id=req.params.id;
    try {
        const note = await noteModel.findByIdAndRemove(id);
        res.status(202).json({message:"Note Deleted Successfully!",note:note})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
        
    }
    
}

//To Update Note
const updateNote=async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const {title,tag,description,color}=req.body;
    const newNote= {
        title:title,
        tag:tag,
        color:color,
        description:description,
        userID:req.userID
    }
    try {
        await noteModel.findByIdAndUpdate(id,newNote,{new:true})
        res.status(200).json({message:"Note Update Successfully!",newNote:newNote})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
        
    }

}

module.exports={getNotes,createNote,deleteNote,updateNote}