import { createContext, useContext, useState, useEffect } from 'react';

// Translation dictionary
const translations = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    rtl: false,
    translations: {
      // App Navigation
      'app.title': 'Synesthetica',
      'app.subtitle': 'Color to Sound Synesthesia',
      'app.backToCanvas': 'Back to Canvas',
      'app.freeAccount': 'Free Account',
      'app.proAccount': 'Pro Account',
      
      // Sidebar
      'sidebar.palettes': 'Palettes',
      'sidebar.brushes': 'Brushes',
      'sidebar.instruments': 'Instruments',
      'sidebar.tools': 'Tools & Actions',
      'sidebar.soundEnvelope': 'Sound Envelope',
      'sidebar.sonificationMode': 'Sonification Mode',
      
      // Sonification Modes
      'mode.timeline': 'Timeline Mode',
      'mode.colorfield': 'Color Harmony Mode',
      'mode.timelineDesc': 'Position → Time progression',
      'mode.colorfieldDesc': 'Pure color texture, no position dependency',
      
      // Brushes
      'brush.round': 'Round',
      'brush.square': 'Square',
      'brush.spray': 'Spray',
      'brush.star': 'Star',
      'brush.cross': 'Cross',
      'brush.triangle': 'Triangle',
      'brush.sawtooth': 'Sawtooth',
      
      // Instruments
      'instrument.pureSine': 'Pure Sine',
      'instrument.triangle': 'Triangle',
      'instrument.sawtooth': 'Sawtooth',
      'instrument.square': 'Square',
      'instrument.piano': 'Piano',
      'instrument.guitar': 'Guitar',
      'instrument.strings': 'Strings',
      'instrument.bell': 'Bell',
      
      // ADSR
      'adsr.attack': 'Attack',
      'adsr.decay': 'Decay',
      'adsr.sustain': 'Sustain',
      'adsr.release': 'Release',
      'adsr.envelopeShape': 'Envelope Shape',
      
      // Tools
      'tools.history': 'History',
      'tools.undo': 'Undo',
      'tools.redo': 'Redo',
      'tools.clearCanvas': 'Clear Canvas',
      'tools.audio': 'Audio',
      'tools.volume': 'Volume',
      'tools.file': 'File',
      'tools.saveDrawing': 'Save Drawing',
      'tools.uploadImage': 'Upload Image',
      'tools.sonifyImage': 'Sonify Image',
      'tools.exportAudio': 'Export Audio',
      'tools.quickActions': 'Quick Actions',
      'tools.reset': 'Reset',
      'tools.export': 'Export',
      
      // Upload
      'upload.title': 'Upload & Sonify Image',
      'upload.subtitle': 'Transform any image into sound using advanced color-to-frequency mapping',
      'upload.dragDrop': 'Drop your image here',
      'upload.orClick': 'or click to browse',
      'upload.fileTypes': 'JPG, PNG, WEBP • Max 8MB',
      'upload.chooseFile': 'Choose File',
      'upload.quickPreview': 'Quick Preview',
      'upload.generateFullAudio': 'Generate Full Audio',
      'upload.generatedAudio': 'Generated Audio',
      'upload.downloadWav': 'Download WAV',
      'upload.downloadMidi': 'Download MIDI',
      'upload.duration': 'Duration',
      'upload.mode': 'Mode',
      
      // Messages
      'msg.imageUploaded': 'Image uploaded successfully!',
      'msg.generatingPreview': 'Generating quick preview...',
      'msg.sendingToServer': 'Sending image to server for high-quality generation...',
      'msg.audioGenerated': 'High-quality audio generated successfully!',
      'msg.switchedToColorHarmony': 'Switched to Color Harmony – now hearing pure color texture!',
      'msg.switchedToTimeline': 'Switched to Timeline – now hearing position-based melody!',
      
      // Errors
      'error.invalidFileType': 'Please upload an image file (JPG, PNG, or WEBP)',
      'error.fileTooLarge': 'Image size must be less than 8MB',
      'error.serverError': 'Failed to generate audio. Please try again.',
      'error.previewFailed': 'Failed to generate preview',
      
      // Pro Features
      'pro.upgradeRequired': 'Pro Feature',
      'pro.upgradeToPro': 'Upgrade to Pro',
      'pro.currentPlan': 'Current Plan',
      'pro.getStarted': 'Get Started',
      'pro.dailyLimit': 'Daily submissions limit reached',
      'pro.unlimitedSubmissions': 'Unlimited submissions',
      'pro.allBrushes': 'All brushes including Pro types',
      'pro.highFidelityAudio': 'High-fidelity WAV downloads',
      'pro.midiExport': 'MIDI export',
      'pro.cloudStorage': '1GB Cloud Gallery',
    }
  },
  
  az: {
    name: 'Azərbaycanca',
    flag: '🇦🇿',
    rtl: false,
    translations: {
      // App Navigation
      'app.title': 'Sineşteziya',
      'app.subtitle': 'Rəngdən Səsə Sinesteziyası',
      'app.backToCanvas': 'Kanvasa Geri Dön',
      'app.freeAccount': 'Pulsuz Hesab',
      'app.proAccount': 'Pro Hesab',
      
      // Sidebar
      'sidebar.palettes': 'Palitralar',
      'sidebar.brushes': 'Fırçalar',
      'sidebar.instruments': 'Alətlər',
      'sidebar.tools': 'Alətlər və Əməliyyatlar',
      'sidebar.soundEnvelope': 'Səs Mərhələsi',
      'sidebar.sonificationMode': 'Səsləndirmə Rejimi',
      
      // Sonification Modes
      'mode.timeline': 'Xəttə Rejimi',
      'mode.colorfield': 'Rəng Harmoniyası Rejimi',
      'mode.timelineDesc': 'Mövqe → Zaman irələməsi',
      'mode.colorfieldDesc': 'Saf rəng teksturası, mövqe asılılığı yoxdur',
      
      // Brushes
      'brush.round': 'Dairəvi',
      'brush.square': 'Kvadrat',
      'brush.spray': 'Sprey',
      'brush.star': 'Ulduz',
      'brush.cross': 'Xaç',
      'brush.triangle': 'Üçbucaq',
      'brush.sawtooth': 'Mişar diş',
      
      // Instruments
      'instrument.pureSine': 'Saf Sinus',
      'instrument.triangle': 'Üçbucaq',
      'instrument.sawtooth': 'Mişar diş',
      'instrument.square': 'Kvadrat',
      'instrument.piano': 'Piano',
      'instrument.guitar': 'Gitara',
      'instrument.strings': 'Simlilər',
      'instrument.bell': 'Zəng',
      
      // ADSR
      'adsr.attack': 'Hücum',
      'adsr.decay': 'Çöküş',
      'adsr.sustain': 'Saxlama',
      'adsr.release': 'Buraxılma',
      'adsr.envelopeShape': 'Mərhələ Şəkli',
      
      // Tools
      'tools.history': 'Tarixçə',
      'tools.undo': 'Geri Al',
      'tools.redo': 'İrəli Al',
      'tools.clearCanvas': 'Kanvası Təmizlə',
      'tools.audio': 'Səs',
      'tools.volume': 'Səs Səviyyəsi',
      'tools.file': 'Fayl',
      'tools.saveDrawing': 'Rəsmi Yadda Saxla',
      'tools.uploadImage': 'Şəkil Yüklə',
      'tools.sonifyImage': 'Şəkli Səsləndir',
      'tools.exportAudio': 'Səsi İxrac Et',
      'tools.quickActions': 'Sürətli Əməliyyatlar',
      'tools.reset': 'Sıfırla',
      'tools.export': 'İxrac Et',
      
      // Upload
      'upload.title': 'Şəkil Yüklə və Səsləndir',
      'upload.subtitle': 'İstənilən şəkli rəngdən tezliyə çevirmək üçün qabaqcıl rəngdən-tezliyə xəritələmədən istifadə edin',
      'upload.dragDrop': 'Şəklinizi buraya atın',
      'upload.orClick': 'və ya fayl seçin',
      'upload.fileTypes': 'JPG, PNG, WEBP • Maks 8MB',
      'upload.chooseFile': 'Fayl Seç',
      'upload.quickPreview': 'Sürətli Baxış',
      'upload.generateFullAudio': 'Tam Səs Yarat',
      'upload.generatedAudio': 'Yaradılmış Səs',
      'upload.downloadWav': 'WAV Yüklə',
      'upload.downloadMidi': 'MIDI Yüklə',
      'upload.duration': 'Müddət',
      'upload.mode': 'Rejim',
      
      // Messages
      'msg.imageUploaded': 'Şəkil uğurla yükləndi!',
      'msg.generatingPreview': 'Sürətli baxış yaradılır...',
      'msg.sendingToServer': 'Yüksək keyfiyyətli generasiya üçün şəkil serverə göndərilir...',
      'msg.audioGenerated': 'Yüksək keyfiyyətli səs uğurla yaradıldı!',
      'msg.switchedToColorHarmony': 'Rəng Harmoniyasına keçildi - indi saf rəng teksturası eşidilir!',
      'msg.switchedToTimeline': 'Xəttə rejiminə keçildi - indi mövqe əsaslı melodiyə eşidilir!',
      
      // Errors
      'error.invalidFileType': 'Zəhmət olmasa şəkil faylı yükləyin (JPG, PNG, və ya WEBP)',
      'error.fileTooLarge': 'Şəkil ölçüsü 8MB-dən az olmalıdır',
      'error.serverError': 'Səs yaradıla bilmədi. Zəhmət olmasa yenidən cəhd edin.',
      'error.previewFailed': 'Baxış yaradıla bilmədi',
      
      // Pro Features
      'pro.upgradeRequired': 'Pro Xüsusiyyəti',
      'pro.upgradeToPro': 'Pro-ya Yüksəlt',
      'pro.currentPlan': 'Cari Plan',
      'pro.getStarted': 'Başla',
      'pro.dailyLimit': 'Günlük təqdimat limitinə çatdı',
      'pro.unlimitedSubmissions': 'Məhdudiyyətsiz təqdimatlar',
      'pro.allBrushes': 'Bütün fırçalar o cümlədən Pro tipləri',
      'pro.highFidelityAudio': 'Yüksək keyfiyyətli WAV yükləmələri',
      'pro.midiExport': 'MIDI ixracı',
      'pro.cloudStorage': '1GB Bulud Qalereyası',
    }
  },
  
  ru: {
    name: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    translations: {
      // App Navigation
      'app.title': 'Синестезия',
      'app.subtitle': 'Синестезия цвета в звук',
      'app.backToCanvas': 'Назад к холсту',
      'app.freeAccount': 'Бесплатный аккаунт',
      'app.proAccount': 'Pro аккаунт',
      
      // Sidebar
      'sidebar.palettes': 'Палитры',
      'sidebar.brushes': 'Кисти',
      'sidebar.instruments': 'Инструменты',
      'sidebar.tools': 'Инструменты и действия',
      'sidebar.soundEnvelope': 'Звуковая огибающая',
      'sidebar.sonificationMode': 'Режим озвучивания',
      
      // Sonification Modes
      'mode.timeline': 'Режим временной шкалы',
      'mode.colorfield': 'Режим цветовой гармонии',
      'mode.timelineDesc': 'Позиция → Временная прогрессия',
      'mode.colorfieldDesc': 'Чистая цветовая текстура, без зависимости от позиции',
      
      // Brushes
      'brush.round': 'Круглая',
      'brush.square': 'Квадратная',
      'brush.spray': 'Распылитель',
      'brush.star': 'Звезда',
      'brush.cross': 'Крест',
      'brush.triangle': 'Треугольник',
      'brush.sawtooth': 'Пилообразная',
      
      // Instruments
      'instrument.pureSine': 'Чистая синусоида',
      'instrument.triangle': 'Треугольник',
      'instrument.sawtooth': 'Пилообразная',
      'instrument.square': 'Квадратная',
      'instrument.piano': 'Пиано',
      'instrument.guitar': 'Гитара',
      'instrument.strings': 'Струнные',
      'instrument.bell': 'Колокол',
      
      // ADSR
      'adsr.attack': 'Атака',
      'adsr.decay': 'Спад',
      'adsr.sustain': 'Сустейн',
      'adsr.release': 'Релиз',
      'adsr.envelopeShape': 'Форма огибающей',
      
      // Tools
      'tools.history': 'История',
      'tools.undo': 'Отменить',
      'tools.redo': 'Повторить',
      'tools.clearCanvas': 'Очистить холст',
      'tools.audio': 'Аудио',
      'tools.volume': 'Громкость',
      'tools.file': 'Файл',
      'tools.saveDrawing': 'Сохранить рисунок',
      'tools.uploadImage': 'Загрузить изображение',
      'tools.sonifyImage': 'Озвучить изображение',
      'tools.exportAudio': 'Экспорт аудио',
      'tools.quickActions': 'Быстрые действия',
      'tools.reset': 'Сбросить',
      'tools.export': 'Экспорт',
      
      // Upload
      'upload.title': 'Загрузить и озвучить изображение',
      'upload.subtitle': 'Преобразуйте любое изображение в звук с помощью расширенного отображения цвета в частоту',
      'upload.dragDrop': 'Перетащите изображение сюда',
      'upload.orClick': 'или нажмите для выбора',
      'upload.fileTypes': 'JPG, PNG, WEBP • Макс 8MB',
      'upload.chooseFile': 'Выбрать файл',
      'upload.quickPreview': 'Быстрый предпросмотр',
      'upload.generateFullAudio': 'Создать полное аудио',
      'upload.generatedAudio': 'Созданное аудио',
      'upload.downloadWav': 'Скачать WAV',
      'upload.downloadMidi': 'Скачать MIDI',
      'upload.duration': 'Длительность',
      'upload.mode': 'Режим',
      
      // Messages
      'msg.imageUploaded': 'Изображение успешно загружено!',
      'msg.generatingPreview': 'Создание быстрого предпросмотра...',
      'msg.sendingToServer': 'Отправка изображения на сервер для создания высококачественного аудио...',
      'msg.audioGenerated': 'Высококачественное аудио успешно создано!',
      'msg.switchedToColorHarmony': 'Переключено на цветовую гармонию - теперь слышна чистая цветовая текстура!',
      'msg.switchedToTimeline': 'Переключено на временную шкалу - теперь слышна мелодия на основе позиции!',
      
      // Errors
      'error.invalidFileType': 'Пожалуйста, загрузите файл изображения (JPG, PNG или WEBP)',
      'error.fileTooLarge': 'Размер изображения должен быть менее 8MB',
      'error.serverError': 'Не удалось создать аудио. Пожалуйста, попробуйте еще раз.',
      'error.previewFailed': 'Не удалось создать предпросмотр',
      
      // Pro Features
      'pro.upgradeRequired': 'Функция Pro',
      'pro.upgradeToPro': 'Обновить до Pro',
      'pro.currentPlan': 'Текущий план',
      'pro.getStarted': 'Начать',
      'pro.dailyLimit': 'Достигнут дневной лимит отправок',
      'pro.unlimitedSubmissions': 'Неограниченные отправки',
      'pro.allBrushes': 'Все кисти включая Pro типы',
      'pro.highFidelityAudio': 'Загрузки WAV высокого качества',
      'pro.midiExport': 'Экспорт MIDI',
      'pro.cloudStorage': '1GB облачное хранилище',
    }
  },
  
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
    translations: {
      // App Navigation
      'app.title': 'Sineştezi',
      'app.subtitle': 'Renkten Sese Sineştezi',
      'app.backToCanvas': 'Tuvale Geri Dön',
      'app.freeAccount': 'Ücretsiz Hesap',
      'app.proAccount': 'Pro Hesap',
      
      // Sidebar
      'sidebar.palettes': 'Paletler',
      'sidebar.brushes': 'Fırçalar',
      'sidebar.instruments': 'Enstrümanlar',
      'sidebar.tools': 'Araçlar ve İşlemler',
      'sidebar.soundEnvelope': 'Ses Zarfı',
      'sidebar.sonificationMode': 'Sese Dönüştürme Modu',
      
      // Sonification Modes
      'mode.timeline': 'Zaman Çizelgesi Modu',
      'mode.colorfield': 'Renk Uyumu Modu',
      'mode.timelineDesc': 'Konum → Zaman ilerlemesi',
      'mode.colorfieldDesc': 'Saf renk dokusu, konum bağımlılığı yok',
      
      // Brushes
      'brush.round': 'Yuvarlak',
      'brush.square': 'Kare',
      'brush.spray': 'Sprey',
      'brush.star': 'Yıldız',
      'brush.cross': 'Çarpı',
      'brush.triangle': 'Üçgen',
      'brush.sawtooth': 'Testere Dişi',
      
      // Instruments
      'instrument.pureSine': ' saf Sinüs',
      'instrument.triangle': 'Üçgen',
      'instrument.sawtooth': 'Testere Dişi',
      'instrument.square': 'Kare',
      'instrument.piano': 'Piyano',
      'instrument.guitar': 'Gitar',
      'instrument.strings': 'Yaylılar',
      'instrument.bell': 'Zil',
      
      // ADSR
      'adsr.attack': 'Atak',
      'adsr.decay': 'Çöküş',
      'adsr.sustain': 'Sürdür',
      'adsr.release': 'Bırakma',
      'adsr.envelopeShape': 'Zarf Şekli',
      
      // Tools
      'tools.history': 'Geçmiş',
      'tools.undo': 'Geri Al',
      'tools.redo': 'İleri Al',
      'tools.clearCanvas': 'Tuvali Temizle',
      'tools.audio': 'Ses',
      'tools.volume': 'Ses Seviyesi',
      'tools.file': 'Dosya',
      'tools.saveDrawing': 'Çizimi Kaydet',
      'tools.uploadImage': 'Görüntü Yükle',
      'tools.sonifyImage': 'Görüntüyü Sese Dönüştür',
      'tools.exportAudio': 'Sesi Dışa Aktar',
      'tools.quickActions': 'Hızlı İşlemler',
      'tools.reset': 'Sıfırla',
      'tools.export': 'Dışa Aktar',
      
      // Upload
      'upload.title': 'Görüntü Yükle ve Sese Dönüştür',
      'upload.subtitle': 'Gelişmiş renkten frekansa eşleme kullanarak herhangi bir görüntüyü sese dönüştürün',
      'upload.dragDrop': 'Görüntünüzü buraya bırakın',
      'upload.orClick': 'veya tıklayarak seçin',
      'upload.fileTypes': 'JPG, PNG, WEBP • Maks 8MB',
      'upload.chooseFile': 'Dosya Seç',
      'upload.quickPreview': 'Hızlı Önizleme',
      'upload.generateFullAudio': 'Tam Ses Oluştur',
      'upload.generatedAudio': 'Oluşturulan Ses',
      'upload.downloadWav': 'WAV İndir',
      'upload.downloadMidi': 'MIDI İndir',
      'upload.duration': 'Süre',
      'upload.mode': 'Mod',
      
      // Messages
      'msg.imageUploaded': 'Görüntü başarıyla yüklendi!',
      'msg.generatingPreview': 'Hızlı önizleme oluşturuluyor...',
      'msg.sendingToServer': 'Yüksek kaliteli ses oluşturmak için görüntü sunucuya gönderiliyor...',
      'msg.audioGenerated': 'Yüksek kaliteli ses başarıyla oluşturuldu!',
      'msg.switchedToColorHarmony': 'Renk Uyumuna geçildi - artık saf renk dokusu duyuluyor!',
      'msg.switchedToTimeline': 'Zaman Çizelgesine geçildi - artık konum tabanlı melodi duyuluyor!',
      
      // Errors
      'error.invalidFileType': 'Lütfen bir görüntü dosyası yükleyin (JPG, PNG veya WEBP)',
      'error.fileTooLarge': 'Görüntü boyutu 8MB\'den az olmalıdır',
      'error.serverError': 'Ses oluşturulamadı. Lütfen tekrar deneyin.',
      'error.previewFailed': 'Önizleme oluşturulamadı',
      
      // Pro Features
      'pro.upgradeRequired': 'Pro Özelliği',
      'pro.upgradeToPro': 'Pro\'ya Yükselt',
      'pro.currentPlan': 'Mevcut Plan',
      'pro.getStarted': 'Başla',
      'pro.dailyLimit': 'Günlük gönderim limitine ulaşıldı',
      'pro.unlimitedSubmissions': 'Sınırsız gönderimler',
      'pro.allBrushes': 'Tüm fırçalar dahil Pro tipleri',
      'pro.highFidelityAudio': 'Yüksek kaliteli WAV indirmeleri',
      'pro.midiExport': 'MIDI dışa aktarımı',
      'pro.cloudStorage': '1GB Bulut Galeri',
    }
  },
  
  ar: {
    name: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    translations: {
      // App Navigation
      'app.title': 'سينستيزيا',
      'app.subtitle': 'سينستيزيا اللون إلى الصوت',
      'app.backToCanvas': 'العودة إلى اللوحة',
      'app.freeAccount': 'حساب مجاني',
      'app.proAccount': 'حساب احترافي',
      
      // Sidebar
      'sidebar.palettes': 'لوحات الألوان',
      'sidebar.brushes': 'الفرش',
      'sidebar.instruments': 'الأدوات',
      'sidebar.tools': 'الأدوات والإجراءات',
      'sidebar.soundEnvelope': 'غلاف الصوت',
      'sidebar.sonificationMode': 'وضع التحويل الصوتي',
      
      // Sonification Modes
      'mode.timeline': 'وضع الخط الزمني',
      'mode.colorfield': 'وضع انسجام الألوان',
      'mode.timelineDesc': 'الموقع → التقدم الزمني',
      'mode.colorfieldDesc': 'نسيج لوني نقي، بدون اعتماد على الموقع',
      
      // Brushes
      'brush.round': 'دائري',
      'brush.square': 'مربع',
      'brush.spray': 'رش',
      'brush.star': 'نجمة',
      'brush.cross': 'صليب',
      'brush.triangle': 'مثلث',
      'brush.sawtooth': 'سن المنشار',
      
      // Instruments
      'instrument.pureSine': 'جيبية نقية',
      'instrument.triangle': 'مثلث',
      'instrument.sawtooth': 'سن المنشار',
      'instrument.square': 'مربع',
      'instrument.piano': 'بيانو',
      'instrument.guitar': 'جيتار',
      'instrument.strings': 'الأوتار',
      'instrument.bell': 'جرس',
      
      // ADSR
      'adsr.attack': 'الهجوم',
      'adsr.decay': 'الانحلال',
      'adsr.sustain': 'الاستمرار',
      'adsr.release': 'الإطلاق',
      'adsr.envelopeShape': 'شكل الغلاف',
      
      // Tools
      'tools.history': 'التاريخ',
      'tools.undo': 'تراجع',
      'tools.redo': 'إعادة',
      'tools.clearCanvas': 'مسح اللوحة',
      'tools.audio': 'الصوت',
      'tools.volume': 'مستوى الصوت',
      'tools.file': 'الملف',
      'tools.saveDrawing': 'حفظ الرسم',
      'tools.uploadImage': 'رفع الصورة',
      'tools.sonifyImage': 'تحويل الصورة إلى صوت',
      'tools.exportAudio': 'تصدير الصوت',
      'tools.quickActions': 'إجراءات سريعة',
      'tools.reset': 'إعادة تعيين',
      'tools.export': 'تصدير',
      
      // Upload
      'upload.title': 'رفع وتحويل الصورة إلى صوت',
      'upload.subtitle': 'حول أي صورة إلى صوت باستخدام تعيين اللون المتقدم إلى التردد',
      'upload.dragDrop': 'اسحب صورتك هنا',
      'upload.orClick': 'أو انقر للاختيار',
      'upload.fileTypes': 'JPG، PNG، WEBP • الحد الأقصى 8 ميجابايت',
      'upload.chooseFile': 'اختر ملف',
      'upload.quickPreview': 'معاينة سريعة',
      'upload.generateFullAudio': 'إنشاء صوت كامل',
      'upload.generatedAudio': 'الصوت الذي تم إنشاؤه',
      'upload.downloadWav': 'تنزيل WAV',
      'upload.downloadMidi': 'تنزيل MIDI',
      'upload.duration': 'المدة',
      'upload.mode': 'الوضع',
      
      // Messages
      'msg.imageUploaded': 'تم تحميل الصورة بنجاح!',
      'msg.generatingPreview': 'إنشاء معاينة سريعة...',
      'msg.sendingToServer': 'إرسال الصورة إلى الخادم لإنشاء صوت عالي الجودة...',
      'msg.audioGenerated': 'تم إنشاء صوت عالي الجودة بنجاح!',
      'msg.switchedToColorHarmony': 'تم التبديل إلى انسجام الألوان - الآن تسمع نسيج اللون النقي!',
      'msg.switchedToTimeline': 'تم التبديل إلى الخط الزمني - الآن تسمع لحنية قائمة على الموقع!',
      
      // Errors
      'error.invalidFileType': 'يرجى تحميل ملف صورة (JPG، PNG أو WEBP)',
      'error.fileTooLarge': 'يجب أن يكون حجم الصورة أقل من 8 ميجابايت',
      'error.serverError': 'فشل في إنشاء الصوت. يرجى المحاولة مرة أخرى.',
      'error.previewFailed': 'فشل في إنشاء المعاينة',
      
      // Pro Features
      'pro.upgradeRequired': 'ميزة احترافية',
      'pro.upgradeToPro': 'ترقية إلى احترافي',
      'pro.currentPlan': 'الخطة الحالية',
      'pro.getStarted': 'ابدأ',
      'pro.dailyLimit': 'تم الوصول إلى الحد اليومي للإرسالات',
      'pro.unlimitedSubmissions': 'إرسالات غير محدودة',
      'pro.allBrushes': 'جميع الفرش بما في ذلك الأنواع الاحترافية',
      'pro.highFidelityAudio': 'تنزيلات WAV عالية الجودة',
      'pro.midiExport': 'تصدير MIDI',
      'pro.cloudStorage': 'معرض سحابي 1 جيجابايت',
    }
  },
  
  zh: {
    name: '中文',
    flag: '🇨🇳',
    rtl: false,
    translations: {
      // App Navigation
      'app.title': '联觉',
      'app.subtitle': '颜色到声音的联觉',
      'app.backToCanvas': '返回画布',
      'app.freeAccount': '免费账户',
      'app.proAccount': '专业账户',
      
      // Sidebar
      'sidebar.palettes': '调色板',
      'sidebar.brushes': '画笔',
      'sidebar.instruments': '乐器',
      'sidebar.tools': '工具和操作',
      'sidebar.soundEnvelope': '声音包络',
      'sidebar.sonificationMode': '声音化模式',
      
      // Sonification Modes
      'mode.timeline': '时间线模式',
      'mode.colorfield': '色彩和谐模式',
      'mode.timelineDesc': '位置 → 时间进程',
      'mode.colorfieldDesc': '纯色彩纹理，无位置依赖',
      
      // Brushes
      'brush.round': '圆形',
      'brush.square': '方形',
      'brush.spray': '喷雾',
      'brush.star': '星形',
      'brush.cross': '十字',
      'brush.triangle': '三角形',
      'brush.sawtooth': '锯齿',
      
      // Instruments
      'instrument.pureSine': '纯正弦',
      'instrument.triangle': '三角',
      'instrument.sawtooth': '锯齿',
      'instrument.square': '方形',
      'instrument.piano': '钢琴',
      'instrument.guitar': '吉他',
      'instrument.strings': '弦乐',
      'instrument.bell': '铃铛',
      
      // ADSR
      'adsr.attack': '起音',
      'adsr.decay': '衰减',
      'adsr.sustain': '持续',
      'adsr.release': '释放',
      'adsr.envelopeShape': '包络形状',
      
      // Tools
      'tools.history': '历史',
      'tools.undo': '撤销',
      'tools.redo': '重做',
      'tools.clearCanvas': '清除画布',
      'tools.audio': '音频',
      'tools.volume': '音量',
      'tools.file': '文件',
      'tools.saveDrawing': '保存绘图',
      'tools.uploadImage': '上传图像',
      'tools.sonifyImage': '声音化图像',
      'tools.exportAudio': '导出音频',
      'tools.quickActions': '快速操作',
      'tools.reset': '重置',
      'tools.export': '导出',
      
      // Upload
      'upload.title': '上传并声音化图像',
      'upload.subtitle': '使用高级颜色到频率映射将任何图像转换为声音',
      'upload.dragDrop': '将图像拖放到此处',
      'upload.orClick': '或点击浏览',
      'upload.fileTypes': 'JPG、PNG、WEBP • 最大8MB',
      'upload.chooseFile': '选择文件',
      'upload.quickPreview': '快速预览',
      'upload.generateFullAudio': '生成完整音频',
      'upload.generatedAudio': '生成的音频',
      'upload.downloadWav': '下载WAV',
      'upload.downloadMidi': '下载MIDI',
      'upload.duration': '持续时间',
      'upload.mode': '模式',
      
      // Messages
      'msg.imageUploaded': '图像上传成功！',
      'msg.generatingPreview': '生成快速预览...',
      'msg.sendingToServer': '将图像发送到服务器进行高质量音频生成...',
      'msg.audioGenerated': '高质量音频生成成功！',
      'msg.switchedToColorHarmony': '切换到色彩和谐 - 现在听到纯色彩纹理！',
      'msg.switchedToTimeline': '切换到时间线 - 现在听到基于位置的旋律！',
      
      // Errors
      'error.invalidFileType': '请上传图像文件（JPG、PNG或WEBP）',
      'error.fileTooLarge': '图像大小必须小于8MB',
      'error.serverError': '无法生成音频。请重试。',
      'error.previewFailed': '无法生成预览',
      
      // Pro Features
      'pro.upgradeRequired': '专业功能',
      'pro.upgradeToPro': '升级到专业版',
      'pro.currentPlan': '当前计划',
      'pro.getStarted': '开始',
      'pro.dailyLimit': '达到每日提交限制',
      'pro.unlimitedSubmissions': '无限提交',
      'pro.allBrushes': '所有画笔包括专业类型',
      'pro.highFidelityAudio': '高保真WAV下载',
      'pro.midiExport': 'MIDI导出',
      'pro.cloudStorage': '1GB云画廊',
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('synesthetica_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('synesthetica_language', language);
  }, [language]);

  // Apply language direction to document
  useEffect(() => {
    const root = document.documentElement;
    const langData = translations[language];
    
    root.setAttribute('dir', langData.rtl ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);
  }, [language]);

  const translate = (key) => {
    const langData = translations[language];
    return langData.translations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    translate,
    currentLanguage: translations[language],
    availableLanguages: Object.entries(translations).map(([key, value]) => ({
      code: key,
      name: value.name,
      flag: value.flag,
      rtl: value.rtl
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
