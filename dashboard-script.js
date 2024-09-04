// User Greeting
const username = localStorage.getItem('username');
document.querySelector('#userName').textContent = username;

// Logout Button
document.querySelector('.log-btn').addEventListener("click", function () {
    if (confirm("Are you sure you want to leave this page?")) {
        window.location.replace('index.html');
    }
});

// Variables
const createEmployeeBtn = document.getElementById('create-employee-btn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-btn');
const form = document.getElementById('info-form');
const dataTable = document.getElementById('data-table').querySelector('tbody');
const employeeCount = document.getElementById('employee-count');
const searchBar = document.getElementById('search-bar');
let currentId = 1; // Track the next ID to assign
let editingRow = null;
let editingRowId = null; // ID of the row being edited

// Show popup
createEmployeeBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
    editingRow = null;
});

// Close popup
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    form.reset();
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
});

// Form validation and submission
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    // Reset error messages
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    // Email validation
    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format.';
        valid = false;
    }

    // Mobile number validation
    const mobile = document.getElementById('mobile').value;
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
        document.getElementById('mobile-error').textContent = 'Invalid mobile number. Must be 10 digits.';
        valid = false;
    }

    // Image file validation
    const image = document.getElementById('image').files[0];
    if (image) {
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(image.type)) {
            document.getElementById('image-error').textContent = 'Only PNG and JPG images are allowed.';
            valid = false;
        }
    }

    // Check for duplicate email or mobile
    const rows = dataTable.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.children;
        if (cells[2].textContent === email && editingRowId !== cells[0].textContent) {
            document.getElementById('email-error').textContent = 'Email already exists.';
            valid = false;
        }
        if (cells[3].textContent === mobile && editingRowId !== cells[0].textContent) {
            document.getElementById('mobile-error').textContent = 'Mobile number already exists.';
            valid = false;
        }
    });

    if (valid) {
        const createDate = new Date().toLocaleDateString();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${editingRow ? editingRowId : currentId++}</td>
            <td><img src="${image ? URL.createObjectURL(image) : ''}" alt="Image"></td>
            <td>${email}</td>
            <td>${mobile}</td>
            <td>${document.getElementById('designation').value}</td>
            <td>${document.getElementById('gender').value}</td>
            <td>${document.getElementById('course').value}</td>
            <td>${createDate}</td>
            <td>
                <button class="edit-btn" style="padding:10px; border-radius:5px; margin-right:10px;">Edit</button>
                <button class="delete-btn" style="padding:10px; border-radius:5px;">Delete</button>
            </td>
        `;

        if (editingRow) {
            editingRow.replaceWith(row);
            editingRow = null;
            editingRowId = null; // Clear the ID after editing
        } else {
            dataTable.appendChild(row);
            document.querySelector('.data-table').style.display = 'table';
        }

        employeeCount.textContent = `Total Employees: ${dataTable.children.length}`;
        popup.style.display = 'none';
        form.reset();
    }
});

// Edit row
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.children;

    // Store ID for later use
    const id = cells[0].textContent;

    document.getElementById('email').value = cells[2].textContent;
    document.getElementById('mobile').value = cells[3].textContent;
    document.getElementById('designation').value = cells[4].textContent;
    document.getElementById('gender').value = cells[5].textContent;
    document.getElementById('course').value = cells[6].textContent;

    editingRow = row;
    editingRowId = id; // Store the ID for reference
    popup.style.display = 'flex';
}


function deleteRow(button) {
    const row = button.closest('tr');
    
    // Ask for user confirmation before deleting
    const confirmDelete = confirm("Are you sure you want to delete this row?");
    
    if (confirmDelete) {
        row.remove();
        
        // Hide the table if no rows are left
        if (dataTable.children.length === 0) {
            document.querySelector('.data-table').style.display = 'none';
        }

        // Update employee count
        employeeCount.textContent = `Total Employees: ${dataTable.children.length}`;
    }
}

// Add event delegation to handle edit and delete buttons
dataTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        editRow(event.target);
    }
    if (event.target.classList.contains('delete-btn')) {
        deleteRow(event.target);
    }
});


// Sorting
let sortOrderId = 'asc'; // Initial sort order for ID
let sortOrderEmail = 'asc'; // Initial sort order for Email

function sortTable(column) {
    const rowsArray = Array.from(dataTable.querySelectorAll('tr'));
    rowsArray.sort((a, b) => {
        const aText = a.children[column === 'id' ? 0 : 2].textContent;
        const bText = b.children[column === 'id' ? 0 : 2].textContent;

        if (column === 'id') {
            const aId = parseInt(aText, 10);
            const bId = parseInt(bText, 10);
            return sortOrderId === 'asc' ? aId - bId : bId - aId;
        } else if (column === 'email') {
            return sortOrderEmail === 'asc'
                ? aText.localeCompare(bText)
                : bText.localeCompare(aText);
        }
    });

    // Update sort order for next click
    if (column === 'id') {
        sortOrderId = sortOrderId === 'asc' ? 'desc' : 'asc';
    } else if (column === 'email') {
        sortOrderEmail = sortOrderEmail === 'asc' ? 'desc' : 'asc';
    }

    // Clear the table and repopulate with sorted rows
    dataTable.innerHTML = '';
    rowsArray.forEach(row => dataTable.appendChild(row));
}

// Attach sort functionality to table headers
document.getElementById('sort-id').addEventListener('click', () => sortTable('id'));
document.getElementById('sort-email').addEventListener('click', () => sortTable('email'));

// Search functionality
searchBar.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const rows = dataTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.children;
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(query) ? '' : 'none';
    });
});
