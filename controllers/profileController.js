const PROFILE = require('../models/profile')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// create account 
const handleRegister = async (req, res) => {
    const {firstName, lastName, email, password, role} =req.body
    try {
        const userExist = await PROFILE.findOne({email});
        if (userExist) {
            return res.status(400).json({err: "The email is already in use"})
        }
        const salt = await bcrypt.genSalt(10)
        const hasehedPassword = await bcrypt.hash(password, salt);

        const user = await PROFILE.create({
            firstName,
            lastName,
            email,
            role,
            password: hasehedPassword,
        });

        res.status(201).json({
            success: true,
            user: {
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error){
        console.log(error) 
            res.status(400).json({Err: error.message});
        
    }
}

// login account
const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    
        try{
    if (!email || !password){
        return res.status(401).json({err: 'Provide all values'})
    }
    
    // check if email has been registered
    const user = await PROFILE.findOne({email})
    if (!user){
        return res.status(400).json({err: "Account not found"})
    }
    
    
    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(401).json({err: "Email Or Password mismatch"})
    }
    
    // handout the token
    const token = jwt.sign({userId: user._id,role: user.role}, process.env.JWT_SECRET,{ expiresIn: "2d"});
    
    
    
    res
    .status(200)
    .json({message: "user logged in",
    user: {email: user.email, role: user.role, firstName: user.firstName,lastName: user.lastName}, token, success:true
    });

    }catch (error){ 
        console.log(error);
        res.status(400).json(error);
    }
};

module.exports = {handleRegister, handleLogin}