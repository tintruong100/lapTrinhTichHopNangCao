const express = require("express");
const router = express.Router();
const Customer = require("../modules/customer");
const path = require("path");
const fs = require("fs");


const exportToJson = async () => {
    const customers = await Customer.find({}, { _id: 0, __v: 0 });
    const filePath = path.join(__dirname, "../data/customerdata.json");
    fs.writeFileSync(filePath, JSON.stringify(customers, null, 4));
};

router.get("/", async (req, res) => {
    await exportToJson();
    const customers = await Customer.find().sort({ createdAt: 1 });
    res.json(customers.map((c, i) => ({ id: i + 1, _id: c._id, ...c._doc })));
});

router.post("/", async (req, res) => {
    try {
        const lastCustomer = await Customer.findOne().sort({ id: -1 }).limit(1);
        const newId = lastCustomer ? lastCustomer.id + 1 : 1;

        const newCustomer = new Customer({
            id: newId,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thêm khách hàng" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { id: parseInt(req.params.id) },  // tìm theo id tự tạo
            req.body,
            { new: true }
        );
        if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        res.json(customer);
    } catch {
        res.status(400).json({ message: "ID không hợp lệ" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        // Gán lại ID liên tục từ 1
        const customers = await Customer.find().sort({ createdAt: 1 });
        for (let i = 0; i < customers.length; i++) {
            customers[i].id = i + 1;
            await customers[i].save();
        }
        res.json({ message: "Đã xóa thành công" });
    } catch {
        res.status(400).json({ message: "ID không hợp lệ" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        res.json(customer);
    } catch {
        res.status(400).json({ message: "ID không hợp lệ" });
    }
});

module.exports = router;
