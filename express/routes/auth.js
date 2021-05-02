const router = require("express").Router();
const {registerValidator,loginValidator} = require('../modal/UserValidator');
const User = require('../modal/User');
const bcrypt =require('bcrypt');

const jwt = require('jsonwebtoken');


router.post('/register',async (req,res)=> {
    // res.send('Register');
    // res.send(req.body);
    // Validate data
    const {error} = registerValidator(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Check User Exists
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send("email Already exist !");

    //incript  password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    // Creating New User
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password :hashPassword  //req.body.password //  
    }); 
    console.log(user);
    try {
        // console.log(userinfo);
        const userinfo = await user.save();
        res.send(userinfo);
    }catch(err){
        res.status(400).send("try failed");
        console.log("failed !");
    };
});

// Loging Things here
router.post("/login",async (req, res)=>{

    // Validate data
    const {error} = loginValidator(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Check User Exists
    const user = await User.findOne({email:req.body.email});
    // if(!user) return res.status(400).send("email doesnt exist !");
    if(!user) return res.status(400).send("email doesnt exist !");
    
    //check for correct password
    const validpass = await bcrypt.compare(req.body.password, user.password)
    if(!validpass) return res.status(400).send("password is wrong !");
    // if(!user.password ==req.body.password) return res.status(400).send("password is wrong !");
    
    // Create and assign a tocken
    console.log(process.env.JWT_KEY);
    const token = jwt.sign({_id:user._id}, process.env.JWT_KEY,{
        expiresIn: 86400 // expires in 24 hours
      });
    res.header('auth-token',token);
    return res.send("Login Success.. !!");
});

module.exports = router;