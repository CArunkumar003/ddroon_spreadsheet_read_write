let mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let Schema = mongoose.Schema

let adduserSchema = new Schema({
    username: { type: String, required: true },
    role_id: 

    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      },
    userPurpose: { type: String, trim: true, required: true }, 
    emailId: { type: String, unique: true, trim: true, required: true },
    password_digest: { type: String, trim: true, required: true },
    saltSecret: String

})


// Custom validation for email
adduserSchema.path('emailId').validate((val) => {
    emailIdRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailIdRegex.test(val);
}, 'Invalid e-mail.');

// Events
adduserSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password_digest, salt, (err, hash) => {
            this.password_digest = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
adduserSchema.methods.verifyPassword = function (password_digest) {
    return bcrypt.compareSync(password_digest, this.password_digest);
};

adduserSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



let User = mongoose.model('user', adduserSchema)
module.exports = User;