const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    username : String,
    email : String,
    password : String,
    total : {
        type : Number,
        default : 0
    },
    in_transit : {
        type : Number,
        default : 0
    },
    alert : {
        type : Number,
        default : 0
    },
    arrived : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model("User", userSchema);