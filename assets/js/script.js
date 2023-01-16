document.addEventListener('DOMContentLoaded', function () {
    let books = [];
    const keyStorage = 'BookshelfErin';
    const formBuku = document.querySelector('.form-buku');

    // ------------------------------------ //
    //  form buku submit handler            //
    // ------------------------------------ //
    formBuku.addEventListener('submit', function (e) {
        e.preventDefault();
        const judulBuku = document.getElementById('judul').value;
        const penulisBuku = document.getElementById('penulis').value;
        const tahunBuku = document.getElementById('tahun').value;
        const isComplete = document.getElementById('selesai').checked;

        if (judulBuku == '' || penulisBuku == '' || tahunBuku == '') {
            alert('Data tidak boleh kosong');
            return;
        }

        books.push(generateObjectBuku(judulBuku, penulisBuku, tahunBuku, isComplete));
        document.dispatchEvent(new Event('RENDER_BUKU'));

        saveToStorage();
        clearForm();
    });

    // ------------------------------------ //
    //  render buku kedalam DOM             //
    // ------------------------------------ //
    document.addEventListener('RENDER_BUKU', function () {
        const listComplete = document.querySelector('.list-complete');
        const listUncomplete = document.querySelector('.list-uncomplete');

        listComplete.innerHTML = '';
        listUncomplete.innerHTML = '';

        for (let book of books) {
            if (book.isComplete) {
                listComplete.innerHTML += generateBukuItem(book);
            } else {
                listUncomplete.innerHTML += generateBukuItem(book);
            }
        }

        // ------------------------------------ //
        //  button hapus click handler          //
        // ------------------------------------ //
        let btnHapus = document.querySelectorAll('.btn-hapus');
        btnHapus.forEach(function (btn) {
            btn.addEventListener('click', function (e) {

                if (e.target.classList.contains('btn-hapus') || e.target.parentElement.classList.contains('btn-hapus')) {
                    let jb = getBukuById(btn.dataset.bukuid);
                    let konfirmasi = confirm(`Apakah anda yakin ingin menghapus buku ( ${jb.judul} ) ?`);

                    if (konfirmasi) {
                        hapusBuku(btn.dataset.bukuid);
                        document.dispatchEvent(new Event('RENDER_BUKU'));

                        saveToStorage();
                    }
                }

            })
        });

        // ------------------------------------ //
        //  button selesaikan click handler     //
        // ------------------------------------ //
        let btnSelesaikan = document.querySelectorAll('.btn-complete');
        btnSelesaikan.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                if (e.target.classList.contains('btn-complete') || e.target.parentElement.classList.contains('btn-complete')) {
                    const id = btn.dataset.bukuid;
                    const index = books.findIndex(book => book.id == id);
                    books[index].isComplete = true;

                    document.dispatchEvent(new Event('RENDER_BUKU'));
                    saveToStorage();
                }
            });
        });

        // ------------------------------------ //
        //  button belum selesai click handler  //
        // ------------------------------------ //
        let btnBelumSelesai = document.querySelectorAll('.btn-uncomplete');
        btnBelumSelesai.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                if (e.target.classList.contains('btn-uncomplete') || e.target.parentElement.classList.contains("btn-uncomplete")) {
                    const id = btn.dataset.bukuid;
                    const index = books.findIndex(book => book.id == id);

                    books[index].isComplete = false;

                    document.dispatchEvent(new Event('RENDER_BUKU'));
                    saveToStorage();
                }
            });
        });
    });

    // ------------------------------------ //
    //  Cari buku handler                   //
    // ------------------------------------ //
    const cari_buku = document.getElementById('cari_buku');
    cari_buku.addEventListener('keyup', function (e) {
        const keyword = e.target.value.toLowerCase();
        const listComplete = document.querySelector('.list-complete');
        const listUncomplete = document.querySelector('.list-uncomplete');

        setTimeout(function () {
            listComplete.innerHTML = '';
            listUncomplete.innerHTML = '';

            for (let book of books) {
                if (book.judul.toLowerCase().includes(keyword) || book.penulis.toLowerCase().includes(keyword) || book.tahun.toLowerCase().includes(keyword)) {
                    if (book.isComplete) {
                        listComplete.innerHTML += generateBukuItem(book);
                    } else {
                        listUncomplete.innerHTML += generateBukuItem(book);
                    }
                }
            }
        }, 1000)
    })

    // ------------------------------------ //
    //  buku item generator                 //
    // ------------------------------------ //
    function generateBukuItem(b) {
        return html = `
            <div data-id="${b.id}" class="book-detail">
                <div class="book-title">
                    ${b.judul} <span style="font-weight:400;">(${b.tahun})</span>
                </div>
                <div class="book-meta">
                    <p class="book-author">
                        ${b.penulis}
                    </p>
                    <small>${b.id}</small>
                </div>
                <div class="book-action">
                ${b.isComplete
                ? `<button class="btn btn-success btn-uncomplete" data-bukuid="${b.id}">
                                <ion-icon name="close-circle-outline"></ion-icon>
                            </button>`
                : `<button class="btn btn-success btn-complete" data-bukuid="${b.id}">
                                <ion-icon name="checkmark-circle-outline"></ion-icon>
                            </button>`
            }
                    <button class="btn btn-danger btn-hapus" data-bukuid="${b.id}">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    }

    // ------------------------------------ //
    //  panggil fungsi load localStorage    //
    // ------------------------------------ //
    loadFromStorage();

    // ------------------------------------ //
    //  Get buku by id                      //
    // ------------------------------------ //
    function getBukuById(id) {
        for (let book of books) {
            if (book.id == id) {
                return book;
            }
        }
        return null;
    }

    // ------------------------------------ //
    //  Hapus Buku                          //
    // ------------------------------------ //
    function hapusBuku(id) {
        for (let book of books) {
            if (book.id == id) {
                books.splice(books.indexOf(book), 1);
            }
        }
    }

    // ------------------------------------ //
    //  save buku array to local storage    //
    // ------------------------------------ //
    function saveToStorage() {
        if (checkStorage()) {
            localStorage.setItem(keyStorage, JSON.stringify(books));
        }
    }

    // ------------------------------------ //
    //  Load buku dari localStorage         //
    // ------------------------------------ //
    function loadFromStorage() {
        if (checkStorage()) {
            let localData = JSON.parse(localStorage.getItem(keyStorage));
            if (localData != null) {
                for (let data of localData) {
                    books.push(data);
                }
            }
            document.dispatchEvent(new Event('RENDER_BUKU'));
        }
    }

    // ------------------------------------ //
    //  Generate objet buku                 //
    // ------------------------------------ //
    function generateObjectBuku(judulBuku, penulisBuku, tahunBuku, isComplete) {
        return {
            id: +new Date(),
            judul: judulBuku,
            penulis: penulisBuku,
            tahun: tahunBuku,
            isComplete: isComplete
        }
    }

    // ------------------------------------ //
    //  Check Browser localStorage Support  //
    // ------------------------------------ //
    function checkStorage() {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }

    // ------------------------------------ //
    //  Hapus semua valur pada form field   //
    // ------------------------------------ //
    function clearForm() {
        formBuku.reset();
    }
});