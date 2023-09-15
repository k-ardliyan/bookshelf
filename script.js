let books = [];
let currentFilter = 'all';

const bookCardHTML = (book) =>
    `
        <div class="card">
            <div class="card-body shadow">
                <div class="form-check form-switch d-flex mb-2 justify-content-between">
                    <div class="align-self-center">
                        <input class="form-check-input" type="checkbox" role="switch" id="isComplete" ${
                            book.isComplete ? 'checked' : ''
                        }>
                        <label class="badge ms-2 rounded-4 ${
                            book.isComplete ? 'bg-success' : 'bg-secondary'
                        }">
                            ${book.isComplete ? 'Sudah Dibaca' : 'Belum Dibaca'}
                        </label>
                    </div> 
                    <div class="dropdown">
                        <button type="button" class="btn p-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end text-end">
                            <li class="text-center">
                                <a class="edit-book dropdown-item" href="#">
                                    <i class="bi bi-pencil"></i> Ubah Buku
                                </a>
                            </li>
                            <li class="text-center">
                                <a class="delete-book dropdown-item text-danger" href="#">
                                    <i class="bi bi-trash"></i> Hapus Buku
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <h4>${book.title}</h4>
                <p class="mb-0">Penulis: ${book.author}</p>
                <p class="mb-0">Tahun: ${book.year}</p>
            </div>
        </div>
    `;

// Rak Buku
const bookShelfAll = document.getElementById('bookShelfAll');
const bookShelfComplete = document.getElementById('bookShelfComplete');
const bookShelfUncomplete = document.getElementById('bookShelfUncomplete');

// List Buku
const bookListCardAll = document.querySelectorAll('.books');
const bookListCard = document.getElementById('bookList');
const bookListCardComplete = document.getElementById('bookListComplete');
const bookListCardUncomplete = document.getElementById('bookListUncomplete');

// Buttons
const addBookButton = document.getElementById('addBookButton');

// Form Input
const formInputBook = document.getElementById('formInputBook');
const inputTitle = document.getElementById('inputBookTitle');
const inputAuthor = document.getElementById('inputBookAuthor');
const inputYear = document.getElementById('inputBookYear');
const inputIsComplete = document.getElementById('inputBookIsComplete');

// Filters
const filterSelect = document.getElementById('filterBook');
const formSearch = document.getElementById('searchBook');

function clearInput() {
    inputTitle.value = '';
    inputAuthor.value = '';
    inputYear.value = '';
    inputIsComplete.checked = false;
}

function getBookById(e) {
    const id = e.target.closest('.book-item').dataset.bookId;
    const book = books.find((book) => book.id === parseInt(id));
    return book;
}

function filterBooks() {
    if (filterSelect.value === 'all') {
        currentFilter = 'all';
        renderBooks({ filter: currentFilter, data: books });
    }

    if (filterSelect.value === 'double') {
        currentFilter = 'double';
        renderBooks({
            filter: currentFilter,
            data: {
                complete: books.filter((book) => book.isComplete),
                uncomplete: books.filter((book) => !book.isComplete),
            },
        });
    }
    setLocalStorage();
}

function searchBooks(e) {
    e.preventDefault();
    const search = document.getElementById('searchBookTitle').value;
    const searchedBooks = books.filter((book) => {
        if (
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            search === ''
        ) {
            return true;
        }
        return false;
    });
    currentFilter = 'all';
    filterSelect.value = currentFilter;
    renderBooks({
        filter: currentFilter,
        data: searchedBooks,
    });
    setLocalStorage();
}

function notFoundBooks() {
    const notFound = document.createElement('div');
    notFound.className = 'col-12 text-center';
    notFound.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center">
                        <i class="bi bi-book" style="font-size: 100px"></i>
                        <h4>Tidak ada buku</h4>
                    </div>
                </div>
            </div>
        `;
    return notFound;
}

function renderBooks(items) {
    // items merupakan array of object by filter
    const { filter, data } = items;

    if (filter === 'all') {
        bookListCard.innerHTML = '';
        data.forEach((book) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item col-12 col-sm-6 col-md-4 col-lg-3';
            bookItem.dataset.bookId = book.id;
            bookItem.innerHTML = bookCardHTML(book);
            bookListCard.appendChild(bookItem);
        });
        bookShelfAll.classList.toggle('d-none', false);
        bookShelfComplete.classList.toggle('d-none', true);
        bookShelfUncomplete.classList.toggle('d-none', true);

        if (data.length === 0) {
            bookListCard.innerHTML = '';
            bookListCard.appendChild(notFoundBooks());
        }
    }

    if (filter === 'double') {
        bookListCardComplete.innerHTML = '';
        bookListCardUncomplete.innerHTML = '';

        data.complete.forEach((book) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item col-12 col-sm-6';
            bookItem.dataset.bookId = book.id;
            bookItem.innerHTML = bookCardHTML(book);
            bookListCardComplete.appendChild(bookItem);
        });

        data.uncomplete.forEach((book) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item col-12 col-sm-6';
            bookItem.dataset.bookId = book.id;
            bookItem.innerHTML = bookCardHTML(book);
            bookListCardUncomplete.appendChild(bookItem);
        });

        bookShelfAll.classList.toggle('d-none', true);
        bookShelfComplete.classList.toggle('d-none', false);
        bookShelfUncomplete.classList.toggle('d-none', false);

        if (data.complete.length === 0) {
            bookListCardComplete.innerHTML = '';
            bookListCardComplete.appendChild(notFoundBooks());
        }

        if (data.uncomplete.length === 0) {
            bookListCardUncomplete.innerHTML = '';
            bookListCardUncomplete.appendChild(notFoundBooks());
        }
    }
}

function addBook(e) {
    e.preventDefault();
    const book = {
        id: +new Date(),
        title: inputTitle.value,
        author: inputAuthor.value,
        year: parseInt(inputYear.value),
        isComplete: inputIsComplete.checked,
    };
    books.push(book);
    clearInput();
    document.dispatchEvent(new Event('bookChanged'));
}

function editBook(e) {
    e.preventDefault();
    const book = getBookById(e);
    const inputBookId = document.createElement('input');
    inputBookId.setAttribute('type', 'hidden');
    inputBookId.setAttribute('id', 'inputBookId');
    inputBookId.setAttribute('value', book.id);
    formInputBook.append(inputBookId);
    [
        inputTitle.value,
        inputAuthor.value,
        inputYear.value,
        inputIsComplete.checked,
    ] = [book.title, book.author, book.year, book.isComplete];
}

function updateBook(e) {
    e.preventDefault();
    const id = document.getElementById('inputBookId');
    books.map((book) => {
        if (book.id === parseInt(id.value)) {
            book.title = inputTitle.value;
            book.author = inputAuthor.value;
            book.year = parseInt(inputYear.value);
            book.isComplete = inputIsComplete.checked;
        }
    });
    document.dispatchEvent(new Event('bookChanged'));
}

function deleteBook(e) {
    e.preventDefault();
    const book = getBookById(e);
    books.splice(books.indexOf(book), 1);
    document.dispatchEvent(new Event('bookChanged'));
}

function toggleBook(e) {
    e.preventDefault();
    const book = getBookById(e);
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event('bookChanged'));
}

function setLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('filter', currentFilter);
}

function getLocalStorage() {
    const localStorageBooks = JSON.parse(localStorage.getItem('books'));
    const localStorageFilter = localStorage.getItem('filter');
    if (localStorageBooks) {
        books = localStorageBooks;
    }
    if (localStorageFilter) {
        currentFilter = localStorageFilter;
    }
}

window.addEventListener('load', function () {
    getLocalStorage();
    if (currentFilter === 'all') {
        renderBooks({ filter: currentFilter, data: books });
    } else if (currentFilter === 'double') {
        renderBooks({
            filter: currentFilter,
            data: {
                complete: books.filter((book) => book.isComplete),
                uncomplete: books.filter((book) => !book.isComplete),
            },
        });
    }
    filterSelect.value = currentFilter;

    const form = document.getElementById('formModal');
    const formModal = new bootstrap.Modal('#formModal');
    const formModalLabel = document.getElementById('formModalLabel');

    filterSelect.addEventListener('change', filterBooks);
    formSearch.addEventListener('submit', searchBooks);

    addBookButton.addEventListener('click', () => {
        clearInput();
        formModal.show();
        formModalLabel.innerHTML = 'Tambah Buku';
        formInputBook.dataset.action = 'add';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.dataset.action === 'add') {
            addBook(e);
            Swal.fire({
                title: 'Berhasil',
                text: 'Data buku berhasil ditambahkan',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }

        if (e.target.dataset.action === 'edit') {
            Swal.fire({
                title: 'Apakah anda yakin?',
                text: 'Data buku akan diubah',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, ubah!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateBook(e);
                    Swal.fire({
                        title: 'Berhasil',
                        text: 'Data buku berhasil diubah',
                        icon: 'success',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            });
        }
        formModal.hide();
    });

    bookListCardAll.forEach((bookCards) => {
        bookCards.addEventListener('click', function (e) {
            e.preventDefault();
            const book = getBookById(e);
            const editBookButton = e.target.classList.contains('edit-book');
            const deleteBookButton = e.target.classList.contains('delete-book');
            const isCompleteButton = e.target.closest('.form-check-input');
            if (editBookButton) {
                formModal.show();
                formModalLabel.innerHTML = 'Ubah Buku';
                formInputBook.dataset.action = 'edit';
                editBook(e);
            } else if (deleteBookButton) {
                Swal.fire({
                    title: 'Apakah anda yakin?',
                    text: `Data buku "${book.title}" akan dihapus`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, hapus!',
                    cancelButtonText: 'Batal',
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteBook(e);
                        Swal.fire({
                            title: 'Berhasil',
                            text: 'Data buku berhasil dihapus',
                            icon: 'success',
                            timer: 1500,
                            timerProgressBar: true,
                            showConfirmButton: false,
                        });
                    }
                });
            } else if (isCompleteButton) {
                toggleBook(e);
            }
        });
    });

    // bookchanged default with filter
    document.addEventListener('bookChanged', filterBooks);
});
