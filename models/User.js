const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: false});
var db = mongoose.connection;
// Create Schema for single User
const UserSchema = new Schema({
    email: {
        type: String,
        default: "",
        trim: true,
        required: true
    },
    password: {
        type: String,
        default: ""
    }
});


module.exports = User = mongoose.model("users", UserSchema);
module.exports.createUser = function(newUser, callback) {
    newUser.password = password;
    newUser.save();
};

module.exports = User = mongoose.model("users", UserSchema);
