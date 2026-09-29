const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : { type : String, required : true },
    username : { type : String, required : true },
    email : { type : String, required : true, unique : true, index : true },
    password : { type : String, required : true },
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