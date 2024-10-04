const userSchema = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var userDetails = {};
var otpDetails = {};

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
        if (!userDetails[email]) {
            userDetails[email] = {};
        }
        userDetails[email] = {
            username:username,
            email:email,
            password:hashedPassword
        }
        res.status(201).json({code:201});
       } else {
        return res.status(400).json({ code: 400, message: 'All fields are required' });
    }
    } catch(err) {
       return res.status(400).json(err);
    }
}

const login = (req,res) => {
}

const sendOtp = async (req,res) => {  
    const {email} = req.body;
    if(email){
        if (!otpDetails[email]) {
            otpDetails[email] = {};
        }
        otpDetails[email].otp =  genarateOtp(4)
        const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: 'notesmanager8@gmail.com',
            pass: process.env.GMAIL_PASS
        }
      });
        const mailOptions = {
        from:'notesmanager8@gmail.com',
        to: email,
        subject: 'Please verify OTP',
        text:`Thank you for signing up. Your otp is ${otpDetails[email].otp}.`
      }
      await transporter.sendMail(mailOptions, (error, info) =>{
        if(error) {
            return res.status(400).json({code:400,message:error.message})
        } else {
            otpDetails[email].expiryTime =  Date.now() + (2 * 60 * 1000); 
            return res.status(200).json({code:200,message:'Otp has been sent ,will expire in 2 minutes'});
        }
      }) 
    } else {
        return res.status(400).json({code:400,message:'Email id required'})
        }
}

const verifyOtp = async (req,res) =>{
   const {otp, email} = req.body;
   const otpEntry = otpDetails[email];
   if (!otpEntry) {
    return res.status(400).json({ code: 400, message: 'OTP not found for this email' });
    }
   if(!otp){
     return res.status(400).json({code:400,message:'Otp is required'});
   } else{
    if(otpEntry.expiryTime < Date.now()){
      return res.status(400).json({code:400,message:'OTP expired'})
    }else if(otp !== otpEntry.otp){
        return res.status(400).json({code:400,message:'Invalid OTP'})
     }else {
        let username = userDetails[email].username;
        let userEmail = userDetails[email].email;
        let password = userDetails[email].password;
        let findUser = await userSchema.findOne({email});
        if(findUser){
            return res.status(400).json({code:400,message:'User already exists'})
        }else{
            let createUser = await userSchema.create({
                username,
                email: userEmail,
                password
            });
            return res.status(200).json({code:200,message:'Account was successfully created.'})
        }
     }
   }

}

function genarateOtp (number) {
    var otpGenerated = '';
    for(var i = 1;i <=number;i++){
     otpGenerated += Math.floor(Math.random() * 10).toString()
    }
    return otpGenerated;
}

module.exports = {
    signUp,
    login,
    sendOtp,
    verifyOtp
}