// *** model ***

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String, 
    unique: true, 
    required: "Name is required"
  },
  lastname: {
    type: String, 
    unique: true, 
    required: "Lastname is required"
  },
  email: {
    type: String, 
    unique: true, 
    required: "Email is required"
  },
  password: { 
    type: String, 
    required: "Password is required"
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);
