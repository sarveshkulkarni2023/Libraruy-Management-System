function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Arrays to hold books and users
let books = [];
let users = [];

// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;

// Function to display all books with pagination
function displayBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear the list before displaying

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedBooks = books.slice(start, end);

    paginatedBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="viewBookDetails(${start + index})">View Details</button>
            <button onclick="deleteBook(${start + index})">Delete</button>
        `;
        bookList.appendChild(bookItem);
    });

    updatePaginationControls();
}

// Function to update pagination controls
function updatePaginationControls() {
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(books.length / itemsPerPage)}`;
}

// Function to go to the next page
function nextPage() {
    if (currentPage < Math.ceil(books.length / itemsPerPage)) {
        currentPage++;
        displayBooks();
    }
}

// Function to go to the previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayBooks();
    }
}

function addBook() {
    const title = prompt('Enter book title:');
    const author = prompt('Enter book author:');
    
    if (title && author) {
        books.push({ title, author });
        currentPage = 1;
        displayBooks();
        updateDashboardStats(); // Update stats after adding a book
        alert('Book added successfully!'); // Feedback
    } else {
        alert('Both title and author are required!');
    }
}

// Function to delete a book
function deleteBook(index) {
    if (confirm('Are you sure you want to delete this book?')) {
        books.splice(index, 1);
        currentPage = 1; // Reset to first page after deleting a book
        displayBooks();
        alert('Book deleted successfully!'); // Feedback
    }
}

// Function to display all users
function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear the list before displaying

    users.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.innerHTML = `
            <p>${user.name} (Email: ${user.email})</p>
            <button onclick="deleteUser(${index})">Delete</button>
        `;
        userList.appendChild(userItem);
    });
}

function addUser() {
    const name = prompt('Enter user name:');
    const email = prompt('Enter user email:');
    
    if (name && email) {
        users.push({ name, email });
        displayUsers();
        updateDashboardStats(); // Update stats after adding a user
        alert('User added successfully!'); // Feedback
    } else {
        alert('Both name and email are required!');
    }
}

// Function to delete a user
function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        displayUsers();
        alert('User deleted successfully!'); // Feedback
    }
}

// Array to hold borrowed books
let borrowedBooks = [];

// Function to display borrowable books
function displayBorrowableBooks() {
    const borrowReturnSection = document.getElementById('borrowReturnSection');
    borrowReturnSection.innerHTML = ''; // Clear before displaying

    if (books.length === 0) {
        borrowReturnSection.innerHTML = '<p>No books available for borrowing.</p>';
        return;
    }

    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="borrowBook(${index})">Borrow</button>
        `;
        borrowReturnSection.appendChild(bookItem);
    });

    displayBorrowedBooks(); // Display currently borrowed books
}

function borrowBook(bookIndex) {
    const userName = prompt('Enter your name to borrow this book:');

    if (userName) {
        borrowedBooks.push({ ...books[bookIndex], borrowedBy: userName });
        books.splice(bookIndex, 1);
        displayBorrowableBooks();
        displayBooks();
        updateDashboardStats(); // Update stats after borrowing
        alert('Book borrowed successfully!'); // Feedback
    } else {
        alert('User name is required to borrow a book.');
    }
}

function returnBook(index) {
    books.push({ title: borrowedBooks[index].title, author: borrowedBooks[index].author });
    borrowedBooks.splice(index, 1);
    displayBorrowableBooks();
    displayBooks();
    updateDashboardStats(); // Update stats after returning a book
}

// Function to update dashboard stats
function updateDashboardStats() {
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('borrowedBooks').textContent = borrowedBooks.length;
    document.getElementById('registeredUsers').textContent = users.length;
}

// Function to view book details
function viewBookDetails(index) {
    const bookDetailInfo = document.getElementById('bookDetailInfo');
    bookDetailInfo.innerHTML = `
        <h3>${books[index].title}</h3>
        <p>Author: ${books[index].author}</p>
        <button onclick="showSection('manageBooks');">Back to Manage Books</button>
    `;
    document.getElementById('bookDetails').style.display = 'block';
    showSection('bookDetails');
}

// Function to search books
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
    
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear previous results

    filteredBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="viewBookDetails(${index})">View Details</button>
            <button onclick="deleteBook(${index})">Delete</button>
        `;
        bookList.appendChild(bookItem);
    });
}

// Function to search for borrowable books
function searchBorrowableBooks() {
    const query = document.getElementById('borrowSearchInput').value.toLowerCase();
    const borrowReturnSection = document.getElementById('borrowReturnSection');
    borrowReturnSection.innerHTML = ''; // Clear previous results

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));

    if (filteredBooks.length === 0) {
        borrowReturnSection.innerHTML = '<p>No matching books found.</p>';
        return;
    }

    filteredBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="borrowBook(${index})">Borrow</button>
        `;
        borrowReturnSection.appendChild(bookItem);
    });
}

// Call this function to initialize dashboard stats on page load
updateDashboardStats();
