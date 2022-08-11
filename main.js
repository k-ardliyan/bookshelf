let books = [];

const bookCardHTML = (book) =>
    `
        <div class="card">
            <div class="card-body shadow">
                <div class="dropdown float-end">
                    <button type="button" class="btn p-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(0, 0, 0, 1);"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end text-end">
                        <li><a class="edit-book dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editModal">Ubah Buku</a></li>
                        <li><a class="delete-book dropdown-item text-danger" href="#">Hapus Buku</a></li>
                    </ul>
                </div>
                <div class="form-check form-switch d-flex mb-2">
                    <input class="form-check-input" type="checkbox" role="switch" id="isComplete" ${book.isComplete ? "checked" : ""}>
                    <label class="badge ms-2 rounded-4 ${book.isComplete ? "bg-success" : "bg-secondary"}">${book.isComplete ? "Sudah Dibaca" : "Belum Dibaca"}</label>
                </div>
                <h4>${book.title}</h4>
                <p class="mb-0">Penulis: ${book.author}</p>
                <p class="mb-0">Tahun: ${book.year}</p>
            </div>
        </div>
    `;

function renderBooks(items) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    items.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item col-12 col-sm-6 col-md-4 col-lg-3';
        bookItem.setAttribute('data-book-id', book.id);
        bookItem.innerHTML = bookCardHTML(book);
        bookList.appendChild(bookItem);
    });
}

function addBook(e) {
    e.preventDefault();
    const title = document.getElementById('inputBookTitle'),
        author = document.getElementById('inputBookAuthor'),
        year = document.getElementById('inputBookYear'),
        isComplete = document.getElementById('inputBookIsComplete'),
        book = {
            id: +new Date(),
            title: title.value,
            author: author.value,
            year: parseInt(year.value),
            isComplete: isComplete.checked
        };
    books.push(book);
    [title.value, author.value, year.value, isComplete.checked] = ['', '', '', false];
    document.dispatchEvent(new Event('bookChanged'));
}

function editBook(e) {
    e.preventDefault();
    const id = e.target.closest('.book-item').getAttribute('data-book-id'),
        bookId = document.getElementById('editBookId'),
        title = document.getElementById('editBookTitle'),
        author = document.getElementById('editBookAuthor'),
        year = document.getElementById('editBookYear'),
        isComplete = document.getElementById('editBookIsComplete'),
        book = books.find(book => book.id === parseInt(id));
    [bookId.value, title.value, author.value, year.value, isComplete.checked] = [book.id, book.title, book.author, book.year, book.isComplete];
}

function updateBook(e) {
    e.preventDefault();
    const id = document.getElementById('editBookId'),
        title = document.getElementById('editBookTitle'),
        author = document.getElementById('editBookAuthor'),
        year = document.getElementById('editBookYear'),
        isComplete = document.getElementById('editBookIsComplete');
    books.map(book => {
        if (book.id === parseInt(id.value)) {
            book.title = title.value;
            book.author = author.value;
            book.year = parseInt(year.value);
            book.isComplete = isComplete.checked;
        }
    });
    document.dispatchEvent(new Event('bookChanged'));
}

function deleteBook(e) {
    e.preventDefault();
    const id = e.target.closest('.book-item').getAttribute('data-book-id'),
        book = books.find(book => book.id === parseInt(id));
    books.splice(books.indexOf(book), 1);
    document.dispatchEvent(new Event('bookChanged'));
}

function toggleBook(e) {
    e.preventDefault();
    const id = e.target.closest('.book-item').getAttribute('data-book-id'),
        book = books.find(book => book.id === parseInt(id));
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event('bookChanged'));
}

function filterBooks() {
    const filter = document.getElementById('filterBook').value;
    const filteredBooks = books.filter(book => {
        if (book.isComplete.toString() === filter || filter === '') {
            return true;
        } else {
            return false;
        }
    });
    renderBooks(filteredBooks);
}

function searchBooks(e) {
    e.preventDefault();
    const search = document.getElementById('searchBookTitle').value;
    const searchedBooks = books.filter(book => {
        if (book.title.toLowerCase().includes(search.toLowerCase()) || search === '') {
            return true;
        } else {
            return false;
        }
    });
    document.getElementById('searchBookTitle').value = '';
    document.getElementById('filterBook').value = '';
    renderBooks(searchedBooks);
}

function setLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

function getLocalStorage() {
    const localStorageBooks = JSON.parse(localStorage.getItem('books'));
    if (localStorageBooks) {
        books = localStorageBooks;
    }
}

window.addEventListener('load', function () {
    getLocalStorage(), renderBooks(books);
    const editModal = new bootstrap.Modal("#editModal");
    const addModal = new bootstrap.Modal("#addModal");
    const input = document.getElementById('inputBook'),
        edit = document.getElementById('editBook'),
        search = document.getElementById('searchBook'),
        filter = document.getElementById('filterBook'),
        bookList = document.getElementById('bookList');
    input.addEventListener('submit', (e) => {
        addBook(e);
        addModal.hide();
    });
    edit.addEventListener('submit', (e) => {
        updateBook(e);
        editModal.hide();
    });
    filter.addEventListener('change', filterBooks);
    search.addEventListener('submit', searchBooks);
    bookList.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-book')) {
            editBook(e);
        } else if (e.target.classList.contains('delete-book')) {
            deleteBook(e);
        } else if (e.target.classList.contains('form-check-input')) {
            toggleBook(e);
        }
    });
    // bookchanged default with filter
    document.addEventListener('bookChanged', (e) => {
        filterBooks(), setLocalStorage();
    });
});