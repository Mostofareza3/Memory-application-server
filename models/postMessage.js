import mongoose from 'mongoose';


const postSchema = mongoose.Schema({
   title: String,
   message : String,
   name : String, // name of the person who logged in. 
   creator : String,
   tags : [String],
   selectedFile : String,
   likes: { type: [String], default: [] },
   createdAt:{
       type: Date,
       default: new Date()
   }
});

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;