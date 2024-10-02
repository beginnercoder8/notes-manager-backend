const userSchema = require('../models/userModel');
const bcrypt = require('bcrypt');

const signUp = async(req,res) => {
    try{
      const { username, email, password } = req.body;
       if(username && email && password) {
        let hashedPassword = await bcrypt.hash(password, 10);
        let findExistingUsername = await userSchema.findOne({username});
        let findExistingEmail = await userSchema.findOne({email});
        if(findExistingUsername && findExistingEmail){
            return res.status(400).json({code:400, isDuplicateUsername:true, isDuplicateEmail:true});
        } else if(findExistingUsername){
            return res.status(400).json({code:400, isDuplicateUsername:true, isDuplicateEmail:false});
        } else if(findExistingEmail){
            return res.status(400).json({code:400, isDuplicateUsername:false, isDuplicateEmail:true});
        }
        let createUser = userSchema.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({code:201,message:'Successfully signed up!'});
       } else {
        return res.status(400).json({ code: 400, message: 'All fields are required' });
    }
    } catch(err) {
       return res.status(400).json(err);
    }
}

const login = async(req,res) => {
    try{

    } catch(err) {

    }
}

module.exports = {
    signUp,
    login
}