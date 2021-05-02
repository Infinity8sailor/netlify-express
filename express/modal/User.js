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
    topics : {
        type : Array,
        default : [["604bef3fb7d34333e049c33e","World"]]
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userScheme, "users");