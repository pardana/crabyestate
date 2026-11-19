# Craby Estate API

Backend REST API untuk aplikasi listing properti. API ini menyediakan registrasi dan login agen, autentikasi JWT, pengelolaan listing properti, serta unggah foto properti ke Cloudinary.

> Status repository saat ini: hanya backend. Tidak ada aplikasi frontend, dokumentasi OpenAPI/Swagger, test suite, atau endpoint hapus properti di source saat ini.

## Fitur yang tersedia

- Registrasi, login, dan membaca profil pengguna saat ini.
- Autentikasi token JWT untuk endpoint yang membutuhkan login.
- Membuat listing properti milik agen yang sedang login.
- Membaca seluruh listing, detail satu listing, dan listing milik agen sendiri.
- Memperbarui listing; hanya pemilik listing yang dapat melakukannya.
- Upload maksimal lima foto JPG/JPEG/PNG dalam satu request.
- Penyimpanan data dengan MongoDB melalui Prisma ORM.
- Penyimpanan gambar dengan Cloudinary.

## Technology stack

| Area               | Teknologi                                     |
| ------------------ | --------------------------------------------- |
| Runtime            | Node.js (disarankan versi 20 atau lebih baru) |
| Bahasa             | TypeScript, target ES2022                     |
| Web framework      | Express 5                                     |
| Database           | MongoDB                                       |
| ORM                | Prisma 6                                      |
| Authentication     | JSON Web Token dan bcrypt                     |
| Upload             | Multer dengan memory storage                  |
| Media storage      | Cloudinary                                    |
| Development runner | tsx                                           |

## Arsitektur

Proyek memakai pola sederhana Route → Middleware → Controller → Service/Provider. Controller saat ini langsung memakai Prisma dan helper Cloudinary; belum ada folder service terpisah.

    HTTP client
        ↓
    Express app (src/app.ts)
        ↓
    Route (src/routes)
        ↓
    Auth middleware / Multer, jika endpoint membutuhkannya
        ↓
    Controller (src/controllers)
        ├── Prisma Client → MongoDB
        └── Cloudinary helper → Cloudinary

Alur autentikasi:

1. Pengguna login melalui endpoint auth.
2. Server memvalidasi hash password menggunakan bcrypt.
3. Server membuat JWT yang berlaku satu hari.
4. Client mengirim token pada header Authorization dengan format Bearer <token>.
5. Auth middleware memverifikasi token, mengambil pengguna dari MongoDB, lalu mengisi req.user.

## Struktur proyek

    .
    ├── README.md
    └── server/
        ├── prisma/
        │   └── schema.prisma           # Model MongoDB dan enum
        ├── src/
        │   ├── app.ts                  # Konfigurasi Express dan mount router
        │   ├── server.ts               # Entry point server
        │   ├── config/
        │   │   ├── prisma.ts           # Singleton PrismaClient
        │   │   ├── multer.ts           # Aturan upload file
        │   │   └── cloudinary.ts       # Konfigurasi Cloudinary
        │   ├── controllers/
        │   │   ├── auth.controller.ts
        │   │   └── property.controller.ts
        │   ├── middlewares/
        │   │   └── auth.middleware.ts
        │   ├── routes/
        │   │   ├── auth.route.ts
        │   │   └── property.route.ts
        │   └── utils/
        │       └── uploadToCloudinary.ts
        ├── package.json
        ├── prisma.config.ts
        └── tsconfig.json

Folder server/dist adalah hasil build TypeScript. Jangan mengubah file di dalamnya secara manual; ubah source di server/src lalu jalankan build.

## Prasyarat

- Node.js 20+ dan npm.
- Instance MongoDB yang dapat diakses, misalnya MongoDB Atlas.
- Akun Cloudinary dengan cloud name, API key, dan API secret.

## Menjalankan secara lokal

Semua perintah berikut dijalankan dari folder server.

1.  Install dependency.

         cd server
         npm ci

    Bila package-lock.json belum ingin dipakai, gunakan npm install sebagai alternatif.

2.  Buat file server/.env. File .env sengaja tidak dilacak Git dan jangan pernah berisi nilai rahasia di dokumentasi atau commit.

        PORT=3000
        DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
        JWT_SECRET="ganti-dengan-secret-acak-yang-kuat"
        CLOUDINARY_CLOUD_NAME="<cloud-name>"
        CLOUDINARY_API_KEY="<api-key>"
        CLOUDINARY_API_SECRET="<api-secret>"

3.  Generate Prisma Client, lalu sinkronkan schema ke database development.

         npx prisma generate
         npx prisma db push

    Perintah db push dapat mengubah struktur database tujuan. Gunakan database development atau pastikan ada backup dan rencana perubahan sebelum menjalankannya pada environment produksi.

4.  Jalankan mode development.

         npm run dev

    Server berjalan pada http://localhost:3000 secara default. Cek cepat:

         curl http://localhost:3000/

    Respons yang diharapkan berisi pesan Hello Craby Estate!.

## Perintah yang tersedia

| Perintah            | Kegunaan                                                 |
| ------------------- | -------------------------------------------------------- |
| npm run dev         | Menjalankan server TypeScript dengan watch mode.         |
| npm run build       | Mengompilasi server/src menjadi server/dist.             |
| npm start           | Menjalankan hasil build di server/dist.                  |
| npx prisma generate | Membuat ulang Prisma Client setelah schema berubah.      |
| npx prisma db push  | Menerapkan Prisma schema ke MongoDB.                     |
| npx prisma studio   | Membuka Prisma Studio untuk memeriksa data secara lokal. |

Untuk simulasi produksi:

    npm run build
    npm start

Build TypeScript saat dokumentasi ini dibuat sudah berhasil. Belum ada script test atau lint pada package.json.

## Konfigurasi environment

| Variabel              | Wajib           | Keterangan                                         |
| --------------------- | --------------- | -------------------------------------------------- |
| PORT                  | Tidak           | Port Express. Nilai bawaan 3000.                   |
| DATABASE_URL          | Ya              | Connection string MongoDB yang dipakai Prisma.     |
| JWT_SECRET            | Ya              | Secret untuk menandatangani dan memverifikasi JWT. |
| CLOUDINARY_CLOUD_NAME | Ya untuk upload | Nama cloud dari akun Cloudinary.                   |
| CLOUDINARY_API_KEY    | Ya untuk upload | API key Cloudinary.                                |
| CLOUDINARY_API_SECRET | Ya untuk upload | API secret Cloudinary.                             |

## Panduan kontribusi untuk developer

1. Kerjakan source di server/src, bukan server/dist.
2. Saat membuat fitur baru, mulai dari model data di server/prisma/schema.prisma jika fitur membutuhkan data baru.
3. Setelah schema berubah, jalankan `npx prisma generate` dan `npx prisma db push` pada database development.
4. Tambahkan logika HTTP di controller, lalu daftarkan endpoint-nya di router yang sesuai.
5. Gunakan AuthMiddleware untuk route yang hanya boleh diakses setelah login.
6. Gunakan import dengan akhiran .js di file TypeScript internal. Ini sengaja diperlukan oleh konfigurasi module NodeNext supaya hasil JavaScript dapat dijalankan Node.js.
7. Jalankan npm run build sebelum mengirim perubahan.
8. Jangan memasukkan server/.env, token, API key, password, atau DATABASE_URL asli ke Git.

Contoh urutan penambahan endpoint property baru:

    schema.prisma (bila perlu)
        → prisma generate / db push
        → property.controller.ts
        → property.route.ts
        → npm run build
        → testing dengan curl/Postman

## Petunjuk ringkas untuk AI Agent (model low)

Bagian ini adalah konteks minimum yang dapat ditempel ke AI agent sebelum meminta perubahan.

    Project: Craby Estate REST API.
    Runtime: Node.js + Express 5 + TypeScript ESM/NodeNext.
    Data: MongoDB via Prisma. Image: Cloudinary. Auth: JWT bearer token.
    Source of truth: server/src dan server/prisma/schema.prisma.
    Generated output: server/dist; jangan diedit manual.
    Existing routers: /api/auth dan /api/property.
    Authenticated requests use Authorization: Bearer <JWT>.
    Property ownership is property.agent_id === req.user.id.
    Image upload field name is images, max 5, JPG/JPEG/PNG.
    Internal TypeScript imports must keep the .js suffix.
    After Prisma schema changes run prisma generate and prisma db push.
    Preserve existing API paths and response fields unless task explicitly meminta breaking change.
    Before selesai, run npm run build and report files changed plus verification result.

Sebelum meminta AI melakukan implementasi, berikan requirement yang terukur, contoh request/response bila kontrak berubah, dan batasan hak akses. Contoh prompt yang cukup spesifik:

    Tambahkan endpoint DELETE /api/property/:id. Hanya pemilik listing
    yang boleh menghapusnya. Hapus setiap media dari Cloudinary sebelum
    menghapus dokumen MongoDB. Pertahankan gaya respons endpoint property
    yang ada, tambahkan dokumentasi README, lalu jalankan npm run build.
