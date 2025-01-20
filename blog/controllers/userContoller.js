const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    console.log("Request body:", req.body);

   
    if (!username || !password || !email) {
      console.log("Validation failed - Missing fields:", { username, email, password });
      return res.status(400).send({
        success: false,
        message: "Fill all the fields",
      });
    }

   
    if (!username.trim() || !password.trim() || !email.trim()) {
      console.log("Validation failed - Empty fields:", { username, email, password });
      return res.status(400).send({
        success: false,
        message: "Fill all the fields",
      });
    }

  
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }

   const hashedPassword = await bcrypt.hash(password,10);
   
    const newUser = new userModel({ username, email, password:hashedPassword });
    await newUser.save();

    return res.status(200).send({
      success: true,
      message: "User saved successfully",
    });
  } catch (e) {
    console.log("Error:", e.message);
    return res.status(500).send({
      message: "Error in register callback",
      success: false,
    });
  }
};

exports.getAllUsers =async (req,res)=>{
  try{
  const users = await userModel.find({});
  return res.status(200).send({
    userCount: users.length,
    success:true,
    message:'all user data',
    users,
  })
}
catch(e){
  console.log(e);
  return res.status(500).send({
    success:false,
    message:'Error In Get All Users',
    error,
  });
}
}

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body; // Fix: Destructure as an object
    
    console.log("Request body:", req.body);
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Password match successfully",
      user,
    });
  } catch (e) {
    
    return res.status(500).send({
      success: false,
      message: "Error in login callback",
      error: e.message,
    });
  }
};
