const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        //LAY URI tu bien moi truong
        const mongoURI = process.env.MONGO_URI
        if(!mongoURI){
            console.error("Lỗi: MONGO_URI không được định nghĩa trong file");
            process.exit(1);
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected...[Kết nối thành công]");
    }catch(err){
        console.error("Lỗi kết nối MongoDB: ",err.message);
        //thoat khoi quy trinh voi loi
        process.exit(1);
    }
};
module.exports = connectDB;