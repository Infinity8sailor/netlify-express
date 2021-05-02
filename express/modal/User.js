const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    google_id:{
        type: String,
        required:true
    },
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required : true,
    },
    // password:{
    //     type: String,
    //     required : true,
    // },
    img_url:{
        type:String,
        required : true,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userScheme, "users");