const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/translations.ts');

// The complete dictionary of new keys for ALL remaining languages
const allTranslations = {
    am: { // Amharic
        tabGeneral: "አጠቃላይ", tabAppearance: "መልክ", tabMedia: "ሚዲያ",
        mediaTitle: "የሚዲያ ቅንብሮች", mediaSource: "የምንጭ አይነት", mediaCategory: "ምድብ",
        mediaLocal: "የአካባቢ እነት", mediaMultiSelect: "ምድቦችን ይምረጡ",
        mediaLocalPath: "የአካባቢ እነት መንገድ", mediaNote: "ማስታወሻ: ለአሳሽ ተደራሽነት የአካባቢ አገልግሎትን ይጠቀሙ",
        mediaFrequency: "የመቀየር ድግግሞሽ", mediaInterval: "ምስል ይቀይሩ በየ",
        appearanceCustomize: "የተበጀ ቀለም", appearanceDark: "የጨለማ ሁነታ ቀለሞች", appearanceLight: "የብርሃን ሁነታ ቀለሞች",
        appearancePrimary: "ዋና", appearanceBackground: "ዳራ", appearanceSurface: "ገጽታ",
        imgSourceCategory: "ምድብ", imgSourceLocal: "የአካባቢ",
        mediaGallery: "ጋለሪ", mediaNoSource: "ምስል አልተመረጠም",
        nationalHolidays: "ብሔራዊ በዓላት", activeCalendars: "ንቁ የቀን መቁጠሪያዎች", none: "ምንም",
        dark: "ጨለማ", light: "ብርሃን"
    },
    bn: { // Bengali
        tabGeneral: "সাধারণ", tabAppearance: "চেহারা", tabMedia: "মিডিয়া",
        mediaTitle: "মিডিয়া সেটিংস", mediaSource: "উৎস প্রকার", mediaCategory: "বিভাগ",
        mediaLocal: "স্থানীয় ডিরেক্টরি", mediaMultiSelect: "বিভাগ নির্বাচন করুন",
        mediaLocalPath: "স্থানীয় ডিরেক্টরি পথ", mediaNote: "দ্রষ্টব্য: ব্রাউজারের জন্য লোকাল হোস্ট ব্যবহার করুন।",
        mediaFrequency: "ঘূর্ণন ফ্রিকোয়েন্সি", mediaInterval: "ছবি পরিবর্তন করুন প্রতি",
        appearanceCustomize: "কাস্টম থিম রং", appearanceDark: "ডার্ক মোড রং", appearanceLight: "লাইট মোড রং",
        appearancePrimary: "প্রাথমিক", appearanceBackground: "পটভূমি", appearanceSurface: "উপরিভাগ",
        imgSourceCategory: "বিভাগ", imgSourceLocal: "স্থানীয়",
        mediaGallery: "গ্যালারি", mediaNoSource: "কোনো ছবির উৎস নির্বাচিত হয়নি",
        nationalHolidays: "জাতীয় ছুটি", activeCalendars: "সক্রিয় ক্যালেন্ডার", none: "কোনটি না",
        dark: "অন্ধকার", light: "আলো"
    },
    bg: { // Bulgarian
        tabGeneral: 'Общи', tabAppearance: 'Външен вид', tabMedia: 'Медия',
        mediaTitle: 'Настройки за медия', mediaSource: 'Тип източник', mediaCategory: 'Категория',
        mediaLocal: 'Локална директория', mediaMultiSelect: 'Избор на категории',
        mediaLocalPath: 'Път до директорията', mediaNote: 'Бележка: Използвайте локален сървър.',
        mediaFrequency: 'Честота на смяна', mediaInterval: 'Смяна на всеки',
        appearanceCustomize: 'Персонализирани цветове', appearanceDark: 'Тъмна тема', appearanceLight: 'Светла тема',
        appearancePrimary: 'Основен', appearanceBackground: 'Фон', appearanceSurface: 'Повърхност',
        imgSourceCategory: 'Категория', imgSourceLocal: 'Локален',
        mediaGallery: 'Галерия', mediaNoSource: 'Няма избран източник',
        nationalHolidays: 'Национални празници', activeCalendars: 'Активни календари', none: 'Няма',
        dark: 'Тъмна', light: 'Светла'
    },
    ca: { // Catalan
        tabGeneral: "General", tabAppearance: "Aparença", tabMedia: "Multimèdia",
        mediaTitle: "Configuració Multimèdia", mediaSource: "Tipus de Font", mediaCategory: "Categoria",
        mediaLocal: "Directori Local", mediaMultiSelect: "Selecciona Categories",
        mediaLocalPath: "Ruta del Directori", mediaNote: "Nota: Utilitzeu servidor local.",
        mediaFrequency: "Freqüència de Rotació", mediaInterval: "Canvia imatge cada",
        appearanceCustomize: "Colors Personalitzats", appearanceDark: "Colors Mode Fosc", appearanceLight: "Colors Mode Clar",
        appearancePrimary: "Primari", appearanceBackground: "Fons", appearanceSurface: "Superfície",
        imgSourceCategory: "Categoria", imgSourceLocal: "Local",
        mediaGallery: "Galeria", mediaNoSource: "Cap font seleccionada",
        nationalHolidays: "Festes Nacionals", activeCalendars: "Calendaris Actius", none: "Cap",
        dark: "Fosc", light: "Clar"
    },
    hr: { // Croatian
        tabGeneral: "Općenito", tabAppearance: "Izgled", tabMedia: "Mediji",
        mediaTitle: "Postavke medija", mediaSource: "Vrsta izvora", mediaCategory: "Kategorija",
        mediaLocal: "Lokalni direktorij", mediaMultiSelect: "Odaberi kategorije",
        mediaLocalPath: "Putanja direktorija", mediaNote: "Napomena: Koristite lokalni poslužitelj.",
        mediaFrequency: "Učestalost rotacije", mediaInterval: "Promijeni sliku svakih",
        appearanceCustomize: "Prilagođene boje", appearanceDark: "Boje tamnog načina", appearanceLight: "Boje svijetlog načina",
        appearancePrimary: "Primarna", appearanceBackground: "Pozadina", appearanceSurface: "Površina",
        imgSourceCategory: "Kategorija", imgSourceLocal: "Lokalno",
        mediaGallery: "Galerija", mediaNoSource: "Izvor nije odabran",
        nationalHolidays: "Državni praznici", activeCalendars: "Aktivni kalendari", none: "Nijedan",
        dark: "Tamno", light: "Svijetlo"
    },
    cs: { // Czech
        tabGeneral: "Obecné", tabAppearance: "Vzhled", tabMedia: "Média",
        mediaTitle: "Nastavení médií", mediaSource: "Typ zdroje", mediaCategory: "Kategorie",
        mediaLocal: "Místní adresář", mediaMultiSelect: "Vybrat kategorie",
        mediaLocalPath: "Cesta k adresáři", mediaNote: "Poznámka: Použijte lokální server.",
        mediaFrequency: "Frekvence rotace", mediaInterval: "Změnit obrázek každých",
        appearanceCustomize: "Vlastní barvy", appearanceDark: "Barvy tmavého režimu", appearanceLight: "Barvy světlého režimu",
        appearancePrimary: "Primární", appearanceBackground: "Pozadí", appearanceSurface: "Povrch",
        imgSourceCategory: "Kategorie", imgSourceLocal: "Místní",
        mediaGallery: "Galerie", mediaNoSource: "Nebyl vybrán zdroj",
        nationalHolidays: "Státní svátky", activeCalendars: "Aktivní kalendáře", none: "Žádný",
        dark: "Tmavý", light: "Světlý"
    },
    da: { // Danish
        tabGeneral: "Generelt", tabAppearance: "Udseende", tabMedia: "Medier",
        mediaTitle: "Medieindstillinger", mediaSource: "Kildetype", mediaCategory: "Kategori",
        mediaLocal: "Lokalt bibliotek", mediaMultiSelect: "Vælg kategorier",
        mediaLocalPath: "Bibliotekssti", mediaNote: "Bemærk: Brug en lokal server.",
        mediaFrequency: "Rotationsfrekvens", mediaInterval: "Skift billede hver",
        appearanceCustomize: "Tilpassede farver", appearanceDark: "Mørk tilstand farver", appearanceLight: "Lys tilstand farver",
        appearancePrimary: "Primær", appearanceBackground: "Baggrund", appearanceSurface: "Overflade",
        imgSourceCategory: "Kategori", imgSourceLocal: "Lokal",
        mediaGallery: "Galleri", mediaNoSource: "Ingen kilde valgt",
        nationalHolidays: "Nationale helligdage", activeCalendars: "Aktive kalendere", none: "Ingen",
        dark: "Mørk", light: "Lys"
    },
    et: { // Estonian
        tabGeneral: 'Üldine', tabAppearance: 'Välimus', tabMedia: 'Meedia',
        mediaTitle: 'Meedia seaded', mediaSource: 'Allika tüüp', mediaCategory: 'Kategooria',
        mediaLocal: 'Kohalik kaust', mediaMultiSelect: 'Vali kategooriad',
        mediaLocalPath: 'Kausta tee', mediaNote: 'Märkus: Kasuta localhosti.',
        mediaFrequency: 'Vahetuse sagedus', mediaInterval: 'Vaheta pilti iga',
        appearanceCustomize: 'Kohandatud värvid', appearanceDark: 'Tumeda režiimi värvid', appearanceLight: 'Heleda režiimi värvid',
        appearancePrimary: 'Peamine', appearanceBackground: 'Taust', appearanceSurface: 'Pind',
        imgSourceCategory: 'Kategooria', imgSourceLocal: 'Kohalik',
        mediaGallery: 'Galerii', mediaNoSource: 'Allikat pole valitud',
        nationalHolidays: 'Riigipühad', activeCalendars: 'Aktiivsed kalendrid', none: 'Puudub',
        dark: 'Tume', light: 'Hele'
    },
    fil: { // Filipino
        tabGeneral: "Pangkalahatan", tabAppearance: "Hitsura", tabMedia: "Media",
        mediaTitle: "Mga Setting ng Media", mediaSource: "Uri ng Pinagmulan", mediaCategory: "Kategorya",
        mediaLocal: "Lokal na Direktoryo", mediaMultiSelect: "Pumili ng mga Kategorya",
        mediaLocalPath: "Path ng Direktoryo", mediaNote: "Tandaan: Gumamit ng localhost.",
        mediaFrequency: "Dalas ng Pag-rotate", mediaInterval: "Baguhin ang larawan bawat",
        appearanceCustomize: "Pasadyang Kulay", appearanceDark: "Kulay ng Madilim na Mode", appearanceLight: "Kulay ng Maliwanag na Mode",
        appearancePrimary: "Pangunahin", appearanceBackground: "Background", appearanceSurface: "Ibabaw",
        imgSourceCategory: "Kategorya", imgSourceLocal: "Lokal",
        mediaGallery: "Galerya", mediaNoSource: "Walang napiling pinagmulan",
        nationalHolidays: "Pambansang Piyesta Opisyal", activeCalendars: "Aktibong Kalendaryo", none: "Wala",
        dark: "Madilim", light: "Maliwanag"
    },
    fi: { // Finnish
        tabGeneral: "Yleiset", tabAppearance: "Ulkoasu", tabMedia: "Media",
        mediaTitle: "Media-asetukset", mediaSource: "Lähdetyyppi", mediaCategory: "Kategoria",
        mediaLocal: "Paikallinen hakemisto", mediaMultiSelect: "Valitse kategoriat",
        mediaLocalPath: "Hakemistopolku", mediaNote: "Huom: Käytä paikallista palvelinta.",
        mediaFrequency: "Vaihtoväli", mediaInterval: "Vaihda kuva joka",
        appearanceCustomize: "Mukautetut värit", appearanceDark: "Tumman tilan värit", appearanceLight: "Vaalean tilan värit",
        appearancePrimary: "Ensisijainen", appearanceBackground: "Tausta", appearanceSurface: "Pinta",
        imgSourceCategory: "Kategoria", imgSourceLocal: "Paikallinen",
        mediaGallery: "Galleria", mediaNoSource: "Ei lähdettä valittu",
        nationalHolidays: "Kansalliset vapaapäivät", activeCalendars: "Aktiiviset kalenterit", none: "Ei mitään",
        dark: "Tumma", light: "Vaalea"
    },
    el: { // Greek
        tabGeneral: "Γενικά", tabAppearance: "Εμφάνιση", tabMedia: "Πολυμέσα",
        mediaTitle: "Ρυθμίσεις Πολυμέσων", mediaSource: "Τύπος Πηγής", mediaCategory: "Κατηγορία",
        mediaLocal: "Τοπικός Φάκελος", mediaMultiSelect: "Επιλογή Κατηγοριών",
        mediaLocalPath: "Διαδρομή Φακέλου", mediaNote: "Σημείωση: Χρησιμοποιήστε localhost.",
        mediaFrequency: "Συχνότητα Εναλλαγής", mediaInterval: "Αλλαγή εικόνας κάθε",
        appearanceCustomize: "Προσαρμοσμένα Χρώματα", appearanceDark: "Χρώματα Σκούρου Θέματος", appearanceLight: "Χρώματα Φωτεινού Θέματος",
        appearancePrimary: "Πρωτεύον", appearanceBackground: "Φόντο", appearanceSurface: "Επιφάνεια",
        imgSourceCategory: "Κατηγορία", imgSourceLocal: "Τοπικό",
        mediaGallery: "Γκαλερί", mediaNoSource: "Δεν επιλέχθηκε πηγή",
        nationalHolidays: "Εθνικές Εορτές", activeCalendars: "Ενεργά Ημερολόγια", none: "Κανένα",
        dark: "Σκούρο", light: "Φωτεινό"
    },
    gu: { // Gujarati
        tabGeneral: "સામાન્ય", tabAppearance: "દેખાવ", tabMedia: "મીડિયા",
        mediaTitle: "મીડિયા સેટિંગ્સ", mediaSource: "સ્રોત પ્રકાર", mediaCategory: "શ્રેણી",
        mediaLocal: "સ્થાનિક ડિરેક્ટરી", mediaMultiSelect: "શ્રેણીઓ પસંદ કરો",
        mediaLocalPath: "ડિરેક્ટરી પાથ", mediaNote: "નોંધ: લોકલ સર્વર વાપરો.",
        mediaFrequency: "ફેરફાર આવર્તન", mediaInterval: "દરેક વખતે છબી બદલો",
        appearanceCustomize: "કસ્ટમ રંગો", appearanceDark: "ડાર્ક મોડ રંગો", appearanceLight: "લાઇટ મોડ રંગો",
        appearancePrimary: "પ્રાથમિક", appearanceBackground: "પૃષ્ઠભૂમિ", appearanceSurface: "સપાટી",
        imgSourceCategory: "શ્રેણી", imgSourceLocal: "સ્થાનિક",
        mediaGallery: "ગેલેરી", mediaNoSource: "કોઈ સ્રોત પસંદ નથી",
        nationalHolidays: "રાષ્ટ્રીય રજાઓ", activeCalendars: "સક્રિય કેલેન્ડર્સ", none: "કોઈ નહીં",
        dark: "ડાર્ક", light: "લાઇટ"
    },
    hi: { // Hindi
        tabGeneral: "सामान्य", tabAppearance: "दिखावट", tabMedia: "मीडिया",
        mediaTitle: "मीडिया सेटिंग्स", mediaSource: "स्रोत प्रकार", mediaCategory: "श्रेणी",
        mediaLocal: "स्थानीय निर्देशिका", mediaMultiSelect: "श्रेणियाँ चुनें",
        mediaLocalPath: "निर्देशिका पथ", mediaNote: "नोट: स्थानीय सर्वर और का उपयोग करें।",
        mediaFrequency: "रोटेशन आवृत्ति", mediaInterval: "हर बार छवि बदलें",
        appearanceCustomize: "कस्टम रंग", appearanceDark: "डार्क मोड रंग", appearanceLight: "लाइट मोड रंग",
        appearancePrimary: "प्राथमिक", appearanceBackground: "पृष्ठभूमि", appearanceSurface: "सतह",
        imgSourceCategory: "श्रेणी", imgSourceLocal: "स्थानीय",
        mediaGallery: "गेलरी", mediaNoSource: "कोई स्रोत नहीं चुना गया",
        nationalHolidays: "राष्ट्रीय अवकाश", activeCalendars: "सक्रिय कैलेंडर", none: "कोई नहीं",
        dark: "गहरा", light: "हल्का"
    },
    hu: { // Hungarian
        tabGeneral: "Általános", tabAppearance: "Megjelenés", tabMedia: "Média",
        mediaTitle: "Média beállítások", mediaSource: "Forrás típusa", mediaCategory: "Kategória",
        mediaLocal: "Helyi könyvtár", mediaMultiSelect: "Kategóriák kiválasztása",
        mediaLocalPath: "Könyvtár elérési útja", mediaNote: "Megjegyzés: Használjon helyi szervert.",
        mediaFrequency: "Váltási gyakoriság", mediaInterval: "Kép cseréje minden",
        appearanceCustomize: "Egyéni színek", appearanceDark: "Sötét mód színei", appearanceLight: "Világos mód színei",
        appearancePrimary: "Elsődleges", appearanceBackground: "Háttér", appearanceSurface: "Felület",
        imgSourceCategory: "Kategória", imgSourceLocal: "Helyi",
        mediaGallery: "Galéria", mediaNoSource: "Nincs forrás kiválasztva",
        nationalHolidays: "Nemzeti ünnepek", activeCalendars: "Aktív naptárak", none: "Nincs",
        dark: "Sötét", light: "Világos"
    },
    id: { // Indonesian
        tabGeneral: "Umum", tabAppearance: "Tampilan", tabMedia: "Media",
        mediaTitle: "Pengaturan Media", mediaSource: "Jenis Sumber", mediaCategory: "Kategori",
        mediaLocal: "Direktori Lokal", mediaMultiSelect: "Pilih Kategori",
        mediaLocalPath: "Jalur Direktori", mediaNote: "Catatan: Gunakan server lokal.",
        mediaFrequency: "Frekuensi Rotasi", mediaInterval: "Ganti gambar setiap",
        appearanceCustomize: "Warna Kustom", appearanceDark: "Warna Mode Gelap", appearanceLight: "Warna Mode Terang",
        appearancePrimary: "Utama", appearanceBackground: "Latar Belakang", appearanceSurface: "Permukaan",
        imgSourceCategory: "Kategori", imgSourceLocal: "Lokal",
        mediaGallery: "Galeri", mediaNoSource: "Tidak ada sumber dipilih",
        nationalHolidays: "Hari Libur Nasional", activeCalendars: "Kalender Aktif", none: "Tidak Ada",
        dark: "Gelap", light: "Terang"
    },
    kn: { // Kannada
        tabGeneral: "ಸಾಮಾನ್ಯ", tabAppearance: "ನೋಟ", tabMedia: "ಮಾಧ್ಯಮ",
        mediaTitle: "ಮಾಧ್ಯಮ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", mediaSource: "ಮೂಲ ಪ್ರಕಾರ", mediaCategory: "ವರ್ಗ",
        mediaLocal: "ಸ್ಥಳೀಯ ಕೋಶ", mediaMultiSelect: "ವರ್ಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        mediaLocalPath: "ಕೋಶದ ಮಾರ್ಗ", mediaNote: "ಗಮನಿಸಿ: ಲೋಕಲ್ ಹೋಸ್ಟ್ ಬಳಸಿ.",
        mediaFrequency: "ತಿರುಗುವಿಕೆ ಆವರ್ತನ", mediaInterval: "ಚಿತ್ರವನ್ನು ಬದಲಿಸಿ ಪ್ರತಿ",
        appearanceCustomize: "ಕಸ್ಟಮ್ ಬಣ್ಣಗಳು", appearanceDark: "ಡಾರ್ಕ್ ಮೋಡ್ ಬಣ್ಣಗಳು", appearanceLight: "ಲೈಟ್ ಮೋಡ್ ಬಣ್ಣಗಳು",
        appearancePrimary: "ಪ್ರಾಥಮಿಕ", appearanceBackground: "ಹಿನ್ನೆಲೆ", appearanceSurface: "ಮೇಲ್ಮೈ",
        imgSourceCategory: "ವರ್ಗ", imgSourceLocal: "ಸ್ಥಳೀಯ",
        mediaGallery: "ಗ್ಯಾಲರಿ", mediaNoSource: "ಯಾವುದೇ ಮೂಲ ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ",
        nationalHolidays: "ರಾಷ್ಟ್ರೀಯ ಹಬ್ಬಗಳು", activeCalendars: "ಸಕ್ರಿಯ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು", none: "ಯಾವುದೂ ಇಲ್ಲ",
        dark: "ಕತ್ತಲೆ", light: "ಬೆಳಕು"
    },
    lv: { // Latvian
        tabGeneral: "Vispārīgi", tabAppearance: "Izskats", tabMedia: "Multivide",
        mediaTitle: "Multivides iestatījumi", mediaSource: "Avota veids", mediaCategory: "Kategorija",
        mediaLocal: "Lokālā direktorija", mediaMultiSelect: "Izvēlēties kategorijas",
        mediaLocalPath: "Direktorijas ceļš", mediaNote: "Piezīme: Izmantojiet lokālo serveri.",
        mediaFrequency: "Maiņas biežums", mediaInterval: "Mainīt attēlu katru",
        appearanceCustomize: "Pielāgotas krāsas", appearanceDark: "Tumšā režīma krāsas", appearanceLight: "Gaišā režīma krāsas",
        appearancePrimary: "Primārā", appearanceBackground: "Fons", appearanceSurface: "Virsma",
        imgSourceCategory: "Kategorija", imgSourceLocal: "Lokāls",
        mediaGallery: "Galerija", mediaNoSource: "Avots nav izvēlēts",
        nationalHolidays: "Valsts svētki", activeCalendars: "Aktīvie kalendāri", none: "Nav",
        dark: "Tumšs", light: "Gaišs"
    },
    lt: { // Lithuanian
        tabGeneral: "Bendra", tabAppearance: "Išvaizda", tabMedia: "Medija",
        mediaTitle: "Medijos nustatymai", mediaSource: "Šaltinio tipas", mediaCategory: "Kategorija",
        mediaLocal: "Vietinis katalogas", mediaMultiSelect: "Pasirinkti kategorijas",
        mediaLocalPath: "Katalogo kelias", mediaNote: "Pastaba: Naudokite vietinį serverį.",
        mediaFrequency: "Keitimo dažnis", mediaInterval: "Keisti paveikslėlį kas",
        appearanceCustomize: "Pasirinktinės spalvos", appearanceDark: "Tamsaus režimo spalvos", appearanceLight: "Šviesaus režimo spalvos",
        appearancePrimary: "Pagrindinė", appearanceBackground: "Fonas", appearanceSurface: "Paviršius",
        imgSourceCategory: "Kategorija", imgSourceLocal: "Vietinis",
        mediaGallery: "Galerija", mediaNoSource: "Šaltinis nepasirinktas",
        nationalHolidays: "Valstybinės šventės", activeCalendars: "Aktyvūs kalendoriai", none: "Nėra",
        dark: "Tamsus", light: "Šviesus"
    },
    ms: { // Malay
        tabGeneral: "Umum", tabAppearance: "Penampilan", tabMedia: "Media",
        mediaTitle: "Tetapan Media", mediaSource: "Jenis Sumber", mediaCategory: "Kategori",
        mediaLocal: "Direktori Tempatan", mediaMultiSelect: "Pilih Kategori",
        mediaLocalPath: "Laluan Direktori", mediaNote: "Nota: Gunakan pelayan tempatan.",
        mediaFrequency: "Kekerapan Putaran", mediaInterval: "Tukar imej setiap",
        appearanceCustomize: "Warna Tersuai", appearanceDark: "Warna Mod Gelap", appearanceLight: "Warna Mod Cerah",
        appearancePrimary: "Utama", appearanceBackground: "Latar Belakang", appearanceSurface: "Permukaan",
        imgSourceCategory: "Kategori", imgSourceLocal: "Tempatan",
        mediaGallery: "Galeri", mediaNoSource: "Tiada sumber dipilih",
        nationalHolidays: "Cuti Kebangsaan", activeCalendars: "Kalendar Aktif", none: "Tiada",
        dark: "Gelap", light: "Cerah"
    },
    mr: { // Marathi
        tabGeneral: "सामान्य", tabAppearance: "दिसणे", tabMedia: "मीडिया",
        mediaTitle: "मीडिया सेटिंग्ज", mediaSource: "स्रोत प्रकार", mediaCategory: "श्रेणी",
        mediaLocal: "स्थानिक डिरेक्टरी", mediaMultiSelect: "श्रेणी निवडा",
        mediaLocalPath: "डिरेक्टरी मार्ग", mediaNote: "टीप: स्थानिक सर्व्हर वापरा.",
        mediaFrequency: "फिरविण्याची वारंवारता", mediaInterval: "प्रत्येक वेळी प्रतिमा बदला",
        appearanceCustomize: "सानुकूल रंग", appearanceDark: "डार्क मोड रंग", appearanceLight: "लाइट मोड रंग",
        appearancePrimary: "प्राथमिक", appearanceBackground: "पार्श्वभूमी", appearanceSurface: "पृष्ठभाग",
        imgSourceCategory: "श्रेणी", imgSourceLocal: "स्थानिक",
        mediaGallery: "गॅलरी", mediaNoSource: "कोणताही स्रोत निवडलेला नाही",
        nationalHolidays: "राष्ट्रीय सुट्ट्या", activeCalendars: "सक्रिय कॅलेंडर", none: "काहीही नाही",
        dark: "गडद", light: "हलका"
    },
    no: { // Norwegian
        tabGeneral: "Generelt", tabAppearance: "Utseende", tabMedia: "Medier",
        mediaTitle: "Medieinnstillinger", mediaSource: "Kildetype", mediaCategory: "Kategori",
        mediaLocal: "Lokal katalog", mediaMultiSelect: "Velg kategorier",
        mediaLocalPath: "Katalogbane", mediaNote: "Merk: Bruk en lokal server.",
        mediaFrequency: "Rotasjonsfrekvens", mediaInterval: "Bytt bilde hver",
        appearanceCustomize: "Egendefinerte farger", appearanceDark: "Mørk modus-farger", appearanceLight: "Lys modus-farger",
        appearancePrimary: "Primær", appearanceBackground: "Bakgrunn", appearanceSurface: "Overflate",
        imgSourceCategory: "Kategori", imgSourceLocal: "Lokal",
        mediaGallery: "Galleri", mediaNoSource: "Ingen kilde valgt",
        nationalHolidays: "Nasjonale helligdager", activeCalendars: "Aktive kalendere", none: "Ingen",
        dark: "Mørk", light: "Lys"
    },
    fa: { // Persian
        tabGeneral: "عمومی", tabAppearance: "ظاهر", tabMedia: "رسانه",
        mediaTitle: "تنظیمات رسانه", mediaSource: "نوع منبع", mediaCategory: "دسته",
        mediaLocal: "دایرکتوری محلی", mediaMultiSelect: "انتخاب دسته‌ها",
        mediaLocalPath: "مسیر دایرکتوری", mediaNote: "نکته: از سرور محلی استفاده کنید.",
        mediaFrequency: "فرکانس چرخش", mediaInterval: "تغییر تصویر هر",
        appearanceCustomize: "رنگ‌های سفارشی", appearanceDark: "رنگ‌های حالت تاریک", appearanceLight: "رنگ‌های حالت روشن",
        appearancePrimary: "اصلی", appearanceBackground: "پس‌زمینه", appearanceSurface: "سطح",
        imgSourceCategory: "دسته", imgSourceLocal: "محلی",
        mediaGallery: "گالری", mediaNoSource: "منبعی انتخاب نشده",
        nationalHolidays: "تعطیلات ملی", activeCalendars: "تقویم‌های فعال", none: "هیچ",
        dark: "تاریک", light: "روشن"
    },
    pl: { // Polish
        tabGeneral: "Ogólne", tabAppearance: "Wygląd", tabMedia: "Multimedia",
        mediaTitle: "Ustawienia mediów", mediaSource: "Typ źródła", mediaCategory: "Kategoria",
        mediaLocal: "Katalog lokalny", mediaMultiSelect: "Wybierz kategorie",
        mediaLocalPath: "Ścieżka katalogu", mediaNote: "Uwaga: Użyj lokalnego serwera.",
        mediaFrequency: "Częstotliwość zmian", mediaInterval: "Zmieniaj obraz co",
        appearanceCustomize: "Kolory niestandardowe", appearanceDark: "Kolory trybu ciemnego", appearanceLight: "Kolory trybu jasnego",
        appearancePrimary: "Podstawowy", appearanceBackground: "Tło", appearanceSurface: "Powierzchnia",
        imgSourceCategory: "Kategoria", imgSourceLocal: "Lokalny",
        mediaGallery: "Galeria", mediaNoSource: "Nie wybrano źródła",
        nationalHolidays: "Święta narodowe", activeCalendars: "Aktywne kalendarze", none: "Brak",
        dark: "Ciemny", light: "Jasny"
    },
    ro: { // Romanian
        tabGeneral: "General", tabAppearance: "Aspect", tabMedia: "Media",
        mediaTitle: "Setări Media", mediaSource: "Tip Sursă", mediaCategory: "Categorie",
        mediaLocal: "Director Local", mediaMultiSelect: "Selectează Categorii",
        mediaLocalPath: "Cale Director", mediaNote: "Notă: Folosiți un server local.",
        mediaFrequency: "Frecvență Rotație", mediaInterval: "Schimbă imaginea la fiecare",
        appearanceCustomize: "Culori Personalizate", appearanceDark: "Culori Mod Întunecat", appearanceLight: "Culori Mod Luminos",
        appearancePrimary: "Primar", appearanceBackground: "Fundal", appearanceSurface: "Suprafață",
        imgSourceCategory: "Categorie", imgSourceLocal: "Local",
        mediaGallery: "Galerie", mediaNoSource: "Nicio sursă selectată",
        nationalHolidays: "Sărbători Naționale", activeCalendars: "Calendare Active", none: "Niciunul",
        dark: "Întunecat", light: "Luminos"
    },
    sr: { // Serbian
        tabGeneral: "Opšte", tabAppearance: "Izgled", tabMedia: "Mediji",
        mediaTitle: "Podešavanja medija", mediaSource: "Tip izvora", mediaCategory: "Kategorija",
        mediaLocal: "Lokalni direktorijum", mediaMultiSelect: "Izaberi kategorije",
        mediaLocalPath: "Putanja", mediaNote: "Napomena: Koristite lokalni server.",
        mediaFrequency: "Učestalost", mediaInterval: "Promeni sliku svakih",
        appearanceCustomize: "Prilagođene boje", appearanceDark: "Tamni režim", appearanceLight: "Svetli režim",
        appearancePrimary: "Primarna", appearanceBackground: "Pozadina", appearanceSurface: "Površina",
        imgSourceCategory: "Kategorija", imgSourceLocal: "Lokalno",
        mediaGallery: "Galerija", mediaNoSource: "Izvor nije izabran",
        nationalHolidays: "Državni praznici", activeCalendars: "Aktivni kalendari", none: "Nijedan",
        dark: "Tamno", light: "Svetlo"
    },
    sk: { // Slovak
        tabGeneral: "Všeobecné", tabAppearance: "Vzhľad", tabMedia: "Médiá",
        mediaTitle: "Nastavenia médií", mediaSource: "Typ zdroja", mediaCategory: "Kategória",
        mediaLocal: "Miestny adresár", mediaMultiSelect: "Vybrať kategórie",
        mediaLocalPath: "Cesta k adresáru", mediaNote: "Poznámka: Použite lokálny server.",
        mediaFrequency: "Frekvencia rotácie", mediaInterval: "Zmeniť obrázok každých",
        appearanceCustomize: "Vlastné farby", appearanceDark: "Farby tmavého režimu", appearanceLight: "Farby svetlého režimu",
        appearancePrimary: "Primárna", appearanceBackground: "Pozadie", appearanceSurface: "Povrch",
        imgSourceCategory: "Kategória", imgSourceLocal: "Miestny",
        mediaGallery: "Galéria", mediaNoSource: "Nebol vybraný zdroj",
        nationalHolidays: "Štátne sviatky", activeCalendars: "Aktívne kalendáre", none: "Žiadny",
        dark: "Tmavý", light: "Svetlý"
    },
    sl: { // Slovenian
        tabGeneral: "Splošno", tabAppearance: "Videz", tabMedia: "Mediji",
        mediaTitle: "Nastavitve medijev", mediaSource: "Vrsta vira", mediaCategory: "Kategorija",
        mediaLocal: "Lokalna mapa", mediaMultiSelect: "Izberi kategorije",
        mediaLocalPath: "Pot do mape", mediaNote: "Opomba: Uporabite lokalni strežnik.",
        mediaFrequency: "Frekvenca menjave", mediaInterval: "Zamenjaj sliko vsakih",
        appearanceCustomize: "Barve po meri", appearanceDark: "Barve temnega načina", appearanceLight: "Barve svetlega načina",
        appearancePrimary: "Primarna", appearanceBackground: "Ozadje", appearanceSurface: "Površina",
        imgSourceCategory: "Kategorija", imgSourceLocal: "Lokalno",
        mediaGallery: "Galerija", mediaNoSource: "Vir ni izbran",
        nationalHolidays: "Državni prazniki", activeCalendars: "Aktivni koledarji", none: "Brez",
        dark: "Temno", light: "Svetlo"
    },
    sw: { // Swahili
        tabGeneral: "Jumla", tabAppearance: "Muonekano", tabMedia: "Media",
        mediaTitle: "Mipangilio ya Media", mediaSource: "Aina ya Chanzo", mediaCategory: "Kategoria",
        mediaLocal: "Saraka ya Ndani", mediaMultiSelect: "Chagua Kategoria",
        mediaLocalPath: "Njia ya Saraka", mediaNote: "Kumbuka: Tumia seva ya ndani.",
        mediaFrequency: "Masafa ya Kuzunguka", mediaInterval: "Badilisha picha kila",
        appearanceCustomize: "Rangi Maalum", appearanceDark: "Rangi za Hali ya Giza", appearanceLight: "Rangi za Hali ya Mwanga",
        appearancePrimary: "Msingi", appearanceBackground: "Mandharinyuma", appearanceSurface: "Uso",
        imgSourceCategory: "Kategoria", imgSourceLocal: "Ndani",
        mediaGallery: "Matunzio", mediaNoSource: "Hakuna chanzo kilichochaguliwa",
        nationalHolidays: "Sikukuu za Kitaifa", activeCalendars: "Kalenda Zinazoendelea", none: "Hakuna",
        dark: "Giza", light: "Mwanga"
    },
    sv: { // Swedish
        tabGeneral: "Allmänt", tabAppearance: "Utseende", tabMedia: "Medier",
        mediaTitle: "Medieinställningar", mediaSource: "Källtyp", mediaCategory: "Kategori",
        mediaLocal: "Lokal katalog", mediaMultiSelect: "Välj kategorier",
        mediaLocalPath: "Katalogsökväg", mediaNote: "Obs: Använd en lokal server.",
        mediaFrequency: "Rotationsfrekvens", mediaInterval: "Byt bild varje",
        appearanceCustomize: "Anpassade färger", appearanceDark: "Färger för mörkt läge", appearanceLight: "Färger för ljust läge",
        appearancePrimary: "Primär", appearanceBackground: "Bakgrund", appearanceSurface: "Yta",
        imgSourceCategory: "Kategori", imgSourceLocal: "Lokal",
        mediaGallery: "Galleri", mediaNoSource: "Ingen källa vald",
        nationalHolidays: "Nationella helgdagar", activeCalendars: "Aktiva kalendrar", none: "Ingen",
        dark: "Mörk", light: "Ljus"
    },
    ta: { // Tamil
        tabGeneral: "பொது", tabAppearance: "தோற்றம்", tabMedia: "ஊடகம்",
        mediaTitle: "ஊடக அமைப்புகள்", mediaSource: "மூல வகை", mediaCategory: "வகை",
        mediaLocal: "உள்ளூர் அடைவு", mediaMultiSelect: "வகைகளைத் தேர்ந்தெடுக்கவும்",
        mediaLocalPath: "அடைவு பாதை", mediaNote: "குறிப்பு: லோக்கல் ஹோஸ்டைப் பயன்படுத்தவும்.",
        mediaFrequency: "சுழற்சி அதிர்வெண்", mediaInterval: "படத்தை மாற்றவும் ஒவ்வொரு",
        appearanceCustomize: "தனிப்பயன் வண்ணங்கள்", appearanceDark: "இருண்ட பயன்முறை வண்ணங்கள்", appearanceLight: "ஒளி பயன்முறை வண்ணங்கள்",
        appearancePrimary: "முதன்மை", appearanceBackground: "பின்னணி", appearanceSurface: "மேற்பரப்பு",
        imgSourceCategory: "வகை", imgSourceLocal: "உள்ளூர்",
        mediaGallery: "கேலரி", mediaNoSource: "மூலம் தேர்ந்தெடுக்கப்படவில்லை",
        nationalHolidays: "தேசிய விடுமுறைகள்", activeCalendars: "செயலில் உள்ள காலெண்டர்கள்", none: "ஏதுமில்லை",
        dark: "இருண்ட", light: "வெளிச்சம்"
    },
    te: { // Telugu
        tabGeneral: "సాధారణ", tabAppearance: "స్వరూపం", tabMedia: "మీడియా",
        mediaTitle: "మీడియా సెట్టింగ్‌లు", mediaSource: "మూల రకం", mediaCategory: "వర్గం",
        mediaLocal: "స్థానిక డైరెక్టరీ", mediaMultiSelect: "వర్గాలను ఎంచుకోండి",
        mediaLocalPath: "డైరెక్టరీ మార్గం", mediaNote: "గమనిక: లోకల్ హోస్ట్ ఉపయోగించండి.",
        mediaFrequency: "భ్రమణ ఫ్రీక్వెన్సీ", mediaInterval: "ప్రతిసారీ చిత్రాన్ని మార్చండి",
        appearanceCustomize: "అనుకూల రంగులు", appearanceDark: "డार्क మోడ్ రంగులు", appearanceLight: "లైట్ మోడ్ రంగులు",
        appearancePrimary: "ప్రాథమిక", appearanceBackground: "నేపథ్యం", appearanceSurface: "ఉపరితలం",
        imgSourceCategory: "వర్గం", imgSourceLocal: "స్థానిక",
        mediaGallery: "గ్యాలరీ", mediaNoSource: "ఏ మూలం ఎంపిక కాలేదు",
        nationalHolidays: "జాతీయ సెలవులు", activeCalendars: "యాక్టివ్ క్యాలెండర్లు", none: "ఏదీ లేదు",
        dark: "ముదురు", light: "వెలుతురు"
    },
    th: { // Thai
        tabGeneral: "ทั่วไป", tabAppearance: "รูปลักษณ์", tabMedia: "สื่อ",
        mediaTitle: "การตั้งค่าสื่อ", mediaSource: "ประเภทแหล่งที่มา", mediaCategory: "หมวดหมู่",
        mediaLocal: "ไดเรกทอรีท้องถิ่น", mediaMultiSelect: "เลือกหมวดหมู่",
        mediaLocalPath: "เส้นทางไดเรกทอรี", mediaNote: "หมายเหตุ: ใช้เซิร์ฟเวอร์ภายใน",
        mediaFrequency: "ความถี่ในการหมุนเวียน", mediaInterval: "เปลี่ยนรูปทุก",
        appearanceCustomize: "สีที่กำหนดเอง", appearanceDark: "สีโหมดมืด", appearanceLight: "สีโหมดสว่าง",
        appearancePrimary: "สีหลัก", appearanceBackground: "พื้นหลัง", appearanceSurface: "พื้นผิว",
        imgSourceCategory: "หมวดหมู่", imgSourceLocal: "ท้องถิ่น",
        mediaGallery: "แกลเลอรี", mediaNoSource: "ไม่ได้เลือกแหล่งที่มา",
        nationalHolidays: "วันหยุดประจำชาติ", activeCalendars: "ปฏิทินที่ใช้งาน", none: "ไม่มี",
        dark: "มืด", light: "สว่าง"
    },
    uk: { // Ukrainian
        tabGeneral: "Загальні", tabAppearance: "Вигляд", tabMedia: "Медіа",
        mediaTitle: "Налаштування медіа", mediaSource: "Тип джерела", mediaCategory: "Категорія",
        mediaLocal: "Локальна тека", mediaMultiSelect: "Вибрати категорії",
        mediaLocalPath: "Шлях до теки", mediaNote: "Примітка: Використовуйте локальний сервер.",
        mediaFrequency: "Частота зміни", mediaInterval: "Змінювати зображення кожні",
        appearanceCustomize: "Власні кольори", appearanceDark: "Кольори темної теми", appearanceLight: "Кольори світлої теми",
        appearancePrimary: "Основний", appearanceBackground: "Фон", appearanceSurface: "Поверхня",
        imgSourceCategory: "Категорія", imgSourceLocal: "Локальний",
        mediaGallery: "Галерея", mediaNoSource: "Джерело не вибрано",
        nationalHolidays: "Національні свята", activeCalendars: "Активні календари", none: "Немає",
        dark: "Темна", light: "Світла"
    },
    ur: { // Urdu
        tabGeneral: "عام", tabAppearance: "ظاہری شکل", tabMedia: "میڈیا",
        mediaTitle: "میڈیا کی ترتیبات", mediaSource: "ماخذ کی قسم", mediaCategory: "زمرہ",
        mediaLocal: "مقام", mediaMultiSelect: "زمرہ جات منتخب کریں",
        mediaLocalPath: "ڈائریکٹری کا راستہ", mediaNote: "نوٹ: لوکل ہوسٹ استعمال کریں۔",
        mediaFrequency: "تعدد", mediaInterval: "ہر وقت تصویر تبدیل کریں",
        appearanceCustomize: "اپنی مرضی کے رنگ", appearanceDark: "ڈارک موڈ رنگ", appearanceLight: "لائٹ موڈ رنگ",
        appearancePrimary: "بنیادی", appearanceBackground: "پس منظر", appearanceSurface: "سطح",
        imgSourceCategory: "زمرہ", imgSourceLocal: "مقام",
        mediaGallery: "گیلری", mediaNoSource: "کوئی ذریعہ منتخب نہیں کیا گیا",
        nationalHolidays: "قومی تعطیلات", activeCalendars: "فعال کیلنڈر", none: "کوئی نہیں",
        dark: "تاریک", light: "روشن"
    },
    vi: { // Vietnamese
        tabGeneral: "Chung", tabAppearance: "Giao diện", tabMedia: "Phương tiện",
        mediaTitle: "Cài đặt phương tiện", mediaSource: "Loại nguồn", mediaCategory: "Danh mục",
        mediaLocal: "Thư mục cục bộ", mediaMultiSelect: "Chọn danh mục",
        mediaLocalPath: "Đường dẫn thư mục", mediaNote: "Lưu ý: Sử dụng máy chủ cục bộ.",
        mediaFrequency: "Tần suất xoay", mediaInterval: "Đổi hình ảnh mỗi",
        appearanceCustomize: "Màu tùy chỉnh", appearanceDark: "Màu chế độ tối", appearanceLight: "Màu chế độ sáng",
        appearancePrimary: "Chính", appearanceBackground: "Nền", appearanceSurface: "Bề mặt",
        imgSourceCategory: "Danh mục", imgSourceLocal: "Cục bộ",
        mediaGallery: "Thư viện", mediaNoSource: "Chưa chọn nguồn",
        nationalHolidays: "Ngày lễ quốc gia", activeCalendars: "Lịch hoạt động", none: "Không",
        dark: "Tối", light: "Sáng"
    }
};

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.split('\n');
    let outputLines = [];
    let currentLang = null;
    let insideLanguageBlock = false;

    // Helper to get leading spaces
    const getIndent = (line) => line.match(/^\s*/)[0];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmed = line.trim();

        // Detect start of language block: "    code: {"
        const langMatch = line.match(/^\s+([a-z]{2,3}(?:-[A-Z]{2})?):\s*\{/);

        if (langMatch) {
            currentLang = langMatch[1];
            insideLanguageBlock = true;
            outputLines.push(line);

            // Read until end of block
            let blockLines = [];
            i++;
            while (i < lines.length) {
                let innerLine = lines[i];
                if (innerLine.trim().startsWith('},')) {
                    // Start of block close

                    // Determine which keys to add or replace
                    let keysToAdd = {};

                    if (allTranslations[currentLang]) {
                        keysToAdd = { ...allTranslations[currentLang] };
                    }

                    // Deduplicate and Remove lines that we are about to replace
                    let uniqueBlockLines = [];
                    let seenInBlock = new Set();

                    for (let bl of blockLines) {
                        const match = bl.match(/^\s+([a-zA-Z0-9_]+):/);
                        let keepLine = true;

                        if (match) {
                            const key = match[1];
                            // If we have a new translation for this key, DO NOT keep the old line
                            if (keysToAdd.hasOwnProperty(key)) {
                                keepLine = false;
                            }
                            // Also deduplicate existing
                            if (seenInBlock.has(key)) {
                                keepLine = false;
                            }
                            seenInBlock.add(key);
                        }

                        if (keepLine) {
                            uniqueBlockLines.push(bl);
                        }
                    }

                    // Add preserved block lines to output
                    uniqueBlockLines.forEach(l => outputLines.push(l));

                    // Now append ALL keys from our dictionary
                    if (Object.keys(keysToAdd).length > 0) {
                        // Ensure trailing comma on last line
                        if (outputLines.length > 0) {
                            let last = outputLines[outputLines.length - 1];
                            if (!last.trim().endsWith(',') && !last.trim().endsWith('{')) {
                                outputLines[outputLines.length - 1] = last + ',';
                            }
                        }

                        Object.entries(keysToAdd).forEach(([k, v]) => {
                            outputLines.push(`        ${k}: '${v}',`);
                        });
                    }

                    outputLines.push(innerLine); // The closing brace
                    insideLanguageBlock = false;
                    currentLang = null;
                    break;
                } else {
                    blockLines.push(innerLine);
                }
                i++;
            }
        } else {
            outputLines.push(line);
        }
    }

    fs.writeFile(filePath, outputLines.join('\n'), 'utf8', (err) => {
        if (err) console.error(err);
        else console.log('Translations updated and deduplicated successfully.');
    });
});
