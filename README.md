# 🦀 Craby Estate

**Craby Estate** adalah project huruf **C** dalam **Allnimal A–Z Project**: portfolio pembelajaran fullstack yang membangun satu produk berbeda untuk setiap huruf.

Pada project ini, Craby Estate dikembangkan sebagai **Real Estate System**. Tujuannya adalah menyediakan alur digital bagi agen untuk memasang dan mengelola properti, serta bagi calon pembeli atau penyewa untuk menemukan properti dan mengirim pesan kepada agen.

> Fokusnya bukan hanya membuat halaman properti, tetapi memahami satu sistem web dari request pengguna sampai data tersimpan dan media diunggah.

---

## 🎯 Tujuan Project

Craby Estate dibuat untuk melatih kemampuan fullstack development secara terstruktur:

- Merancang REST API untuk domain real estate.
- Menerapkan authentication dan authorization berbasis JWT.
- Mengelola ownership: agen hanya dapat mengubah atau menghapus property miliknya sendiri.
- Menangani upload dan penghapusan foto property melalui Cloudinary.
- Membuat pencarian, filter, sorting, dan pagination untuk data listing.
- Membangun Frontend Web dengan React sebagai consumer API.
- Menjadi project portfolio yang menunjukkan proses engineering, bukan hanya tampilan akhir.

---

## 🧠 Konsep Utama

Craby Estate dibangun dengan prinsip:

> “Pahami alur sistemnya, lalu bangun fiturnya dengan sadar.”

Hal yang dipelajari lewat project ini:

- Alur data: browser → API → middleware → controller → database.
- Relasi agen, property, dan pesan kontak.
- Validasi hak akses sebelum perubahan data.
- Pemisahan source backend dan frontend dalam satu repository.
- Kontrak API yang dapat digunakan oleh Frontend React.

---

## 🛠 Tech Stack

### API Documentation

- Status: planned.
- Endpoint aktif dapat dilihat dari file route di folder server/src/routes.

### Backend — Active Development

- Node.js
- Express 5
- TypeScript
- Prisma ORM 6
- MongoDB
- JWT untuk authentication
- bcrypt untuk hash password
- Multer untuk menerima file upload
- Cloudinary untuk penyimpanan foto property

### Frontend Web — Planned

- React
- Folder client/ telah disiapkan.
- Source React dan package manifest belum tersedia di repository saat ini.

---

## 🚀 Fitur Utama

### Phase 1 — Authentication

- [x] User registration
- [x] User login dengan JWT
- [x] Get current user
- [x] Password hashing menggunakan bcrypt
- [x] Protected route melalui auth middleware

### Phase 2 — Property Listing System

- [x] Create property
- [x] Read semua property dan detail property
- [x] Read property milik agen yang sedang login
- [x] Update property dengan pemeriksaan ownership
- [x] Delete property dengan pemeriksaan ownership
- [x] Upload maksimal lima foto JPG/JPEG/PNG
- [x] Hapus foto lama dari Cloudinary ketika property dihapus
- [x] Search judul dan deskripsi
- [x] Filter tipe property, tipe listing, status, harga, kota, dan provinsi
- [x] Sorting dan pagination

### Phase 3 — Contact System

- [x] Client mengirim pesan ke agen property
- [x] Agen membaca pesan masuk dari calon client
- [x] Client membaca pesan yang pernah dikirim
- [x] Mencegah agen mengirim pesan ke property miliknya sendiri

### Phase 4 — Frontend Web

- [ ] Inisialisasi React application
- [ ] Halaman daftar dan detail property
- [ ] Login, register, dan user session
- [ ] Dashboard agen untuk kelola property
- [ ] Form contact agent
- [ ] Integrasi API Craby Estate

---

## 🔐 Arsitektur Singkat

    React Web Client (planned)
              ↓ JSON / HTTP
    Express API (server/src/app.ts)
              ↓
    Router
              ↓
    Auth Middleware / Multer upload middleware
              ↓
    Controller
          ↙           ↘
    Prisma → MongoDB   Cloudinary

---

## 📁 Struktur Repository

    .
    ├── README.md                 # Gambaran project Allnimal [Craby Estate]
    ├── client/                   # Frontend React
    └── server/                   # Backend Express + TypeScript

---

## 🌐 API yang Sudah Tersedia

| Domain          | Base path            | Fungsi                                                             |
| --------------- | -------------------- | ------------------------------------------------------------------ |
| Authentication  | /api/auth            | Register, login, dan current user.                                 |
| Property        | /api/property        | CRUD property, image upload, search, filter, sort, dan pagination. |
| Contact message | /api/contact-message | Mengirim dan membaca pesan antara client dan agen.                 |

Contoh endpoint utama:

    POST   /api/auth/register
    POST   /api/auth/login
    GET    /api/auth/me

    POST   /api/property
    GET    /api/property
    GET    /api/property/user
    GET    /api/property/:id
    PUT    /api/property/:id
    DELETE /api/property/:id

    POST   /api/contact-message/send
    GET    /api/contact-message/client
    GET    /api/contact-message/agent

Dokumentasi setup dan kontrak backend yang lebih rinci tersedia di server/README.md.

---

## ⚙️ Menjalankan Backend Lokal

Prasyarat:

- Node.js 20 atau lebih baru.
- MongoDB database, misalnya MongoDB Atlas.
- Akun Cloudinary untuk upload gambar.

Jalankan dari folder server:

    cd server
    npm ci

Buat file server/.env dengan nilai environment milik sendiri:

    PORT=3000
    DATABASE_URL="<mongodb-connection-string>"
    JWT_SECRET="<secret-yang-kuat>"
    CLOUDINARY_CLOUD_NAME="<cloud-name>"
    CLOUDINARY_API_KEY="<api-key>"
    CLOUDINARY_API_SECRET="<api-secret>"

Kemudian generate Prisma Client, sinkronkan schema development, lalu mulai server:

    npm run prisma:generate
    npm run prisma:push
    npm run dev

Server berjalan pada http://localhost:3000 secara default.

> Jangan commit file .env atau nilai credential apa pun ke Git.

---

## 🌱 Visi Pengembangan

Craby Estate akan dikembangkan sebagai:

- Simulasi sistem property listing yang mendekati kebutuhan dunia nyata.
- Tempat belajar integrasi frontend React dengan API Express.
- Portfolio fullstack yang menunjukkan authentication, ownership, media upload, dan relasi data.
- Bagian dari ekosistem project Allnimal A–Z dengan domain yang berbeda di setiap huruf.

---

## 🐾 Tentang Allnimal A–Z Project

Craby Estate adalah huruf **C** dalam sistem besar:

> **Allnimal A–Z Project**  
> Sebuah pendekatan membangun portfolio berbasis ekosistem, tempat setiap huruf mewakili project dengan domain, tantangan, dan pembelajaran yang berbeda.

Project ini dibuat untuk belajar secara mendalam, membangun secara sadar, dan berkembang konsisten sebagai Fullstack Developer.
