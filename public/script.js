const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const cancelEdit = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");
let contacts = [];
let editIndex = -1;

function renderContacts() {
    contactList.innerHTML = "";
    contacts.forEach((contact, index) => {
        contactList.innerHTML += `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editContact(${index})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (editIndex === -1) {
        contacts.push({ name, phone, email });
    } else {
        contacts[editIndex] = { name, phone, email };
        editIndex = -1;
        formTitle.textContent = "Thêm liên hệ";
        contactForm.querySelector("button[type=submit]").textContent = "Thêm";
        cancelEdit.classList.add("d-none");
    }
    renderContacts();
    contactForm.reset();
});

function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
}

function editContact(index) {
    const contact = contacts[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;
    editIndex = index;
    formTitle.textContent = "Chỉnh sửa liên hệ";
    contactForm.querySelector("button[type=submit]").textContent = "Lưu";
    cancelEdit.classList.remove("d-none");
}

cancelEdit.addEventListener("click", function () {
    editIndex = -1;
    contactForm.reset();
    formTitle.textContent = "Thêm liên hệ";
    contactForm.querySelector("button[type=submit]").textContent = "Thêm";
    cancelEdit.classList.add("d-none");
});
