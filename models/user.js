const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

//Define our model
const userSchema = new Schema({
    email : { type: String, unique: true, lowercase: true},
    password: String
})

//here is the great encryption, On Save Hook, password encryption
//before the model gets saved, run this function
userSchema.pre('save',function(next){
    //we get access to user model
    const user = this;
    bcrypt.genSalt('10',function(err,salt){
        if(err) {return next(err);}

        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err) {return next(err)}

            //overwrite plain text password to encrypted password
            user.password = hash;
            next()
        })
        
    })
})
userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) { return callback(err); }

        callback(null, isMatch)
    })
}



//Create the model class
const ModelClass = mongoose.model('user',userSchema);

//Export the model

module.exports = ModelClass;