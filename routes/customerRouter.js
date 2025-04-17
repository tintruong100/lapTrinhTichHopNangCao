const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/customerdata.json");

// Đọc dữ liệu
const readData = () => {
    if (!fs.existsSync(dataPath)) return [];
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
};

// Ghi dữ liệu
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
};

// Lấy danh sách tất cả khách hàng
router.get("/", (req, res) => {
    const customers = readData();
    res.json(customers);
});

// Lấy 1 khách hàng theo ID
router.get("/:id", (req, res) => {
    const customers = readData();
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(customer);
});

// Thêm khách hàng mới
router.post("/", (req, res) => {
    const customers = readData();
    const newCustomer = {
        id: customers.length ? customers[customers.length - 1].id + 1 : 1,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    };
    customers.push(newCustomer);

    // Gán lại ID liên tục từ 1
    const updated = customers.map((c, i) => ({ ...c, id: i + 1 }));
    writeData(updated);

    res.status(201).json(newCustomer);
});

// Cập nhật thông tin khách hàng
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

// Xóa khách hàng và cập nhật lại ID
router.delete("/:id", (req, res) => {
    let customers = readData();
    const idToDelete = parseInt(req.params.id);
    const newCustomers = customers.filter(c => c.id !== idToDelete);

    if (newCustomers.length === customers.length) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }

    // Gán lại ID tuần tự
    const updated = newCustomers.map((c, i) => ({ ...c, id: i + 1 }));
    writeData(updated);

    res.json({ message: "Khách hàng đã được xóa" });
});

module.exports = router;
