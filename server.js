const express = require("express");
const cors = require("cors");
const path = require("path");

// Chú ý: 'route' chứ không phải 'routes'
const customerRouter = require("./routes/customerRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Đăng ký router khách hàng
app.use("/api/customers", customerRouter);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
