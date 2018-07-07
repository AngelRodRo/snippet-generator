# SNIPTOR

The snippet generator allows install code snippet from a gihub project to another project, according to MVP structure.

## Installation

Using NPM
```
npm install --save sniptor
```

## Format

For to install each file accordint to type it's neccesary define a comment in the top of the file.

### Model

```javascript
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
```

### Controller

```javascript
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
```

### Route

```javascript
// *** route ***

const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post("/user", userController.create)
router.post("/login", userController.login)

module.exports = router;
```

3. Configuration


3. Changelogs

4. To Do

    - Install dependencies per project
