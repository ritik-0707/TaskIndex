const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports= new mongoose.model("Register",registerSchema);