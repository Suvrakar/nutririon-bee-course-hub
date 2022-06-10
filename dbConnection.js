
const mongoose = require("mongoose")

const connect = async() => {
    try {
        let res=await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, });
        console.log("DB Connected");
    } catch (error) {
        console.log("Not Connected ,", error);
    }

}

exports.connect = connect;