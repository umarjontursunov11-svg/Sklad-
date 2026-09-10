import {
  Warehouse,
  Product,
  StockBalance,
  StockMovement,
  UserProfile,
  InvoiceWithItems,
  CorrectionRequest,
  LoginLog,
} from './types';

// Default initial warehouses
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-main',
    name: 'Asosiy Ombor (Central Hub)',
    address: 'Sanoat zonasi, 1-bino',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'wh-north',
    name: 'Shimoliy Filial (North Distribution)',
    address: 'Aylanma yo\'l, 12-blok',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'wh-south',
    name: 'Janubiy Terminal (South Depot)',
    address: 'Logistika ko\'chasi, 4-dock',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Initial system administrator (Staff will self-register)
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Tursunov Umarjon (Admin)',
    full_name: 'Tursunov Umarjon',
    email: 'admin@warehouse.io',
    phone: '+998 90 123-45-67',
    employee_id: 'EMP-0001',
    role: 'admin',
    role_id: '11111111-1111-1111-1111-111111111111',
    assigned_warehouse_id: null,
  },
];

// 294 Products imported from https://online-market-smoky.vercel.app/ ("STANDART VA METROLOGIYA" MCHJ)
export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "dev-fluke-manometer",
    "name": "Yuqori aniqlikdagi raqamli manometr / bosim kalibratori (Model: Fluke CPC-800)",
    "description": "Sanoat manometrlarini tekshirish va kalibrlash uchun 0.02% aniqlikdagi raqamli etalon manometr. • [0.02% Aniqlik] • Narxi: 9 800 000 so'm • Diapazon: 0 dan 25 bar gacha (0 - 350 psi / 0 - 2.5 MPa)",
    "unit": "kg",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-MANO-CPC-800",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "dev-analytical-balance",
    "name": "Laboratoriya analitik elektron tarozisi (Model: METTLER-XSR204, 0.0001g)",
    "description": "Shisha himoya qopqoqli, ichki avtomatik kalibrlashli yuqori aniqlikdagi I-maxsus sinf analitik tarozi. • [I-Maxsus Sinf] • Narxi: 28 500 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/analytical_balance.jpg",
    "qr_code_data": "WMS-GSO-BAL-XSR-204",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "dev-ph-meter-seven",
    "name": "Raqamli laboratoriya pH/mV/Temp metri (Model: SevenDirect SD50)",
    "description": "Rangli 7 dyuymli sensorli ekran, elektrod ushlagich shtativ va avtomatik harorat kompensatsiyasi (ATC). • [Sensorli Ekran] • Narxi: 14 200 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/digital_ph_meter.jpg",
    "qr_code_data": "WMS-GSO-PH-SEVEN-SD50",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "dev-spectrophotometer",
    "name": "UV-VIS Spektrofotometr ikki nurlik (Model: NEXUS UV-3200 Touch)",
    "description": "190-1100 nm spektral diapazonli, rangli grafik displeyli zamonaviy laboratoriya spektrofotometri. • [190-1100 nm] • Narxi: 36 000 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/spectrophotometer.jpg",
    "qr_code_data": "WMS-GSO-SPEC-UV-3200",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-1",
    "name": "Газовый счет барабанного типа ГСБ 400  Скидка  35%",
    "description": "Газовый счет барабанного типа ГСБ 400  Скидка  35%. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Yuqori Aniqlik] • Narxi: 31 000 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1000",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-2",
    "name": "Вискозиметр ВПЖ-2 D- 0.56",
    "description": "Вискозиметр ВПЖ-2 D- 0.56. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 1 792 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-3",
    "name": "Вискозиметр ВПЖ-2 D -0,99",
    "description": "Вискозиметр ВПЖ-2 D -0,99. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 1 948 800 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-4",
    "name": "Вискозиметр ВПЖ-2  D -0,73",
    "description": "Вискозиметр ВПЖ-2  D -0,73. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 1 948 800 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-5",
    "name": "Вискозиметр ВПЖ-4 D-1,47",
    "description": "Вискозиметр ВПЖ-4 D-1,47. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 1 724 800 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-4",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-6",
    "name": "Вискозиметр ВПЖ-4 D-0.37",
    "description": "Вискозиметр ВПЖ-4 D-0.37. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 1 730 400 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-4",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-7",
    "name": "Вискозиметр ВПЖ-4 D-0.82",
    "description": "Вискозиметр ВПЖ-4 D-0.82. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 2 100 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-4",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-8",
    "name": "Вискозиметр ВПЖ-4 D-1.12",
    "description": "Вискозиметр ВПЖ-4 D-1.12. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 2 100 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-4",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-9",
    "name": "Вискозиметр ВПЖ-4 D-0.62",
    "description": "Вискозиметр ВПЖ-4 D-0.62. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 2 140 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-4",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-10",
    "name": "Вискозиметр ВПЖ-2 D-1.31",
    "description": "Вискозиметр ВПЖ-2 D-1.31. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 10028] • Narxi: 2 170 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-VPJ-ВПЖ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-11",
    "name": "Рулетка Р10 УЗГ с грузом 2 кг",
    "description": "Рулетка Р10 УЗГ с грузом 2 кг. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Davlat Reestri] • Narxi: 1 517 600 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "kg",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1010",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-12",
    "name": "Толщиномер покрытии МТ",
    "description": "Толщиномер покрытии МТ. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Davlat Reestri] • Narxi: 5 516 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1011",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-13",
    "name": "Термометр гигрометр электронный цифровой HTC-2 с вынос датчиком с поверкой",
    "description": "Термометр гигрометр электронный цифровой HTC-2 с вынос датчиком с поверкой. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Qiyoslangan] • Narxi: 500 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/digital_ph_meter.jpg",
    "qr_code_data": "WMS-GSO-SI-1012",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-14",
    "name": "Термогигрометр Testo Система Wi-Fi- логгеров данных testo Saveris 2",
    "description": "Термогигрометр Testo Система Wi-Fi- логгеров данных testo Saveris 2. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Qiyoslangan] • Narxi: 5 800 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/digital_ph_meter.jpg",
    "qr_code_data": "WMS-GSO-SI-1013",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-15",
    "name": "Линейка металлическая 1000 мм ГОСТ 427-75",
    "description": "Линейка металлическая 1000 мм ГОСТ 427-75. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 448 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1014",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-16",
    "name": "Линейка металлическая 300 мм",
    "description": "Линейка металлическая 300 мм. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 320 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1015",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-17",
    "name": "Штангенциркуль 150 мм Китай",
    "description": "Штангенциркуль 150 мм Китай. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 175 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-18",
    "name": "Штангенциркуль 200 мм Китай",
    "description": "Штангенциркуль 200 мм Китай. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 200 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1017",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-19",
    "name": "Штангенциркуль 300 мм Китай",
    "description": "Штангенциркуль 300 мм Китай. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 225 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1018",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-20",
    "name": "Микрометр 150 мм Китай",
    "description": "Микрометр 150 мм Китай. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1019",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-21",
    "name": "Набор щупов №1 диап: 02-0,1 L=100 МИК",
    "description": "Набор щупов №1 диап: 02-0,1 L=100 МИК. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 350 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "set",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1020",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-22",
    "name": "Набор щупов №2 диап: 02-0,5 L=100 МИК",
    "description": "Набор щупов №2 диап: 02-0,5 L=100 МИК. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 350 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "set",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1021",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-23",
    "name": "Набор щупов №3 диап: 0,5-1 L=100 МИК",
    "description": "Набор щупов №3 диап: 0,5-1 L=100 МИК. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 350 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "set",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1022",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-24",
    "name": "Набор щупов №4 диап: 0,1-1 L=100 МИК",
    "description": "Набор щупов №4 диап: 0,1-1 L=100 МИК. Ishlab chiqaruvchi: O'zstandart / Rossiya. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Chiziqli O'lchov] • Narxi: 350 000 so'm • Ishlab chiqaruvchi: O'zstandart / Rossiya",
    "unit": "set",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1023",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-25",
    "name": "Ареометр АМ 1020-1040",
    "description": "Ареометр АМ 1020-1040. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АМ",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-26",
    "name": "Ареометр АМТ 1015-1040",
    "description": "Ареометр АМТ 1015-1040. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АМТ",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-27",
    "name": "Ареометр АНТ-1 650-710",
    "description": "Ареометр АНТ-1 650-710. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-1",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-28",
    "name": "Ареометр АНТ-1 710-770",
    "description": "Ареометр АНТ-1 710-770. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 336 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-29",
    "name": "Ареометр АНТ-1 770-830",
    "description": "Ареометр АНТ-1 770-830. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 336 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-30",
    "name": "Ареометр АНТ-1 830-890",
    "description": "Ареометр АНТ-1 830-890. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 336 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-31",
    "name": "Ареометр АНТ-2 670-750",
    "description": "Ареометр АНТ-2 670-750. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-32",
    "name": "Ареометр АНТ-2 830-910",
    "description": "Ареометр АНТ-2 830-910. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-33",
    "name": "Ареометр АНТ-2 910-990",
    "description": "Ареометр АНТ-2 910-990. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АНТ-2",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-34",
    "name": "Ареометр АОН-1 700-760",
    "description": "Ареометр АОН-1 700-760. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-35",
    "name": "Ареометр АОН-1 760-820",
    "description": "Ареометр АОН-1 760-820. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-36",
    "name": "Ареометр АОН-1 820-880",
    "description": "Ареометр АОН-1 820-880. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-37",
    "name": "Ареометр АОН-1 880-940",
    "description": "Ареометр АОН-1 880-940. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-38",
    "name": "Ареометр АОН-1 940-1000",
    "description": "Ареометр АОН-1 940-1000. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-39",
    "name": "Ареометр АОН-1 1120-1180",
    "description": "Ареометр АОН-1 1120-1180. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-40",
    "name": "Ареометр АОН-1 1180-1240",
    "description": "Ареометр АОН-1 1180-1240. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-41",
    "name": "Ареометр АОН-1 1240-1300",
    "description": "Ареометр АОН-1 1240-1300. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-42",
    "name": "Ареометр АОН-1 1420-1480",
    "description": "Ареометр АОН-1 1420-1480. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-43",
    "name": "Ареометр АОН-1 1480-1540",
    "description": "Ареометр АОН-1 1480-1540. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-44",
    "name": "Ареометр АОН-1 1540-1600",
    "description": "Ареометр АОН-1 1540-1600. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-45",
    "name": "Ареометр АОН-1 1600-1660",
    "description": "Ареометр АОН-1 1600-1660. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-46",
    "name": "Ареометр АОН-1 1660-1720",
    "description": "Ареометр АОН-1 1660-1720. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-47",
    "name": "Ареометр АОН-1 1720-1780",
    "description": "Ареометр АОН-1 1720-1780. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-48",
    "name": "Ареометр АОН-1 1780-1840",
    "description": "Ареометр АОН-1 1780-1840. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 212 800 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-АОН-1",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-49",
    "name": "Набор ареометров АОН-1 700-1840",
    "description": "Набор ареометров АОН-1 700-1840. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [GOST 18481] • Narxi: 2 520 000 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "set",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-AREO-ареометров",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-50",
    "name": "Гигрометр психрометрический ВИТ-1",
    "description": "Гигрометр психрометрический ВИТ-1. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Qiyoslangan] • Narxi: 201 600 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/digital_ph_meter.jpg",
    "qr_code_data": "WMS-GSO-SI-1049",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-51",
    "name": "Гигрометр психрометрический ВИТ-2",
    "description": "Гигрометр психрометрический ВИТ-2. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Qiyoslangan] • Narxi: 201 600 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/digital_ph_meter.jpg",
    "qr_code_data": "WMS-GSO-SI-1050",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-52",
    "name": "Колба КРН-125/100/Flask КРН-125/100",
    "description": "Колба КРН-125/100/Flask КРН-125/100. Ishlab chiqaruvchi: Стеклоприбор Украина. Davlat tekshiruvi va qiyoslash sertifikati bilan. • [Davlat Reestri] • Narxi: 246 400 so'm • Ishlab chiqaruvchi: Стеклоприбор Украина",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-SI-1051",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-53",
    "name": "ТЛ-2 N1 исп.1(-30+70) ц.д.1 термометр  стеклянный лабораторный",
    "description": "ТЛ-2 N1 исп.1(-30+70) ц.д.1 термометр  стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 1 724 800 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-252",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-54",
    "name": "ТЛ-2 N2 исп.1  (0+100)  ц.д 1 термометр стеклянный лабораторный",
    "description": "ТЛ-2 N2 исп.1  (0+100)  ц.д 1 термометр стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 038 400 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-253",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-55",
    "name": "ТЛ-2 N3 исп.1  (0+150) ц.д 1 термометр стеклянный лабораторный",
    "description": "ТЛ-2 N3 исп.1  (0+150) ц.д 1 термометр стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 049 600 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-254",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-56",
    "name": "ТЛ-2 N5 исп.1 (0+350) ц.д 1 термометр  стеклянный лабораторный",
    "description": "ТЛ-2 N5 исп.1 (0+350) ц.д 1 термометр  стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 122 400 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-255",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-57",
    "name": "ТЛ-4 N2 (0+55) Термометр ртутный стеклянный лабораторный",
    "description": "ТЛ-4 N2 (0+55) Термометр ртутный стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 4 928 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-256",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-58",
    "name": "ТЛ-5 N2 (0+105 ц.д. 0,5) Термометр ртутный стеклянный лабораторный",
    "description": "ТЛ-5 N2 (0+105 ц.д. 0,5) Термометр ртутный стеклянный лабораторный. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 3 248 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-257",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-59",
    "name": "ТН-1 N1 (0+170) Термометр стеклянный ртутный  для испытания нефтепродуктов",
    "description": "ТН-1 N1 (0+170) Термометр стеклянный ртутный  для испытания нефтепродуктов. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 822 400 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-258",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-60",
    "name": "ТН 2М (0+360) Термометр стеклянный ртутный для испытаний нефтепродуктов",
    "description": "ТН 2М (0+360) Термометр стеклянный ртутный для испытаний нефтепродуктов. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 822 400 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-259",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-61",
    "name": "ТН-4М- 1 (0+150) Термометр стеклянный ртутный для испытаний нефтепродуктов",
    "description": "ТН-4М- 1 (0+150) Термометр стеклянный ртутный для испытаний нефтепродуктов. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 800 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-260",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "si-therm-62",
    "name": "ТН-7 (0+360) Термометр стеклянный ртутный для испытаний нефтепродуктов",
    "description": "ТН-7 (0+360) Термометр стеклянный ртутный для испытаний нефтепродуктов. Neft va laboratoriya sinovlari uchun maxsus laboratoriya termometri. • [GOST 28498] • Narxi: 2 800 000 so'm",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-THM-261",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-63",
    "name": "Стандарт-титр азотная кислота 0,1н (10 амп) Уралхиминвест",
    "description": "Стандарт-титр азотная кислота 0,1н (10 амп) Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 245 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-162",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-64",
    "name": "Стандарт-титр Натрий серноватистокислый 5-водный 0,1н Уралхиминвест",
    "description": "Стандарт-титр Натрий серноватистокислый 5-водный 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 260 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-163",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-65",
    "name": "Стандарт-титр Аммоний хлористый 0,1н Уралхиминвест",
    "description": "Стандарт-титр Аммоний хлористый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 245 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-164",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-66",
    "name": "Стандарт-титр Калий йодноватокислый 0,1н Уралхиминвест",
    "description": "Стандарт-титр Калий йодноватокислый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 295 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-165",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-67",
    "name": "Стандарт-титр Натрий хлористый 0,1н (5 шт в упаковке) Ленреактив",
    "description": "Стандарт-титр Натрий хлористый 0,1н (5 шт в упаковке) Ленреактив. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 245 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-166",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-68",
    "name": "Стандарт-титр Натрий углекислый безводный 0,1н Уралхиминвест",
    "description": "Стандарт-титр Натрий углекислый безводный 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 305 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-167",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-69",
    "name": "Стандарт-титр Калий бромистый 0,1н Уралхиминвест",
    "description": "Стандарт-титр Калий бромистый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 300 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-168",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-70",
    "name": "Стандарт-титр Калий железосинеродистый 0,05н Уралхиминвест",
    "description": "Стандарт-титр Калий железосинеродистый 0,05н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 255 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-169",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-71",
    "name": "Стандарт-титр Натрий углекислый кислый 0,1н Уралхиминвест",
    "description": "Стандарт-титр Натрий углекислый кислый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 336 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-170",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-72",
    "name": "Стандарт-титр Кислота серная 0,1н Уралхиминвест",
    "description": "Стандарт-титр Кислота серная 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 356 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-171",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-73",
    "name": "Стандарт-титр Калий хлористый Уралхиминвест",
    "description": "Стандарт-титр Калий хлористый Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 298 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-172",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-74",
    "name": "Стандарт-титр Щавелевая кислота 0,1Н  Ленреактив",
    "description": "Стандарт-титр Щавелевая кислота 0,1Н  Ленреактив. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 360 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-173",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-75",
    "name": "Стандарт-титр аммоний роданистый 0,1н Уралхиминвест",
    "description": "Стандарт-титр аммоний роданистый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 250 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-174",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-76",
    "name": "Стандарт-титры \"НАТРИЙ ТЕТРАБОРНОКИСЛЫЙ\" (натрий тетраборат) УЗХП",
    "description": "Стандарт-титры \"НАТРИЙ ТЕТРАБОРНОКИСЛЫЙ\" (натрий тетраборат) УЗХП. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 270 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-175",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-77",
    "name": "Стандарт-титры \"НАТРИЙ УГЛЕКИСЛЫЙ\" (натрий карбонат) УЗХП",
    "description": "Стандарт-титры \"НАТРИЙ УГЛЕКИСЛЫЙ\" (натрий карбонат) УЗХП. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 200 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-176",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-78",
    "name": "Стандарт-титр, соль Мора Уралхиминвест",
    "description": "Стандарт-титр, соль Мора Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 284 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-177",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-79",
    "name": "Стандарт-титры \"БАРИЙ ХЛОРИСТЫИ\" (барий хлорид) 2-водный Уралхиминвест",
    "description": "Стандарт-титры \"БАРИЙ ХЛОРИСТЫИ\" (барий хлорид) 2-водный Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 275 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-178",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-80",
    "name": "Стандарт-титр Калий щавелевокислый 1-водный 0,1н  Уралхиминвест",
    "description": "Стандарт-титр Калий щавелевокислый 1-водный 0,1н  Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 336 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-179",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-81",
    "name": "Стандарт титр Трилон Б",
    "description": "Стандарт титр Трилон Б. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 324 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-180",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-82",
    "name": "Стандарт-титры \"КИСЛОТА УКСУСНАЯ 0,1Н\" 10 амп Уралхиминвест",
    "description": "Стандарт-титры \"КИСЛОТА УКСУСНАЯ 0,1Н\" 10 амп Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 216 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-181",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-83",
    "name": "Стандарт-титры \"КАЛИЙ УГЛЕКИСЛЫЙ\" (калий карбонат) Уралхиминвест",
    "description": "Стандарт-титры \"КАЛИЙ УГЛЕКИСЛЫЙ\" (калий карбонат) Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 215 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-182",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-84",
    "name": "Стандарт титр рН метрии набор 6 значений (1,65; 3,56; 4,01; 6,86; 9,18; 12,43)",
    "description": "Стандарт титр рН метрии набор 6 значений (1,65; 3,56; 4,01; 6,86; 9,18; 12,43). Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 320 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-183",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-85",
    "name": "Стандарт-титры для приготовления рабочих эталонов рН=3,56 Уралхиминвест",
    "description": "Стандарт-титры для приготовления рабочих эталонов рН=3,56 Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 180 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-184",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-86",
    "name": "Стандарт-титр, рН-метрии, тип 4,01 Уралхиминвест",
    "description": "Стандарт-титр, рН-метрии, тип 4,01 Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 175 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-185",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-87",
    "name": "Стандарт-титр Калия гидроокись Уралхиминвест",
    "description": "Стандарт-титр Калия гидроокись Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 270 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-186",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-88",
    "name": "Стандарт-титр Кислота щавелевая 0,1н Уралхиминвест",
    "description": "Стандарт-титр Кислота щавелевая 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 240 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-187",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "titr-89",
    "name": "Стандарт-титр Калий хромовокислый 0,1н Уралхиминвест",
    "description": "Стандарт-титр Калий хромовокислый 0,1н Уралхиминвест. Titrimetrik tahlil va aniq ishchi eritmalarni tayyorlash uchun fiksanal. • [Fiksanal] • Narxi: 235 000 so'm",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-TITR-188",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-90",
    "name": "Кадмий ГСО 7874-2000, МСО 0299:2002 (1г/дм3), 5мл",
    "description": "Кадмий ГСО 7874-2000, МСО 0299:2002 (1г/дм3), 5мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7874-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-91",
    "name": "Нитрит-ион ГСО 7753-2000 МСО 0202:2001 (1 г/дм3), 3.05.01.0290",
    "description": "Нитрит-ион ГСО 7753-2000 МСО 0202:2001 (1 г/дм3), 3.05.01.0290. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 235 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7753-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-92",
    "name": "Марганец (II) ГСО 7875-2000 МСО 0300:2002 (1г/дм3) 5 мл",
    "description": "Марганец (II) ГСО 7875-2000 МСО 0300:2002 (1г/дм3) 5 мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 210 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7875-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-93",
    "name": "Магний ГСО 7681-99 МСО 0196:2001 (1г/дм3) 5 мл",
    "description": "Магний ГСО 7681-99 МСО 0196:2001 (1г/дм3) 5 мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 252 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7681-99",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-94",
    "name": "Мышьяк (III) ГСО 7976-2001 (0,1 г/дм3) 5 мл",
    "description": "Мышьяк (III) ГСО 7976-2001 (0,1 г/дм3) 5 мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 216 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7976-2001",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-95",
    "name": "Жесткость воды ГСО 7680-99",
    "description": "Жесткость воды ГСО 7680-99. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 235 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7680-99",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-96",
    "name": "Со состава водного раствора хлорид-ионов ГСО 7617-99",
    "description": "Со состава водного раствора хлорид-ионов ГСО 7617-99. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 210 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7617-99",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-97",
    "name": "СО состава водного раствора фосфат-ионов ГСО 7748-99",
    "description": "СО состава водного раствора фосфат-ионов ГСО 7748-99. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7748-99",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-98",
    "name": "СО ионов кальция ГСО 7682-99 (1 г/дм3) 5 мл",
    "description": "СО ионов кальция ГСО 7682-99 (1 г/дм3) 5 мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 265 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7682-99",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-99",
    "name": "СО состава фенола ГСО 7101-94",
    "description": "СО состава фенола ГСО 7101-94. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 228 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7101-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-100",
    "name": "СО состава раствора ионов ртути ГСО 7879-2001",
    "description": "СО состава раствора ионов ртути ГСО 7879-2001. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 216 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7879-2001",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-101",
    "name": "СО состава раствора ионов никеля ГСО 7873-2000",
    "description": "СО состава раствора ионов никеля ГСО 7873-2000. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 235 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7873-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-102",
    "name": "СО состава раствора ионов свинца ГСО 7877-2000",
    "description": "СО состава раствора ионов свинца ГСО 7877-2000. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7877-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-103",
    "name": "ГСО Аммоний 7747-99",
    "description": "ГСО Аммоний 7747-99. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 210 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-2102",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-104",
    "name": "Хром (VI) ГСО 7834-2000 МСО 0293:2002 ( 1 г/дм3)",
    "description": "Хром (VI) ГСО 7834-2000 МСО 0293:2002 ( 1 г/дм3). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 205 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7834-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-105",
    "name": "Хлорид-ион ГСО 7616-99 МСО 0189:2000(1г/дм3) 5мл",
    "description": "Хлорид-ион ГСО 7616-99 МСО 0189:2000(1г/дм3) 5мл. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 205 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7616-99",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-106",
    "name": "Цинк ГСО 7837-2000",
    "description": "Цинк ГСО 7837-2000. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 218 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7837-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-107",
    "name": "Роданид ГСО 7618-99",
    "description": "Роданид ГСО 7618-99. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 225 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7618-99",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-108",
    "name": "ГСО ионов меди ГСО 7836-2000",
    "description": "ГСО ионов меди ГСО 7836-2000. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 254 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7836-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-109",
    "name": "Железо (III) ГСО 7835-2000",
    "description": "Железо (III) ГСО 7835-2000. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 245 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7835-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-110",
    "name": "Мутность воды (формазиновая суспензия) ГСО 12428-2024 (4000 ЕМФ)",
    "description": "Мутность воды (формазиновая суспензия) ГСО 12428-2024 (4000 ЕМФ). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [Suv Tahlili] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-12428-2024",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-111",
    "name": "Кремний ГСО 8934-2008 (флакон 40 мл)",
    "description": "Кремний ГСО 8934-2008 (флакон 40 мл). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 300 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8934-2008",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-112",
    "name": "Общей жесткость воды ГСО 7680-99 (флакон 40 мл)",
    "description": "Общей жесткость воды ГСО 7680-99 (флакон 40 мл). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 275 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7680-99",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-113",
    "name": "Ионов кобальта ГСО 7880-2001",
    "description": "Ионов кобальта ГСО 7880-2001. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 230 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7880-2001",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-114",
    "name": "Цветность ГСО 11431-2019",
    "description": "Цветность ГСО 11431-2019. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [Suv Tahlili] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-11431-2019",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-115",
    "name": "Марганец (II) ГСО 7876-2000 МСО 0301:2002 (10 г/дм3)",
    "description": "Марганец (II) ГСО 7876-2000 МСО 0301:2002 (10 г/дм3). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 220 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7876-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-116",
    "name": "Алюминий ГСО 7927-2001 МСО 0306:2002 (1г/дм3)",
    "description": "Алюминий ГСО 7927-2001 МСО 0306:2002 (1г/дм3). Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 215 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7927-2001",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-117",
    "name": "Фторид ион ГСО 8125-2002",
    "description": "Фторид ион ГСО 8125-2002. Ishlab chiqaruvchi: Ekrosxim. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 315 000 so'm • Ishlab chiqaruvchi: Ekrosxim",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8125-2002",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-118",
    "name": "Водные растворы ионов калия ГСО 8092-94-8094-94",
    "description": "Водные растворы ионов калия ГСО 8092-94-8094-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8092-94-8094-94",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-119",
    "name": "Водный раствор ионов бария ГСО 7107-94",
    "description": "Водный раствор ионов бария ГСО 7107-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 270 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7107-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-120",
    "name": "Фосфор общий ГСО 7241-96 МСО 0092:1999 (0,5 мг/мл),",
    "description": "Фосфор общий ГСО 7241-96 МСО 0092:1999 (0,5 мг/мл),. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 228 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7241-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-121",
    "name": "Водные растворы ионов кальция ГСО 8065-94-:-8067-94",
    "description": "Водные растворы ионов кальция ГСО 8065-94-:-8067-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8065-94-",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-122",
    "name": "Водный раствор ионов селена ГСО 7340-96",
    "description": "Водный раствор ионов селена ГСО 7340-96. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 245 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7340-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-123",
    "name": "Водные растворы ионов натрия ГСО 8062-94-:-8064-94",
    "description": "Водные растворы ионов натрия ГСО 8062-94-:-8064-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8062-94-",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-124",
    "name": "ГСО ионов аммония (комплект № 15К) ГСО 7015-93/7017-93",
    "description": "ГСО ионов аммония (комплект № 15К) ГСО 7015-93/7017-93. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 225 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7015-93",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-125",
    "name": "ГСО ионов алюминия (12К-1) ГСО 8059-94/8061-94",
    "description": "ГСО ионов алюминия (12К-1) ГСО 8059-94/8061-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 200 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8059-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-126",
    "name": "ГСО состава водных растворов ионов алюминия (42К) ГСО 7854-2000",
    "description": "ГСО состава водных растворов ионов алюминия (42К) ГСО 7854-2000. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 235 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7854-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-127",
    "name": "ГСО состава водных растворов ионов бора (39К-1) ГСО 7337-96",
    "description": "ГСО состава водных растворов ионов бора (39К-1) ГСО 7337-96. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 209 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7337-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-128",
    "name": "ГСО состава водных растворов ионов железа (III) ГСО 8032-94 (1г/дм3),",
    "description": "ГСО состава водных растворов ионов железа (III) ГСО 8032-94 (1г/дм3),. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 225 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8032-94",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-129",
    "name": "Калий (18К-1) ГСО 8092-94, МСО 0019:1998, фон – вода, 1,0 г/дм3",
    "description": "Калий (18К-1) ГСО 8092-94, МСО 0019:1998, фон – вода, 1,0 г/дм3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 223 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8092-94",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-130",
    "name": "Раствор формальдегида ГСО 9376-2009",
    "description": "Раствор формальдегида ГСО 9376-2009. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 255 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-9376-2009",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-131",
    "name": "Магний (20К-1) ГСО 7190-95 (0085:1999)  1,0 (5)Фон – вода",
    "description": "Магний (20К-1) ГСО 7190-95 (0085:1999)  1,0 (5)Фон – вода. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 223 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7190-95",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-132",
    "name": "Марганец (II) (10К-1) ГСО 8056-94 (0014:1998) 1,0 (5) Фон –0,1 М Н2SO4",
    "description": "Марганец (II) (10К-1) ГСО 8056-94 (0014:1998) 1,0 (5) Фон –0,1 М Н2SO4. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 223 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8056-94",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-133",
    "name": "Натрий (17К-1) ГСО 8062-94, МСО 0018:1998, фон – вода, 1,0 г/дм3",
    "description": "Натрий (17К-1) ГСО 8062-94, МСО 0018:1998, фон – вода, 1,0 г/дм3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 202 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8062-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-134",
    "name": "Ртуть (9К-1) ГСО 8004-93 (0013:1998)    1,0 (5) Фон –0,1 М НNO3",
    "description": "Ртуть (9К-1) ГСО 8004-93 (0013:1998)    1,0 (5) Фон –0,1 М НNO3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 242 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8004-93",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-135",
    "name": "Стронций (25К-1) ГСО 7145-95, МСО 0083:1999, фон – вода, 1,0 г/дм3",
    "description": "Стронций (25К-1) ГСО 7145-95, МСО 0083:1999, фон – вода, 1,0 г/дм3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 242 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7145-95",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-136",
    "name": "СО Сурьма 0,1 мг/см3 ГСО 7204-95 МСО 0086:1999 до 21.02.2028. 23К-2",
    "description": "СО Сурьма 0,1 мг/см3 ГСО 7204-95 МСО 0086:1999 до 21.02.2028. 23К-2. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 242 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7204-95",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-137",
    "name": "СО ионов хрома 1 г/л, фон-вода (5мл) (бывш ГСО 8035-94)",
    "description": "СО ионов хрома 1 г/л, фон-вода (5мл) (бывш ГСО 8035-94). Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 278 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8035-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-138",
    "name": "Цинк (4К-1) ГСО 8053-94 (0008:1998)  1,0 (5)Фон –0,1 М НNO3",
    "description": "Цинк (4К-1) ГСО 8053-94 (0008:1998)  1,0 (5)Фон –0,1 М НNO3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 265 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8053-94",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-139",
    "name": "Нитрит-ион ГСО 7021-93 (1г/дм3) 7A-1, 3.09.03.02.0380,",
    "description": "Нитрит-ион ГСО 7021-93 (1г/дм3) 7A-1, 3.09.03.02.0380,. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 252 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7021-93",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-140",
    "name": "ГСО состава водного раствора сульфат-ионов Стандарт: ГСО 6693-93",
    "description": "ГСО состава водного раствора сульфат-ионов Стандарт: ГСО 6693-93. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 245 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-6693-93",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-141",
    "name": "Бензол ГСО 7141-95 МСО 0038:1998 (1,5 см3)",
    "description": "Бензол ГСО 7141-95 МСО 0038:1998 (1,5 см3). Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 249 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7141-95",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-142",
    "name": "Общая жесткость воды ГСО 9284-2008",
    "description": "Общая жесткость воды ГСО 9284-2008. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 222 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-9284-2008",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-143",
    "name": "Хлорид ионов 1А-1 ГСО 6687-93",
    "description": "Хлорид ионов 1А-1 ГСО 6687-93. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-6687-93",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-144",
    "name": "Цветность ГСО 7853-2000 (500 градусов),",
    "description": "Цветность ГСО 7853-2000 (500 градусов),. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [Suv Tahlili] • Narxi: 357 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7853-2000",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-145",
    "name": "ГСО 9437-2009 СО состава смеси триглицеридов жирных кислот",
    "description": "ГСО 9437-2009 СО состава смеси триглицеридов жирных кислот. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 520 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-9437-2009",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-146",
    "name": "Водный раствор сульфат-ионов (41А) ГСО 7437-98",
    "description": "Водный раствор сульфат-ионов (41А) ГСО 7437-98. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 246 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7437-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-147",
    "name": "Нитрат ион ГСО 6696-93",
    "description": "Нитрат ион ГСО 6696-93. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 220 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-6696-93",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-148",
    "name": "Молибден ГСО 8086-94",
    "description": "Молибден ГСО 8086-94. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8086-94",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-149",
    "name": "Cтандартный образец БПК (ХПК) ГСО 8048-94 БПК 116 (ХПК 204) мг/дм3",
    "description": "Cтандартный образец БПК (ХПК) ГСО 8048-94 БПК 116 (ХПК 204) мг/дм3. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 330 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8048-94",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-150",
    "name": "ГСО 7271-96, МСО 0101:1998 Мутность(формазиевая суспензия)",
    "description": "ГСО 7271-96, МСО 0101:1998 Мутность(формазиевая суспензия). Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [Suv Tahlili] • Narxi: 286 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7271-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-151",
    "name": "ГСО 7018-93 фосфат-ионов МСО 0026:1998 1мг/см3 фон-вода",
    "description": "ГСО 7018-93 фосфат-ионов МСО 0026:1998 1мг/см3 фон-вода. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7018-93",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-152",
    "name": "ХПК ГСО 7425-97",
    "description": "ХПК ГСО 7425-97. Ishlab chiqaruvchi: TsSOVV. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 400 000 so'm • Ishlab chiqaruvchi: TsSOVV",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7425-97",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-153",
    "name": "ГСО ХЛОРИД-ИОНОВ (9.5-10.5) ГСО 7478-98",
    "description": "ГСО ХЛОРИД-ИОНОВ (9.5-10.5) ГСО 7478-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7478-98",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-154",
    "name": "Ионов железа (III) ГСО 7476-98",
    "description": "Ионов железа (III) ГСО 7476-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7476-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-155",
    "name": "Сульфат- ионов ГСО 7253-96",
    "description": "Сульфат- ионов ГСО 7253-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 256 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7253-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-156",
    "name": "ГСО ИОНОВ КАДМИЯ (0.95-1.05) ГСО 7472-98",
    "description": "ГСО ИОНОВ КАДМИЯ (0.95-1.05) ГСО 7472-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 289 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7472-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-157",
    "name": "ГСО ионов меди ГСО 7255-96",
    "description": "ГСО ионов меди ГСО 7255-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 245 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7255-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-158",
    "name": "ГСО хлорид ионов ГСО 7262-96",
    "description": "ГСО хлорид ионов ГСО 7262-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 239 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7262-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-159",
    "name": "ГСО ионов хрома ГСО 7257-96",
    "description": "ГСО ионов хрома ГСО 7257-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 238 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7257-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-160",
    "name": "ГСО общей жесткости воды ГСО 8206-2002",
    "description": "ГСО общей жесткости воды ГСО 8206-2002. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 257 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8206-2002",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-161",
    "name": "ГСО фенола ГСО 7270-96",
    "description": "ГСО фенола ГСО 7270-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 260 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7270-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-162",
    "name": "ГСО ионов цинка ГСО 7256-96",
    "description": "ГСО ионов цинка ГСО 7256-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 265 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7256-96",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-163",
    "name": "ГСО ионов цинка ГСО 7470-98",
    "description": "ГСО ионов цинка ГСО 7470-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 265 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7470-98",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-164",
    "name": "ГСО ионов цинка ГСО 7471-98",
    "description": "ГСО ионов цинка ГСО 7471-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 290 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7471-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-165",
    "name": "ГСО ионов меди ГСО 8205-2002",
    "description": "ГСО ионов меди ГСО 8205-2002. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 286 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8205-2002",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-166",
    "name": "ГСО сульфат ионов ГСО 7480-98",
    "description": "ГСО сульфат ионов ГСО 7480-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 228 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7480-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-167",
    "name": "ГСО ионов аммония ГСО 7259-96",
    "description": "ГСО ионов аммония ГСО 7259-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 243 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7259-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-168",
    "name": "ГСО ионов мышьяка ГСО 7264-96",
    "description": "ГСО ионов мышьяка ГСО 7264-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 250 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7264-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-169",
    "name": "ГСО нитрат ионов ГСО 7258-96",
    "description": "ГСО нитрат ионов ГСО 7258-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 254 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7258-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-170",
    "name": "Ионов никеля ГСО 7265-96",
    "description": "Ионов никеля ГСО 7265-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 200 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7265-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-171",
    "name": "Ионов висмута ГСО 7477-98",
    "description": "Ионов висмута ГСО 7477-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 240 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7477-98",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-172",
    "name": "Ионов марганца ГСО 7266-96",
    "description": "Ионов марганца ГСО 7266-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 200 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7266-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-173",
    "name": "Ионов свинца ГСО 7252-96",
    "description": "Ионов свинца ГСО 7252-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 210 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7252-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-174",
    "name": "Ионов ртути ГСО 7263-96",
    "description": "Ионов ртути ГСО 7263-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 210 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7263-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-175",
    "name": "Ионов алюминия ГСО 7269-96",
    "description": "Ионов алюминия ГСО 7269-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 205 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7269-96",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-176",
    "name": "Ионов натрия ГСО 7474-98",
    "description": "Ионов натрия ГСО 7474-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 215 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7474-98",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-177",
    "name": "Ионов кобальта ГСО 7268-96",
    "description": "Ионов кобальта ГСО 7268-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 220 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7268-96",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-178",
    "name": "Ионов железа ГСО 7254-96",
    "description": "Ионов железа ГСО 7254-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 220 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7254-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-179",
    "name": "Нитрит ионов ГСО 7479-98",
    "description": "Нитрит ионов ГСО 7479-98. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 219 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7479-98",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-180",
    "name": "Ионов ванадия ГСО 7267-96",
    "description": "Ионов ванадия ГСО 7267-96. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 245 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7267-96",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-181",
    "name": "ГСО ионов висмута ГСО 8463-2003",
    "description": "ГСО ионов висмута ГСО 8463-2003. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 224 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8463-2003",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-182",
    "name": "Cтандартный образец окисляемость перманганатая 1мг/см3   ГСО  7797 :2000",
    "description": "Cтандартный образец окисляемость перманганатая 1мг/см3   ГСО  7797 :2000. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [GSO / CRM] • Narxi: 220 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7797",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-183",
    "name": "СО состава пестицида 4.4-ДДТ ГСО 8892-2007",
    "description": "СО состава пестицида 4.4-ДДТ ГСО 8892-2007. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Pestitsid GSO] • Narxi: 3 170 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8892-2007",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-184",
    "name": "СО состава пестицида 4.4-ДДД ГСО 8891-2007",
    "description": "СО состава пестицида 4.4-ДДД ГСО 8891-2007. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Pestitsid GSO] • Narxi: 2 830 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8891-2007",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-185",
    "name": "СО состава пестицида Альфа-ГХЦГ ГСО 8888-2007",
    "description": "СО состава пестицида Альфа-ГХЦГ ГСО 8888-2007. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Pestitsid GSO] • Narxi: 3 170 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8888-2007",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-186",
    "name": "СО состава пестицида Гамма-ГХЦГ ГСО 8890-2007",
    "description": "СО состава пестицида Гамма-ГХЦГ ГСО 8890-2007. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Pestitsid GSO] • Narxi: 2 890 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8890-2007",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-187",
    "name": "СО состава пестицида 4.4-ДДЭ ГСО 8893-2007",
    "description": "СО состава пестицида 4.4-ДДЭ ГСО 8893-2007. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Pestitsid GSO] • Narxi: 2 886 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-8893-2007",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-188",
    "name": "Нефтепродукт в гексане ГСО 7950-2001",
    "description": "Нефтепродукт в гексане ГСО 7950-2001. Ishlab chiqaruvchi: UZXP. Davlat metrologik pasporti bilan. • [Neft GSO] • Narxi: 1 064 000 so'm • Ishlab chiqaruvchi: UZXP",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GSO-7950-2001",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-189",
    "name": "Анти хлордан (y) SHAM_243958 10mg,98%",
    "description": "Анти хлордан (y) SHAM_243958 10mg,98%. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 2 715 958 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-488",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-190",
    "name": "а-BHC в н-гексане GBW(E)086403 1.2mL,1000mg/mL",
    "description": "а-BHC в н-гексане GBW(E)086403 1.2mL,1000mg/mL. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 1 077 018 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-489",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-191",
    "name": "p,p'-DDD в н-гексане GBW(E)086415 1.2mL,1000mg/mL",
    "description": "p,p'-DDD в н-гексане GBW(E)086415 1.2mL,1000mg/mL. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 866 297 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-490",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-192",
    "name": "Афлатоксин B1 в ацетонитриле BWQ8307-2016 1.2mL,2mg/mL",
    "description": "Афлатоксин B1 в ацетонитриле BWQ8307-2016 1.2mL,2mg/mL. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 1 404 806 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-491",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-193",
    "name": "Aфлатоксин M1 в ацетонитриле BWQ8130-2016 1mL,10mg/mL",
    "description": "Aфлатоксин M1 в ацетонитриле BWQ8130-2016 1mL,10mg/mL. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 1 662 353 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-492",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-194",
    "name": "HT-2 токсини ацетонитриле BWN5903-2016 1.2mL,100mg/mL",
    "description": "HT-2 токсини ацетонитриле BWN5903-2016 1.2mL,100mg/mL. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 2 637 913 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-493",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "gso-crm-195",
    "name": "Госсипол standard BWJ4861-2016 50mg, 99.65%",
    "description": "Госсипол standard BWJ4861-2016 50mg, 99.65%. Xalqaro CRM sertifikatlangan standart namunasi (Xitoy / Xalqaro akkreditatsiya). • [Import CRM] • Narxi: 2 861 121 so'm • Ishlab chiqaruvchi: Xalqaro standartlar laboratoriyasi (Xitoy)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-CRM-494",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Muzlatgichda (-18°C gacha)",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-196",
    "name": "Буферный раствор рН=1,68 (250 мл)",
    "description": "Буферный раствор рН=1,68. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-695",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-197",
    "name": "Буферный раствор рН=4,01 (250 мл)",
    "description": "Буферный раствор рН=4,01. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-696",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-198",
    "name": "Буферный раствор рН=6,86 (250 мл)",
    "description": "Буферный раствор рН=6,86. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-697",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-199",
    "name": "Буферный раствор рН=7,01 (250 мл)",
    "description": "Буферный раствор рН=7,01. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-698",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-200",
    "name": "Буферный раствор рН=9,18 (250 мл)",
    "description": "Буферный раствор рН=9,18. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-699",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-201",
    "name": "Буферный раствор рН=11,00 (250 мл)",
    "description": "Буферный раствор рН=11,00. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-700",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-202",
    "name": "Буферный раствор рН=1,48 (250 мл)",
    "description": "Буферный раствор рН=1,48. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-701",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-203",
    "name": "Буферный раствор рН=10,01 (250 мл)",
    "description": "Буферный раствор рН=10,01. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 576 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-702",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-204",
    "name": "Буферный раствор рН=4,01 (500 мл)",
    "description": "Буферный раствор рН=4,01. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-703",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-205",
    "name": "Буферный раствор рН=6,86 (500 мл)",
    "description": "Буферный раствор рН=6,86. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-704",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-206",
    "name": "Буферный раствор рН=7,01 (500 мл)",
    "description": "Буферный раствор рН=7,01. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-705",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-207",
    "name": "Буферный раствор рН=9,18 (500 мл)",
    "description": "Буферный раствор рН=9,18. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-706",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-208",
    "name": "Буферный раствор рН=10,01 (500 мл)",
    "description": "Буферный раствор рН=10,01. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-707",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-209",
    "name": "Буферный раствор рН=11,00 (500 мл)",
    "description": "Буферный раствор рН=11,00. Hajmi: 500 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [pH Bufer] • Narxi: 730 500 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-708",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-210",
    "name": "Калибровочный раствор для кондуктометра 5000 мкСм/см (250 мл)",
    "description": "Калибровочный раствор для кондуктометра 5000 мкСм/см. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 885 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-709",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-211",
    "name": "Калибровочный раствор для кондуктометра 80000 мкСм/см (250 мл)",
    "description": "Калибровочный раствор для кондуктометра 80000 мкСм/см. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 992 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-710",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-212",
    "name": "Калибровочный раствор для кондуктометра 111800 мкСм/см (250 мл)",
    "description": "Калибровочный раствор для кондуктометра 111800 мкСм/см. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 997 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-711",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-213",
    "name": "Калибровочный раствор 1382 мг/л (250 мл)",
    "description": "Калибровочный раствор 1382 мг/л. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 897 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-712",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-214",
    "name": "Калибровочный раствор для кондуктометра 1413 мкСм/см (250 мл)",
    "description": "Калибровочный раствор для кондуктометра 1413 мкСм/см. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 910 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-713",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "buf-215",
    "name": "Калибровочный раствор для кондуктометра 5 мкСм/см (250 мл)",
    "description": "Калибровочный раствор для кондуктометра 5 мкСм/см. Hajmi: 250 мл. pH-metrlar va konduktometrlarni aniq kalibrlash uchun standart eritma. • [EC Standart] • Narxi: 878 000 so'm",
    "unit": "liter",
    "min_stock_level": 10,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BUF-714",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-1",
    "name": "Раствор для титрования дихроматом калия (BWZ8249-2016 Potassium dichromate titration solution, 500 mL,c (1/6K2 Cr2O7) = 0.8000 mol/L, water)",
    "description": "BWZ8249-2016 Potassium dichromate titration solution, 500 mL,c (1/6K2 Cr2O7) = 0.8000 mol/L, water / Раствор для титрования дихроматом калия. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 722 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8249-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-2",
    "name": "Раствор для титрования азотной кислотой, фон вода ,0.1005mol/L (BWB2026-2016 Nitric acid titration solution, 100mL , 0.1005 mol/L, water)",
    "description": "BWB2026-2016 Nitric acid titration solution, 100mL , 0.1005 mol/L, water / Раствор для титрования азотной кислотой, фон вода ,0.1005mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 263 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2026-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-3",
    "name": "Стандартное вещество для определения pH раствора тригидрооксалата калия 1.68(25℃) (BWZ6591-2016 Potassium tri hydrogen oxalate pH solution standard substance   50mL)",
    "description": "BWZ6591-2016 Potassium tri hydrogen oxalate pH solution standard substance   50mL / Стандартное вещество для определения pH раствора тригидрооксалата калия 1.68(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 296 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6591-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-4",
    "name": "Буферный раствор тартрата гидрохлорида калия 3.55 (BWZ8168-2016 Potassium hydro gent art rate pH buffer solution, 500mL)",
    "description": "BWZ8168-2016 Potassium hydro gent art rate pH buffer solution, 500mL / Буферный раствор тартрата гидрохлорида калия 3.55. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 464 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ8168-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-5",
    "name": "Стандартное вещество для раствора смешанных фосфатов pH , 6.86(25℃) (GBW(E)130935 Standard substance for mixed phosphate pH solution,500mL)",
    "description": "GBW(E)130935 Standard substance for mixed phosphate pH solution,500mL / Стандартное вещество для раствора смешанных фосфатов pH , 6.86(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 560 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)130935",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-6",
    "name": "Гидрофталат калия 10 vials/kit, 4.00 (BWZ7116-2016 Potassium hydrogen phthalate,10pieces/box)",
    "description": "BWZ7116-2016 Potassium hydrogen phthalate,10pieces/box / Гидрофталат калия 10 vials/kit, 4.00. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 453 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7116-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-7",
    "name": "Эталонный образец pH буры 10 vials/kit,9.18 (BWZ7118-2016 Borax pH reference material,10pieces/box)",
    "description": "BWZ7118-2016 Borax pH reference material,10pieces/box / Эталонный образец pH буры 10 vials/kit,9.18. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 380 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7118-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-8",
    "name": "Раствор для титрования броматом калия-бромидом калия c(1/6KBrO3-KBr）=0.1009mol/L (BWZ8411-2016 Potassium bromate-potassium bromide titration solution, 500mL)",
    "description": "BWZ8411-2016 Potassium bromate-potassium bromide titration solution, 500mL / Раствор для титрования броматом калия-бромидом калия c(1/6KBrO3-KBr）=0.1009mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 1 064 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8411-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-9",
    "name": "Раствор карбоната калия 15%（w/v） (BWZ6144-2016 Potassium carbonate solution,100mL)",
    "description": "BWZ6144-2016 Potassium carbonate solution,100mL / Раствор карбоната калия 15%（w/v）. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 207 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6144-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-10",
    "name": "Раствор для титрования бикарбонатом натрия carbon dioxide-free water, 0.1004 mol/L (BWB2036-2016 Sodium bi carbonate titration solution,50mL)",
    "description": "BWB2036-2016 Sodium bi carbonate titration solution,50mL / Раствор для титрования бикарбонатом натрия carbon dioxide-free water, 0.1004 mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 313 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2036-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-11",
    "name": "Раствор титрованного тиоцианата калия 0.1005mol/L (BWZ8060-2016 Potassium thiocyanate titration solution, 500mL)",
    "description": "BWZ8060-2016 Potassium thiocyanate titration solution, 500mL / Раствор титрованного тиоцианата калия 0.1005mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 660 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8060-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-12",
    "name": "Раствор уксусной кислоты 3% (BWZ0077-2016 Acetic acid solution, 500mL)",
    "description": "BWZ0077-2016 Acetic acid solution, 500mL / Раствор уксусной кислоты 3%. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 610 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ0077-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-13",
    "name": "Ион йода в воде 1000μg/mL (BWZ6627-2016 Iodine ion in water,50mL)",
    "description": "BWZ6627-2016 Iodine ion in water,50mL / Ион йода в воде 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 263 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6627-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-14",
    "name": "Стандартный раствор хромата 1000μg/mL (BWZ7090-2016 Chromate Standard Solution, 100mL)",
    "description": "BWZ7090-2016 Chromate Standard Solution, 100mL / Стандартный раствор хромата 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 588 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7090-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-15",
    "name": "Раствор азотной кислоты 1%（v/v） (BWZ0142-2016 Nitric acid solution,500mL)",
    "description": "BWZ0142-2016 Nitric acid solution,500mL / Раствор азотной кислоты 1%（v/v）. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 386 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ0142-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-16",
    "name": "Стандартный раствор для титрования тиосульфата натрия 0.9940mol/L (BWZ8176-2016 Sodium thiosulfate standard titration solution, 500mL)",
    "description": "BWZ8176-2016 Sodium thiosulfate standard titration solution, 500mL / Стандартный раствор для титрования тиосульфата натрия 0.9940mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 795 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8176-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-17",
    "name": "Стандартный раствор хлорида аммония 1000μg/mL (BWJ4194-2016 Ammonium chloride standard solution,20mL)",
    "description": "BWJ4194-2016 Ammonium chloride standard solution,20mL / Стандартный раствор хлорида аммония 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 420 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWJ4194-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-18",
    "name": "Стандартный раствор йодата калия 1000μg/mL (BWZ6742-2016 Potassium iodate standard solution,20mL)",
    "description": "BWZ6742-2016 Potassium iodate standard solution,20mL / Стандартный раствор йодата калия 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 229 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6742-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-19",
    "name": "Раствор для титрования хлорида натрия 0.1007mol/L (BGBW(E)086419 Sodium chloride titration solution, 500mL)",
    "description": "BGBW(E)086419 Sodium chloride titration solution, 500mL / Раствор для титрования хлорида натрия 0.1007mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 560 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BGBW(E)086419",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-20",
    "name": "Раствор для титрования карбонатом натрия , c(1/2Na2CO3) = 0.1005mol/L (GBW(E)086341 Sodium carbonate titrations solution, 500mL)",
    "description": "GBW(E)086341 Sodium carbonate titrations solution, 500mL / Раствор для титрования карбонатом натрия , c(1/2Na2CO3) = 0.1005mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 655 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086341",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-21",
    "name": "Стандартный раствор сульфата железа(II) аммония 20% sulfuric acid and water, 0.2004 mol/L (BWZ8353-2016 Ferrous ammonium sulfate standard solution, 500mL)",
    "description": "BWZ8353-2016 Ferrous ammonium sulfate standard solution, 500mL / Стандартный раствор сульфата железа(II) аммония 20% sulfuric acid and water, 0.2004 mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 784 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8353-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-22",
    "name": "Насыщенный раствор бромида калия 0.809(25℃) (BWZ7490-2016 Potassium bromide saturated solution,500mL)",
    "description": "BWZ7490-2016 Potassium bromide saturated solution,500mL / Насыщенный раствор бромида калия 0.809(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 991 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7490-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-23",
    "name": "Раствор для титрования перманганатом калия 0.05015mol/L (BWZ8431-2016 Potassium permanganate titration solution,500mL)",
    "description": "BWZ8431-2016 Potassium permanganate titration solution,500mL / Раствор для титрования перманганатом калия 0.05015mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 655 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8431-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-24",
    "name": "Раствор серной кислоты для титрования c(1/2H2SO4)=0.1001mol/L (GBW(E)086342 Sulfuric acid solution for titrations, 50mL)",
    "description": "GBW(E)086342 Sulfuric acid solution for titrations, 50mL / Раствор серной кислоты для титрования c(1/2H2SO4)=0.1001mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 257 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086342",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-25",
    "name": "Раствор хлорида калия 1.010mol/L (BWZ8034-2016 Potassium Chloride Solution, 500mL)",
    "description": "BWZ8034-2016 Potassium Chloride Solution, 500mL / Раствор хлорида калия 1.010mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 560 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8034-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-26",
    "name": "BWZ6281-2016 Magnesium sulfate test solution, 100mL/ Раствор сульфата магния для анализа 120g/L",
    "description": "BWZ6281-2016 Magnesium sulfate test solution, 100mL/ Раствор сульфата магния для анализа 120g/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 291 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6281-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-27",
    "name": "BWZ8082-2016 Oxalic acid titration solution, 500mL/ Раствор щавелевой кислоты для титрования c(1/2H2C2O4)=0.1010mol/L",
    "description": "BWZ8082-2016 Oxalic acid titration solution, 500mL/ Раствор щавелевой кислоты для титрования c(1/2H2C2O4)=0.1010mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 593 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8082-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-28",
    "name": "BWZ8004-2016 Ammonium thiocyanate titration solution, 500mL/ Титрованный раствор тиоцианата аммония 0.1006mol/L",
    "description": "BWZ8004-2016 Ammonium thiocyanate titration solution, 500mL/ Титрованный раствор тиоцианата аммония 0.1006mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 655 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8004-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-29",
    "name": "Аммиачно-аммоний хлоридный буферный раствор Ammonia solution, 9.5 (BWZ6243-2016 Ammonia-ammonium chloride buffer solution, 500mL)",
    "description": "BWZ6243-2016 Ammonia-ammonium chloride buffer solution, 500mL / Аммиачно-аммоний хлоридный буферный раствор Ammonia solution, 9.5. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 459 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6243-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-30",
    "name": "Раствор йодата калия для титрования c(1/6KIO3)= 0.1004mol/L  c(KIO3)=0.01673mol/L(ChP) (GBW(E)086425 Potassium iodate solution for titrations, 500mL)",
    "description": "GBW(E)086425 Potassium iodate solution for titrations, 500mL / Раствор йодата калия для титрования c(1/6KIO3)= 0.1004mol/L  c(KIO3)=0.01673mol/L(ChP). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 1 120 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086425",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-31",
    "name": "Раствор тетрабората натрия 0.02000mol/L (BWZ8363-2016 Sodium tetraborate solution, 500mL)",
    "description": "BWZ8363-2016 Sodium tetraborate solution, 500mL / Раствор тетрабората натрия 0.02000mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 560 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8363-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-32",
    "name": "Раствор для титрования оксалата натрия c(1/2Na2C2O4) = 1.002mol/L c(Na2C2O4)=0.5010mol/L(ChP) (BWR0013-2016 Sodium oxalate titration solution, 100mL)",
    "description": "BWR0013-2016 Sodium oxalate titration solution, 100mL / Раствор для титрования оксалата натрия c(1/2Na2C2O4) = 1.002mol/L c(Na2C2O4)=0.5010mol/L(ChP). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 616 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWR0013-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-33",
    "name": "Раствор хлорида бария 100g/L (BWZ6066-2016 Barium chloride solution,100mL)",
    "description": "BWZ6066-2016 Barium chloride solution,100mL / Раствор хлорида бария 100g/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6066-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-34",
    "name": "Раствор для титрования дихроматом калия c(1/6K2Cr2O7)=0.1005mol/L (GBW(E)086346 Potassium dichromate titration solution, 500mL)",
    "description": "GBW(E)086346 Potassium dichromate titration solution, 500mL / Раствор для титрования дихроматом калия c(1/6K2Cr2O7)=0.1005mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 571 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086346",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-35",
    "name": "Ферроцианид калия в воде 10% (BWZ8637-2016 Potassium ferrocyanide in water,1L)",
    "description": "BWZ8637-2016 Potassium ferrocyanide in water,1L / Ферроцианид калия в воде 10%. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 1 204 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8637-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-36",
    "name": "Раствор для титрования соляной кислотой 0.1007mol/L (GBW(E)083798 Hydrochloric acid titration solution,500mL)",
    "description": "GBW(E)083798 Hydrochloric acid titration solution,500mL / Раствор для титрования соляной кислотой 0.1007mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 453 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)083798",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-37",
    "name": "Аналитический объемный раствор хлорида калия 0.01009mol/L (BWR3060-2016 Analytical Volumetric Solution Potassium Chloride, 50mL)",
    "description": "BWR3060-2016 Analytical Volumetric Solution Potassium Chloride, 50mL / Аналитический объемный раствор хлорида калия 0.01009mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 296 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWR3060-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-38",
    "name": "Раствор для титрования ЭДТА 0.05001mol/L (BWZ8361-2016 EDTA titration solution,500mL)",
    "description": "BWZ8361-2016 EDTA titration solution,500mL / Раствор для титрования ЭДТА 0.05001mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 638 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8361-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-39",
    "name": "Раствор для титрования гидроксидом калия 0.5007mol/L (GBW(E)083808 Potassium hydroxide titration solution, 100mL)",
    "description": "GBW(E)083808 Potassium hydroxide titration solution, 100mL / Раствор для титрования гидроксидом калия 0.5007mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 296 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)083808",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-40",
    "name": "Раствор для титрования гидроксидом натрия 1.005mol/L (GBW(E)083806 Sodium hydroxide titrations solution,500mL)",
    "description": "GBW(E)083806 Sodium hydroxide titrations solution,500mL / Раствор для титрования гидроксидом натрия 1.005mol/L. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Titrlash Eritmasi] • Narxi: 526 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "ampoule",
    "min_stock_level": 20,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)083806",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-41",
    "name": "Стандартный раствор никеля 5%HNO3,1000μg/mL (GBW(E)083786 Ni standard solution,100mL)",
    "description": "GBW(E)083786 Ni standard solution,100mL / Стандартный раствор никеля 5%HNO3,1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 436 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)083786",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-42",
    "name": "Стандартный раствор хрома 1000μg/mL (BWZ6851-2016 Cr6+ standard solution,50mL)",
    "description": "BWZ6851-2016 Cr6+ standard solution,50mL / Стандартный раствор хрома 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 319 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6851-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-43",
    "name": "Стандартный раствор кобальта 5% nitric acid, 1000 µg/mL (GBW(E)083781 Co standard solution, 50mL)",
    "description": "GBW(E)083781 Co standard solution, 50mL / Стандартный раствор кобальта 5% nitric acid, 1000 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 302 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)083781",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-44",
    "name": "Стандартный раствор магния 1000μg/mL (BWB2255-2016 Mg standard solution,50mL)",
    "description": "BWB2255-2016 Mg standard solution,50mL / Стандартный раствор магния 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 274 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2255-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-45",
    "name": "Стандартный раствор мышьяка 0.06% sodium bicarbonate, 100 µg/mL (BWB2507-2016 As3+standard solution,50mL)",
    "description": "BWB2507-2016 As3+standard solution,50mL / Стандартный раствор мышьяка 0.06% sodium bicarbonate, 100 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 772 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2507-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-46",
    "name": "Общий азот в воде 500μg/mL (GBW(E)086222 Total nitrogen in water,20mL)",
    "description": "GBW(E)086222 Total nitrogen in water,20mL / Общий азот в воде 500μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 240 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086222",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-47",
    "name": "Общий фосфор в воде 500μg/mL (GBW(E)086225 Total phosphorus in water, 50mL)",
    "description": "GBW(E)086225 Total phosphorus in water, 50mL / Общий фосфор в воде 500μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 330 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086225",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-48",
    "name": "Стандартный раствор алюминия 5% nitric acid, 1000 µg/mL (BWB2199-2016 Al standard solution, 50mL)",
    "description": "BWB2199-2016 Al standard solution, 50mL / Стандартный раствор алюминия 5% nitric acid, 1000 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 274 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2199-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-49",
    "name": "Стандартный раствор марганца 5% hydrochloric acid, 1000  µg/mL (BWB2069-2016 Mn standard solution,50mL)",
    "description": "BWB2069-2016 Mn standard solution,50mL / Стандартный раствор марганца 5% hydrochloric acid, 1000  µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 274 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2069-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-50",
    "name": "Стандартный раствор натрия 2% nitric acid, 1000 µg/mL (BWZ7423-2016 Na standard solution,100mL)",
    "description": "BWZ7423-2016 Na standard solution,100mL / Стандартный раствор натрия 2% nitric acid, 1000 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 436 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7423-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-51",
    "name": "Сера в воде 1000μg/mL (BWZ7041-2016 Sulfur in water, 50mL)",
    "description": "BWZ7041-2016 Sulfur in water, 50mL / Сера в воде 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 319 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7041-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-52",
    "name": "Стандартный раствор фосфата натрия 1000μg/mL (BWZ7370-2016 Sodium phosphate standard solution,50mL)",
    "description": "BWZ7370-2016 Sodium phosphate standard solution,50mL / Стандартный раствор фосфата натрия 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 319 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ7370-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-53",
    "name": "Водный раствор хлора 10000μg/mL (BWZ6859-2016 Cl-in water,50mL)",
    "description": "BWZ6859-2016 Cl-in water,50mL / Водный раствор хлора 10000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 520 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ6859-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-54",
    "name": "Стандартный раствор ртути  5% nitric acid, 1000 µg/mL (GBW(E)086362 Hg standard solution,50mL)",
    "description": "GBW(E)086362 Hg standard solution,50mL / Стандартный раствор ртути  5% nitric acid, 1000 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 268 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086362",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-55",
    "name": "Фосфат в воде 1000μg/mL (GBW(E)086177 Phosphate in water,50mL)",
    "description": "GBW(E)086177 Phosphate in water,50mL / Фосфат в воде 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 319 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086177",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-56",
    "name": "Мутность воды по Фуэрме (BWR3084-2016 Fuerma turbidity in water,50mL)",
    "description": "BWR3084-2016 Fuerma turbidity in water,50mL / Мутность воды по Фуэрме. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 862 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWR3084-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-57",
    "name": "Общая жесткость воды 1000 µg/m (GBW(E)086429 Total hardness in water,20mL)",
    "description": "GBW(E)086429 Total hardness in water,20mL / Общая жесткость воды 1000 µg/m. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)086429",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-58",
    "name": "Стандартный раствор железо  1000 µg/mL (BWB2448-2016 Fe3+standard solution, 50mL)",
    "description": "BWB2448-2016 Fe3+standard solution, 50mL / Стандартный раствор железо  1000 µg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 319 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2448-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-59",
    "name": "Стандартный раствор цинка 1000μg/mL (BWB2153-2016 Zn standard solution, 50mL)",
    "description": "BWB2153-2016 Zn standard solution, 50mL / Стандартный раствор цинка 1000μg/mL. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 207 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWB2153-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-60",
    "name": "Стандартный раствор сульфата железа(II) аммония (BWZ8092-2016 Ammonium iron(II) sulfate standard solution, 500mL)",
    "description": "BWZ8092-2016 Ammonium iron(II) sulfate standard solution, 500mL / Стандартный раствор сульфата железа(II) аммония. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [CRM Weiyel] • Narxi: 369 600 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/standard_samples.jpg",
    "qr_code_data": "WMS-GSO-BWZ8092-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+15°C dan +25°C gacha, quruq va qorong'i joyda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-61",
    "name": "Стандартный раствор боракса для определения pH 9.18（25℃） (GBW(E)130936 Borax pH solution standard substance,500mL)",
    "description": "GBW(E)130936 Borax pH solution standard substance,500mL / Стандартный раствор боракса для определения pH 9.18（25℃）. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 576 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)130936",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-62",
    "name": "Гидрофталат калия (стандарт pH) 4.01(25℃) (BWZ8128-2016A Potassium hydrogen phthalate pH solution standard substance, 250mL)",
    "description": "BWZ8128-2016A Potassium hydrogen phthalate pH solution standard substance, 250mL / Гидрофталат калия (стандарт pH) 4.01(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 487 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ8128-2016A",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-63",
    "name": "Раствор смешанных фосфатов с заданным pH 7.00 (25℃) (BWZ6621-2016 Mixed phosphate pH solution,50mL)",
    "description": "BWZ6621-2016 Mixed phosphate pH solution,50mL / Раствор смешанных фосфатов с заданным pH 7.00 (25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: 235 200 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6621-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-64",
    "name": "Стандартные растворы для измерения проводимости 84μS/cm(25℃) (BWZ6901-2016 Conductivity solution standards,250mL)",
    "description": "BWZ6901-2016 Conductivity solution standards,250mL / Стандартные растворы для измерения проводимости 84μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 744 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6901-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-65",
    "name": "Стандартный раствор для проверки электропроводности 1413μS/cm(25℃) (BWZ6902-2016 Conductivity standard solution,250mL)",
    "description": "BWZ6902-2016 Conductivity standard solution,250mL / Стандартный раствор для проверки электропроводности 1413μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 616 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6902-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-66",
    "name": "Стандартный раствор для проверки электропроводности 5000μS/cm(25℃) (BWZ7259-2016 Conductivity standard solution, 500mL)",
    "description": "BWZ7259-2016 Conductivity standard solution, 500mL / Стандартный раствор для проверки электропроводности 5000μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 890 400 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ7259-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-67",
    "name": "Стандартный раствор для проверки электропроводности 12.88mS/cm(25℃) (BWZ6903-2016 Conductivity standard solution,250mL)",
    "description": "BWZ6903-2016 Conductivity standard solution,250mL / Стандартный раствор для проверки электропроводности 12.88mS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 616 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6903-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-12-10",
    "expiry_date": "2026-12-15",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-68",
    "name": "Стандартный раствор для проверки электропроводности 50000μS/cm(25℃) (BWZ8322-2016 Conductivity solution standards, 500mL)",
    "description": "BWZ8322-2016 Conductivity solution standards, 500mL / Стандартный раствор для проверки электропроводности 50000μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 1 232 000 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ8322-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-69",
    "name": "Стандартный раствор для проверки электропроводности 10000μS/cm(25℃) (BWR3057-2016 Conductivity solution standard substance, 50mL)",
    "description": "BWR3057-2016 Conductivity solution standard substance, 50mL / Стандартный раствор для проверки электропроводности 10000μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 324 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWR3057-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-70",
    "name": "Стандартный раствор для проверки электропроводности 1413μS/cm(25℃) (BWR3043-2016 Conductivity solution standard substance, 50mL)",
    "description": "BWR3043-2016 Conductivity solution standard substance, 50mL / Стандартный раствор для проверки электропроводности 1413μS/cm(25℃). Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: 324 800 so'm • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWR3043-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2024-11-01",
    "expiry_date": "2026-11-30",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-71",
    "name": "Стандартный раствор для измерения электропроводности 2000μS/cm 25 (BWZ8404-2016 Conductivity Standard Solution 500mL)",
    "description": "BWZ8404-2016 Conductivity Standard Solution 500mL / Стандартный раствор для измерения электропроводности 2000μS/cm 25. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [EC Standart] • Narxi: Buyurtma asosida • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ8404-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-72",
    "name": "Стандартное вещество для смешанного фосфатного раствора с заданным pH (BWZ6837-2016 Mixed phosphate pH solution standard substance 250mL)",
    "description": "BWZ6837-2016 Mixed phosphate pH solution standard substance 250mL / Стандартное вещество для смешанного фосфатного раствора с заданным pH. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [pH Standart] • Narxi: Buyurtma asosida • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/buffer_solutions.jpg",
    "qr_code_data": "WMS-GSO-BWZ6837-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "+2°C dan +8°C gacha sovutgichda",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-73",
    "name": "Эталонный материал для измерения осмолярной концентрации (раствор хлорида натрия) 5mL*6,300 mOs mol/kg (GBW(E)130989 Osmolar concentration reference material (sodium chloride solution) 5mL*6)",
    "description": "GBW(E)130989 Osmolar concentration reference material (sodium chloride solution) 5mL*6 / Эталонный материал для измерения осмолярной концентрации (раствор хлорида натрия) 5mL*6,300 mOs mol/kg. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Etalon Standart] • Narxi: Buyurtma asosida • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "kg",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-GBW(E)130989",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-74",
    "name": "Показатель преломления и относительная плотность в глицерине (BWS0097-2016 Refractive index and relative density in glycerin 100mL)",
    "description": "BWS0097-2016 Refractive index and relative density in glycerin 100mL / Показатель преломления и относительная плотность в глицерине. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Etalon Standart] • Narxi: Buyurtma asosida • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-BWS0097-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2025-09-20",
    "expiry_date": "2028-09-20",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "weiyel-75",
    "name": "Стандартный раствор плотности 0,7781 г/мл при 20℃ (BWZ7486-2016 Density standard solution 0.7781g/ mL@20 ℃  100mL)",
    "description": "BWZ7486-2016 Density standard solution 0.7781g/ mL@20 ℃  100mL / Стандартный раствор плотности 0,7781 г/мл при 20℃. Ishlab chiqaruvchi: Weiyel. Yuqori aniqlikdagi xalqaro CRM standart namunasi. • [Etalon Standart] • Narxi: Buyurtma asosida • Ishlab chiqaruvchi: Weiyel CRM (Xitoy / Xalqaro akkreditatsiya)",
    "unit": "piece",
    "min_stock_level": 5,
    "image_url": "https://online-market-smoky.vercel.app/assets/images/precision_manometer.jpg",
    "qr_code_data": "WMS-GSO-BWZ7486-2016",
    "qr_code_image_url": null,
    "manufacture_date": "2026-02-10",
    "expiry_date": "2029-02-10",
    "storage_conditions": "Xona haroratida (15-25°C), quruq laboratoriya sharoitida",
    "created_at": "2026-08-15T08:00:00.000Z"
  }
];

// Real stock balance distributed across warehouses
export const INITIAL_STOCK: StockBalance[] = [
  {
    "id": "stk-dev-fluke-manometer-wh-main",
    "product_id": "dev-fluke-manometer",
    "warehouse_id": "wh-main",
    "quantity": 8,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-fluke-manometer-wh-north",
    "product_id": "dev-fluke-manometer",
    "warehouse_id": "wh-north",
    "quantity": 4,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-analytical-balance-wh-main",
    "product_id": "dev-analytical-balance",
    "warehouse_id": "wh-main",
    "quantity": 4,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-analytical-balance-wh-north",
    "product_id": "dev-analytical-balance",
    "warehouse_id": "wh-north",
    "quantity": 2,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-ph-meter-seven-wh-main",
    "product_id": "dev-ph-meter-seven",
    "warehouse_id": "wh-main",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-ph-meter-seven-wh-north",
    "product_id": "dev-ph-meter-seven",
    "warehouse_id": "wh-north",
    "quantity": 3,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-spectrophotometer-wh-main",
    "product_id": "dev-spectrophotometer",
    "warehouse_id": "wh-main",
    "quantity": 3,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-dev-spectrophotometer-wh-north",
    "product_id": "dev-spectrophotometer",
    "warehouse_id": "wh-north",
    "quantity": 1,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-1-wh-main",
    "product_id": "si-1",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-1-wh-north",
    "product_id": "si-1",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-1-wh-south",
    "product_id": "si-1",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-2-wh-main",
    "product_id": "si-2",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-2-wh-north",
    "product_id": "si-2",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-2-wh-south",
    "product_id": "si-2",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-3-wh-main",
    "product_id": "si-3",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-3-wh-north",
    "product_id": "si-3",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-3-wh-south",
    "product_id": "si-3",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-4-wh-main",
    "product_id": "si-4",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-4-wh-north",
    "product_id": "si-4",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-4-wh-south",
    "product_id": "si-4",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-5-wh-main",
    "product_id": "si-5",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-5-wh-north",
    "product_id": "si-5",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-5-wh-south",
    "product_id": "si-5",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-6-wh-main",
    "product_id": "si-6",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-6-wh-north",
    "product_id": "si-6",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-6-wh-south",
    "product_id": "si-6",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-7-wh-main",
    "product_id": "si-7",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-7-wh-north",
    "product_id": "si-7",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-7-wh-south",
    "product_id": "si-7",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-8-wh-main",
    "product_id": "si-8",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-8-wh-north",
    "product_id": "si-8",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-8-wh-south",
    "product_id": "si-8",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-9-wh-main",
    "product_id": "si-9",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-9-wh-north",
    "product_id": "si-9",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-9-wh-south",
    "product_id": "si-9",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-10-wh-main",
    "product_id": "si-10",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-10-wh-north",
    "product_id": "si-10",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-10-wh-south",
    "product_id": "si-10",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-11-wh-main",
    "product_id": "si-11",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-11-wh-north",
    "product_id": "si-11",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-11-wh-south",
    "product_id": "si-11",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-12-wh-main",
    "product_id": "si-12",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-12-wh-north",
    "product_id": "si-12",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-12-wh-south",
    "product_id": "si-12",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-13-wh-main",
    "product_id": "si-13",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-13-wh-north",
    "product_id": "si-13",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-13-wh-south",
    "product_id": "si-13",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-14-wh-main",
    "product_id": "si-14",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-14-wh-north",
    "product_id": "si-14",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-14-wh-south",
    "product_id": "si-14",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-15-wh-main",
    "product_id": "si-15",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-15-wh-north",
    "product_id": "si-15",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-15-wh-south",
    "product_id": "si-15",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-16-wh-main",
    "product_id": "si-16",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-16-wh-north",
    "product_id": "si-16",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-16-wh-south",
    "product_id": "si-16",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-17-wh-main",
    "product_id": "si-17",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-17-wh-north",
    "product_id": "si-17",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-17-wh-south",
    "product_id": "si-17",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-18-wh-main",
    "product_id": "si-18",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-18-wh-north",
    "product_id": "si-18",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-18-wh-south",
    "product_id": "si-18",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-19-wh-main",
    "product_id": "si-19",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-19-wh-north",
    "product_id": "si-19",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-19-wh-south",
    "product_id": "si-19",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-20-wh-main",
    "product_id": "si-20",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-20-wh-north",
    "product_id": "si-20",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-20-wh-south",
    "product_id": "si-20",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-21-wh-main",
    "product_id": "si-21",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-21-wh-north",
    "product_id": "si-21",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-21-wh-south",
    "product_id": "si-21",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-22-wh-main",
    "product_id": "si-22",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-22-wh-north",
    "product_id": "si-22",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-22-wh-south",
    "product_id": "si-22",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-23-wh-main",
    "product_id": "si-23",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-23-wh-north",
    "product_id": "si-23",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-23-wh-south",
    "product_id": "si-23",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-24-wh-main",
    "product_id": "si-24",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-24-wh-north",
    "product_id": "si-24",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-24-wh-south",
    "product_id": "si-24",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-25-wh-main",
    "product_id": "si-25",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-25-wh-north",
    "product_id": "si-25",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-25-wh-south",
    "product_id": "si-25",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-26-wh-main",
    "product_id": "si-26",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-26-wh-north",
    "product_id": "si-26",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-26-wh-south",
    "product_id": "si-26",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-27-wh-main",
    "product_id": "si-27",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-27-wh-north",
    "product_id": "si-27",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-27-wh-south",
    "product_id": "si-27",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-28-wh-main",
    "product_id": "si-28",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-28-wh-north",
    "product_id": "si-28",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-28-wh-south",
    "product_id": "si-28",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-29-wh-main",
    "product_id": "si-29",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-29-wh-north",
    "product_id": "si-29",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-29-wh-south",
    "product_id": "si-29",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-30-wh-main",
    "product_id": "si-30",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-30-wh-north",
    "product_id": "si-30",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-30-wh-south",
    "product_id": "si-30",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-31-wh-main",
    "product_id": "si-31",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-31-wh-north",
    "product_id": "si-31",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-31-wh-south",
    "product_id": "si-31",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-32-wh-main",
    "product_id": "si-32",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-32-wh-north",
    "product_id": "si-32",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-32-wh-south",
    "product_id": "si-32",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-33-wh-main",
    "product_id": "si-33",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-33-wh-north",
    "product_id": "si-33",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-33-wh-south",
    "product_id": "si-33",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-34-wh-main",
    "product_id": "si-34",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-34-wh-north",
    "product_id": "si-34",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-34-wh-south",
    "product_id": "si-34",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-35-wh-main",
    "product_id": "si-35",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-35-wh-north",
    "product_id": "si-35",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-35-wh-south",
    "product_id": "si-35",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-36-wh-main",
    "product_id": "si-36",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-36-wh-north",
    "product_id": "si-36",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-36-wh-south",
    "product_id": "si-36",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-37-wh-main",
    "product_id": "si-37",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-37-wh-north",
    "product_id": "si-37",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-37-wh-south",
    "product_id": "si-37",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-38-wh-main",
    "product_id": "si-38",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-38-wh-north",
    "product_id": "si-38",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-38-wh-south",
    "product_id": "si-38",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-39-wh-main",
    "product_id": "si-39",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-39-wh-north",
    "product_id": "si-39",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-39-wh-south",
    "product_id": "si-39",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-40-wh-main",
    "product_id": "si-40",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-40-wh-north",
    "product_id": "si-40",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-40-wh-south",
    "product_id": "si-40",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-41-wh-main",
    "product_id": "si-41",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-41-wh-north",
    "product_id": "si-41",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-41-wh-south",
    "product_id": "si-41",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-42-wh-main",
    "product_id": "si-42",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-42-wh-north",
    "product_id": "si-42",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-42-wh-south",
    "product_id": "si-42",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-43-wh-main",
    "product_id": "si-43",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-43-wh-north",
    "product_id": "si-43",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-43-wh-south",
    "product_id": "si-43",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-44-wh-main",
    "product_id": "si-44",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-44-wh-north",
    "product_id": "si-44",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-44-wh-south",
    "product_id": "si-44",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-45-wh-main",
    "product_id": "si-45",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-45-wh-north",
    "product_id": "si-45",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-45-wh-south",
    "product_id": "si-45",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-46-wh-main",
    "product_id": "si-46",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-46-wh-north",
    "product_id": "si-46",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-46-wh-south",
    "product_id": "si-46",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-47-wh-main",
    "product_id": "si-47",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-47-wh-north",
    "product_id": "si-47",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-47-wh-south",
    "product_id": "si-47",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-48-wh-main",
    "product_id": "si-48",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-48-wh-north",
    "product_id": "si-48",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-48-wh-south",
    "product_id": "si-48",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-49-wh-main",
    "product_id": "si-49",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-49-wh-north",
    "product_id": "si-49",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-49-wh-south",
    "product_id": "si-49",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-50-wh-main",
    "product_id": "si-50",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-50-wh-north",
    "product_id": "si-50",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-50-wh-south",
    "product_id": "si-50",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-51-wh-main",
    "product_id": "si-51",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-51-wh-north",
    "product_id": "si-51",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-51-wh-south",
    "product_id": "si-51",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-52-wh-main",
    "product_id": "si-52",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-52-wh-north",
    "product_id": "si-52",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-52-wh-south",
    "product_id": "si-52",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-53-wh-main",
    "product_id": "si-therm-53",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-53-wh-north",
    "product_id": "si-therm-53",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-53-wh-south",
    "product_id": "si-therm-53",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-54-wh-main",
    "product_id": "si-therm-54",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-54-wh-north",
    "product_id": "si-therm-54",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-54-wh-south",
    "product_id": "si-therm-54",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-55-wh-main",
    "product_id": "si-therm-55",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-55-wh-north",
    "product_id": "si-therm-55",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-55-wh-south",
    "product_id": "si-therm-55",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-56-wh-main",
    "product_id": "si-therm-56",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-56-wh-north",
    "product_id": "si-therm-56",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-56-wh-south",
    "product_id": "si-therm-56",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-57-wh-main",
    "product_id": "si-therm-57",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-57-wh-north",
    "product_id": "si-therm-57",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-57-wh-south",
    "product_id": "si-therm-57",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-58-wh-main",
    "product_id": "si-therm-58",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-58-wh-north",
    "product_id": "si-therm-58",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-58-wh-south",
    "product_id": "si-therm-58",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-59-wh-main",
    "product_id": "si-therm-59",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-59-wh-north",
    "product_id": "si-therm-59",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-59-wh-south",
    "product_id": "si-therm-59",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-60-wh-main",
    "product_id": "si-therm-60",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-60-wh-north",
    "product_id": "si-therm-60",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-60-wh-south",
    "product_id": "si-therm-60",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-61-wh-main",
    "product_id": "si-therm-61",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-61-wh-north",
    "product_id": "si-therm-61",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-61-wh-south",
    "product_id": "si-therm-61",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-62-wh-main",
    "product_id": "si-therm-62",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-62-wh-north",
    "product_id": "si-therm-62",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-si-therm-62-wh-south",
    "product_id": "si-therm-62",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-63-wh-main",
    "product_id": "titr-63",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-63-wh-north",
    "product_id": "titr-63",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-63-wh-south",
    "product_id": "titr-63",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-64-wh-main",
    "product_id": "titr-64",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-64-wh-north",
    "product_id": "titr-64",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-64-wh-south",
    "product_id": "titr-64",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-65-wh-main",
    "product_id": "titr-65",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-65-wh-north",
    "product_id": "titr-65",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-65-wh-south",
    "product_id": "titr-65",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-66-wh-main",
    "product_id": "titr-66",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-66-wh-north",
    "product_id": "titr-66",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-66-wh-south",
    "product_id": "titr-66",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-67-wh-main",
    "product_id": "titr-67",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-67-wh-north",
    "product_id": "titr-67",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-67-wh-south",
    "product_id": "titr-67",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-68-wh-main",
    "product_id": "titr-68",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-68-wh-north",
    "product_id": "titr-68",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-68-wh-south",
    "product_id": "titr-68",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-69-wh-main",
    "product_id": "titr-69",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-69-wh-north",
    "product_id": "titr-69",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-69-wh-south",
    "product_id": "titr-69",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-70-wh-main",
    "product_id": "titr-70",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-70-wh-north",
    "product_id": "titr-70",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-70-wh-south",
    "product_id": "titr-70",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-71-wh-main",
    "product_id": "titr-71",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-71-wh-north",
    "product_id": "titr-71",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-71-wh-south",
    "product_id": "titr-71",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-72-wh-main",
    "product_id": "titr-72",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-72-wh-north",
    "product_id": "titr-72",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-72-wh-south",
    "product_id": "titr-72",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-73-wh-main",
    "product_id": "titr-73",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-73-wh-north",
    "product_id": "titr-73",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-73-wh-south",
    "product_id": "titr-73",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-74-wh-main",
    "product_id": "titr-74",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-74-wh-north",
    "product_id": "titr-74",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-74-wh-south",
    "product_id": "titr-74",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-75-wh-main",
    "product_id": "titr-75",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-75-wh-north",
    "product_id": "titr-75",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-75-wh-south",
    "product_id": "titr-75",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-76-wh-main",
    "product_id": "titr-76",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-76-wh-north",
    "product_id": "titr-76",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-76-wh-south",
    "product_id": "titr-76",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-77-wh-main",
    "product_id": "titr-77",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-77-wh-north",
    "product_id": "titr-77",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-77-wh-south",
    "product_id": "titr-77",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-78-wh-main",
    "product_id": "titr-78",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-78-wh-north",
    "product_id": "titr-78",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-78-wh-south",
    "product_id": "titr-78",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-79-wh-main",
    "product_id": "titr-79",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-79-wh-north",
    "product_id": "titr-79",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-79-wh-south",
    "product_id": "titr-79",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-80-wh-main",
    "product_id": "titr-80",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-80-wh-north",
    "product_id": "titr-80",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-80-wh-south",
    "product_id": "titr-80",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-81-wh-main",
    "product_id": "titr-81",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-81-wh-north",
    "product_id": "titr-81",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-81-wh-south",
    "product_id": "titr-81",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-82-wh-main",
    "product_id": "titr-82",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-82-wh-north",
    "product_id": "titr-82",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-82-wh-south",
    "product_id": "titr-82",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-83-wh-main",
    "product_id": "titr-83",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-83-wh-north",
    "product_id": "titr-83",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-83-wh-south",
    "product_id": "titr-83",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-84-wh-main",
    "product_id": "titr-84",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-84-wh-north",
    "product_id": "titr-84",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-84-wh-south",
    "product_id": "titr-84",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-85-wh-main",
    "product_id": "titr-85",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-85-wh-north",
    "product_id": "titr-85",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-85-wh-south",
    "product_id": "titr-85",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-86-wh-main",
    "product_id": "titr-86",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-86-wh-north",
    "product_id": "titr-86",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-86-wh-south",
    "product_id": "titr-86",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-87-wh-main",
    "product_id": "titr-87",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-87-wh-north",
    "product_id": "titr-87",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-87-wh-south",
    "product_id": "titr-87",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-88-wh-main",
    "product_id": "titr-88",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-88-wh-north",
    "product_id": "titr-88",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-88-wh-south",
    "product_id": "titr-88",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-89-wh-main",
    "product_id": "titr-89",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-89-wh-north",
    "product_id": "titr-89",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-titr-89-wh-south",
    "product_id": "titr-89",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-90-wh-main",
    "product_id": "gso-90",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-90-wh-north",
    "product_id": "gso-90",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-90-wh-south",
    "product_id": "gso-90",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-91-wh-main",
    "product_id": "gso-91",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-91-wh-north",
    "product_id": "gso-91",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-91-wh-south",
    "product_id": "gso-91",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-92-wh-main",
    "product_id": "gso-92",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-92-wh-north",
    "product_id": "gso-92",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-92-wh-south",
    "product_id": "gso-92",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-93-wh-main",
    "product_id": "gso-93",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-93-wh-north",
    "product_id": "gso-93",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-93-wh-south",
    "product_id": "gso-93",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-94-wh-main",
    "product_id": "gso-94",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-94-wh-north",
    "product_id": "gso-94",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-94-wh-south",
    "product_id": "gso-94",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-95-wh-main",
    "product_id": "gso-95",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-95-wh-north",
    "product_id": "gso-95",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-95-wh-south",
    "product_id": "gso-95",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-96-wh-main",
    "product_id": "gso-96",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-96-wh-north",
    "product_id": "gso-96",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-96-wh-south",
    "product_id": "gso-96",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-97-wh-main",
    "product_id": "gso-97",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-97-wh-north",
    "product_id": "gso-97",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-97-wh-south",
    "product_id": "gso-97",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-98-wh-main",
    "product_id": "gso-98",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-98-wh-north",
    "product_id": "gso-98",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-98-wh-south",
    "product_id": "gso-98",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-99-wh-main",
    "product_id": "gso-99",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-99-wh-north",
    "product_id": "gso-99",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-99-wh-south",
    "product_id": "gso-99",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-100-wh-main",
    "product_id": "gso-100",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-100-wh-north",
    "product_id": "gso-100",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-100-wh-south",
    "product_id": "gso-100",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-101-wh-main",
    "product_id": "gso-101",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-101-wh-north",
    "product_id": "gso-101",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-101-wh-south",
    "product_id": "gso-101",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-102-wh-main",
    "product_id": "gso-102",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-102-wh-north",
    "product_id": "gso-102",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-102-wh-south",
    "product_id": "gso-102",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-103-wh-main",
    "product_id": "gso-103",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-103-wh-north",
    "product_id": "gso-103",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-103-wh-south",
    "product_id": "gso-103",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-104-wh-main",
    "product_id": "gso-104",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-104-wh-north",
    "product_id": "gso-104",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-104-wh-south",
    "product_id": "gso-104",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-105-wh-main",
    "product_id": "gso-105",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-105-wh-north",
    "product_id": "gso-105",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-105-wh-south",
    "product_id": "gso-105",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-106-wh-main",
    "product_id": "gso-106",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-106-wh-north",
    "product_id": "gso-106",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-106-wh-south",
    "product_id": "gso-106",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-107-wh-main",
    "product_id": "gso-107",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-107-wh-north",
    "product_id": "gso-107",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-107-wh-south",
    "product_id": "gso-107",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-108-wh-main",
    "product_id": "gso-108",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-108-wh-north",
    "product_id": "gso-108",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-108-wh-south",
    "product_id": "gso-108",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-109-wh-main",
    "product_id": "gso-109",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-109-wh-north",
    "product_id": "gso-109",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-109-wh-south",
    "product_id": "gso-109",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-110-wh-main",
    "product_id": "gso-110",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-110-wh-north",
    "product_id": "gso-110",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-110-wh-south",
    "product_id": "gso-110",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-111-wh-main",
    "product_id": "gso-111",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-111-wh-north",
    "product_id": "gso-111",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-111-wh-south",
    "product_id": "gso-111",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-112-wh-main",
    "product_id": "gso-112",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-112-wh-north",
    "product_id": "gso-112",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-112-wh-south",
    "product_id": "gso-112",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-113-wh-main",
    "product_id": "gso-113",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-113-wh-north",
    "product_id": "gso-113",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-113-wh-south",
    "product_id": "gso-113",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-114-wh-main",
    "product_id": "gso-114",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-114-wh-north",
    "product_id": "gso-114",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-114-wh-south",
    "product_id": "gso-114",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-115-wh-main",
    "product_id": "gso-115",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-115-wh-north",
    "product_id": "gso-115",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-115-wh-south",
    "product_id": "gso-115",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-116-wh-main",
    "product_id": "gso-116",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-116-wh-north",
    "product_id": "gso-116",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-116-wh-south",
    "product_id": "gso-116",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-117-wh-main",
    "product_id": "gso-117",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-117-wh-north",
    "product_id": "gso-117",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-117-wh-south",
    "product_id": "gso-117",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-118-wh-main",
    "product_id": "gso-118",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-118-wh-north",
    "product_id": "gso-118",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-118-wh-south",
    "product_id": "gso-118",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-119-wh-main",
    "product_id": "gso-119",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-119-wh-north",
    "product_id": "gso-119",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-119-wh-south",
    "product_id": "gso-119",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-120-wh-main",
    "product_id": "gso-120",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-120-wh-north",
    "product_id": "gso-120",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-120-wh-south",
    "product_id": "gso-120",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-121-wh-main",
    "product_id": "gso-121",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-121-wh-north",
    "product_id": "gso-121",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-121-wh-south",
    "product_id": "gso-121",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-122-wh-main",
    "product_id": "gso-122",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-122-wh-north",
    "product_id": "gso-122",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-122-wh-south",
    "product_id": "gso-122",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-123-wh-main",
    "product_id": "gso-123",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-123-wh-north",
    "product_id": "gso-123",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-123-wh-south",
    "product_id": "gso-123",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-124-wh-main",
    "product_id": "gso-124",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-124-wh-north",
    "product_id": "gso-124",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-124-wh-south",
    "product_id": "gso-124",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-125-wh-main",
    "product_id": "gso-125",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-125-wh-north",
    "product_id": "gso-125",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-125-wh-south",
    "product_id": "gso-125",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-126-wh-main",
    "product_id": "gso-126",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-126-wh-north",
    "product_id": "gso-126",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-126-wh-south",
    "product_id": "gso-126",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-127-wh-main",
    "product_id": "gso-127",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-127-wh-north",
    "product_id": "gso-127",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-127-wh-south",
    "product_id": "gso-127",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-128-wh-main",
    "product_id": "gso-128",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-128-wh-north",
    "product_id": "gso-128",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-128-wh-south",
    "product_id": "gso-128",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-129-wh-main",
    "product_id": "gso-129",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-129-wh-north",
    "product_id": "gso-129",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-129-wh-south",
    "product_id": "gso-129",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-130-wh-main",
    "product_id": "gso-130",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-130-wh-north",
    "product_id": "gso-130",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-130-wh-south",
    "product_id": "gso-130",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-131-wh-main",
    "product_id": "gso-131",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-131-wh-north",
    "product_id": "gso-131",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-131-wh-south",
    "product_id": "gso-131",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-132-wh-main",
    "product_id": "gso-132",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-132-wh-north",
    "product_id": "gso-132",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-132-wh-south",
    "product_id": "gso-132",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-133-wh-main",
    "product_id": "gso-133",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-133-wh-north",
    "product_id": "gso-133",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-133-wh-south",
    "product_id": "gso-133",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-134-wh-main",
    "product_id": "gso-134",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-134-wh-north",
    "product_id": "gso-134",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-134-wh-south",
    "product_id": "gso-134",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-135-wh-main",
    "product_id": "gso-135",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-135-wh-north",
    "product_id": "gso-135",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-135-wh-south",
    "product_id": "gso-135",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-136-wh-main",
    "product_id": "gso-136",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-136-wh-north",
    "product_id": "gso-136",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-136-wh-south",
    "product_id": "gso-136",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-137-wh-main",
    "product_id": "gso-137",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-137-wh-north",
    "product_id": "gso-137",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-137-wh-south",
    "product_id": "gso-137",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-138-wh-main",
    "product_id": "gso-138",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-138-wh-north",
    "product_id": "gso-138",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-138-wh-south",
    "product_id": "gso-138",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-139-wh-main",
    "product_id": "gso-139",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-139-wh-north",
    "product_id": "gso-139",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-139-wh-south",
    "product_id": "gso-139",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-140-wh-main",
    "product_id": "gso-140",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-140-wh-north",
    "product_id": "gso-140",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-140-wh-south",
    "product_id": "gso-140",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-141-wh-main",
    "product_id": "gso-141",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-141-wh-north",
    "product_id": "gso-141",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-141-wh-south",
    "product_id": "gso-141",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-142-wh-main",
    "product_id": "gso-142",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-142-wh-north",
    "product_id": "gso-142",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-142-wh-south",
    "product_id": "gso-142",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-143-wh-main",
    "product_id": "gso-143",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-143-wh-north",
    "product_id": "gso-143",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-143-wh-south",
    "product_id": "gso-143",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-144-wh-main",
    "product_id": "gso-144",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-144-wh-north",
    "product_id": "gso-144",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-144-wh-south",
    "product_id": "gso-144",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-145-wh-main",
    "product_id": "gso-145",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-145-wh-north",
    "product_id": "gso-145",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-145-wh-south",
    "product_id": "gso-145",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-146-wh-main",
    "product_id": "gso-146",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-146-wh-north",
    "product_id": "gso-146",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-146-wh-south",
    "product_id": "gso-146",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-147-wh-main",
    "product_id": "gso-147",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-147-wh-north",
    "product_id": "gso-147",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-147-wh-south",
    "product_id": "gso-147",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-148-wh-main",
    "product_id": "gso-148",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-148-wh-north",
    "product_id": "gso-148",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-148-wh-south",
    "product_id": "gso-148",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-149-wh-main",
    "product_id": "gso-149",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-149-wh-north",
    "product_id": "gso-149",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-149-wh-south",
    "product_id": "gso-149",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-150-wh-main",
    "product_id": "gso-150",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-150-wh-north",
    "product_id": "gso-150",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-150-wh-south",
    "product_id": "gso-150",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-151-wh-main",
    "product_id": "gso-151",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-151-wh-north",
    "product_id": "gso-151",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-151-wh-south",
    "product_id": "gso-151",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-152-wh-main",
    "product_id": "gso-152",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-152-wh-north",
    "product_id": "gso-152",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-152-wh-south",
    "product_id": "gso-152",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-153-wh-main",
    "product_id": "gso-153",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-153-wh-north",
    "product_id": "gso-153",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-153-wh-south",
    "product_id": "gso-153",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-154-wh-main",
    "product_id": "gso-154",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-154-wh-north",
    "product_id": "gso-154",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-154-wh-south",
    "product_id": "gso-154",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-155-wh-main",
    "product_id": "gso-155",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-155-wh-north",
    "product_id": "gso-155",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-155-wh-south",
    "product_id": "gso-155",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-156-wh-main",
    "product_id": "gso-156",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-156-wh-north",
    "product_id": "gso-156",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-156-wh-south",
    "product_id": "gso-156",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-157-wh-main",
    "product_id": "gso-157",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-157-wh-north",
    "product_id": "gso-157",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-157-wh-south",
    "product_id": "gso-157",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-158-wh-main",
    "product_id": "gso-158",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-158-wh-north",
    "product_id": "gso-158",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-158-wh-south",
    "product_id": "gso-158",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-159-wh-main",
    "product_id": "gso-159",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-159-wh-north",
    "product_id": "gso-159",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-159-wh-south",
    "product_id": "gso-159",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-160-wh-main",
    "product_id": "gso-160",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-160-wh-north",
    "product_id": "gso-160",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-160-wh-south",
    "product_id": "gso-160",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-161-wh-main",
    "product_id": "gso-161",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-161-wh-north",
    "product_id": "gso-161",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-161-wh-south",
    "product_id": "gso-161",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-162-wh-main",
    "product_id": "gso-162",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-162-wh-north",
    "product_id": "gso-162",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-162-wh-south",
    "product_id": "gso-162",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-163-wh-main",
    "product_id": "gso-163",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-163-wh-north",
    "product_id": "gso-163",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-163-wh-south",
    "product_id": "gso-163",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-164-wh-main",
    "product_id": "gso-164",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-164-wh-north",
    "product_id": "gso-164",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-164-wh-south",
    "product_id": "gso-164",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-165-wh-main",
    "product_id": "gso-165",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-165-wh-north",
    "product_id": "gso-165",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-165-wh-south",
    "product_id": "gso-165",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-166-wh-main",
    "product_id": "gso-166",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-166-wh-north",
    "product_id": "gso-166",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-166-wh-south",
    "product_id": "gso-166",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-167-wh-main",
    "product_id": "gso-167",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-167-wh-north",
    "product_id": "gso-167",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-167-wh-south",
    "product_id": "gso-167",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-168-wh-main",
    "product_id": "gso-168",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-168-wh-north",
    "product_id": "gso-168",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-168-wh-south",
    "product_id": "gso-168",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-169-wh-main",
    "product_id": "gso-169",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-169-wh-north",
    "product_id": "gso-169",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-169-wh-south",
    "product_id": "gso-169",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-170-wh-main",
    "product_id": "gso-170",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-170-wh-north",
    "product_id": "gso-170",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-170-wh-south",
    "product_id": "gso-170",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-171-wh-main",
    "product_id": "gso-171",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-171-wh-north",
    "product_id": "gso-171",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-171-wh-south",
    "product_id": "gso-171",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-172-wh-main",
    "product_id": "gso-172",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-172-wh-north",
    "product_id": "gso-172",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-172-wh-south",
    "product_id": "gso-172",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-173-wh-main",
    "product_id": "gso-173",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-173-wh-north",
    "product_id": "gso-173",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-173-wh-south",
    "product_id": "gso-173",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-174-wh-main",
    "product_id": "gso-174",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-174-wh-north",
    "product_id": "gso-174",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-174-wh-south",
    "product_id": "gso-174",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-175-wh-main",
    "product_id": "gso-175",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-175-wh-north",
    "product_id": "gso-175",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-175-wh-south",
    "product_id": "gso-175",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-176-wh-main",
    "product_id": "gso-176",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-176-wh-north",
    "product_id": "gso-176",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-176-wh-south",
    "product_id": "gso-176",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-177-wh-main",
    "product_id": "gso-177",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-177-wh-north",
    "product_id": "gso-177",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-177-wh-south",
    "product_id": "gso-177",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-178-wh-main",
    "product_id": "gso-178",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-178-wh-north",
    "product_id": "gso-178",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-178-wh-south",
    "product_id": "gso-178",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-179-wh-main",
    "product_id": "gso-179",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-179-wh-north",
    "product_id": "gso-179",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-179-wh-south",
    "product_id": "gso-179",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-180-wh-main",
    "product_id": "gso-180",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-180-wh-north",
    "product_id": "gso-180",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-180-wh-south",
    "product_id": "gso-180",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-181-wh-main",
    "product_id": "gso-181",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-181-wh-north",
    "product_id": "gso-181",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-181-wh-south",
    "product_id": "gso-181",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-182-wh-main",
    "product_id": "gso-182",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-182-wh-north",
    "product_id": "gso-182",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-182-wh-south",
    "product_id": "gso-182",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-183-wh-main",
    "product_id": "gso-183",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-183-wh-north",
    "product_id": "gso-183",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-183-wh-south",
    "product_id": "gso-183",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-184-wh-main",
    "product_id": "gso-184",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-184-wh-north",
    "product_id": "gso-184",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-184-wh-south",
    "product_id": "gso-184",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-185-wh-main",
    "product_id": "gso-185",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-185-wh-north",
    "product_id": "gso-185",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-185-wh-south",
    "product_id": "gso-185",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-186-wh-main",
    "product_id": "gso-186",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-186-wh-north",
    "product_id": "gso-186",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-186-wh-south",
    "product_id": "gso-186",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-187-wh-main",
    "product_id": "gso-187",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-187-wh-north",
    "product_id": "gso-187",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-187-wh-south",
    "product_id": "gso-187",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-188-wh-main",
    "product_id": "gso-188",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-188-wh-north",
    "product_id": "gso-188",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-188-wh-south",
    "product_id": "gso-188",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-189-wh-main",
    "product_id": "gso-crm-189",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-189-wh-north",
    "product_id": "gso-crm-189",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-189-wh-south",
    "product_id": "gso-crm-189",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-190-wh-main",
    "product_id": "gso-crm-190",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-190-wh-north",
    "product_id": "gso-crm-190",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-190-wh-south",
    "product_id": "gso-crm-190",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-191-wh-main",
    "product_id": "gso-crm-191",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-191-wh-north",
    "product_id": "gso-crm-191",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-191-wh-south",
    "product_id": "gso-crm-191",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-192-wh-main",
    "product_id": "gso-crm-192",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-192-wh-north",
    "product_id": "gso-crm-192",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-192-wh-south",
    "product_id": "gso-crm-192",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-193-wh-main",
    "product_id": "gso-crm-193",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-193-wh-north",
    "product_id": "gso-crm-193",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-193-wh-south",
    "product_id": "gso-crm-193",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-194-wh-main",
    "product_id": "gso-crm-194",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-194-wh-north",
    "product_id": "gso-crm-194",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-194-wh-south",
    "product_id": "gso-crm-194",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-195-wh-main",
    "product_id": "gso-crm-195",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-195-wh-north",
    "product_id": "gso-crm-195",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-gso-crm-195-wh-south",
    "product_id": "gso-crm-195",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-196-wh-main",
    "product_id": "buf-196",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-196-wh-north",
    "product_id": "buf-196",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-196-wh-south",
    "product_id": "buf-196",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-197-wh-main",
    "product_id": "buf-197",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-197-wh-north",
    "product_id": "buf-197",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-197-wh-south",
    "product_id": "buf-197",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-198-wh-main",
    "product_id": "buf-198",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-198-wh-north",
    "product_id": "buf-198",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-198-wh-south",
    "product_id": "buf-198",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-199-wh-main",
    "product_id": "buf-199",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-199-wh-north",
    "product_id": "buf-199",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-199-wh-south",
    "product_id": "buf-199",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-200-wh-main",
    "product_id": "buf-200",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-200-wh-north",
    "product_id": "buf-200",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-200-wh-south",
    "product_id": "buf-200",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-201-wh-main",
    "product_id": "buf-201",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-201-wh-north",
    "product_id": "buf-201",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-201-wh-south",
    "product_id": "buf-201",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-202-wh-main",
    "product_id": "buf-202",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-202-wh-north",
    "product_id": "buf-202",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-202-wh-south",
    "product_id": "buf-202",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-203-wh-main",
    "product_id": "buf-203",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-203-wh-north",
    "product_id": "buf-203",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-203-wh-south",
    "product_id": "buf-203",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-204-wh-main",
    "product_id": "buf-204",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-204-wh-north",
    "product_id": "buf-204",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-204-wh-south",
    "product_id": "buf-204",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-205-wh-main",
    "product_id": "buf-205",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-205-wh-north",
    "product_id": "buf-205",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-205-wh-south",
    "product_id": "buf-205",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-206-wh-main",
    "product_id": "buf-206",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-206-wh-north",
    "product_id": "buf-206",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-206-wh-south",
    "product_id": "buf-206",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-207-wh-main",
    "product_id": "buf-207",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-207-wh-north",
    "product_id": "buf-207",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-207-wh-south",
    "product_id": "buf-207",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-208-wh-main",
    "product_id": "buf-208",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-208-wh-north",
    "product_id": "buf-208",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-208-wh-south",
    "product_id": "buf-208",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-209-wh-main",
    "product_id": "buf-209",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-209-wh-north",
    "product_id": "buf-209",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-209-wh-south",
    "product_id": "buf-209",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-210-wh-main",
    "product_id": "buf-210",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-210-wh-north",
    "product_id": "buf-210",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-210-wh-south",
    "product_id": "buf-210",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-211-wh-main",
    "product_id": "buf-211",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-211-wh-north",
    "product_id": "buf-211",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-211-wh-south",
    "product_id": "buf-211",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-212-wh-main",
    "product_id": "buf-212",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-212-wh-north",
    "product_id": "buf-212",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-212-wh-south",
    "product_id": "buf-212",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-213-wh-main",
    "product_id": "buf-213",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-213-wh-north",
    "product_id": "buf-213",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-213-wh-south",
    "product_id": "buf-213",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-214-wh-main",
    "product_id": "buf-214",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-214-wh-north",
    "product_id": "buf-214",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-214-wh-south",
    "product_id": "buf-214",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-215-wh-main",
    "product_id": "buf-215",
    "warehouse_id": "wh-main",
    "quantity": 30,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-215-wh-north",
    "product_id": "buf-215",
    "warehouse_id": "wh-north",
    "quantity": 15,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-buf-215-wh-south",
    "product_id": "buf-215",
    "warehouse_id": "wh-south",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-1-wh-main",
    "product_id": "weiyel-1",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-1-wh-north",
    "product_id": "weiyel-1",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-2-wh-main",
    "product_id": "weiyel-2",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-2-wh-north",
    "product_id": "weiyel-2",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-3-wh-main",
    "product_id": "weiyel-3",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-3-wh-north",
    "product_id": "weiyel-3",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-4-wh-main",
    "product_id": "weiyel-4",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-4-wh-north",
    "product_id": "weiyel-4",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-5-wh-main",
    "product_id": "weiyel-5",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-5-wh-north",
    "product_id": "weiyel-5",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-6-wh-main",
    "product_id": "weiyel-6",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-6-wh-north",
    "product_id": "weiyel-6",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-7-wh-main",
    "product_id": "weiyel-7",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-7-wh-north",
    "product_id": "weiyel-7",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-8-wh-main",
    "product_id": "weiyel-8",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-8-wh-north",
    "product_id": "weiyel-8",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-9-wh-main",
    "product_id": "weiyel-9",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-9-wh-north",
    "product_id": "weiyel-9",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-10-wh-main",
    "product_id": "weiyel-10",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-10-wh-north",
    "product_id": "weiyel-10",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-11-wh-main",
    "product_id": "weiyel-11",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-11-wh-north",
    "product_id": "weiyel-11",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-12-wh-main",
    "product_id": "weiyel-12",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-12-wh-north",
    "product_id": "weiyel-12",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-13-wh-main",
    "product_id": "weiyel-13",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-13-wh-north",
    "product_id": "weiyel-13",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-14-wh-main",
    "product_id": "weiyel-14",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-14-wh-north",
    "product_id": "weiyel-14",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-15-wh-main",
    "product_id": "weiyel-15",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-15-wh-north",
    "product_id": "weiyel-15",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-16-wh-main",
    "product_id": "weiyel-16",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-16-wh-north",
    "product_id": "weiyel-16",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-17-wh-main",
    "product_id": "weiyel-17",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-17-wh-north",
    "product_id": "weiyel-17",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-18-wh-main",
    "product_id": "weiyel-18",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-18-wh-north",
    "product_id": "weiyel-18",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-19-wh-main",
    "product_id": "weiyel-19",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-19-wh-north",
    "product_id": "weiyel-19",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-20-wh-main",
    "product_id": "weiyel-20",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-20-wh-north",
    "product_id": "weiyel-20",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-21-wh-main",
    "product_id": "weiyel-21",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-21-wh-north",
    "product_id": "weiyel-21",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-22-wh-main",
    "product_id": "weiyel-22",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-22-wh-north",
    "product_id": "weiyel-22",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-23-wh-main",
    "product_id": "weiyel-23",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-23-wh-north",
    "product_id": "weiyel-23",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-24-wh-main",
    "product_id": "weiyel-24",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-24-wh-north",
    "product_id": "weiyel-24",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-25-wh-main",
    "product_id": "weiyel-25",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-25-wh-north",
    "product_id": "weiyel-25",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-26-wh-main",
    "product_id": "weiyel-26",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-26-wh-north",
    "product_id": "weiyel-26",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-27-wh-main",
    "product_id": "weiyel-27",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-27-wh-north",
    "product_id": "weiyel-27",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-28-wh-main",
    "product_id": "weiyel-28",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-28-wh-north",
    "product_id": "weiyel-28",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-29-wh-main",
    "product_id": "weiyel-29",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-29-wh-north",
    "product_id": "weiyel-29",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-30-wh-main",
    "product_id": "weiyel-30",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-30-wh-north",
    "product_id": "weiyel-30",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-31-wh-main",
    "product_id": "weiyel-31",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-31-wh-north",
    "product_id": "weiyel-31",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-32-wh-main",
    "product_id": "weiyel-32",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-32-wh-north",
    "product_id": "weiyel-32",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-33-wh-main",
    "product_id": "weiyel-33",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-33-wh-north",
    "product_id": "weiyel-33",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-34-wh-main",
    "product_id": "weiyel-34",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-34-wh-north",
    "product_id": "weiyel-34",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-35-wh-main",
    "product_id": "weiyel-35",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-35-wh-north",
    "product_id": "weiyel-35",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-36-wh-main",
    "product_id": "weiyel-36",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-36-wh-north",
    "product_id": "weiyel-36",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-37-wh-main",
    "product_id": "weiyel-37",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-37-wh-north",
    "product_id": "weiyel-37",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-38-wh-main",
    "product_id": "weiyel-38",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-38-wh-north",
    "product_id": "weiyel-38",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-39-wh-main",
    "product_id": "weiyel-39",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-39-wh-north",
    "product_id": "weiyel-39",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-40-wh-main",
    "product_id": "weiyel-40",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-40-wh-north",
    "product_id": "weiyel-40",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-41-wh-main",
    "product_id": "weiyel-41",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-41-wh-north",
    "product_id": "weiyel-41",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-42-wh-main",
    "product_id": "weiyel-42",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-42-wh-north",
    "product_id": "weiyel-42",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-43-wh-main",
    "product_id": "weiyel-43",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-43-wh-north",
    "product_id": "weiyel-43",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-44-wh-main",
    "product_id": "weiyel-44",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-44-wh-north",
    "product_id": "weiyel-44",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-45-wh-main",
    "product_id": "weiyel-45",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-45-wh-north",
    "product_id": "weiyel-45",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-46-wh-main",
    "product_id": "weiyel-46",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-46-wh-north",
    "product_id": "weiyel-46",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-47-wh-main",
    "product_id": "weiyel-47",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-47-wh-north",
    "product_id": "weiyel-47",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-48-wh-main",
    "product_id": "weiyel-48",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-48-wh-north",
    "product_id": "weiyel-48",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-49-wh-main",
    "product_id": "weiyel-49",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-49-wh-north",
    "product_id": "weiyel-49",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-50-wh-main",
    "product_id": "weiyel-50",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-50-wh-north",
    "product_id": "weiyel-50",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-51-wh-main",
    "product_id": "weiyel-51",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-51-wh-north",
    "product_id": "weiyel-51",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-52-wh-main",
    "product_id": "weiyel-52",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-52-wh-north",
    "product_id": "weiyel-52",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-53-wh-main",
    "product_id": "weiyel-53",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-53-wh-north",
    "product_id": "weiyel-53",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-54-wh-main",
    "product_id": "weiyel-54",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-54-wh-north",
    "product_id": "weiyel-54",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-55-wh-main",
    "product_id": "weiyel-55",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-55-wh-north",
    "product_id": "weiyel-55",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-56-wh-main",
    "product_id": "weiyel-56",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-56-wh-north",
    "product_id": "weiyel-56",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-57-wh-main",
    "product_id": "weiyel-57",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-57-wh-north",
    "product_id": "weiyel-57",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-58-wh-main",
    "product_id": "weiyel-58",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-58-wh-north",
    "product_id": "weiyel-58",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-59-wh-main",
    "product_id": "weiyel-59",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-59-wh-north",
    "product_id": "weiyel-59",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-60-wh-main",
    "product_id": "weiyel-60",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-60-wh-north",
    "product_id": "weiyel-60",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-61-wh-main",
    "product_id": "weiyel-61",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-61-wh-north",
    "product_id": "weiyel-61",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-62-wh-main",
    "product_id": "weiyel-62",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-62-wh-north",
    "product_id": "weiyel-62",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-63-wh-main",
    "product_id": "weiyel-63",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-63-wh-north",
    "product_id": "weiyel-63",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-64-wh-main",
    "product_id": "weiyel-64",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-64-wh-north",
    "product_id": "weiyel-64",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-65-wh-main",
    "product_id": "weiyel-65",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-65-wh-north",
    "product_id": "weiyel-65",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-66-wh-main",
    "product_id": "weiyel-66",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-66-wh-north",
    "product_id": "weiyel-66",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-67-wh-main",
    "product_id": "weiyel-67",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-67-wh-north",
    "product_id": "weiyel-67",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-68-wh-main",
    "product_id": "weiyel-68",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-68-wh-north",
    "product_id": "weiyel-68",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-69-wh-main",
    "product_id": "weiyel-69",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-69-wh-north",
    "product_id": "weiyel-69",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-70-wh-main",
    "product_id": "weiyel-70",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-70-wh-north",
    "product_id": "weiyel-70",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-71-wh-main",
    "product_id": "weiyel-71",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-71-wh-north",
    "product_id": "weiyel-71",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-72-wh-main",
    "product_id": "weiyel-72",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-72-wh-north",
    "product_id": "weiyel-72",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-73-wh-main",
    "product_id": "weiyel-73",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-73-wh-north",
    "product_id": "weiyel-73",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-74-wh-main",
    "product_id": "weiyel-74",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-74-wh-north",
    "product_id": "weiyel-74",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-75-wh-main",
    "product_id": "weiyel-75",
    "warehouse_id": "wh-main",
    "quantity": 10,
    "updated_at": "2026-09-01T10:00:00.000Z"
  },
  {
    "id": "stk-weiyel-75-wh-north",
    "product_id": "weiyel-75",
    "warehouse_id": "wh-north",
    "quantity": 5,
    "updated_at": "2026-09-01T10:00:00.000Z"
  }
];

// Initial receiving movements from official catalog
export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    "id": "mov-init-dev-fluke-manometer",
    "product_id": "dev-fluke-manometer",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 12,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: MANO-CPC-800)"
  },
  {
    "id": "mov-init-dev-analytical-balance",
    "product_id": "dev-analytical-balance",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 6,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BAL-XSR-204)"
  },
  {
    "id": "mov-init-dev-ph-meter-seven",
    "product_id": "dev-ph-meter-seven",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 8,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: PH-SEVEN-SD50)"
  },
  {
    "id": "mov-init-dev-spectrophotometer",
    "product_id": "dev-spectrophotometer",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 4,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SPEC-UV-3200)"
  },
  {
    "id": "mov-init-si-1",
    "product_id": "si-1",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1000)"
  },
  {
    "id": "mov-init-si-2",
    "product_id": "si-2",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-2)"
  },
  {
    "id": "mov-init-si-3",
    "product_id": "si-3",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-2)"
  },
  {
    "id": "mov-init-si-4",
    "product_id": "si-4",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-2)"
  },
  {
    "id": "mov-init-si-5",
    "product_id": "si-5",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-4)"
  },
  {
    "id": "mov-init-si-6",
    "product_id": "si-6",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-4)"
  },
  {
    "id": "mov-init-si-7",
    "product_id": "si-7",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-4)"
  },
  {
    "id": "mov-init-si-8",
    "product_id": "si-8",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-4)"
  },
  {
    "id": "mov-init-si-9",
    "product_id": "si-9",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-4)"
  },
  {
    "id": "mov-init-si-10",
    "product_id": "si-10",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: VPJ-ВПЖ-2)"
  },
  {
    "id": "mov-init-si-11",
    "product_id": "si-11",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1010)"
  },
  {
    "id": "mov-init-si-12",
    "product_id": "si-12",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1011)"
  },
  {
    "id": "mov-init-si-13",
    "product_id": "si-13",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1012)"
  },
  {
    "id": "mov-init-si-14",
    "product_id": "si-14",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1013)"
  },
  {
    "id": "mov-init-si-15",
    "product_id": "si-15",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1014)"
  },
  {
    "id": "mov-init-si-16",
    "product_id": "si-16",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1015)"
  },
  {
    "id": "mov-init-si-17",
    "product_id": "si-17",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1016)"
  },
  {
    "id": "mov-init-si-18",
    "product_id": "si-18",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1017)"
  },
  {
    "id": "mov-init-si-19",
    "product_id": "si-19",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1018)"
  },
  {
    "id": "mov-init-si-20",
    "product_id": "si-20",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1019)"
  },
  {
    "id": "mov-init-si-21",
    "product_id": "si-21",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1020)"
  },
  {
    "id": "mov-init-si-22",
    "product_id": "si-22",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1021)"
  },
  {
    "id": "mov-init-si-23",
    "product_id": "si-23",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1022)"
  },
  {
    "id": "mov-init-si-24",
    "product_id": "si-24",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1023)"
  },
  {
    "id": "mov-init-si-25",
    "product_id": "si-25",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АМ)"
  },
  {
    "id": "mov-init-si-26",
    "product_id": "si-26",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АМТ)"
  },
  {
    "id": "mov-init-si-27",
    "product_id": "si-27",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-1)"
  },
  {
    "id": "mov-init-si-28",
    "product_id": "si-28",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-1)"
  },
  {
    "id": "mov-init-si-29",
    "product_id": "si-29",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-1)"
  },
  {
    "id": "mov-init-si-30",
    "product_id": "si-30",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-1)"
  },
  {
    "id": "mov-init-si-31",
    "product_id": "si-31",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-2)"
  },
  {
    "id": "mov-init-si-32",
    "product_id": "si-32",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-2)"
  },
  {
    "id": "mov-init-si-33",
    "product_id": "si-33",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АНТ-2)"
  },
  {
    "id": "mov-init-si-34",
    "product_id": "si-34",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-35",
    "product_id": "si-35",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-36",
    "product_id": "si-36",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-37",
    "product_id": "si-37",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-38",
    "product_id": "si-38",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-39",
    "product_id": "si-39",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-40",
    "product_id": "si-40",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-41",
    "product_id": "si-41",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-42",
    "product_id": "si-42",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-43",
    "product_id": "si-43",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-44",
    "product_id": "si-44",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-45",
    "product_id": "si-45",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-46",
    "product_id": "si-46",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-47",
    "product_id": "si-47",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-48",
    "product_id": "si-48",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-АОН-1)"
  },
  {
    "id": "mov-init-si-49",
    "product_id": "si-49",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: AREO-ареометров)"
  },
  {
    "id": "mov-init-si-50",
    "product_id": "si-50",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1049)"
  },
  {
    "id": "mov-init-si-51",
    "product_id": "si-51",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1050)"
  },
  {
    "id": "mov-init-si-52",
    "product_id": "si-52",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: SI-1051)"
  },
  {
    "id": "mov-init-si-therm-53",
    "product_id": "si-therm-53",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-252)"
  },
  {
    "id": "mov-init-si-therm-54",
    "product_id": "si-therm-54",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-253)"
  },
  {
    "id": "mov-init-si-therm-55",
    "product_id": "si-therm-55",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-254)"
  },
  {
    "id": "mov-init-si-therm-56",
    "product_id": "si-therm-56",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-255)"
  },
  {
    "id": "mov-init-si-therm-57",
    "product_id": "si-therm-57",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-256)"
  },
  {
    "id": "mov-init-si-therm-58",
    "product_id": "si-therm-58",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-257)"
  },
  {
    "id": "mov-init-si-therm-59",
    "product_id": "si-therm-59",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-258)"
  },
  {
    "id": "mov-init-si-therm-60",
    "product_id": "si-therm-60",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-259)"
  },
  {
    "id": "mov-init-si-therm-61",
    "product_id": "si-therm-61",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-260)"
  },
  {
    "id": "mov-init-si-therm-62",
    "product_id": "si-therm-62",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: THM-261)"
  },
  {
    "id": "mov-init-titr-63",
    "product_id": "titr-63",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-162)"
  },
  {
    "id": "mov-init-titr-64",
    "product_id": "titr-64",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-163)"
  },
  {
    "id": "mov-init-titr-65",
    "product_id": "titr-65",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-164)"
  },
  {
    "id": "mov-init-titr-66",
    "product_id": "titr-66",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-165)"
  },
  {
    "id": "mov-init-titr-67",
    "product_id": "titr-67",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-166)"
  },
  {
    "id": "mov-init-titr-68",
    "product_id": "titr-68",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-167)"
  },
  {
    "id": "mov-init-titr-69",
    "product_id": "titr-69",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-168)"
  },
  {
    "id": "mov-init-titr-70",
    "product_id": "titr-70",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-169)"
  },
  {
    "id": "mov-init-titr-71",
    "product_id": "titr-71",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-170)"
  },
  {
    "id": "mov-init-titr-72",
    "product_id": "titr-72",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-171)"
  },
  {
    "id": "mov-init-titr-73",
    "product_id": "titr-73",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-172)"
  },
  {
    "id": "mov-init-titr-74",
    "product_id": "titr-74",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-173)"
  },
  {
    "id": "mov-init-titr-75",
    "product_id": "titr-75",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-174)"
  },
  {
    "id": "mov-init-titr-76",
    "product_id": "titr-76",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-175)"
  },
  {
    "id": "mov-init-titr-77",
    "product_id": "titr-77",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-176)"
  },
  {
    "id": "mov-init-titr-78",
    "product_id": "titr-78",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-177)"
  },
  {
    "id": "mov-init-titr-79",
    "product_id": "titr-79",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-178)"
  },
  {
    "id": "mov-init-titr-80",
    "product_id": "titr-80",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-179)"
  },
  {
    "id": "mov-init-titr-81",
    "product_id": "titr-81",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-180)"
  },
  {
    "id": "mov-init-titr-82",
    "product_id": "titr-82",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-181)"
  },
  {
    "id": "mov-init-titr-83",
    "product_id": "titr-83",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-182)"
  },
  {
    "id": "mov-init-titr-84",
    "product_id": "titr-84",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-183)"
  },
  {
    "id": "mov-init-titr-85",
    "product_id": "titr-85",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-184)"
  },
  {
    "id": "mov-init-titr-86",
    "product_id": "titr-86",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-185)"
  },
  {
    "id": "mov-init-titr-87",
    "product_id": "titr-87",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-186)"
  },
  {
    "id": "mov-init-titr-88",
    "product_id": "titr-88",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-187)"
  },
  {
    "id": "mov-init-titr-89",
    "product_id": "titr-89",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: TITR-188)"
  },
  {
    "id": "mov-init-gso-90",
    "product_id": "gso-90",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7874-2000)"
  },
  {
    "id": "mov-init-gso-91",
    "product_id": "gso-91",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7753-2000)"
  },
  {
    "id": "mov-init-gso-92",
    "product_id": "gso-92",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7875-2000)"
  },
  {
    "id": "mov-init-gso-93",
    "product_id": "gso-93",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7681-99)"
  },
  {
    "id": "mov-init-gso-94",
    "product_id": "gso-94",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7976-2001)"
  },
  {
    "id": "mov-init-gso-95",
    "product_id": "gso-95",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7680-99)"
  },
  {
    "id": "mov-init-gso-96",
    "product_id": "gso-96",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7617-99)"
  },
  {
    "id": "mov-init-gso-97",
    "product_id": "gso-97",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7748-99)"
  },
  {
    "id": "mov-init-gso-98",
    "product_id": "gso-98",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7682-99)"
  },
  {
    "id": "mov-init-gso-99",
    "product_id": "gso-99",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7101-94)"
  },
  {
    "id": "mov-init-gso-100",
    "product_id": "gso-100",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7879-2001)"
  },
  {
    "id": "mov-init-gso-101",
    "product_id": "gso-101",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7873-2000)"
  },
  {
    "id": "mov-init-gso-102",
    "product_id": "gso-102",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7877-2000)"
  },
  {
    "id": "mov-init-gso-103",
    "product_id": "gso-103",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-2102)"
  },
  {
    "id": "mov-init-gso-104",
    "product_id": "gso-104",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7834-2000)"
  },
  {
    "id": "mov-init-gso-105",
    "product_id": "gso-105",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7616-99)"
  },
  {
    "id": "mov-init-gso-106",
    "product_id": "gso-106",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7837-2000)"
  },
  {
    "id": "mov-init-gso-107",
    "product_id": "gso-107",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7618-99)"
  },
  {
    "id": "mov-init-gso-108",
    "product_id": "gso-108",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7836-2000)"
  },
  {
    "id": "mov-init-gso-109",
    "product_id": "gso-109",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7835-2000)"
  },
  {
    "id": "mov-init-gso-110",
    "product_id": "gso-110",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-12428-2024)"
  },
  {
    "id": "mov-init-gso-111",
    "product_id": "gso-111",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8934-2008)"
  },
  {
    "id": "mov-init-gso-112",
    "product_id": "gso-112",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7680-99)"
  },
  {
    "id": "mov-init-gso-113",
    "product_id": "gso-113",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7880-2001)"
  },
  {
    "id": "mov-init-gso-114",
    "product_id": "gso-114",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-11431-2019)"
  },
  {
    "id": "mov-init-gso-115",
    "product_id": "gso-115",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7876-2000)"
  },
  {
    "id": "mov-init-gso-116",
    "product_id": "gso-116",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7927-2001)"
  },
  {
    "id": "mov-init-gso-117",
    "product_id": "gso-117",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8125-2002)"
  },
  {
    "id": "mov-init-gso-118",
    "product_id": "gso-118",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8092-94-8094-94)"
  },
  {
    "id": "mov-init-gso-119",
    "product_id": "gso-119",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7107-94)"
  },
  {
    "id": "mov-init-gso-120",
    "product_id": "gso-120",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7241-96)"
  },
  {
    "id": "mov-init-gso-121",
    "product_id": "gso-121",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8065-94-)"
  },
  {
    "id": "mov-init-gso-122",
    "product_id": "gso-122",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7340-96)"
  },
  {
    "id": "mov-init-gso-123",
    "product_id": "gso-123",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8062-94-)"
  },
  {
    "id": "mov-init-gso-124",
    "product_id": "gso-124",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7015-93)"
  },
  {
    "id": "mov-init-gso-125",
    "product_id": "gso-125",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8059-94)"
  },
  {
    "id": "mov-init-gso-126",
    "product_id": "gso-126",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7854-2000)"
  },
  {
    "id": "mov-init-gso-127",
    "product_id": "gso-127",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7337-96)"
  },
  {
    "id": "mov-init-gso-128",
    "product_id": "gso-128",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8032-94)"
  },
  {
    "id": "mov-init-gso-129",
    "product_id": "gso-129",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8092-94)"
  },
  {
    "id": "mov-init-gso-130",
    "product_id": "gso-130",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-9376-2009)"
  },
  {
    "id": "mov-init-gso-131",
    "product_id": "gso-131",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7190-95)"
  },
  {
    "id": "mov-init-gso-132",
    "product_id": "gso-132",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8056-94)"
  },
  {
    "id": "mov-init-gso-133",
    "product_id": "gso-133",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8062-94)"
  },
  {
    "id": "mov-init-gso-134",
    "product_id": "gso-134",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8004-93)"
  },
  {
    "id": "mov-init-gso-135",
    "product_id": "gso-135",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7145-95)"
  },
  {
    "id": "mov-init-gso-136",
    "product_id": "gso-136",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7204-95)"
  },
  {
    "id": "mov-init-gso-137",
    "product_id": "gso-137",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8035-94)"
  },
  {
    "id": "mov-init-gso-138",
    "product_id": "gso-138",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8053-94)"
  },
  {
    "id": "mov-init-gso-139",
    "product_id": "gso-139",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7021-93)"
  },
  {
    "id": "mov-init-gso-140",
    "product_id": "gso-140",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-6693-93)"
  },
  {
    "id": "mov-init-gso-141",
    "product_id": "gso-141",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7141-95)"
  },
  {
    "id": "mov-init-gso-142",
    "product_id": "gso-142",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-9284-2008)"
  },
  {
    "id": "mov-init-gso-143",
    "product_id": "gso-143",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-6687-93)"
  },
  {
    "id": "mov-init-gso-144",
    "product_id": "gso-144",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7853-2000)"
  },
  {
    "id": "mov-init-gso-145",
    "product_id": "gso-145",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-9437-2009)"
  },
  {
    "id": "mov-init-gso-146",
    "product_id": "gso-146",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7437-98)"
  },
  {
    "id": "mov-init-gso-147",
    "product_id": "gso-147",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-6696-93)"
  },
  {
    "id": "mov-init-gso-148",
    "product_id": "gso-148",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8086-94)"
  },
  {
    "id": "mov-init-gso-149",
    "product_id": "gso-149",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8048-94)"
  },
  {
    "id": "mov-init-gso-150",
    "product_id": "gso-150",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7271-96)"
  },
  {
    "id": "mov-init-gso-151",
    "product_id": "gso-151",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7018-93)"
  },
  {
    "id": "mov-init-gso-152",
    "product_id": "gso-152",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7425-97)"
  },
  {
    "id": "mov-init-gso-153",
    "product_id": "gso-153",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7478-98)"
  },
  {
    "id": "mov-init-gso-154",
    "product_id": "gso-154",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7476-98)"
  },
  {
    "id": "mov-init-gso-155",
    "product_id": "gso-155",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7253-96)"
  },
  {
    "id": "mov-init-gso-156",
    "product_id": "gso-156",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7472-98)"
  },
  {
    "id": "mov-init-gso-157",
    "product_id": "gso-157",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7255-96)"
  },
  {
    "id": "mov-init-gso-158",
    "product_id": "gso-158",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7262-96)"
  },
  {
    "id": "mov-init-gso-159",
    "product_id": "gso-159",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7257-96)"
  },
  {
    "id": "mov-init-gso-160",
    "product_id": "gso-160",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8206-2002)"
  },
  {
    "id": "mov-init-gso-161",
    "product_id": "gso-161",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7270-96)"
  },
  {
    "id": "mov-init-gso-162",
    "product_id": "gso-162",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7256-96)"
  },
  {
    "id": "mov-init-gso-163",
    "product_id": "gso-163",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7470-98)"
  },
  {
    "id": "mov-init-gso-164",
    "product_id": "gso-164",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7471-98)"
  },
  {
    "id": "mov-init-gso-165",
    "product_id": "gso-165",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8205-2002)"
  },
  {
    "id": "mov-init-gso-166",
    "product_id": "gso-166",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7480-98)"
  },
  {
    "id": "mov-init-gso-167",
    "product_id": "gso-167",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7259-96)"
  },
  {
    "id": "mov-init-gso-168",
    "product_id": "gso-168",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7264-96)"
  },
  {
    "id": "mov-init-gso-169",
    "product_id": "gso-169",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7258-96)"
  },
  {
    "id": "mov-init-gso-170",
    "product_id": "gso-170",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7265-96)"
  },
  {
    "id": "mov-init-gso-171",
    "product_id": "gso-171",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7477-98)"
  },
  {
    "id": "mov-init-gso-172",
    "product_id": "gso-172",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7266-96)"
  },
  {
    "id": "mov-init-gso-173",
    "product_id": "gso-173",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7252-96)"
  },
  {
    "id": "mov-init-gso-174",
    "product_id": "gso-174",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7263-96)"
  },
  {
    "id": "mov-init-gso-175",
    "product_id": "gso-175",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7269-96)"
  },
  {
    "id": "mov-init-gso-176",
    "product_id": "gso-176",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7474-98)"
  },
  {
    "id": "mov-init-gso-177",
    "product_id": "gso-177",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7268-96)"
  },
  {
    "id": "mov-init-gso-178",
    "product_id": "gso-178",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7254-96)"
  },
  {
    "id": "mov-init-gso-179",
    "product_id": "gso-179",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7479-98)"
  },
  {
    "id": "mov-init-gso-180",
    "product_id": "gso-180",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7267-96)"
  },
  {
    "id": "mov-init-gso-181",
    "product_id": "gso-181",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8463-2003)"
  },
  {
    "id": "mov-init-gso-182",
    "product_id": "gso-182",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7797)"
  },
  {
    "id": "mov-init-gso-183",
    "product_id": "gso-183",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8892-2007)"
  },
  {
    "id": "mov-init-gso-184",
    "product_id": "gso-184",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8891-2007)"
  },
  {
    "id": "mov-init-gso-185",
    "product_id": "gso-185",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8888-2007)"
  },
  {
    "id": "mov-init-gso-186",
    "product_id": "gso-186",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8890-2007)"
  },
  {
    "id": "mov-init-gso-187",
    "product_id": "gso-187",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-8893-2007)"
  },
  {
    "id": "mov-init-gso-188",
    "product_id": "gso-188",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GSO-7950-2001)"
  },
  {
    "id": "mov-init-gso-crm-189",
    "product_id": "gso-crm-189",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-488)"
  },
  {
    "id": "mov-init-gso-crm-190",
    "product_id": "gso-crm-190",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-489)"
  },
  {
    "id": "mov-init-gso-crm-191",
    "product_id": "gso-crm-191",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-490)"
  },
  {
    "id": "mov-init-gso-crm-192",
    "product_id": "gso-crm-192",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-491)"
  },
  {
    "id": "mov-init-gso-crm-193",
    "product_id": "gso-crm-193",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-492)"
  },
  {
    "id": "mov-init-gso-crm-194",
    "product_id": "gso-crm-194",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-493)"
  },
  {
    "id": "mov-init-gso-crm-195",
    "product_id": "gso-crm-195",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: CRM-494)"
  },
  {
    "id": "mov-init-buf-196",
    "product_id": "buf-196",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-695)"
  },
  {
    "id": "mov-init-buf-197",
    "product_id": "buf-197",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-696)"
  },
  {
    "id": "mov-init-buf-198",
    "product_id": "buf-198",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-697)"
  },
  {
    "id": "mov-init-buf-199",
    "product_id": "buf-199",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-698)"
  },
  {
    "id": "mov-init-buf-200",
    "product_id": "buf-200",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-699)"
  },
  {
    "id": "mov-init-buf-201",
    "product_id": "buf-201",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-700)"
  },
  {
    "id": "mov-init-buf-202",
    "product_id": "buf-202",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-701)"
  },
  {
    "id": "mov-init-buf-203",
    "product_id": "buf-203",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-702)"
  },
  {
    "id": "mov-init-buf-204",
    "product_id": "buf-204",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-703)"
  },
  {
    "id": "mov-init-buf-205",
    "product_id": "buf-205",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-704)"
  },
  {
    "id": "mov-init-buf-206",
    "product_id": "buf-206",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-705)"
  },
  {
    "id": "mov-init-buf-207",
    "product_id": "buf-207",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-706)"
  },
  {
    "id": "mov-init-buf-208",
    "product_id": "buf-208",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-707)"
  },
  {
    "id": "mov-init-buf-209",
    "product_id": "buf-209",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-708)"
  },
  {
    "id": "mov-init-buf-210",
    "product_id": "buf-210",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-709)"
  },
  {
    "id": "mov-init-buf-211",
    "product_id": "buf-211",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-710)"
  },
  {
    "id": "mov-init-buf-212",
    "product_id": "buf-212",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-711)"
  },
  {
    "id": "mov-init-buf-213",
    "product_id": "buf-213",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-712)"
  },
  {
    "id": "mov-init-buf-214",
    "product_id": "buf-214",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-713)"
  },
  {
    "id": "mov-init-buf-215",
    "product_id": "buf-215",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 55,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BUF-714)"
  },
  {
    "id": "mov-init-weiyel-1",
    "product_id": "weiyel-1",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8249-2016)"
  },
  {
    "id": "mov-init-weiyel-2",
    "product_id": "weiyel-2",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2026-2016)"
  },
  {
    "id": "mov-init-weiyel-3",
    "product_id": "weiyel-3",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6591-2016)"
  },
  {
    "id": "mov-init-weiyel-4",
    "product_id": "weiyel-4",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8168-2016)"
  },
  {
    "id": "mov-init-weiyel-5",
    "product_id": "weiyel-5",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)130935)"
  },
  {
    "id": "mov-init-weiyel-6",
    "product_id": "weiyel-6",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7116-2016)"
  },
  {
    "id": "mov-init-weiyel-7",
    "product_id": "weiyel-7",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7118-2016)"
  },
  {
    "id": "mov-init-weiyel-8",
    "product_id": "weiyel-8",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8411-2016)"
  },
  {
    "id": "mov-init-weiyel-9",
    "product_id": "weiyel-9",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6144-2016)"
  },
  {
    "id": "mov-init-weiyel-10",
    "product_id": "weiyel-10",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2036-2016)"
  },
  {
    "id": "mov-init-weiyel-11",
    "product_id": "weiyel-11",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8060-2016)"
  },
  {
    "id": "mov-init-weiyel-12",
    "product_id": "weiyel-12",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ0077-2016)"
  },
  {
    "id": "mov-init-weiyel-13",
    "product_id": "weiyel-13",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6627-2016)"
  },
  {
    "id": "mov-init-weiyel-14",
    "product_id": "weiyel-14",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7090-2016)"
  },
  {
    "id": "mov-init-weiyel-15",
    "product_id": "weiyel-15",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ0142-2016)"
  },
  {
    "id": "mov-init-weiyel-16",
    "product_id": "weiyel-16",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8176-2016)"
  },
  {
    "id": "mov-init-weiyel-17",
    "product_id": "weiyel-17",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWJ4194-2016)"
  },
  {
    "id": "mov-init-weiyel-18",
    "product_id": "weiyel-18",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6742-2016)"
  },
  {
    "id": "mov-init-weiyel-19",
    "product_id": "weiyel-19",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BGBW(E)086419)"
  },
  {
    "id": "mov-init-weiyel-20",
    "product_id": "weiyel-20",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086341)"
  },
  {
    "id": "mov-init-weiyel-21",
    "product_id": "weiyel-21",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8353-2016)"
  },
  {
    "id": "mov-init-weiyel-22",
    "product_id": "weiyel-22",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7490-2016)"
  },
  {
    "id": "mov-init-weiyel-23",
    "product_id": "weiyel-23",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8431-2016)"
  },
  {
    "id": "mov-init-weiyel-24",
    "product_id": "weiyel-24",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086342)"
  },
  {
    "id": "mov-init-weiyel-25",
    "product_id": "weiyel-25",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8034-2016)"
  },
  {
    "id": "mov-init-weiyel-26",
    "product_id": "weiyel-26",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6281-2016)"
  },
  {
    "id": "mov-init-weiyel-27",
    "product_id": "weiyel-27",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8082-2016)"
  },
  {
    "id": "mov-init-weiyel-28",
    "product_id": "weiyel-28",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8004-2016)"
  },
  {
    "id": "mov-init-weiyel-29",
    "product_id": "weiyel-29",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6243-2016)"
  },
  {
    "id": "mov-init-weiyel-30",
    "product_id": "weiyel-30",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086425)"
  },
  {
    "id": "mov-init-weiyel-31",
    "product_id": "weiyel-31",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8363-2016)"
  },
  {
    "id": "mov-init-weiyel-32",
    "product_id": "weiyel-32",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWR0013-2016)"
  },
  {
    "id": "mov-init-weiyel-33",
    "product_id": "weiyel-33",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6066-2016)"
  },
  {
    "id": "mov-init-weiyel-34",
    "product_id": "weiyel-34",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086346)"
  },
  {
    "id": "mov-init-weiyel-35",
    "product_id": "weiyel-35",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8637-2016)"
  },
  {
    "id": "mov-init-weiyel-36",
    "product_id": "weiyel-36",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)083798)"
  },
  {
    "id": "mov-init-weiyel-37",
    "product_id": "weiyel-37",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWR3060-2016)"
  },
  {
    "id": "mov-init-weiyel-38",
    "product_id": "weiyel-38",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8361-2016)"
  },
  {
    "id": "mov-init-weiyel-39",
    "product_id": "weiyel-39",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)083808)"
  },
  {
    "id": "mov-init-weiyel-40",
    "product_id": "weiyel-40",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)083806)"
  },
  {
    "id": "mov-init-weiyel-41",
    "product_id": "weiyel-41",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)083786)"
  },
  {
    "id": "mov-init-weiyel-42",
    "product_id": "weiyel-42",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6851-2016)"
  },
  {
    "id": "mov-init-weiyel-43",
    "product_id": "weiyel-43",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)083781)"
  },
  {
    "id": "mov-init-weiyel-44",
    "product_id": "weiyel-44",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2255-2016)"
  },
  {
    "id": "mov-init-weiyel-45",
    "product_id": "weiyel-45",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2507-2016)"
  },
  {
    "id": "mov-init-weiyel-46",
    "product_id": "weiyel-46",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086222)"
  },
  {
    "id": "mov-init-weiyel-47",
    "product_id": "weiyel-47",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086225)"
  },
  {
    "id": "mov-init-weiyel-48",
    "product_id": "weiyel-48",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2199-2016)"
  },
  {
    "id": "mov-init-weiyel-49",
    "product_id": "weiyel-49",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2069-2016)"
  },
  {
    "id": "mov-init-weiyel-50",
    "product_id": "weiyel-50",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7423-2016)"
  },
  {
    "id": "mov-init-weiyel-51",
    "product_id": "weiyel-51",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7041-2016)"
  },
  {
    "id": "mov-init-weiyel-52",
    "product_id": "weiyel-52",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7370-2016)"
  },
  {
    "id": "mov-init-weiyel-53",
    "product_id": "weiyel-53",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6859-2016)"
  },
  {
    "id": "mov-init-weiyel-54",
    "product_id": "weiyel-54",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086362)"
  },
  {
    "id": "mov-init-weiyel-55",
    "product_id": "weiyel-55",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086177)"
  },
  {
    "id": "mov-init-weiyel-56",
    "product_id": "weiyel-56",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWR3084-2016)"
  },
  {
    "id": "mov-init-weiyel-57",
    "product_id": "weiyel-57",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)086429)"
  },
  {
    "id": "mov-init-weiyel-58",
    "product_id": "weiyel-58",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2448-2016)"
  },
  {
    "id": "mov-init-weiyel-59",
    "product_id": "weiyel-59",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWB2153-2016)"
  },
  {
    "id": "mov-init-weiyel-60",
    "product_id": "weiyel-60",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8092-2016)"
  },
  {
    "id": "mov-init-weiyel-61",
    "product_id": "weiyel-61",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)130936)"
  },
  {
    "id": "mov-init-weiyel-62",
    "product_id": "weiyel-62",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8128-2016A)"
  },
  {
    "id": "mov-init-weiyel-63",
    "product_id": "weiyel-63",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6621-2016)"
  },
  {
    "id": "mov-init-weiyel-64",
    "product_id": "weiyel-64",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6901-2016)"
  },
  {
    "id": "mov-init-weiyel-65",
    "product_id": "weiyel-65",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6902-2016)"
  },
  {
    "id": "mov-init-weiyel-66",
    "product_id": "weiyel-66",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7259-2016)"
  },
  {
    "id": "mov-init-weiyel-67",
    "product_id": "weiyel-67",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6903-2016)"
  },
  {
    "id": "mov-init-weiyel-68",
    "product_id": "weiyel-68",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8322-2016)"
  },
  {
    "id": "mov-init-weiyel-69",
    "product_id": "weiyel-69",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWR3057-2016)"
  },
  {
    "id": "mov-init-weiyel-70",
    "product_id": "weiyel-70",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWR3043-2016)"
  },
  {
    "id": "mov-init-weiyel-71",
    "product_id": "weiyel-71",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ8404-2016)"
  },
  {
    "id": "mov-init-weiyel-72",
    "product_id": "weiyel-72",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ6837-2016)"
  },
  {
    "id": "mov-init-weiyel-73",
    "product_id": "weiyel-73",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: GBW(E)130989)"
  },
  {
    "id": "mov-init-weiyel-74",
    "product_id": "weiyel-74",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWS0097-2016)"
  },
  {
    "id": "mov-init-weiyel-75",
    "product_id": "weiyel-75",
    "warehouse_id": "wh-main",
    "target_warehouse_id": null,
    "movement_type": "inbound",
    "quantity": 15,
    "user_id": "usr-admin",
    "user_name": "Tursunov Umarjon",
    "employee_id": "EMP-0001",
    "device_type": "web",
    "timestamp": "2026-09-01T10:00:00.000Z",
    "notes": "\"STANDART VA METROLOGIYA\" MCHJ rasmiy katalogidan qabul qilindi (Artikul: BWZ7486-2016)"
  }
];

export const INITIAL_INVOICES: InvoiceWithItems[] = [];
export const INITIAL_CORRECTIONS: CorrectionRequest[] = [];
export const INITIAL_LOGIN_LOGS: LoginLog[] = [];
