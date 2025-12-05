# 🚀 RevoU Software Engineering Coding Camp - Mini Project

<div align="center">
  <img src="./assets/logo/RevoU-logo.avif" alt="RevoU Logo" width="300"/>
  <br>
  <br>

![RevoU](https://img.shields.io/badge/RevoU-Software%20Engineering-F4D03F?style=for-the-badge&labelColor=black)
![Batch](https://img.shields.io/badge/Batch-Desember%202025-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

</div>

---

## 📖 Tentang Project Ini

Selamat datang di repository **Mini Coding Project** saya! Project ini dibuat sebagai tugas akhir wajib untuk **RevoU Software Engineering Coding Camp (Batch Desember 2025)**.

Di sini, saya membangun sebuah **Website Company Profile "Dua Arah Media"** dari nol, menerapkan konsep web development modern dengan validation system yang robust dan data persistence menggunakan localStorage.

---

## 🌐 Cek Website Live

Penasaran hasilnya? Langsung aja klik link di bawah ini buat liat website aslinya:

👉 [**Lihat Website Live di Sini**](https://hanifjbg.github.io/CodingCamp-01Dec25-Hanif/)  

---

## 🛠️ Teknologi yang Dipakai

Project ini dibangun dengan stack teknologi berikut:

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)
![Flowbite](https://img.shields.io/badge/Flowbite-1C64F2?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5LjI3TDE3IDE0LjE0TDE4LjE4IDIxTDEyIDE3LjI3TDUuODIgMjFMNyAxNC4xNEwyIDkuMjdMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)

**Dependencies:**
- **Tailwind CSS CDN** - Utility-first CSS framework
- **Font Awesome 6** - Icon library untuk UI elements
- **Flowbite** - Datepicker component

---

## ✨ Fitur Utama

### 1. **Advanced Form Validation System** 📝✅

**Real-time validation dengan feedback yang jelas:**

- ✅ **Inline Error Messages** - Error langsung muncul di bawah field yang salah
- ✅ **Field-Specific Rules** - Validasi berbeda per field (nama, DOB, gender, pesan)
- ✅ **Toast Notifications** - Notifikasi popup untuk feedback (max 3 toasts, auto-dismiss 3s)
- ✅ **Submit Debounce** - Mencegah spam klik button submit (cooldown 500ms)
- ✅ **Error Shake Animation** - Field yang error goyang untuk menarik perhatian

**Validation Rules:**
- **Nama:** Min 3 karakter, tidak boleh kosong
- **Tanggal Lahir:** Wajib pilih dari datepicker (readonly input)
- **Gender:** Wajib pilih salah satu (Laki-laki/Perempuan)
- **Pesan:** Min 10 karakter, max 250 karakter

### 2. **LocalStorage Message Persistence** 💾

**Pesan tersimpan PERMANEN di browser:**

- ✅ Data persist across page refreshes (tetap ada setelah refresh)
- ✅ Data persist across browser restarts (tetap ada setelah tutup Chrome)
- ✅ Initial dummy data (3 pesan example) hanya muncul sekali
- ✅ User-submitted messages tidak pernah hilang kecuali manual clear cache

### 3. **Interactive Message Refresh** 🔄

**Refresh message list dengan animasi smooth:**

- ✅ Spinning icon animation saat loading
- ✅ Toast notification "Memuat pesan terbaru..."
- ✅ Message cards fade-in dengan slide-up animation
- ✅ Real refresh dari localStorage (bukan dummy)

### 4. **Dark Mode Toggle** 🌓

**Theme switching dengan smooth transition:**

- ✅ Toggle button di navbar
- ✅ Preference tersimpan di localStorage
- ✅ All components dark mode compatible
- ✅ Smooth color transition (300ms)

### 5. **Responsive Design** 📱💻

**Optimized untuk semua device:**

- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Flexbox & Grid layout
- ✅ Touch-friendly buttons (min 44x44px)

### 6. **Datepicker Integration** 📅

**Flowbite datepicker untuk DOB field:**

- ✅ Calendar popup yang modern
- ✅ Format Indonesia: `dd/mm/yyyy`
- ✅ Readonly input (tidak bisa ketik manual)
- ✅ Auto-hide setelah pilih tanggal

### 7. **Custom CSS Wrapper System** 🎨

**Reusable class utilities untuk consistency:**

- ✅ Button wrappers (`.btn-gradient`, `.btn-cancel`, dll)
- ✅ Form wrappers (`.input-field`, `.input-addon-group`)
- ✅ Modal utilities (`.modal-backdrop`, `.modal-dialog`)
- ✅ Message card styling (`.message-card`)

---

## 🧠 Business Logic & Implementation

### **1. Form Validation Flow**

<details>
<summary>📖 Click to expand pseudocode</summary>

```
CLASS FormValidator:
    CONSTRUCTOR(formId, validationRules):
        SET form = getElementById(formId)
        SET rules = validationRules
        SET errors = []
    
    METHOD validate():
        CLEAR errors array
        FOR EACH field IN rules:
            result = validateSingleField(field)
            IF result is invalid:
                ADD result to errors
        
        IF errors exist:
            FOCUS on first error field  // Fokus ke field pertama yang error
            RETURN false
        ELSE:
            RETURN true
    
    METHOD validateSingleField(fieldName):
        GET field element
        GET validation rule for field
        
        // Handling khusus untuk radio button (gender)
        IF field is radio button group:
            GET checked radio value
            SET field to first radio element
        
        // Validasi berdasarkan tipe rule
        IF rule has 'required':
            IF field is empty:
                SHOW error message
                RETURN invalid
        
        IF rule has 'minLength':
            IF field length < minLength:
                SHOW error message
                RETURN invalid
        
        IF rule has 'maxLength':
            IF field length > maxLength:
                SHOW error message
                RETURN invalid
        
        CLEAR error message
        RETURN valid
```

</details>

### **2. LocalStorage Message Persistence**

<details>
<summary>📖 Click to expand pseudocode</summary>

```
CONSTANT STORAGE_KEY = 'contact_messages'

FUNCTION initDummyData():
    // Cek dulu apakah localStorage kosong
    IF localStorage does NOT contain STORAGE_KEY:
        CREATE dummyMessages array with 3 sample messages
        SAVE dummyMessages to localStorage
    ELSE:
        // Data udah ada, jangan ditimpa (biar pesan user ga ilang)
        DO NOTHING

FUNCTION saveMessage(formData):
    GET existing messages from localStorage
    
    CREATE newMessage object:
        - id: current timestamp
        - name: formData.name
        - dob: formData.dob
        - gender: formData.gender
        - message: formData.message
        - timestamp: current time
    
    ADD newMessage to START of messages array (unshift)  // Taruh di paling atas
    SAVE updated messages to localStorage
    CALL renderMessages() to refresh UI

FUNCTION getMessages():
    GET messages string from localStorage
    PARSE JSON string to array
    IF empty or null:
        RETURN empty array
    ELSE:
        RETURN parsed messages array
```

</details>

### **3. Toast Notification System**

<details>
<summary>📖 Click to expand pseudocode</summary>

```
CONSTANT MAX_TOASTS = 3
CONSTANT TOAST_DURATION = 3000 // 3 detik

FUNCTION showToast(type, message):
    GET toast container
    GET current toasts
    
    // Batasi maksimal toast yang muncul
    IF current toast count >= MAX_TOASTS:
        REMOVE oldest toast  // Hapus toast paling lama
    
    // Bikin element toast baru
    CREATE toast div with:
        - Type-specific background color  // Warna sesuai tipe (hijau/merah/kuning/biru)
        - Icon based on type (success/error/warning/info)
        - Message text
        - Initial state: translated down, opacity 0  // Awalnya di bawah, transparan
    
    ADD toast to container
    
    // Animasi masuk
    AFTER browser repaint:
        REMOVE translate and opacity classes (triggers CSS transition)
    
    // Auto hapus setelah durasi habis
    AFTER TOAST_DURATION milliseconds:
        ADD fade-out classes  // Fade out pelan-pelan
        AFTER 300ms:
            REMOVE toast from DOM  // Hapus total dari halaman
```

</details>

### **4. Message Refresh Logic**

<details>
<summary>📖 Click to expand pseudocode</summary>

```
FUNCTION refreshMessages():
    GET refresh icon element
    GET current message count BEFORE refresh  // Simpan jumlah pesan sebelum refresh
    
    // Tampilkan loading state
    SHOW toast: "Memuat pesan terbaru..."
    ADD '.fa-spin' class to icon (rotate animation)  // Icon muter
    
    // Simulasi operasi async
    AFTER 2 seconds:
        REMOVE '.fa-spin' class from icon  // Stop muter
        
        // Render ulang pesan dari localStorage
        CALL renderMessages()
        
        // Hitung selisih pesan
        GET new message count AFTER refresh
        CALCULATE newMessages = newCount - previousCount
        
        // Tampilkan hasil
        IF newMessages > 0:
            SHOW success toast: "X pesan baru dimuat"
        ELSE IF newMessages < 0:
            SHOW info toast: "Pesan diperbarui"
        ELSE:
            SHOW info toast: "Pesan sudah terbaru"
```

</details>

### **5. Dark Mode Toggle**

<details>
<summary>📖 Click to expand pseudocode</summary>

```
CONSTANT THEME_KEY = 'theme'

FUNCTION initTheme():
    // Cek localStorage, ada preference tersimpan atau engga
    savedTheme = localStorage.getItem(THEME_KEY)
    
    IF savedTheme exists:
        IF savedTheme == 'dark':
            ADD 'dark' class to <html>  // Aktifkan dark mode
        ELSE:
            REMOVE 'dark' class from <html>  // Light mode
    ELSE:
        // Default light mode kalo belum ada preference
        REMOVE 'dark' class from <html>
    
    UPDATE toggle button icon  // Sesuaikan icon (sun/moon)

FUNCTION toggleTheme():
    GET <html> element
    
    IF <html> has 'dark' class:
        REMOVE 'dark' class  // Pindah ke light mode
        SAVE 'light' to localStorage  // Simpan preference
    ELSE:
        ADD 'dark' class  // Pindah ke dark mode
        SAVE 'dark' to localStorage  // Simpan preference
    
    UPDATE toggle button icon (sun ↔ moon)  // Ganti icon
```

</details>

---

## 📂 Struktur Folder

Sesuai aturan ketat dari RevoU, strukturnya simpel dan clean:

```text
CodingCamp-01Dec25-Hanif/
│
├── css/
│   └── style.css           # Custom CSS (animations, wrappers, utilities)
├── js/
│   └── script.js           # Semua logika JavaScript (validation, localStorage, etc)
├── assets/
│   └── images/
│       └── logo.png        # Logo perusahaan
├── index.html              # File utama HTML
└── README.md               # Dokumentasi project (file ini)
```

---

## 🚀 Cara Jalanin di Laptop Sendiri

Kalau mau coba utak-atik kodenya di laptop, ikutin cara ini:

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/hanifjbg/CodingCamp-01Dec25-Hanif.git
    ```
2.  **Masuk ke foldernya:**
    ```bash
    cd CodingCamp-01Dec25-Hanif
    ```
3.  **Buka di Browser:**
    - Tinggal klik 2x file `index.html`.
    - Atau biar makin asik, pake **Live Server** di VS Code.

---

## 🧪 Testing Flow

### **Recommended Testing Sequence:**

1. **Form Validation:**
   - Submit form kosong → Lihat inline errors muncul
   - Isi nama < 3 karakter → Error "minimal 3 karakter"
   - Isi pesan < 10 karakter → Error "minimal 10 karakter"
   - Submit valid form → Modal konfirmasi muncul
   
2. **Message Persistence:**
   - Submit 1 pesan baru
   - Refresh page (F5) → Pesan masih ada
   - Tutup browser → Buka lagi → Pesan masih ada
   
3. **Dark Mode:**
   - Klik toggle (moon icon) → Theme berubah gelap
   - Refresh page → Theme tetap gelap (saved)
   
4. **Message Refresh:**
   - Klik button "Refresh" → Icon berputar
   - Toast "Memuat pesan terbaru..." muncul
   - Message cards fade in dengan animasi

---

## 📊 Code Statistics

| Metric | Value |
|--------|-------|
| Total Lines | 2,662 |
| HTML | 689 lines |
| CSS | 907 lines |
| JavaScript | 1,066 lines |
| Total Size | ~103 KB |

---

## 🎯 Key Achievements

✅ **Reusable FormValidator Class** - Validation system yang bisa dipake untuk form lain  
✅ **Persistent Data Storage** - Messages survive browser restart  
✅ **Toast Notification System** - Max 3 toasts, auto-dismiss, type-specific styling  
✅ **Custom CSS Wrapper System** - DRY principle, consistent styling  
✅ **Dark Mode Support** - Full theme compatibility dengan localStorage persistence  
✅ **Responsive Design** - Mobile-first approach, works on all devices  
✅ **Clean Code Architecture** - Bilingual comments, well-organized, production-ready  

---

## 👨‍💻 Pembuat

<div align="left">
  <strong>Hanif Saifudin</strong><br>
  <em>Aspiring Software Engineer 🚀</em>
</div>

---

## 📝 Catatan Penting

- **LocalStorage:** Data tersimpan permanen di browser (hanya hilang jika manual clear cache)
- **Dummy Data:** 3 pesan example hanya muncul sekali di awal (saat localStorage kosong)
- **Form Validation:** Submit-only validation (tidak live) untuk UX yang lebih baik
- **Datepicker:** DOB field readonly, hanya bisa pilih dari calendar popup
- **No Backend:** Project ini 100% frontend, tidak ada server/database

---

_Dibuat dengan ❤️ dan ☕ untuk RevoU Coding Camp 2025._
