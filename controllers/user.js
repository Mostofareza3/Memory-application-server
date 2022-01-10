import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


import User from '../models/user';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        // check: Is user already exist? 
        if (!existingUser) return res.status(404).json({ message: "user not found!" });
        // check: is password correct? 
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        // check: if password not found.
        if (!isPasswordCorrect) return res.status(404).json({ message: "user not found!" });

        // if user email and password valid,
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    }
    catch (error) {
        res.status(500).json({ message: 'something is wrong!' })
    }
};


export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        // check: Is user already exist? 
        if (existingUser) return res.status(400).json({ message: "user already exist!" });

        // check: password isValid
        if(password !== confirmPassword) return res.status(400).json({message: "passwords don't match."});

        // firstly make password hashed
        const hashedPassword = await bcrypt.hash(password, 12);

        // create new user
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});

        // create token
        const token = jwt.sign({ email: result.email, id: result._id},'test', { expiresIn: "1h"});
        
        res.status(200).json({result, token});
        
    } catch (error) {
        res.status(500).json({ message: 'something is wrong!' })
    }

}