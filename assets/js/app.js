document.addEventListener('DOMContentLoaded', function () {
    const books = [];

    const KEY = 'BookshelfAppKu'
    const formBuku = document.querySelector('.form-buku');

    formBuku.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = Date.now();
        const judul = document.getElementById('judul').value;
        const pengarang = document.getElementById('penulis').value;
        const tahun = document.getElementById('tahun').value;
        const status = document.querySelector('#status').checked;

        if (judul == '' || pengarang == '' || tahun == '') {
            alert('Harap Lengkapi detail buku sebelum menambahkan.')
        } else {
            books.push(generateObjectBuku(id, judul, pengarang, tahun, status));
            document.dispatchEvent(new Event('RENDER-BUKU')); // tampilkan data buku
    
            toLocalStorage();
            clearForm();
        }
    })

    document.addEventListener('RENDER-BUKU', function () {
        const complete = document.querySelector('.complete');
        const uncomplete = document.querySelector('.uncomplete');

        complete.innerHTML = '';
        uncomplete.innerHTML = '';

        for (b of books) {
            if (b.isComplete) {
                var html = `<div data-id="${b.id}" class="book-detail">
                    <div class="book-title">
                        ${b.title}
                    </div>
                    <div class="book-meta">
                        <p class="book-author">
                            ${b.author}
                        </p>
                        <p class="book-year">${b.year}</p>
                    </div>
                    <div class="book-action">
                        <button class="btn btn-success btn-uncomplete" data-bukuid="${b.id}">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.18 20C12.36 20.72 12.65 21.39 13.04 22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H18C19.11 2 20 2.9 20 4V12.18C19.5 12.07 19 12 18.5 12C18.33 12 18.17 12 18 12.03V4H13V12L10.5 9.75L8 12V4H6V20H12.18M23 18.5C23 21 21 23 18.5 23S14 21 14 18.5 16 14 18.5 14 23 16 23 18.5M20 21.08L15.92 17C15.65 17.42 15.5 17.94 15.5 18.5C15.5 20.16 16.84 21.5 18.5 21.5C19.06 21.5 19.58 21.35 20 21.08M21.5 18.5C21.5 16.84 20.16 15.5 18.5 15.5C17.94 15.5 17.42 15.65 17 15.92L21.08 20C21.35 19.58 21.5 19.06 21.5 18.5Z" />
                    </svg>
                        </button>
                        <button class="btn btn-danger btn-hapus" data-bukuid="${b.id}">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                        </button>
                    </div>
                </div>`;
                complete.innerHTML += html;
            } else {
                var html = `<div data-id="${b.id}" class="book-detail">
                    <div class="book-title">
                        ${b.title}
                    </div>
                    <div class="book-meta">
                        <p class="book-author">
                            ${b.author}
                        </p>
                        <p class="book-year">${b.year}</p>
                    </div>
                    <div class="book-action">
                        <button class="btn btn-success btn-complete" data-bukuid="${b.id}">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M16.75 22.16L14 19.16L15.16 18L16.75 19.59L20.34 16L21.5 17.41L16.75 22.16M18 2C19.1 2 20 2.9 20 4V13.34C19.37 13.12 18.7 13 18 13V4H13V12L10.5 9.75L8 12V4H6V20H12.08C12.2 20.72 12.45 21.39 12.8 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H18Z" />
                    </svg>
                        </button>
                        <button class="btn btn-danger btn-hapus" data-bukuid="${b.id}">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                        </button>
                    </div>
                </div>`;
                uncomplete.innerHTML += html;
            }
        }

        let btnHapus = document.querySelectorAll('.btn-hapus');

        btnHapus.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var confirm = window.confirm('Apakah anda yakin ingin menghapus buku ini?');
                if (confirm) {
                    const id = e.target.dataset.bukuid;
                    const index = books.findIndex(function (b) {
                        return b.id == id;
                    });
                    books.splice(index, 1);
                    document.dispatchEvent(new Event('RENDER-BUKU'));
                    toLocalStorage();
                }
            });
        });

        let btnSelesaikan = document.querySelectorAll('.btn-complete');
        btnSelesaikan.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const id = e.target.dataset.bukuid;
                const index = books.findIndex(function (b) {
                    return b.id == id;
                });
                books[index].isComplete = true;
                document.dispatchEvent(new Event('RENDER-BUKU'));
                toLocalStorage();
            });
        });
      
        let btnBelumSelesai = document.querySelectorAll('.btn-uncomplete');
        btnBelumSelesai.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const id = e.target.dataset.bukuid;
                const index = books.findIndex(function (b) {
                    return b.id == id;
                });
                books[index].isComplete = false;
                document.dispatchEvent(new Event('RENDER-BUKU'));
                toLocalStorage();
            });
        });

    });

    if (lsSupportCheck()) {
        localLocalStorageData();
    }

    const cariJudul = document.getElementById('cariJudul');
    cariJudul.addEventListener('keyup', function () {
        const cari = this.value.toLowerCase();
        const hasil = books.filter(function (b) {
            return b.title.toLowerCase().includes(cari) || b.author.toLowerCase().includes(cari) || b.year.toLowerCase().includes(cari);
        });

        const complete = document.querySelector('.complete');
        const uncomplete = document.querySelector('.uncomplete');

        complete.innerHTML = '';
        uncomplete.innerHTML = '';

        for (b of hasil) {
            if (b.isComplete) {
                var html = `<div data-id="${b.id}" class="book-detail">
            <div class="book-title">
                ${b.title}
            </div>
            <div class="book-meta">
                <p class="book-author">
                    ${b.author}
                </p>
                <p class="book-year">${b.year}</p>
            </div>
            <div class="book-action">
                <button class="btn btn-success btn-uncomplete" data-bukuid="${b.id}">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.18 20C12.36 20.72 12.65 21.39 13.04 22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H18C19.11 2 20 2.9 20 4V12.18C19.5 12.07 19 12 18.5 12C18.33 12 18.17 12 18 12.03V4H13V12L10.5 9.75L8 12V4H6V20H12.18M23 18.5C23 21 21 23 18.5 23S14 21 14 18.5 16 14 18.5 14 23 16 23 18.5M20 21.08L15.92 17C15.65 17.42 15.5 17.94 15.5 18.5C15.5 20.16 16.84 21.5 18.5 21.5C19.06 21.5 19.58 21.35 20 21.08M21.5 18.5C21.5 16.84 20.16 15.5 18.5 15.5C17.94 15.5 17.42 15.65 17 15.92L21.08 20C21.35 19.58 21.5 19.06 21.5 18.5Z" />
                    </svg>
                </button>
                <button class="btn btn-danger btn-hapus" data-bukuid="${b.id}">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                </button>
            </div>
        </div>`;
                complete.innerHTML += html;
            } else {
                var html = `<div data-id="${b.id}" class="book-detail">
            <div class="book-title">
                ${b.title}
            </div>
            <div class="book-meta">
                <p class="book-author">
                    ${b.author}
                </p>
                <p class="book-year">${b.year}</p>
            </div>
            <div class="book-action">
                <button class="btn btn-success btn-complete" data-bukuid="${b.id}">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M16.75 22.16L14 19.16L15.16 18L16.75 19.59L20.34 16L21.5 17.41L16.75 22.16M18 2C19.1 2 20 2.9 20 4V13.34C19.37 13.12 18.7 13 18 13V4H13V12L10.5 9.75L8 12V4H6V20H12.08C12.2 20.72 12.45 21.39 12.8 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H18Z" />
                    </svg>
                </button>
                <button class="btn btn-danger btn-hapus" data-bukuid="${b.id}">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                </button>
            </div>
        </div>`;
                uncomplete.innerHTML += html;
            }
        }

        let btnHapus = document.querySelectorAll('.btn-hapus');

        btnHapus.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var confirm = window.confirm('Apakah anda yakin ingin menghapus buku ini?');
                if (confirm) {
                    const id = e.target.dataset.bukuid;
                    const index = books.findIndex(function (b) {
                        return b.id == id;
                    });
                    books.splice(index, 1);
                    document.dispatchEvent(new Event('RENDER-BUKU'));
                }
            });
        });

        let btnSelesaikan = document.querySelectorAll('.btn-complete');
        btnSelesaikan.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const id = e.target.dataset.bukuid;
                const index = books.findIndex(function (b) {
                    return b.id == id;
                });
                books[index].isComplete = true;
                document.dispatchEvent(new Event('RENDER-BUKU'));
            });
        });
  
        let btnBelumSelesai = document.querySelectorAll('.btn-uncomplete');
        btnBelumSelesai.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const id = e.target.dataset.bukuid;
                const index = books.findIndex(function (b) {
                    return b.id == id;
                });
                books[index].isComplete = false;
                document.dispatchEvent(new Event('RENDER-BUKU'));
            });
        });
    })

    function toLocalStorage() {
        if (lsSupportCheck()) {
            const hashed = JSON.stringify(books);
            localStorage.setItem(KEY, hashed);
        }
    }

    function lsSupportCheck() {
        if (typeof (Storage) === undefined) {
            alert("Broser yangg anda gunakan tidak mendukung Local Storage");
            return false;
        }
        return true;
    }

    function localLocalStorageData() {
        const slData = localStorage.getItem(KEY);
        let data = JSON.parse(slData);

        if (data !== null) {
            for (const databuku of data) {
                books.push(databuku);
            }
        }

        document.dispatchEvent(new Event('RENDER-BUKU'));
    }

    // ------------------------------------------------------- //

    function clearForm() {
        document.getElementById('judul').value = '';
        document.getElementById('penulis').value = '';
        document.getElementById('tahun').value = '';
        document.getElementById('cariJudul').value = '';
    }

    function generateObjectBuku(id, title, author, year, isComplete) {
        return {
            id: id,
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        }
    }
});