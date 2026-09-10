# OmniStock PRO - Warehouse Automation & Management System (WMS)

OmniStock PRO is a modern, full-stack warehouse management and automation platform engineered for high-throughput logistics, multi-facility inventory tracking, automated QR code labeling, and real-time database synchronization.

---

## 🌟 Key Features

1. **Supabase & PostgreSQL Backend**:
   - Single source of truth with Row-Level Security (RLS) policies enforcing role permissions (`admin`, `warehouse_manager`, `warehouse_staff`).
   - Atomic stored procedures (`execute_stock_movement`) preventing race conditions and negative balances.
   - Real-time event streaming (`supabase_realtime`) to web and mobile clients.

2. **Automated QR Code Engine**:
   - Automatically generates unique, high-resolution QR codes (`WMS-PRD-XXXX`) upon product creation.
   - Single label preview with instant PNG download or printable PDF badge.
   - **Batch QR Printing Lab**: Multi-select products and generate custom A4 sticker sheets (2-column or 3-column grid) ready for laser printing.

3. **In-App Camera QR Scanning & 1-Tap Operations**:
   - In-browser camera QR code scanner with autofocus viewfinder and manual fallback.
   - Instant scan-result sheet displaying product details, multi-warehouse stock breakdown, and last 5 transactions.
   - Quick **Stock In** and **Stock Out** buttons with direct balance and ledger updates.

4. **Multi-Warehouse Stock Management & Transfers**:
   - Real-time stock matrix per warehouse facility.
   - Low-stock warnings triggered automatically when inventory drops below safety thresholds.
   - Atomic inter-facility stock transfers (source deduction + destination increment).

5. **Analytics & Export**:
   - Export inventory audits and movement histories to **Excel (`.xlsx`)** via SheetJS.
   - Generate printable formal audit reports in **PDF (`.pdf`)** format via jsPDF.

6. **Multi-Language Support (i18n)**:
   - 🇺🇿 **O'zbekcha**
   - 🇷🇺 **Русский**
   - 🇬🇧 **English**
   - Instant language switcher in Navbar with persisted preference.

---

## 🏗️ System Architecture

```
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
├── .gitignore                # Git ignore rules
│
├── supabase/                 # Database Migrations & Schemas
│   ├── complete_setup.sql    # 1-Click consolidated SQL setup for Supabase SQL Editor
│   ├── README.md             # Supabase deployment instructions
│   └── migrations/
│       ├── 01_schema.sql     # Tables: roles, warehouses, users, products, stock, movements
│       ├── 02_functions_and_triggers.sql # Atomic procedures and triggers
│       ├── 03_rls_policies.sql           # Row-Level Security policies
│       ├── 04_storage_buckets.sql        # Storage bucket definitions
│       └── 05_seed_data.sql              # Realistic seed data
│
├── types/                    # Shared TypeScript types
│   └── supabase.ts           # Generated Supabase Database types
│
└── web/                      # Next.js 14 Frontend Application
    ├── package.json
    ├── tailwind.config.ts
    └── src/
        ├── app/              # App Router pages (Dashboard, Products, Inventory, etc.)
        ├── components/       # Reusable components (Navbar, Sidebar, QRModal, Scanner)
        └── lib/              # State store, Supabase client, i18n translations
```

---

## 🚀 Quick Start

### 1. Database Setup (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/complete_setup.sql` and run it.

### 2. Configure Environment
Copy `.env.example` to `.env.local` inside `web/`:
```bash
cp .env.example web/.env.local
```
Fill in your Supabase Project URL and Anon Key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run Web App
```bash
cd web
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📱 Mobile Application (Flutter)
The mobile application is designed to target both Android and iOS from a single Dart codebase located in `mobile/`, utilizing `supabase_flutter` for real-time synchronization and `mobile_scanner` for hardware camera QR code scanning.

---

## 📄 License
MIT License. Built for warehouse and supply chain automation.
