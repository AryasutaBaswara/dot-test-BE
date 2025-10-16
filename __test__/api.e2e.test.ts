// __tests__/api.e2e.test.ts
export {};
const request = require("supertest");
// Kita impor aplikasi yang sudah diekspor dari hasil kompilasi
const { app, server } = require("../dist/index.js");
const { pool } = require("../dist/db.js"); // Impor koneksi DB

// 'describe' adalah cara mengelompokkan serangkaian tes
describe("Alur Tes E2E Lengkap untuk API Blog", () => {
  let token: string;
  let postId: number;
  // Gunakan email acak agar tes bisa dijalankan berkali-kali
  const randomEmail = `testuser_${Date.now()}@example.com`;

  // Tes #1: Mendaftarkan user baru
  it("Harus bisa mendaftarkan user baru", async () => {
    const response = await request(app).post("/api/users/register").send({
      email: randomEmail,
      password: "password123",
      name: "User Tes E2E",
    });
    expect(response.status).toBe(201); // Berharap statusnya 201 Created
    expect(response.body.user).toHaveProperty("id"); // Berharap responsnya punya properti 'id'
  });

  // Tes #2: Login dengan user baru
  it("Harus bisa login dan mendapatkan token JWT", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: randomEmail,
      password: "password123",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token; // Simpan token untuk tes berikutnya
  });

  // Tes #3: Gagal membuat post TANPA token
  it("Harus gagal membuat post tanpa token", async () => {
    const response = await request(app).post("/api/posts").send({
      title: "Postingan Tanpa Token",
      content: "Ini seharusnya tidak berhasil.",
    });
    expect(response.status).toBe(401); // 401 Unauthorized
  });

  // Tes #4: Berhasil membuat post DENGAN token
  it("Harus bisa membuat post baru dengan token yang valid", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`) // Gunakan token yang sudah disimpan
      .send({
        title: "Postingan E2E Pertamaku",
        content: "Ini dibuat oleh tes otomatis!",
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    postId = response.body.id; // Simpan ID post untuk tes berikutnya
  });

  // Tes #5: Berhasil menambahkan komentar ke post
  it("Harus bisa menambahkan komentar ke post yang baru dibuat", async () => {
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Komentar dari robot tes!",
      });
    expect(response.status).toBe(201);
  });

  // Tes #6: Berhasil me-like postingan
  it("Harus bisa me-like postingan dengan token yang valid", async () => {
    const response = await request(app)
      .post(`/api/posts/${postId}/like`) // Gunakan postId yang sudah disimpan
      .set("Authorization", `Bearer ${token}`); // Gunakan token yang sama

    expect(response.status).toBe(201); // Berharap status 201 Created (atau 200 OK, sesuaikan dengan kodemu)
    expect(response.body.message).toBe("Post liked successfully");
  });

  // Tes #7: Berhasil membatalkan like (unlike)
  it("Harus bisa membatalkan like (unlike) dengan token yang valid", async () => {
    const response = await request(app)
      .delete(`/api/posts/${postId}/like`) // Gunakan method DELETE
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post unliked successfully");
  });
});

afterAll((done) => {
  // Matikan server Express
  server.close(() => {
    // Setelah server mati, tutup koneksi database
    pool.end(() => {
      done(); // Beri tahu Jest bahwa semuanya sudah bersih
    });
  });
});
