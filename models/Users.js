const { Schema, model } = require("mongoose");


const Users = model('Users', Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    unvname: { type: String, required: true },
    paymentStatus: { type: String, required: false },
    password: { type: String, required: true },
}));

exports.Users = Users; 


// id: Date.now().toString(),
// name: req.body.name,
// email: req.body.email,
// phone: req.body.phone,
// unvname: req.body.unvname,
// password: req.body.password,
// paymentStatus: true