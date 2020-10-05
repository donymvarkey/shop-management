const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, enum: ['admin', 'shop-owner', 'user'], default: 'shop-owner'}
});

module.exports = mongoose.model('UserModel', UserSchema);

