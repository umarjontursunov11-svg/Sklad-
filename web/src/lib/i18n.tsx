'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'ru' | 'en';

export const translations = {
  uz: {
    // Brand & Header
    brandTitle: 'OmniStock PRO',
    brandSubtitle: 'Omborni avtomatlashtirish',
    scanQrBtn: 'QR Kodni Skanerlash',
    allWarehouses: 'Umumiy (Barcha omborlar)',
    activeRole: 'Joriy Rol',
    switchRole: 'Faol rolni almashtirish',
    lowStockAlerts: 'Kam qolgan tovarlar',
    warningCount: 'ta ogohlantirish',
    noAlerts: 'Barcha tovar qoldiqlari me\'yorda.',
    databaseActive: 'Ma\'lumotlar bazasi faol',
    databaseDesc: 'PostgreSQL & Supabase Realtime atomik tranzaksiyalar bilan tayyor.',

    // Navigation
    navModules: 'Ombor Modullari',
    dashboard: 'Boshqaruv Paneli',
    products: 'Mahsulotlar & QR',
    inventory: 'Omborlar Matritsasi',
    stockInOut: 'Kirim / Chiqim',
    transfers: 'Omborlararo Ko\'chirish',
    reports: 'Hisobotlar & Eksport',
    qrLab: 'Batch QR Print Lab',
    lowBadge: 'Kam qoldi',

    // Dashboard
    heroBadge: 'Avtomatlashtirilgan Ombor Tizimi',
    heroTitle: 'Ombor Operatsiyalari Boshqaruv Markazi',
    heroDesc: 'Veb va mobil ilovalar o\'rtasida real-vaqtda sinxronizatsiya. Mahsulotlar katalogi, QR identifikatsiya, atomik transferlar va qoldiq monitoringi.',
    addProductBtn: 'Mahsulot Qo\'shish',
    stockInOutBtn: 'Kirim / Chiqim',
    kpiCatalog: 'Katalog Mahsulotlari',
    kpiQrTagged: '100% QR kodlangan va chop etiladi',
    kpiTotalOnHand: 'Ombordagi Jami Birlik',
    kpiFacilities: 'ta faol ombor majmuasi bo\'ylab',
    kpiLowStock: 'Kam Qolgan Tovarlar',
    kpiThresholdDesc: 'Xavfsizlik chegarasida yoki undan past',
    kpiLedger: 'Tranzaksiyalar Jurnali',
    kpiLedgerDesc: 'Kirim, chiqim va omborlararo ko\'chirishlar',
    attentionRequired: 'Diqqat Talab: Kam Qolgan Tovarlar',
    restockAdvice: 'Xavfsizlik chegarasini saqlash uchun zaxirani to\'ldiring',
    viewMatrix: 'Matritsani Ko\'rish',
    quickRestock: 'Tezkor Kirim',
    activeDistribution: 'Omborlar Bo\'yicha Taqsimot',
    recentMovements: 'So\'nggi Harakatlar',
    fullLedger: 'To\'liq Jurnal',
    units: 'birlik',

    // Products Page
    productCatalogTitle: 'Mahsulotlar Katalogi & QR Dvigateli',
    productCatalogSubtitle: 'Avtomatik QR generatsiya, yuqori sifatli stikerlar va yagona/ommaviy chop etish.',
    batchPrintBtn: 'Stikerlarni Chop Etish',
    searchPlaceholder: 'Mahsulot nomi, QR kodi bo\'yicha qidirish...',
    allUnits: 'Barcha o\'lchov birliklari',
    selectAll: 'Barchasini tanlash',
    clearSelection: 'Tozalash',
    totalStock: 'Jami Qoldiq',
    safetyMin: 'Xavfsiz Min',
    viewQrPrint: 'QR Kod / Chop etish',
    registerProductTitle: 'Yangi Mahsulotni Ro\'yxatdan O\'tkazish',
    registerProductDesc: 'Noyob QR identifikator avtomatik tarzda yaratiladi va chop etishga tayyor bo\'ladi.',
    productName: 'Mahsulot Nomi *',
    description: 'Tavsif',
    unitField: 'O\'lchov Birligi',
    minStockField: 'Xavfsiz Minimal Qoldiq',
    imageUrlField: 'Rasm URL (ixtiyoriy)',
    initialIntakeTitle: 'Birlamchi Kirim Qoldig\'i',
    intakeWarehouse: 'Qabul Qiluvchi Ombor',
    initialQty: 'Boshlang\'ich Miqdor',
    cancel: 'Bekor qilish',
    saveAndGenerate: 'Saqlash va QR Generatsiya',
    generating: 'QR yaratilmoqda...',

    // Units
    unit_piece: 'dona',
    unit_box: 'quti',
    unit_liter: 'litr',
    unit_kg: 'kg',
    unit_pallet: 'poddon',
    unit_meter: 'metr',

    // QR Modal
    qrModalBadge: 'Mahsulot QR Identifikatori',
    copyCode: 'Kodni Nusxalash',
    copied: 'Nusxalandi',
    downloadPng: 'PNG Yuklab Olish',
    downloadPdfBadge: 'PDF Beydj',
    printLabel: 'Stikerni Chop Etish',
    scanWithScanner: 'Mobil yoki skaner orqali skanerlang',

    // Batch Print Modal
    batchModalTitle: 'Ommaviy QR Stikerlarni Chop Etish',
    batchModalDesc: 'ta mahsulot stikerlar varag\'ini yaratish uchun tanlandi',
    gridLayout: 'Format:',
    columns2: '2 Ustun (Katta A4)',
    columns3: '3 Ustun (Standart A4)',
    thermalOption: 'Termal Printer (Etiketka)',
    a4Option: 'A4 Qog\'oz Varag\'i',
    labelSize: 'Stiker O\'lchami:',
    customSize: 'Boshqa (Maxsus)',
    widthMm: 'Kenglik (mm)',
    heightMm: 'Balandlik (mm)',
    continuousRoll: 'Uzluksiz lenta (Xprinter / Zebra / TSC)',
    browserPrint: 'Brauzer orqali Chop Etish',
    downloadPdfSheet: 'PDF Yuklab Olish',

    // Scanner
    inAppScannerTitle: 'Kamera Orqali QR Skanerlash',
    inAppScannerDesc: 'Kamera orqali QR kodni skanerlang yoki kodni qo\'lda kiriting',
    manualCodeLabel: 'Yoki QR kod identifikatorini qo\'lda kiriting:',
    lookupBtn: 'Qidirish',
    quickPresets: 'Tezkor Test Tugmalari (1-bosishda simulyatsiya):',

    // Quick Transaction & Scan Result
    totalBalance: 'Jami Qoldiq',
    stockByWarehouse: 'Omborlar Kesimidagi Qoldiq',
    quickActionTitle: 'Tezkor Tranzaksiya',
    stockIn: 'Kirim (Stock In)',
    stockOut: 'Chiqim (Stock Out)',
    transfer: 'Ko\'chirish',
    warehouseLocation: 'Ombor Joylashuvi',
    sourceWarehouse: 'Chiqaruvchi Ombor',
    destinationWarehouse: 'Qabul Qiluvchi Ombor',
    quantity: 'Miqdor',
    notesPlaceholder: 'Tranzaksiya izohi yoki rekvizitlar...',
    confirmStockIn: 'Kirimni Tasdiqlash',
    confirmStockOut: 'Chiqimni Tasdiqlash',
    confirmTransfer: 'Ko\'chirishni Tasdiqlash',
    timelineTitle: 'Tranzaksiyalar Tarixi (So\'nggi 5 ta)',
    lastActivity: 'So\'nggi harakat:',
    noMovementsYet: 'Hozircha harakatlar qayd etilmagan.',

    // Transfers
    transferPageTitle: 'Omborlararo Tovarlarni Ko\'chirish',
    transferPageDesc: 'Bir ombordan ikkinchisiga tovar ko\'chirishda manba ombordan avtomatik yechiladi va nishon omborga qo\'shiladi.',
    selectProductToRelocate: 'Ko\'chiriladigan Mahsulotni Tanlang',
    originFacility: 'Manba Ombor (Qayerdan)',
    destinationFacility: 'Nishon Ombor (Qayerga)',
    availableStock: 'Mavjud qoldiq:',
    currentTargetStock: 'Nishon ombordagi joriy qoldiq:',
    confirmAndExecuteTransfer: 'Ko\'chirishni Amalga Oshirish',
    recentTransfers: 'So\'nggi Ko\'chirishlar',

    // Reports
    reportsPageTitle: 'Tahlil va Hisobotlar Markazi',
    reportsPageDesc: 'Ombor inventarizatsiyasi va tranzaksiyalar tarixini Excel (.xlsx) va PDF (.pdf) formatlarida eksport qiling.',
    exportExcelBtn: 'Excel (.xlsx) Yuklab Olish',
    exportPdfBtn: 'PDF Hisobot Yuklab Olish',
    overallStockReport: 'Umumiy Qoldiq Hisoboti',
    movementHistoryReport: 'To\'liq Harakatlar Tarixi',
    criticalLow: 'KRITIK KAM',
    optimal: 'ME\'YORDA',
    reorderRequired: 'BUYURTMA KERAK',
  },

  ru: {
    // Brand & Header
    brandTitle: 'OmniStock PRO',
    brandSubtitle: 'Автоматизация склада',
    scanQrBtn: 'Сканировать QR',
    allWarehouses: 'Консолидировано (Все склады)',
    activeRole: 'Текущая роль',
    switchRole: 'Сменить активную роль',
    lowStockAlerts: 'Предупреждения о запасах',
    warningCount: 'предупреждений',
    noAlerts: 'Все складские запасы в норме.',
    databaseActive: 'База данных активна',
    databaseDesc: 'PostgreSQL & Supabase Realtime с атомарными транзакциями готовы.',

    // Navigation
    navModules: 'Складские модули',
    dashboard: 'Панель управления',
    products: 'Товары и QR-коды',
    inventory: 'Матрица запасов',
    stockInOut: 'Приход / Расход',
    transfers: 'Перемещение со склада',
    reports: 'Отчеты и экспорт',
    qrLab: 'Пакетная печать QR',
    lowBadge: 'Мало',

    // Dashboard
    heroBadge: 'Автоматизированная экосистема склада',
    heroTitle: 'Центр управления складскими операциями',
    heroDesc: 'Синхронизация в реальном времени между веб и мобильным приложением. Управление товарами, QR-сканирование, атомарные перемещения и учет остатков.',
    addProductBtn: 'Добавить товар',
    stockInOutBtn: 'Приход / Расход',
    kpiCatalog: 'Товаров в каталоге',
    kpiQrTagged: '100% с QR-маркировкой для печати',
    kpiTotalOnHand: 'Всего единиц на складах',
    kpiFacilities: 'по всем активным складам',
    kpiLowStock: 'Заканчивающиеся товары',
    kpiThresholdDesc: 'На уровне или ниже точки перезаказа',
    kpiLedger: 'Журнал операций',
    kpiLedgerDesc: 'Приходы, расходы и перемещения',
    attentionRequired: 'Требуется внимание: Низкий остаток',
    restockAdvice: 'Пополните запасы для поддержания безопасности производства',
    viewMatrix: 'Открыть матрицу',
    quickRestock: 'Пополнить',
    activeDistribution: 'Распределение по складам',
    recentMovements: 'Последние операции',
    fullLedger: 'Полный журнал',
    units: 'ед.',

    // Products Page
    productCatalogTitle: 'Каталог товаров и генератор QR-кодов',
    productCatalogSubtitle: 'Автоматическое присвоение уникальных QR-кодов, экспорт в высоком разрешении и печать наклеек.',
    batchPrintBtn: 'Печать наклеек',
    searchPlaceholder: 'Поиск по названию, коду QR...',
    allUnits: 'Все единицы измерения',
    selectAll: 'Выбрать все',
    clearSelection: 'Снять выбор',
    totalStock: 'Общий остаток',
    safetyMin: 'Мин. запас',
    viewQrPrint: 'QR-код / Печать',
    registerProductTitle: 'Регистрация нового товара',
    registerProductDesc: 'Уникальный идентификатор QR генерируется автоматически и готов к печати.',
    productName: 'Наименование товара *',
    description: 'Описание',
    unitField: 'Единица измерения',
    minStockField: 'Минимальный резервный остаток',
    imageUrlField: 'URL изображения (опционально)',
    initialIntakeTitle: 'Первоначальный приход товара',
    intakeWarehouse: 'Склад поступления',
    initialQty: 'Количество прихода',
    cancel: 'Отмена',
    saveAndGenerate: 'Сохранить и создать QR',
    generating: 'Генерация QR...',

    // Units
    unit_piece: 'шт.',
    unit_box: 'кор.',
    unit_liter: 'л.',
    unit_kg: 'кг.',
    unit_pallet: 'паллет',
    unit_meter: 'м.',

    // QR Modal
    qrModalBadge: 'QR-идентификатор товара',
    copyCode: 'Копировать код',
    copied: 'Скопировано',
    downloadPng: 'Скачать PNG',
    downloadPdfBadge: 'PDF бейдж',
    printLabel: 'Печать этикетки',
    scanWithScanner: 'Сканируйте смартфоном или сканером',

    // Batch Print Modal
    batchModalTitle: 'Пакетная печать этикеток с QR-кодами',
    batchModalDesc: 'товаров выбрано для формирования листа наклеек',
    gridLayout: 'Формат:',
    columns2: '2 колонки (Крупный А4)',
    columns3: '3 колонки (Лист А4)',
    thermalOption: 'Термопринтер (Этикетка)',
    a4Option: 'Лист бумаги А4',
    labelSize: 'Размер этикетки:',
    customSize: 'Другой (Свой)',
    widthMm: 'Ширина (мм)',
    heightMm: 'Высота (мм)',
    continuousRoll: 'Непрерывная лента (Xprinter / Zebra / TSC)',
    browserPrint: 'Печать через браузер',
    downloadPdfSheet: 'Скачать PDF',

    // Scanner
    inAppScannerTitle: 'Встроенный сканер QR-кодов',
    inAppScannerDesc: 'Наведите камеру на QR-код или введите идентификатор вручную',
    manualCodeLabel: 'Или введите идентификатор QR вручную:',
    lookupBtn: 'Найти',
    quickPresets: 'Быстрые кнопки для теста (симуляция сканирования):',

    // Quick Transaction & Scan Result
    totalBalance: 'Общий остаток',
    stockByWarehouse: 'Остаток по складам',
    quickActionTitle: 'Быстрая складская операция',
    stockIn: 'Приход (Stock In)',
    stockOut: 'Расход (Stock Out)',
    transfer: 'Перемещение',
    warehouseLocation: 'Склад',
    sourceWarehouse: 'Склад-отправитель',
    destinationWarehouse: 'Склад-получатель',
    quantity: 'Количество',
    notesPlaceholder: 'Номер накладной, примечание...',
    confirmStockIn: 'Подтвердить приход',
    confirmStockOut: 'Подтвердить расход',
    confirmTransfer: 'Подтвердить перемещение',
    timelineTitle: 'История движений (Последние 5 записей)',
    lastActivity: 'Последняя активность:',
    noMovementsYet: 'Движений по данному товару еще не было.',

    // Transfers
    transferPageTitle: 'Межскладское перемещение товаров',
    transferPageDesc: 'Атомарное списание товара с исходного склада и оприходование на целевом складе в рамках единой транзакции.',
    selectProductToRelocate: 'Выберите товар для перемещения',
    originFacility: 'Склад отправления (Откуда)',
    destinationFacility: 'Склад назначения (Куда)',
    availableStock: 'Доступный остаток:',
    currentTargetStock: 'Текущий остаток на складе назначения:',
    confirmAndExecuteTransfer: 'Выполнить перемещение',
    recentTransfers: 'Последние перемещения',

    // Reports
    reportsPageTitle: 'Аналитика и отчетность склада',
    reportsPageDesc: 'Экспорт инвентаризационных ведомостей и журналов движения товаров в форматы Excel (.xlsx) и PDF (.pdf).',
    exportExcelBtn: 'Скачать Excel (.xlsx)',
    exportPdfBtn: 'Скачать PDF отчет',
    overallStockReport: 'Ведомость остатков',
    movementHistoryReport: 'Журнал перемещений',
    criticalLow: 'КРИТИЧЕСКИ МАЛО',
    optimal: 'В НОРМЕ',
    reorderRequired: 'ТРЕБУЕТСЯ ЗАКАЗ',
  },

  en: {
    // Brand & Header
    brandTitle: 'OmniStock PRO',
    brandSubtitle: 'Warehouse Automation',
    scanQrBtn: 'Scan QR Code',
    allWarehouses: 'Consolidated (All Warehouses)',
    activeRole: 'Active Role',
    switchRole: 'Switch Active Role',
    lowStockAlerts: 'Low Stock Alerts',
    warningCount: 'warning(s)',
    noAlerts: 'All inventory levels are optimal.',
    databaseActive: 'Database Active',
    databaseDesc: 'PostgreSQL & Supabase Realtime schema ready with atomic transactions.',

    // Navigation
    navModules: 'Inventory Modules',
    dashboard: 'Dashboard',
    products: 'Products & QR',
    inventory: 'Inventory Matrix',
    stockInOut: 'Stock In / Out',
    transfers: 'Transfers',
    reports: 'Reports & Export',
    qrLab: 'Batch QR Print Lab',
    lowBadge: 'Low',

    // Dashboard
    heroBadge: 'Automated Warehouse Ecosystem',
    heroTitle: 'Warehouse Operations Command Center',
    heroDesc: 'Real-time synchronization across web & mobile devices. Manage products, scan QR identifiers, track atomic multi-warehouse transfers, and monitor stock levels.',
    addProductBtn: 'Add Product',
    stockInOutBtn: 'Stock In/Out',
    kpiCatalog: 'Catalog Items',
    kpiQrTagged: '100% QR-tagged & printable',
    kpiTotalOnHand: 'Total Units on Hand',
    kpiFacilities: 'across active warehouse facilities',
    kpiLowStock: 'Low-Stock Warnings',
    kpiThresholdDesc: 'Items at or below safety reorder threshold',
    kpiLedger: 'Movement Ledger',
    kpiLedgerDesc: 'Inbound, outbound, and inter-facility transfers',
    attentionRequired: 'Attention Required: Low Stock Items',
    restockAdvice: 'Restock these products to maintain safety margins',
    viewMatrix: 'View Matrix',
    quickRestock: 'Quick Restock',
    activeDistribution: 'Active Facility Distribution',
    recentMovements: 'Recent Movements',
    fullLedger: 'Full Ledger',
    units: 'units',

    // Products Page
    productCatalogTitle: 'Product Catalog & QR Engine',
    productCatalogSubtitle: 'Automated QR assignment, high-res label rendering, and single/batch printing.',
    batchPrintBtn: 'Batch Print Labels',
    searchPlaceholder: 'Search by product name, QR identifier...',
    allUnits: 'All Units',
    selectAll: 'Select All',
    clearSelection: 'Clear',
    totalStock: 'Total Stock',
    safetyMin: 'Safety Min',
    viewQrPrint: 'View QR / Print',
    registerProductTitle: 'Register New Product',
    registerProductDesc: 'Unique QR identifier is automatically assigned and ready to print upon creation.',
    productName: 'Product Name *',
    description: 'Description',
    unitField: 'Measurement Unit',
    minStockField: 'Min Safety Threshold',
    imageUrlField: 'Image URL (Optional)',
    initialIntakeTitle: 'Initial Intake Stock Balance',
    intakeWarehouse: 'Intake Warehouse',
    initialQty: 'Initial Quantity',
    cancel: 'Cancel',
    saveAndGenerate: 'Save & Generate QR',
    generating: 'Generating QR...',

    // Units
    unit_piece: 'piece',
    unit_box: 'box',
    unit_liter: 'liter',
    unit_kg: 'kg',
    unit_pallet: 'pallet',
    unit_meter: 'meter',

    // QR Modal
    qrModalBadge: 'Product QR Identification',
    copyCode: 'Copy Code',
    copied: 'Copied',
    downloadPng: 'Download PNG',
    downloadPdfBadge: 'PDF Badge',
    printLabel: 'Print Label',
    scanWithScanner: 'Scan with Mobile or Handheld Scanner',

    // Batch Print Modal
    batchModalTitle: 'Batch QR Code Label Printing',
    batchModalDesc: 'product(s) selected for mass sticker sheet generation',
    gridLayout: 'Print Mode:',
    columns2: '2 Columns (Large A4)',
    columns3: '3 Columns (Standard A4)',
    thermalOption: 'Thermal Printer (Label)',
    a4Option: 'A4 Paper Sheet',
    labelSize: 'Label Size:',
    customSize: 'Custom Size',
    widthMm: 'Width (mm)',
    heightMm: 'Height (mm)',
    continuousRoll: 'Continuous Roll (Xprinter / Zebra / TSC)',
    browserPrint: 'Browser Print',
    downloadPdfSheet: 'Download PDF',

    // Scanner
    inAppScannerTitle: 'In-App QR Code Scanner',
    inAppScannerDesc: 'Scan product QR with device camera or enter code',
    manualCodeLabel: 'Or enter QR code identifier manually:',
    lookupBtn: 'Lookup',
    quickPresets: 'Quick Test Presets (1-click scan simulation):',

    // Quick Transaction & Scan Result
    totalBalance: 'Total Balance',
    stockByWarehouse: 'Stock by Warehouse Location',
    quickActionTitle: 'Quick Transaction Action',
    stockIn: 'Stock In',
    stockOut: 'Stock Out',
    transfer: 'Transfer',
    warehouseLocation: 'Warehouse Location',
    sourceWarehouse: 'Source Warehouse',
    destinationWarehouse: 'Destination Warehouse',
    quantity: 'Quantity',
    notesPlaceholder: 'Optional transaction reference or note...',
    confirmStockIn: 'Confirm Stock In',
    confirmStockOut: 'Confirm Stock Out',
    confirmTransfer: 'Confirm Transfer',
    timelineTitle: 'Transaction Timeline (Last 5 Records)',
    lastActivity: 'Last Activity:',
    noMovementsYet: 'No movement transactions recorded yet.',

    // Transfers
    transferPageTitle: 'Multi-Warehouse Stock Transfer',
    transferPageDesc: 'Atomic cross-warehouse relocation with instant balance deduction at source and increment at target.',
    selectProductToRelocate: 'Select Product to Relocate',
    originFacility: 'Origin Facility (Source)',
    destinationFacility: 'Destination Facility (Target)',
    availableStock: 'Available Stock:',
    currentTargetStock: 'Current Target Stock:',
    confirmAndExecuteTransfer: 'Confirm & Execute Atomic Transfer',
    recentTransfers: 'Recent Inter-Facility Transfers',

    // Reports
    reportsPageTitle: 'Analytics & Reports Center',
    reportsPageDesc: 'Export comprehensive warehouse inventory audits and transaction ledgers to Excel (.xlsx) and PDF (.pdf).',
    exportExcelBtn: 'Export Excel (.xlsx)',
    exportPdfBtn: 'Export PDF Report',
    overallStockReport: 'Overall Stock Report',
    movementHistoryReport: 'Full Movement History',
    criticalLow: 'CRITICAL LOW',
    optimal: 'OPTIMAL',
    reorderRequired: 'REORDER REQUIRED',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['uz'];
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wms_lang') as Language;
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wms_lang', lang);
    }
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};
