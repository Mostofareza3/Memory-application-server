
import mongoose from 'mongoose';
import express from 'express';
import PostMessage from "../models/postMessage.js"

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
       
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT //get the starting index of every page.
        console.log('get hit')
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        //it gives us the newest post in as a first item.
        console.log('get successful');
        // console.log(posts)
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    }
    catch (error) {
        console.log('get failure')
        res.status(400).json({ message: error.message })
    }
}

export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {
        
        const title = new RegExp(searchQuery, 'i'); //(i) means-->it ignore case sensitive [Test,tesT,TEST]

        // below '$or' means --> find the data if it matched by either searchQuery or tags.
        // and split here, because when i pass request by tags from frontend it is an String but concatinated by comma.  
        const posts = await PostMessage.find({ $or: [{ title }, { tags: tags.split(',') }] });

        res.json({ data: posts })
        

    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}

export const createPost = async (req, res) => {

    const post = req.body;
    /* here, I push on the new post with the creator id. and the userId comes from auth middleware */

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        
        await newPostMessage.save();
        
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost)
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" })
}


export const likePost = async (req, res) => {
    const { id } = req.params;
    //userId comes from auth middleware
    if (!req.userId) return res.status(404).json({ message: "Unauthenticated!" })
    //check: Is specific id post available here or not?
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    // finally, find from database by id
    const post = await PostMessage.findById(id);

    // check: Is the post already liked by this person?
    // console.log(req.headers)
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        // like the post  
        post.likes.push(req.userId);
    } else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}