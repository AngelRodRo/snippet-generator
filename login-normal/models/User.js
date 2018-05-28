// *** model ***

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type:String, unique: true, required:'Name is required'},
  lastname: {type:String, unique: true, required:'Lastname is required'},
  email: {type:String, unique: true, required:'Email is required'},
  password: {type:String, required:'Password is required'},
  createdAt:{ type: Date, default: Date.now}
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
