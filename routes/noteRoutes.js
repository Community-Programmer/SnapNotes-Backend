const express=require('express');
const {getNotes, createNote, deleteNote,updateNote}=require('../controllers/notesController')
const auth=require('../middleware/auth')

const noteRouter=express.Router();

noteRouter.get('/getnotes',auth,getNotes)
noteRouter.post('/addnotes',auth,createNote)
noteRouter.delete('/deletenotes/:id',auth,deleteNote)
noteRouter.put("/updatenotes/:id",auth,updateNote)

module.exports=noteRouter