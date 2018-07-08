# SNIPTOR

The snippet generator allows install code snippet from a gihub project to another project, according to MVP structure.

## Installation

Using ***NPM***
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

### Configuration

For start to use the sniptor, you need a config file, here you especify, the next fields:

- Paths: Path for components of your app (Controller, Model, Route) 
- Project: Framework used (Express, Loopback, etc)
- Pattern: Design pattern using like MVP, MVC, etc.
- Type: Project Type (Webapp, API, WebService, etc)
- Method:
    * Add: Insert the snippet directly in your project, it mean create a new file for each type file (Model, Controller, Route)

```JSON
{
    "paths": {
        "controller": "controllers",
        "model": "models",
        "route": "routes"
    },
    "project": "express",
    "pattern": "mvc",
    "type": "API",
    "method": "add"
}
```
**NOTE:** In the current version, it is important have the structure definied in the config.json.

### Changelogs

### To Do

- Install dependencies per project
