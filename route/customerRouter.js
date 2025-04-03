const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/customerdata.json"); 

// Đọc dữ liệu từ file JSON
const readData = () => {
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
};

// Ghi dữ liệu vào file JSON
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
};

// Lấy danh sách khách hàng
router.get("/", (req, res) => {
    res.json(readData());
});

// Lấy thông tin một khách hàng cụ thể
router.get("/:id", (req, res) => {
    const customers = readData();
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(customer);
});

// Thêm một khách hàng mới
router.post("/", (req, res) => {
    const customers = readData();
    const newCustomer = {
        id: customers.length ? customers[customers.length - 1].id + 1 : 1,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    };
    customers.push(newCustomer);
    writeData(customers);
    res.status(201).json(newCustomer);
});

// Cập nhật thông tin khách hàng
//123
router.put("/:id", (req, res) => {
    let customers = readData();
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy khách hàng" });

    customers[index] = {
        ...customers[index],
        name: req.body.name || customers[index].name,
        phone: req.body.phone || customers[index].phone,
        email: req.body.email || customers[index].email
    };

    writeData(customers);
    res.json(customers[index]);
});

// Xóa một khách hàng
router.delete("/:id", (req, res) => {
    let customers = readData();
    const newCustomers = customers.filter(c => c.id !== parseInt(req.params.id));
    
    if (customers.length === newCustomers.length) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    writeData(newCustomers);
    res.json({ message: "Khách hàng đã được xóa" });
});

module.exports = router;
