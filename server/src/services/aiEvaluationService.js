import Groq from "groq-sdk";

const CATEGORY_FOCUS = {
  Teknologi: "kebolehskalaan teknikal dan potensi automasi",
  Perniagaan: "model perolehan hasil dan kesesuaian pasaran",
  Kesihatan: "kebolehlaksanaan dari segi peraturan dan keselamatan pengguna",
  Pendidikan: "kesan pembelajaran dan kemudahan pengadopsian oleh pelajar/pensyarah",
  Kewangan: "pematuhan kewangan dan tahap risiko",
};

export const runAiEvaluation = async ({ startupName, category, shortDescription }) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const focusArea = CATEGORY_FOCUS[category] || "kesesuaian umum dan potensi pasaran";

  const prompt = `
Anda adalah penilai idea startup untuk platform komuniti universiti UKM.
Nilai HANYA berdasarkan maklumat yang diberikan. Jangan reka fakta atau andaikan maklumat yang tidak dinyatakan.

Untuk kategori "${category}", beri perhatian khusus kepada ${focusArea}.

Berikut adalah dua contoh penilaian sebagai rujukan format dan gaya (bukan untuk ditiru isinya):

Contoh 1 (idea kukuh):
Nama: "TrashSort AI"
Kategori: Teknologi
Deskripsi: "Aplikasi mudah alih yang menggunakan kamera untuk mengenal pasti jenis sampah dan mencadangkan tong kitar semula yang betul, dengan sistem mata ganjaran untuk pengguna aktif."
Penilaian:
{
  "scores": { "keaslian": 7, "kebolehlaksanaan": 8, "saizPasaran": 7, "kejelasanMasalah": 9 },
  "score": 8,
  "summary": "Idea ini menyelesaikan masalah kitar semula yang jelas dengan pendekatan gamifikasi yang menarik.",
  "strengths": ["Masalah jelas dan releven", "Teknologi sedia ada (image recognition) boleh diguna pakai", "Elemen ganjaran meningkatkan penglibatan pengguna"],
  "improvements": ["Perlu kejelasan model perolehan hasil", "Ketepatan pengecaman imej perlu diuji dengan pelbagai jenis sampah"],
  "verdict": "Berpotensi Tinggi"
}

Contoh 2 (idea lemah/kabur):
Nama: "Apps Makanan"
Kategori: Perniagaan
Deskripsi: "Apps untuk order makanan lebih senang."
Penilaian:
{
  "scores": { "keaslian": 2, "kebolehlaksanaan": 4, "saizPasaran": 3, "kejelasanMasalah": 2 },
  "score": 3,
  "summary": "Konsep terlalu umum dan tidak membezakan diri daripada platform penghantaran makanan sedia ada seperti GrabFood.",
  "strengths": ["Kategori dengan permintaan pasaran sedia ada"],
  "improvements": ["Perlu nyatakan masalah spesifik yang tidak diselesaikan oleh pemain sedia ada", "Perlu jelaskan khalayak sasaran dan cadangan nilai unik"],
  "verdict": "Perlu Penambahbaikan"
}

Sekarang nilai idea sebenar berikut:

Nama Startup: ${startupName}
Kategori: ${category}
Deskripsi: ${shortDescription}

PENTING: Padang "strengths" WAJIB mengandungi sekurang-kurangnya 1 item, walaupun idea sangat lemah — cari sebarang aspek positif sekecil mana pun (contohnya kategori releven, masalah sedia wujud, dsb). Jangan pulangkan array kosong.

Respons WAJIB dalam format JSON sahaja, tiada markdown, tiada penjelasan tambahan, ikut struktur tepat ini:
{
  "scores": { "keaslian": <1-10>, "kebolehlaksanaan": <1-10>, "saizPasaran": <1-10>, "kejelasanMasalah": <1-10> },
  "score": <purata keseluruhan, 1-10>,
  "summary": "<ringkasan 2 ayat dalam Bahasa Malaysia>",
  "strengths": ["<kekuatan 1>", "<kekuatan 2>", "<kekuatan 3>"],
  "improvements": ["<penambahbaikan 1>", "<penambahbaikan 2>"],
  "verdict": "<Berpotensi Tinggi | Berpotensi Sederhana | Perlu Penambahbaikan>"
}
`;

  const callGroq = async (retryPrompt) => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: retryPrompt || prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
  };

  try {
    const text = await callGroq();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (parseError) {
    console.error("First parse failed, retrying:", parseError.message);
    const retryText = await callGroq(
      prompt + "\n\nPENTING: Respons SEBELUM ini tidak sah sebagai JSON. Berikan HANYA objek JSON, tiada teks lain."
    );
    return JSON.parse(retryText.replace(/```json|```/g, "").trim());
  }
};
