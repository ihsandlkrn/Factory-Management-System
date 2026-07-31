# 🫐 Blueberry Factory Management System
### (Yaban Mersini Fabrika Yönetim Sistemi)

A modern, responsive, and lightweight ERP web application designed to manage a blueberry processing factory. The application runs entirely in the browser and uses client-side storage to persist data.

*Yaban mersini işleme fabrikasını yönetmek amacıyla tasarlanmış modern, duyarlı (responsive) ve hafif bir ERP web uygulamasıdır. Uygulama tamamen tarayıcı üzerinde çalışır ve verileri kaydetmek için yerel depolamayı (LocalStorage) kullanır.*

---

## 🌎 Language / Dil Seçimi
- [English Description](#-english-details)
- [Türkçe Açıklama](#-türkçe-detaylar)

---

## 🇬🇧 English Details

### 🛠️ Technology Stack
- **Frontend:** HTML5, Modern Vanilla CSS3 (Custom properties/variables, flexbox, CSS grid).
- **Core Logic:** Vanilla JavaScript (ES Modules using `import`/`export` syntax).
- **Visualization:** [Chart.js](https://www.chartjs.org/) for interactive sales and revenue analytics.
- **Database/Persistence:** Browser `LocalStorage` API (persists data across page reloads).

### 🚀 Key Features
1. **Unified Dashboard:** A premium, modern sidebar navigation layout allowing seamless routing between modules on desktop, tablet, and mobile.
2. **Supplier Management:** 
   - Register, update, and search farmer profiles.
   - Log blueberry harvest purchases by type (*Fresh, Frozen, Organic*).
   - Generate purchase summaries and calculate procurement expenses.
   - Export farmer directories to CSV.
3. **Packaging System:**
   - Package raw harvest berries into retail sizes (*Small, Medium, Large, Extra Large, Family Pack, Bulk Pack, Premium*).
   - Deduct packaged amounts from raw inventory in real time.
   - Define and update pricing structures per kilogram.
4. **Sales System:**
   - Log client orders with validation (automatically checks stock availability before confirming packaging).
   - Track and update order statuses (*Pending, Processed, Shipped, Delivered*).
   - Interactive data visualization of sales revenue by category.
   - Export sales reports as CSV.
5. **Financial Reports:**
   - Consolidated financial summaries calculating total income, total expenses, tax liabilities (18%), and net profit.
   - Overview of packaged items sold and remaining warehouse stocks.

### 💻 How to Run
Simply clone the repository and open [main.html](file:///c:/Users/ihsan/Desktop/Factory-Management-System-main/main.html) in any modern web browser.
No server, database setup, or installation of npm packages is required!

---

## 🇹🇷 Türkçe Detaylar

### 🛠️ Kullanılan Teknolojiler
- **Arayüz:** HTML5, Modern Vanilla CSS3 (CSS değişkenleri, Flexbox, Grid sistemi).
- **Mantık Katmanı:** Vanilla JavaScript (ES Modülleri - `import`/`export` yapısı).
- **Görselleştirme:** Satış grafikleri için [Chart.js](https://www.chartjs.org/) entegrasyonu.
- **Veri Depolama:** Tarayıcı `LocalStorage` API (veriler tarayıcıda kalıcı olarak saklanır).

### 🚀 Öne Çıkan Özellikler
1. **Merkezi Kontrol Paneli:** Masaüstü, tablet ve mobil cihazlara tam uyumlu (responsive), modern tasarımlı yan menü (sidebar) geçiş sistemi.
2. **Tedarikçi Yönetimi:**
   - Çiftçi profillerini ekleme, güncelleme, arama ve listeleme.
   - Hasat alımlarını yaban mersini türüne göre (*Taze, Dondurulmuş, Organik*) kaydetme.
   - Alım geçmişini sıralama, özetleme ve tedarik giderlerini hesaplama.
   - Çiftçi bilgilerini CSV dosyası olarak dışa aktarma.
3. **Paketleme Sistemi:**
   - Depodaki ham ürünleri ticari paket boyutlarında (*Small, Medium, Large, Extra Large, Family Pack, Bulk Pack, Premium*) paketleme.
   - Paketleme yapıldığında ham ürün stoklarını anlık olarak düşürme.
   - Paket kategorileri için kilogram başı fiyat listesini yönetme ve güncelleme.
4. **Satış Sistemi:**
   - Müşteri siparişlerini stok kontrolü ile kaydetme (stok yetersizse sipariş engellenir).
   - Sipariş süreçlerini (*Beklemede, İşlendi, Gönderildi, Teslim Edildi*) yönetme.
   - Satış gelirlerini kategoriye göre dinamik grafiklerle izleme.
   - Satış verilerini CSV formatında indirme.
5. **Finansal Raporlar:**
   - Toplam gelir, gider, vergi yükümlülükleri (%18) ve net kârı hesaplayan konsolide mali tablolar.
   - Satılan ürünlerin kategori dağılımı ve kalan depo stoklarının takibi.

### 💻 Nasıl Çalıştırılır
Depoyu klonlayın ve [main.html](file:///c:/Users/ihsan/Desktop/Factory-Management-System-main/main.html) dosyasını herhangi bir modern web tarayıcısında açın. 
Sunucu kurulumuna, veritabanı ayarlarına veya npm paket yüklemelerine gerek yoktur!
