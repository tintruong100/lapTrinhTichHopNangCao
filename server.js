const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Đăng ký router khách hàng
const customerRouter = require("./routes/customerRouter");
app.use("/api/customers", customerRouter);

//Kết nối mongo
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/contacts")
.then(() => {
    console.log("✅ Kết nối MongoDB local thành công");
    app.listen(3000, () => console.log("✅ Server chạy tại http://localhost:3000"));
})
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

//Đăng ký router Mongo
const customerRouteMongoDB = require("./routes/customerRouteMongoDB");
app.use("/api/customerMongoDB", customerRouteMongoDB);

// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
// });
