# 🍽️ Sade Lezzetler - QR Menü Sistemi

Modern, mobil uyumlu ve tamamen ücretsiz QR menü sistemi. GitHub Pages üzerinde barındırılan bu sistem, kod bilgisi gerektirmeden kolayca düzenlenebilir.

## 🌟 Özellikler

- ✅ **Tamamen Ücretsiz**: GitHub Pages ile ücretsiz barındırma
- 📱 **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- 🚀 **Hızlı**: Vanilla JavaScript, dependency yok
- 🎨 **Modern Tasarım**: Temiz ve kullanıcı dostu arayüz
- 🔧 **Kolay Düzenleme**: JSON dosyası ile basit yönetim
- 🖼️ **Görsel Desteği**: Ürün görselleri ile zengin içerik
- 🏷️ **Kategori Filtreleme**: Kolay navigasyon

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Fork/Clone Edin

GitHub'da bu repository'yi fork edin veya bilgisayarınıza clone edin.

### 2. GitHub Pages'i Aktifleştirin

1. Repository sayfanızda **Settings** sekmesine gidin
2. Sol menüden **Pages** seçeneğini bulun
3. **Source** bölümünden **main** branch seçin
4. **Save** butonuna tıklayın
5. Birkaç dakika sonra menünüz şu adreste yayınlanacak:
   ```
   https://[kullanıcı-adınız].github.io/sade-lezzetler-menu/
   ```

### 3. Menünüzü Ziyaret Edin

GitHub Pages aktifleştikten sonra, yukarıdaki URL'yi ziyaret ederek menünüzü görüntüleyebilirsiniz.

## 📝 Menüyü Düzenleme

### Fiyat Değiştirme

1. GitHub'da `menu-data.json` dosyasını açın
2. Sağ üstteki ✏️ (Edit) ikonuna tıklayın
3. İlgili ürünün `price` değerini değiştirin
4. Sayfanın altında **Commit changes** butonuna tıklayın
5. Değişiklik otomatik olarak yayınlanacaktır (1-2 dakika)

**Örnek:**
```json
{
  "id": 1,
  "name": "Türk Kahvesi",
  "description": "Geleneksel lezzetimiz",
  "price": "50",  // Burası değiştirildi (45'ten 50'ye)
  "image": "images/turk-kahvesi.jpg"
}
```

### Yeni Ürün Ekleme

1. `menu-data.json` dosyasını açın
2. İlgili kategorinin `items` dizisine yeni ürün ekleyin
3. Son ürün objesinden sonra virgül koymayı unutmayın

**Örnek:**
```json
{
  "id": 13,
  "name": "Espresso",
  "description": "Yoğun ve aromatik",
  "price": "40",
  "image": "images/espresso.jpg"
}
```

### Ürün Görseli Ekleme

1. GitHub'da `images/` klasörüne gidin
2. **Add file** > **Upload files** seçeneğini tıklayın
3. Görselinizi sürükleyip bırakın (Önerilen: 400x400px, JPG/PNG)
4. **Commit changes** ile kaydedin
5. `menu-data.json`'da ürünün `image` alanını güncelleyin:
   ```json
   "image": "images/yeni-gorsel.jpg"
   ```

### Yeni Kategori Ekleme

1. `menu-data.json` dosyasını açın
2. `categories` dizisine yeni kategori ekleyin

**Örnek:**
```json
{
  "id": "kahvaltilar",
  "name": "Kahvaltılar",
  "icon": "🥐",
  "items": []
}
```

### 🌟 En Sevilen Ürünler

Herhangi bir ürünü "En Sevilenler" kategorisine eklemek için:

1. `menu-data.json` dosyasını açın
2. İlgili ürüne `"featured": true` ekleyin:

```json
{
  "id": 1,
  "name": "Avokado Toast",
  "description": "Müşterilerimizin favorisi",
  "price": "95",
  "image": "images/avokado-toast.jpg",
  "badges": ["vegan", "organik"],
  "featured": true
}
```

3. Ürün otomatik olarak hem "⭐ En Sevilenler" kategorisinde hem de kendi kategorisinde görünecektir.

**Not:** En az bir ürün `"featured": true` olmalı ki "En Sevilenler" kategorisi görünsün.

### Ürünlere Etiket (Badge) Ekleme

Ürünlere sağlık ve içerik etiketleri ekleyebilirsiniz. `menu-data.json`'da ürüne `badges` alanı ekleyin:

```json
{
  "id": 1,
  "name": "Ürün Adı",
  "description": "Açıklama",
  "price": "50",
  "image": "images/urun.jpg",
  "badges": ["vegan", "organik"]
}
```

**Desteklenen Etiketler:**
- `"vegan"` → 🌱 Vegan
- `"glutensiz"` → 🌾 Glütensiz
- `"sekersiz"` → 🍯 Şekersiz
- `"organik"` → ☘️ Organik

> **Not:** `badges` alanı opsiyoneldir. Etiket eklenmeyen ürünler normal görünür.

### Ürün veya Kategori Silme

1. `menu-data.json` dosyasını açın
2. Silmek istediğiniz objeyi tamamen kaldırın
3. JSON formatının bozulmamasına dikkat edin (virgüller, parantezler)

## 🎨 Özelleştirme

### Renkleri Değiştirme

`styles.css` dosyasındaki `:root` bölümünü düzenleyin:

```css
:root {
    --color-primary: #6B8E23;    /* Ana yeşil */
    --color-secondary: #4A6741;  /* Koyu yeşil */
    --color-accent: #D4A574;     /* Altın/vurgu */
    --color-bg: #FDFEF9;         /* Arka plan */
}
```

### Kafe Adını Değiştirme

`menu-data.json` dosyasındaki `cafeName` değerini değiştirin:

```json
{
  "cafeName": "Kafe Adınız",
  ...
}
```

### Logo Ekleme

`index.html` dosyasındaki header bölümüne logo ekleyin:

```html
<header class="header">
    <img src="images/logo.png" alt="Logo" style="height: 60px; margin-bottom: 1rem;">
    <h1>Sade Lezzetler</h1>
    <p>Menümüze Hoş Geldiniz</p>
</header>
```

## 📱 QR Kod Oluşturma

1. Menü URL'nizi kopyalayın: `https://[kullanıcı-adınız].github.io/sade-lezzetler-menu/`
2. Şu sitelerden birini ziyaret edin:
   - https://www.qr-code-generator.com/
   - https://www.qr-monkey.com/
   - https://qr.io/
3. URL'nizi yapıştırın
4. QR kodunu indirin (PNG veya SVG)
5. QR kodu yazdırıp masalarınıza yerleştirin

### QR Kod İpuçları

- **Boyut**: En az 3x3 cm olmalı
- **Kalite**: Yüksek çözünürlükte yazdırın
- **Yerleşim**: Göz hizasında ve kolay erişilebilir yerde
- **Test**: Yazdırmadan önce telefonunuzla test edin

## 🛠️ Teknik Detaylar

### Proje Yapısı

```
/
├── index.html          # Ana HTML sayfası
├── menu-data.json      # Menü verileri (JSON)
├── styles.css          # CSS stilleri
├── script.js           # JavaScript kodu
├── images/             # Ürün görselleri
│   └── placeholder.svg # Varsayılan görsel
└── README.md           # Kullanım kılavuzu
```

### Teknoloji Stack

- **HTML5**: Semantik markup
- **CSS3**: Modern stil ve animasyonlar
- **Vanilla JavaScript**: Bağımlılık yok, hızlı yükleme
- **GitHub Pages**: Ücretsiz barındırma
- **JSON**: Kolay veri yönetimi

### Tarayıcı Desteği

✅ Chrome/Edge (son 2 versiyon)
✅ Firefox (son 2 versiyon)
✅ Safari (son 2 versiyon)
✅ Mobil tarayıcılar (iOS Safari, Chrome Mobile)

### Responsive Breakpoints

- **Mobil**: < 768px (1 kolon)
- **Tablet**: 768px - 1023px (2 kolon)
- **Desktop**: ≥ 1024px (3 kolon)

## 🐛 Sorun Giderme

### Menü Görünmüyor

1. GitHub Pages'in aktif olduğundan emin olun
2. Repository'nin public olduğunu kontrol edin
3. URL'yi doğru girdiğinizden emin olun
4. Tarayıcı cache'ini temizleyin

### Görsel Görünmüyor

1. Görsel yolunun doğru olduğunu kontrol edin: `images/gorsel.jpg`
2. Görsel dosyasının repository'de olduğunu doğrulayın
3. Dosya isminde Türkçe karakter kullanmayın
4. Placeholder otomatik gösterilecektir

### JSON Hatası

1. JSON formatının geçerli olduğunu kontrol edin: https://jsonlint.com/
2. Virgül, parantez ve tırnak işaretlerine dikkat edin
3. Son elemandan sonra virgül olmadığından emin olun

## 📞 Destek ve İletişim

- **Issues**: GitHub Issues bölümünde soru sorabilirsiniz
- **Katkıda Bulunma**: Pull request'ler memnuniyetle karşılanır
- **Dokümantasyon**: Bu README dosyası sürekli güncellenmektedir

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Özgürce kullanabilir, düzenleyebilir ve dağıtabilirsiniz.

## 🎯 Gelecek Özellikler

- [ ] Multi-language support (Çoklu dil desteği)
- [ ] PWA support (Offline çalışma)
- [ ] Admin panel (Web üzerinden düzenleme)
- [ ] Allergen bilgisi gösterimi
- [ ] Kalori bilgisi
- [ ] Sipariş sistemi entegrasyonu

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz! Başarılı satışlar dileriz. 🎉

---

**Son Güncelleme**: 2024
**Versiyon**: 1.0.0
