// *** controller ***

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports.create = (req, res) => {
  const { name, email, lastname, password } = req.body
  const user = new User()
  user.name = name
  user.email = email
  user.lastname = lastname
  user.password = bcrypt.hashSync(password, 10)
  user.save()
    .then((user) => {
      return res.json(user)
    })
    .catch((e) => {
      return res.sendStatus(500)
    })
}

module.exports.login = function (req,res) {
  const { email, password} = req.body
  User.findOne({ email })
    .then((user, err) => {
      if (err) {
        return res.sendStatus(503)
      }
      
      if (!user) {
        return res.sendStatus(404)
      }
      
      if (bcrypt.compareSync(password, user.password)) { 
        return res.json(user)
      }
      return res.sendStatus(401)
    })
}
