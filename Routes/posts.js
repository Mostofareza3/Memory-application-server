import express from 'express';
import { getPosts,createPost,updatePost, deletePost,likePost,getPostsBySearch } from '../controllers/posts.js';
import auth from '../middleware/auth.js'
const router = express.Router();


// auth is a middleware. It checks: Is user valid or not? With the help of this middleware and user can't take attempt on another user's data. 
router.get('/', getPosts);
router.get('/search', getPostsBySearch);
router.post('/',auth, createPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id',auth, deletePost);
router.patch('/:id/likePost',auth, likePost);


export default router;