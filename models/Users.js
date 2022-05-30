const { Schema, model } = require("mongoose");


const Users = model('Users', Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: false },
    unvname: { type: String, required: true, unique: false },
    paymentStatus: { type: String, required: false },
    paymentStatus2: { type: String, required: false },
    paymentStatus3: { type: String, required: false },
    paymentStatus4: { type: String, required: false },
    paymentStatus5: { type: String, required: false },
    paymentStatus6: { type: String, required: false },
    paymentStatus7: { type: String, required: false },
    paymentStatus8: { type: String, required: false },
    paymentStatus9: { type: String, required: false },
    paymentStatus10: { type: String, required: false },
    password: { type: String, required: true },
    quiz1_1: { type: Number, required: false },
    quiz1_2: { type: Number, required: false },
    quiz2_1: { type: Number, required: false },
    quiz2_2: { type: Number, required: false },
    quiz3_1: { type: Number, required: false },
    quiz3_2: { type: Number, required: false },
    quiz4_1: { type: Number, required: false },
    quiz4_2: { type: Number, required: false },
    quiz5_1: { type: Number, required: false },
    quiz5_2: { type: Number, required: false },
    quiz6_1: { type: Number, required: false },
    quiz6_2: { type: Number, required: false },
    quiz7_1: { type: Number, required: false },
    quiz7_2: { type: Number, required: false },
    quiz8_1: { type: Number, required: false },
    quiz8_2: { type: Number, required: false },
    quiz9_1: { type: Number, required: false },
    quiz9_2: { type: Number, required: false },
    quiz10_1: { type: Number, required: false },
    quiz10_2: { type: Number, required: false },

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