// Ambil elemen yang diperlukan
const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const countDisplay = document.getElementById("count");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const previewArea = document.getElementById("previewArea");

// Ambil data dari localStorage
let reports = JSON.parse(localStorage.getItem("reports")) || [];

// Fungsi untuk memperbarui tampilan daftar laporan
function renderReports() {
  reportsList.innerHTML = "";

  if (reports.length === 0) {
    reportsList.innerHTML = "<p>Belum ada laporan.</p>";
  } else {
    reports.forEach((report, index) => {
      const div = document.createElement("div");
      div.className = "report-item";
      div.innerHTML = `
        <strong>${report.nama}</strong> (${report.bagian})<br>
        <small>${report.tanggal}</small><br>
        <em>${report.jenis}</em><br>
        <p>${report.deskripsi}</p>
        ${report.foto ? `<img src="${report.foto}" alt="foto" class="preview">` : ""}
        <button class="delete-btn" data-index="${index}">Hapus</button>
        <hr>
      `;
      reportsList.appendChild(div);
    });
  }

  countDisplay.textContent = reports.length;
}

// Fungsi untuk simpan ke localStorage
function saveReports() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

// Preview foto sebelum kirim
document.getElementById("foto").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewArea.innerHTML = `<img src="${e.target.result}" class="preview">`;
    };
    reader.readAsDataURL(file);
  } else {
    previewArea.innerHTML = "";
  }
});

// Saat form dikirim
reportForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const bagian = document.getElementById("Bagian").value;
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const fotoInput = document.getElementById("foto");
  let fotoBase64 = "";

  if (fotoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      fotoBase64 = e.target.result;
      tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, fotoBase64);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, fotoBase64);
  }
});

// Fungsi untuk menambah laporan
function tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, foto) {
  reports.push({ nama, bagian, tanggal, jenis, deskripsi, foto });
  saveReports();
  renderReports();
  reportForm.reset();
  previewArea.innerHTML = "";
}

// Tombol hapus laporan
reportsList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    reports.splice(index, 1);
    saveReports();
    renderReports();
  }
});

// Tombol bersihkan form
clearBtn.addEventListener("click", () => {
  reportForm.reset();
  previewArea.innerHTML = "";
});

// Tombol ekspor JSON
exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "laporan_apd.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// Tombol impor JSON
importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          reports = imported;
          saveReports();
          renderReports();
        } else {
          alert("File tidak valid!");
        }
      } catch {
        alert("Gagal memuat file JSON!");
      }
    };
    reader.readAsText(file);
  };
  input.click();
});

// Jalankan pertama kali
renderReports();
