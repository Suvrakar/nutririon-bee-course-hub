const { Schema, model } = require("mongoose");


const Users = model('Users', Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    unvname: { type: String, required: true },
    paymentStatus: { type: String, required: false },
    password: { type: String, required: true },
    quiz1: { type: Number, required: false },
    // img:
    // {
    //     data: Buffer,
    //     contentType: String
    // }
}));

exports.Users = Users; 


// id: Date.now().toString(),
// name: req.body.name,
// email: req.body.email,
// phone: req.body.phone,
// unvname: req.body.unvname,
// password: req.body.password,
// paymentStatus: true