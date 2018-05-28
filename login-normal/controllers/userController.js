// *** controller ***

var bcrypt = require('bcrypt')
var mongoose = require('mongoose')

var User = require('../models/User')

module.exports.create = (req, res) => {
  let data = req.body
  let user = new User()
  user.name = data.name
  user.email = data.email
  user.lastname = data.lastname
  user.password = bcrypt.hashSync(data.password, 10)
  user.save((err, user) => {
      if (err) return res.sendStatus(503)
      return res.json(user)
  });
}

module.exports.login = function (req,res) {
  let data = req.body
  User.findOne({email:data.email}).then((user, err) => {
    if(err) return res.sendStatus(503)
    if(!user) return res.sendStatus(404)
    if (bcrypt.compareSync(data.password, user.password)) return res.json(user)
    return res.sendStatus(401)
  })
}
