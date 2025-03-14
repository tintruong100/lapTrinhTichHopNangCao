const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, "public")));

// API mẫu để lấy danh sách liên hệ
let contacts = [
    { id: 1, name: "Nguyễn Văn A", phone: "0123456789", email: "a@example.com" },
    { id: 2, name: "Trần Thị B", phone: "0987654321", email: "b@example.com" }
];

app.get("/api/contacts", (req, res) => {
    res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
    const newContact = { id: contacts.length + 1, ...req.body };
    contacts.push(newContact);
    res.status(201).json(newContact);
});

app.delete("/api/contacts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);
    res.json({ message: "Đã xóa liên hệ thành công" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
