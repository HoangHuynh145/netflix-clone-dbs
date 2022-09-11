const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {type: String, required: true, minLength: 1, maxLength: 255, unique: true},
    email: {type: String, required: true, minLength: 6, maxLength: 255, unique: true},
    password: {type: String, required: true, minLength:6},
    isAdmin: {type: Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('User', User);
