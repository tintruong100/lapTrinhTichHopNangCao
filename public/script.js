const contactList = document.getElementById("contactList");
const contactForm = document.getElementById("contactForm");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEdit");
const addContactBtn = document.getElementById("addContactBtn");
const contactCard = document.getElementById("contactCard");

let contacts = [];
let isEditing = false;
let editId = null;

// Tải dữ liệu từ API
async function fetchContacts() {
    const res = await fetch("/api/customers");
    contacts = await res.json();
}

// Hiển thị danh sách lọc theo kết quả tìm kiếm
function renderFilteredContacts(filtered) {
    contactList.innerHTML = "";

    filtered.forEach((contact, index) => {
        contactList.innerHTML += `
            <tr>
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editContact(${contact.id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// Tìm kiếm khi nhấn nút
document.getElementById("searchButton").addEventListener("click", async () => {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    await fetchContacts();

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword)
    );

    if (filtered.length > 0) {
        renderFilteredContacts(filtered);
        contactCard.classList.remove("d-none");
    } else {
        contactCard.classList.add("d-none");
        alert("Không tìm thấy kết quả phù hợp.");
    }
});

// Bắt sự kiện Enter để tìm
document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.getElementById("searchButton").click();
    }
});

// Hiển thị form
document.getElementById("showFormBtn").addEventListener("click", () => {
    document.getElementById("formCard").classList.toggle("d-none");
    formTitle.textContent = "Thêm liên hệ";
    contactForm.reset();
    isEditing = false;
    editId = null;
    cancelEditBtn.classList.add("d-none");
});

// Gửi form thêm/sửa
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const data = { name, phone, email };

    if (isEditing && editId !== null) {
        await fetch(`/api/customers/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } else {
        await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    contactForm.reset();
    document.getElementById("formCard").classList.add("d-none");
    isEditing = false;
    editId = null;
    cancelEditBtn.classList.add("d-none");
    document.getElementById("searchButton").click(); // cập nhật danh sách nếu đang hiện
});

// Sửa liên hệ
async function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;

    isEditing = true;
    editId = id;
    formTitle.textContent = "Chỉnh sửa liên hệ";
    document.getElementById("formCard").classList.remove("d-none");
    cancelEditBtn.classList.remove("d-none");
}

// Hủy chỉnh sửa
cancelEditBtn.addEventListener("click", () => {
    contactForm.reset();
    isEditing = false;
    editId = null;
    formTitle.textContent = "Thêm liên hệ";
    cancelEditBtn.classList.add("d-none");
    document.getElementById("formCard").classList.add("d-none");
});

// Xóa liên hệ
async function deleteContact(id) {
    if (confirm("Bạn có chắc chắn muốn xóa liên hệ này không?")) {
        await fetch(`/api/customers/${id}`, { method: "DELETE" });
        document.getElementById("searchButton").click(); // làm mới danh sách
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await fetchContacts();
    renderFilteredContacts(contacts);
});