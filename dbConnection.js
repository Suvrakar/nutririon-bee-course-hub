
const mongoose = require("mongoose")

const connect = async() => {
    try {
        let res=await mongoose.connect("mongodb+srv://suvra123:01711536682Suv@nutriotionbee.qqsv8.mongodb.net/nutriotionBee?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, });
        console.log("DB Connected");
    } catch (error) {
        console.log("Not Connected ,", error);
    }

}

exports.connect = connect;