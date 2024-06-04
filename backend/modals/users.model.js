const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['worker', 'engineer'],
        required: true
    }
}
    , {
        timestamps: true
    }
);
UserSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            this.password = hashedPassword;
            next();
        });
    } else {
        return next();
    }
});
module.exports = mongoose.model('User', UserSchema);