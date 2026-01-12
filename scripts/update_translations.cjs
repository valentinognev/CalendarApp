const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/translations.ts');

const newKeys = {
    en: {
        tabGeneral: "General", tabAppearance: "Appearance", tabMedia: "Media",
        mediaTitle: "Media Settings", mediaSource: "Source Type", mediaCategory: "Category",
        mediaLocal: "Local Directory", mediaMultiSelect: "Select Categories (Multi-select)",
        mediaLocalPath: "Local Directory Path", mediaNote: "Note: For browser availability, use a localhost server.",
        mediaFrequency: "Rotation Frequency", mediaInterval: "Change Image Every",
        appearanceCustomize: "Custom Theme Colors", appearanceDark: "Dark Mode Colors", appearanceLight: "Light Mode Colors",
        appearancePrimary: "Primary Color", appearanceBackground: "Background", appearanceSurface: "Surface",
        imgSourceCategory: "Category", imgSourceLocal: "Local Directory",
        mediaGallery: "Gallery", mediaNoSource: "No image source selected",
        nationalHolidays: "National Holidays / Pays", activeCalendars: "Active Calendars", none: "None"
    },
    zh: {
        tabGeneral: "常规", tabAppearance: "外观", tabMedia: "媒体",
        mediaTitle: "媒体设置", mediaSource: "来源类型", mediaCategory: "类别",
        mediaLocal: "本地目录", mediaMultiSelect: "选择类别（多选）",
        mediaLocalPath: "本地目录路径", mediaNote: "注意：为了浏览器可用性，请使用本地服务器。",
        mediaFrequency: "旋转频率", mediaInterval: "每隔多久更换图片",
        appearanceCustomize: "自定义主题颜色", appearanceDark: "深色模式颜色", appearanceLight: "浅色模式颜色",
        appearancePrimary: "主色", appearanceBackground: "背景色", appearanceSurface: "表面色",
        imgSourceCategory: "类别", imgSourceLocal: "本地目录",
        mediaGallery: "画廊", mediaNoSource: "未选择图片来源",
        nationalHolidays: "国家法定节假日", activeCalendars: "活动日历", none: "无"
    },
    ru: {
        tabGeneral: "Общие", tabAppearance: "Внешний вид", tabMedia: "Медиа",
        mediaTitle: "Настройки медиа", mediaSource: "Тип источника", mediaCategory: "Категория",
        mediaLocal: "Локальный каталог", mediaMultiSelect: "Выберите категории (мультивыбор)",
        mediaLocalPath: "Путь к каталогу", mediaNote: "Прим.: Для доступа браузера используйте локальный сервер.",
        mediaFrequency: "Частота смены", mediaInterval: "Менять изображение каждые",
        appearanceCustomize: "Цвета темы", appearanceDark: "Цвета тёмной темы", appearanceLight: "Цвета светлой темы",
        appearancePrimary: "Основной", appearanceBackground: "Фон", appearanceSurface: "Поверхность",
        imgSourceCategory: "Категория", imgSourceLocal: "Локальный",
        mediaGallery: "Галерея", mediaNoSource: "Источник не выбран",
        nationalHolidays: "Национальные праздники", activeCalendars: "Активные календари", none: "Нет"
    },
    he: {
        tabGeneral: "כללי", tabAppearance: "מראה", tabMedia: "מדיה",
        mediaTitle: "הגדרות מדיה", mediaSource: "סוג מקור", mediaCategory: "קטגוריה",
        mediaLocal: "תיקייה מקומית", mediaMultiSelect: "בחר קטגוריות",
        mediaLocalPath: "נתיב לתיקייה", mediaNote: "הערה: לזמינות בדפדפן, השתמש בשרת מקומי.",
        mediaFrequency: "תדירות החלפה", mediaInterval: "החלף תמונה כל",
        appearanceCustomize: "צבעי נושא מותאמים", appearanceDark: "צבעי מצב כהה", appearanceLight: "צבעי מצב בהיר",
        appearancePrimary: "צבע ראשי", appearanceBackground: "רקע", appearanceSurface: "משטח",
        imgSourceCategory: "קטגוריה", imgSourceLocal: "תיקייה מקומית",
        mediaGallery: "גלריה", mediaNoSource: "לא נבחר מקור תמונה",
        nationalHolidays: "חגים לאומיים", activeCalendars: "לוחות שנה פעילים", none: "ללא"
    },
    ar: {
        tabGeneral: "عام", tabAppearance: "المظهر", tabMedia: "وسائل الإعلام",
        mediaTitle: "إعدادات الوسائط", mediaSource: "نوع المصدر", mediaCategory: "الفئة",
        mediaLocal: "دليل محلي", mediaMultiSelect: "اختر الفئات",
        mediaLocalPath: "مسار الدليل المحلي", mediaNote: "ملاحظة: لتوفر المتصفح، استخدم خادماً محلياً.",
        mediaFrequency: "تكرار التدوير", mediaInterval: "تغيير الصورة كل",
        appearanceCustomize: "ألوان السمات المخصصة", appearanceDark: "ألوان الوضع الداكن", appearanceLight: "ألوان الوضع الفاتح",
        appearancePrimary: "اللون الأساسي", appearanceBackground: "الخلفية", appearanceSurface: "السطح",
        imgSourceCategory: "الفئة", imgSourceLocal: "دليل محلي",
        mediaGallery: "معرض", mediaNoSource: "لم يتم تحديد مصدر",
        nationalHolidays: "الأعياد الوطنية", activeCalendars: "التقويمات النشطة", none: "لا شيء"
    },
    es: {
        tabGeneral: "General", tabAppearance: "Apariencia", tabMedia: "Multimedia",
        mediaTitle: "Configuración Multimedia", mediaSource: "Tipo de Fuente", mediaCategory: "Categoría",
        mediaLocal: "Directorio Local", mediaMultiSelect: "Seleccionar Categorías",
        mediaLocalPath: "Ruta del Directorio", mediaNote: "Nota: Use un servidor local para acceso.",
        mediaFrequency: "Frecuencia de Rotación", mediaInterval: "Cambiar imagen cada",
        appearanceCustomize: "Colores Personalizados", appearanceDark: "Colores Modo Oscuro", appearanceLight: "Colores Modo Claro",
        appearancePrimary: "Principal", appearanceBackground: "Fondo", appearanceSurface: "Superficie",
        imgSourceCategory: "Categoría", imgSourceLocal: "Local",
        mediaGallery: "Galería", mediaNoSource: "Ninguna fuente seleccionada",
        nationalHolidays: "Fiestas Nacionales", activeCalendars: "Calendarios Activos", none: "Ninguno"
    },
    fr: {
        tabGeneral: "Général", tabAppearance: "Apparence", tabMedia: "Médias",
        mediaTitle: "Paramètres Médias", mediaSource: "Type de Source", mediaCategory: "Catégorie",
        mediaLocal: "Répertoire Local", mediaMultiSelect: "Sélectionner Catégories",
        mediaLocalPath: "Chemin du Répertoire", mediaNote: "Note: Utilisez un serveur local.",
        mediaFrequency: "Fréquence de Rotation", mediaInterval: "Changer l\\'image chaque",
        appearanceCustomize: "Couleurs Personnalisées", appearanceDark: "Couleurs Mode Sombre", appearanceLight: "Couleurs Mode Clair",
        appearancePrimary: "Primaire", appearanceBackground: "Arrière-plan", appearanceSurface: "Surface",
        imgSourceCategory: "Catégorie", imgSourceLocal: "Local",
        mediaGallery: "Galerie", mediaNoSource: "Aucune source sélectionnée",
        nationalHolidays: "Jours Fériés", activeCalendars: "Calendriers Actifs", none: "Aucun"
    },
    de: {
        tabGeneral: "Allgemein", tabAppearance: "Aussehen", tabMedia: "Medien",
        mediaTitle: "Medien Einstellungen", mediaSource: "Quelltyp", mediaCategory: "Kategorie",
        mediaLocal: "Lokales Verzeichnis", mediaMultiSelect: "Kategorien wählen",
        mediaLocalPath: "Verzeichnispfad", mediaNote: "Hinweis: Nutzen Sie einen lokalen Server.",
        mediaFrequency: "Wechselfrequenz", mediaInterval: "Bild ändern alle",
        appearanceCustomize: "Benutzerdefinierte Farben", appearanceDark: "Dunkelmodus Farben", appearanceLight: "Hellmodus Farben",
        appearancePrimary: "Primär", appearanceBackground: "Hintergrund", appearanceSurface: "Oberfläche",
        imgSourceCategory: "Kategorie", imgSourceLocal: "Lokal",
        mediaGallery: "Galerie", mediaNoSource: "Keine Quelle ausgewählt",
        nationalHolidays: "Nationale Feiertage", activeCalendars: "Aktive Kalender", none: "Keine"
    },
    it: {
        tabGeneral: "Generale", tabAppearance: "Aspetto", tabMedia: "Media",
        mediaTitle: "Impostazioni Media", mediaSource: "Tipo Sorgente", mediaCategory: "Categoria",
        mediaLocal: "Directory Locale", mediaMultiSelect: "Seleziona Categorie",
        mediaLocalPath: "Percorso Directory", mediaNote: "Nota: Usa un server locale.",
        mediaFrequency: "Frequenza Rotazione", mediaInterval: "Cambia immagine ogni",
        appearanceCustomize: "Colori Personalizzati", appearanceDark: "Colori Modo Scuro", appearanceLight: "Colori Modo Chiaro",
        appearancePrimary: "Primario", appearanceBackground: "Sfondo", appearanceSurface: "Superficie",
        imgSourceCategory: "Categoria", imgSourceLocal: "Locale",
        mediaGallery: "Galleria", mediaNoSource: "Nessuna fonte selezionata",
        nationalHolidays: "Feste Nazionali", activeCalendars: "Calendari Attivi", none: "Nessuno"
    },
    pt: {
        tabGeneral: "Geral", tabAppearance: "Aparência", tabMedia: "Mídia",
        mediaTitle: "Configurações de Mídia", mediaSource: "Tipo de Fonte", mediaCategory: "Categoria",
        mediaLocal: "Diretório Local", mediaMultiSelect: "Selecionar Categorias",
        mediaLocalPath: "Caminho do Diretório", mediaNote: "Nota: Use um servidor local.",
        mediaFrequency: "Frequência de Rotação", mediaInterval: "Mudar imagem a cada",
        appearanceCustomize: "Cores Personalizadas", appearanceDark: "Cores Modo Escuro", appearanceLight: "Cores Modo Claro",
        appearancePrimary: "Primário", appearanceBackground: "Fundo", appearanceSurface: "Superfície",
        imgSourceCategory: "Categoria", imgSourceLocal: "Local",
        mediaGallery: "Galeria", mediaNoSource: "Nenhuma fonte selecionada",
        nationalHolidays: "Feriados Nacionais", activeCalendars: "Calendários Ativos", none: "Nenhum"
    },
    ja: {
        tabGeneral: "一般", tabAppearance: "外観", tabMedia: "メディア",
        mediaTitle: "メディア設定", mediaSource: "ソースタイプ", mediaCategory: "カテゴリー",
        mediaLocal: "ローカルディレクトリ", mediaMultiSelect: "カテゴリー選択（複数可）",
        mediaLocalPath: "ディレクトリパス", mediaNote: "注：ローカルサーバーを使用してください。",
        mediaFrequency: "回転頻度", mediaInterval: "画像の切り替え間隔",
        appearanceCustomize: "カスタムテーマカラー", appearanceDark: "ダークモードカラー", appearanceLight: "ライトモードカラー",
        appearancePrimary: "プライマリ", appearanceBackground: "背景", appearanceSurface: "表面",
        imgSourceCategory: "カテゴリー", imgSourceLocal: "ローカル",
        mediaGallery: "ギャラリー", mediaNoSource: "ソースが選択されていません",
        nationalHolidays: "国民の祝日", activeCalendars: "アクティブなカレンダー", none: "なし"
    },
    ko: {
        tabGeneral: "일반", tabAppearance: "모양", tabMedia: "미디어",
        mediaTitle: "미디어 설정", mediaSource: "소스 유형", mediaCategory: "카테고리",
        mediaLocal: "로컬 디렉토리", mediaMultiSelect: "카테고리 선택 (다중)",
        mediaLocalPath: "디렉토리 경로", mediaNote: "참고: 로컬 서버를 사용하세요.",
        mediaFrequency: "회전 빈도", mediaInterval: "이미지 변경 간격",
        appearanceCustomize: "사용자 지정 테마 색상", appearanceDark: "다크 모드 색상", appearanceLight: "라이트 모드 색상",
        appearancePrimary: "기본", appearanceBackground: "배경", appearanceSurface: "표면",
        imgSourceCategory: "카테고리", imgSourceLocal: "로컬",
        mediaGallery: "갤러리", mediaNoSource: "소스가 선택되지 않았습니다",
        nationalHolidays: "국경일", activeCalendars: "활성 달력", none: "없음"
    },
    tr: {
        tabGeneral: "Genel", tabAppearance: "Görünüm", tabMedia: "Medya",
        mediaTitle: "Medya Ayarları", mediaSource: "Kaynak Türü", mediaCategory: "Kategori",
        mediaLocal: "Yerel Dizin", mediaMultiSelect: "Kategorileri Seç",
        mediaLocalPath: "Dizin Yolu", mediaNote: "Not: Yerel sunucu kullanın.",
        mediaFrequency: "Değişim Sıklığı", mediaInterval: "Görüntüyü her şu kadar sürede değiştir",
        appearanceCustomize: "Özel Tema Renkleri", appearanceDark: "Koyu Mod Renkleri", appearanceLight: "Açık Mod Renkleri",
        appearancePrimary: "Birincil", appearanceBackground: "Arka Plan", appearanceSurface: "Yüzey",
        imgSourceCategory: "Kategori", imgSourceLocal: "Yerel",
        mediaGallery: "Galeri", mediaNoSource: "Kaynak seçilmedi",
        nationalHolidays: "Ulusal Bayramlar", activeCalendars: "Aktif Takvimler", none: "Hiçbiri"
    },
    nl: {
        tabGeneral: "Algemeen", tabAppearance: "Uiterlijk", tabMedia: "Media",
        mediaTitle: "Media-instellingen", mediaSource: "Brontype", mediaCategory: "Categorie",
        mediaLocal: "Lokale map", mediaMultiSelect: "Selecteer categorieën",
        mediaLocalPath: "Mappad", mediaNote: "Opmerking: Gebruik een lokale server.",
        mediaFrequency: "Rotatiefrequentie", mediaInterval: "Wijzig afbeelding elke",
        appearanceCustomize: "Aangepaste temakleuren", appearanceDark: "Kleuren donkere modus", appearanceLight: "Kleuren lichte modus",
        appearancePrimary: "Primair", appearanceBackground: "Achtergrond", appearanceSurface: "Oppervlak",
        imgSourceCategory: "Categorie", imgSourceLocal: "Lokal",
        mediaGallery: "Galerij", mediaNoSource: "Geen bron geselecteerd",
        nationalHolidays: "Nationale Feestdagen", activeCalendars: "Actieve Kalenders", none: "Geen"
    }
};

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let updatedData = data;
    const lines = data.split('\n');
    let outputLines = [];

    // We will assume standard indentation of 4 spaces
    const indent = "        ";

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Detect end of a language block
        // Regex looks for "    }," or "    }, " at start of line (assuming standard formatting from file)
        // But the file might be formatted differently.
        // Let's track the current language context.

        let trimmed = line.trim();

        // Primitive parsing: if line looks like "    code: {" or "    code-COUNTRY: {"
        const langMatch = line.match(/^    ([a-z]{2}(?:-[A-Z]{2})?): \{/);

        if (langMatch) {
            outputLines.push(line);

            // We are inside a language block. We need to find the closing brace.
            // But we can't easily jump ahead. 
            // Instead, we will iterate line by line. 
            // When we see the closing brace "    }," we insert our keys BEFORE it.

            // However, we need to know WHICH language we are in to insert the right keys.
            let currentLang = langMatch[1];

            // Read until closing brace
            i++;
            while (i < lines.length) {
                let innerLine = lines[i];
                if (innerLine.trim().startsWith('},')) {
                    // Found closing brace. Insert new keys here.
                    const keysToAdd = newKeys[currentLang] || newKeys['en'];

                    // Add comma to previous line if missing (it shouldn't be if it's valid JS object, but trailing comma might be missing)
                    if (outputLines.length > 0) {
                        let prevLine = outputLines[outputLines.length - 1];
                        if (!prevLine.trim().endsWith(',') && !prevLine.trim().endsWith('{')) {
                            outputLines[outputLines.length - 1] = prevLine + ',';
                        }
                    }

                    Object.entries(keysToAdd).forEach(([key, value]) => {
                        // Check if key already exists to avoid duplicates
                        // Simple check: iterate previous lines in this block? 
                        // Too expensive. Let's assume they don't exist as this is a new feature.
                        // Or better, we can check if the key is present in the chunk we just read? 
                        // No, we haven't read the chunk, we are processing line by line.
                        // We will blindly append. The user asked to translate "new interface parts".
                        outputLines.push(`${indent}${key}: '${value}',`);
                    });

                    outputLines.push(innerLine);
                    break;
                } else {
                    outputLines.push(innerLine);
                }
                i++;
            }
        } else {
            outputLines.push(line);
        }
    }

    fs.writeFile(filePath, outputLines.join('\n'), 'utf8', (err) => {
        if (err) console.error(err);
        else console.log('Translations updated successfully.');
    });
});
