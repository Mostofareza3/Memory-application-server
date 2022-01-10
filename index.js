import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './Routes/posts.js';
import userRoutes from './Routes/users.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(cors());

app.use(bodyParser.json({limit : "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit : "30mb", extended: true}));


app.use('/posts', postRoutes);
app.use('/user', userRoutes);



const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology : true })
    .then(()=>app.listen(PORT,()=> console.log("server running on port 5000")))
    .catch((err)=> console.log(err.message));

// routes 
app.get('/', async(req,res)=>{
    res.send("hello world")
});
