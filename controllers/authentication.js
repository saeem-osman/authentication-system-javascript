const jwt = require('jwt-simple');
const config = require('../config')
const User = require('../models/user')

//getting authentication
function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp }, config.secret);
}

//user who provide correct email and password

exports.signin = function(req,res,next){
    //User has already had their email and password
    //we just need to give them token

    res.send({token: tokenForUser(req.user) });
}

exports.signup = function(req,res,next) {
    const email = req.body.email;
    const password = req.body.password;

    //if a user doesn't provide email or password
    if(!email || !password){
        return res.status(422).send({error: "You must provide email and password"});
    }
    if(password.length <= 5){
        return res.status(422).send({error: "Password should be at least 6 characters"})
    }

    //see if a user with email already exist

    User.findOne({email:email}, function(err,existingUser){
        //if database not connected or other error
        if(err){
            return next(err);
        }

        //if user already exist in database
        //422 http request to varify 
        if(existingUser){
            return res.status(422).send({error: "Email is in use"})
        }

        const user = new User({
            email: email,
            password: password
        })

        user.save(function(err){
            if(err){
                return next(err)
            }
            //respond to request indicating user was created
            res.json({ token: tokenForUser(user) })
        })

    })
} 