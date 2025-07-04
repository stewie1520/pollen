[![Build](https://github.com/stewie1520/pollen/actions/workflows/build.yml/badge.svg)](https://github.com/stewie1520/pollen/actions/workflows/build.yml)

# Pollen Product Search Platform

A modern product search platform for e-commerce, featuring fast search, product management, and developer-friendly APIs. Built with Docker, Node.js, and Kafka for scalable, local-first development.

---

## 🚀 Features
- Add/manage products via REST endpoints
- Local development stack with Docker Compose
- Kafka integration for event streaming
- Sequin CDC for database changes
- Elasticsearch for full-text search

---

## 📁 Directory Structure
```
/ (root)
├── dev-stack/               # Docker Compose configs and supporting services
│   ├── docker-compose.yml
│   └── sequin-config.yml
├── product-search-service/  # Main Node.js backend service
│   ├── src/
│   ├── package.json
│   ├── drizzle.config.ts
│   ├── tsconfig.json
└── README                   # Project documentation (this file)
```

---

## 🛠️ Requirements
- **Docker Compose** v2.34.0+
- **Node.js** v20+
- **pnpm** v8.8.0+ (or npm/yarn)

---

## ⚡ Quick Start

### 1. Run the Dev Stack
```bash
cd dev-stack
docker compose up -d
```

### 2. Start the Product Search Service
```bash
cd product-search-service
cp .env.example .env # Use default values, or edit as needed
pnpm install         # Install dependencies
pnpm run dev         # Start the service
```

### 3. Test the API
#### Search for products containing "wireless":
```bash
curl http://localhost:3000/products/search?query=wireless
```

#### Add a new product:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '[
  {
    "name": "Wireless Bluetooth Headphones",
    "description": "High-fidelity sound with noise cancellation and 20-hour battery life.",
    "sku": "ELC-HP-BT-001"
  },
  {
    "name": "Ergonomic Office Chair",
    "description": "Adjustable lumbar support, breathable mesh, and smooth-gliding casters.",
    "sku": "FURN-CHR-ERG-005"
  },
  {
    "name": "4K UHD Smart TV 55",
    "description": "Vibrant picture quality, smart features, and multiple HDMI ports.",
    "sku": "ELEC-TV-4K-55-S02"
  },
  {
    "name": "Stainless Steel Water Bottle",
    "description": "Double-walled insulation keeps drinks cold for 24 hours or hot for 12 hours.",
    "sku": "HOME-BTL-SS-750"
  },
  {
    "name": "Mechanical Gaming Keyboard",
    "description": "RGB backlighting, tactile switches, and programmable macro keys.",
    "sku": "TECH-KB-MECH-RGB"
  },
  {
    "name": "Yoga Mat Premium",
    "description": "Non-slip surface, eco-friendly material, 6mm thickness for comfort.",
    "sku": "FIT-MAT-YOGA-PRM"
  },
  {
    "name": "Coffee Maker Programmable",
    "description": "12-cup capacity with auto-shutoff and programmable brew timer.",
    "sku": "APPL-CM-PROG-12"
  },
  {
    "name": "Wireless Charging Pad",
    "description": "Fast charging compatible with Qi-enabled devices, LED indicator.",
    "sku": "ELEC-CHG-WL-PAD"
  },
  {
    "name": "Running Shoes Men",
    "description": "Lightweight design with responsive cushioning and breathable mesh upper.",
    "sku": "SHOE-RUN-MEN-42"
  },
  {
    "name": "Portable Power Bank",
    "description": "20000mAh capacity with dual USB ports and LED battery indicator.",
    "sku": "ELEC-PWR-BNK-20K"
  },
  {
    "name": "Kitchen Knife Set",
    "description": "8-piece professional grade stainless steel knives with wooden block.",
    "sku": "KTCH-KNF-SET-8PC"
  },
  {
    "name": "Desk Lamp LED",
    "description": "Adjustable brightness, touch control, and USB charging port.",
    "sku": "FURN-LMP-LED-DSK"
  },
  {
    "name": "Bluetooth Speaker Portable",
    "description": "Waterproof design, 360-degree sound, and 12-hour battery life.",
    "sku": "ELEC-SPK-BT-PORT"
  },
  {
    "name": "Memory Foam Pillow",
    "description": "Contoured design for neck support, hypoallergenic bamboo cover.",
    "sku": "HOME-PIL-MEM-STD"
  },
  {
    "name": "Fitness Tracker Watch",
    "description": "Heart rate monitor, step counter, sleep tracking, and 7-day battery.",
    "sku": "WEAR-FIT-TRK-V2"
  },
  {
    "name": "Electric Toothbrush",
    "description": "Sonic technology, 3 brushing modes, and 2-minute timer.",
    "sku": "CARE-TB-ELEC-SON"
  },
  {
    "name": "Laptop Stand Adjustable",
    "description": "Aluminum construction, ventilated design, fits 10-17 inch laptops.",
    "sku": "TECH-STD-LAP-ADJ"
  },
  {
    "name": "Air Purifier HEPA",
    "description": "True HEPA filter, covers up to 300 sq ft, quiet operation.",
    "sku": "HOME-PUR-AIR-300"
  },
  {
    "name": "Camping Backpack 40L",
    "description": "Water-resistant, multiple compartments, and ergonomic shoulder straps.",
    "sku": "OUT-BAG-CAMP-40L"
  },
  {
    "name": "Wireless Mouse Gaming",
    "description": "High precision sensor, customizable buttons, and RGB lighting.",
    "sku": "TECH-MOU-GAM-WL"
  },
  {
    "name": "Instant Pot 6 Quart",
    "description": "7-in-1 multi-cooker with pressure cook, slow cook, and sauté functions.",
    "sku": "APPL-IP-6QT-7IN1"
  },
  {
    "name": "Phone Case Protective",
    "description": "Drop-tested protection, wireless charging compatible, clear design.",
    "sku": "ACC-CASE-PHN-CLR"
  },
  {
    "name": "Reading Glasses Blue Light",
    "description": "Anti-blue light lenses, lightweight frame, multiple magnifications.",
    "sku": "WEAR-GLS-RD-BLU"
  }
]'
```

---

## 🔗 Dashboards & Tools
- **Sequin dashboard:** [http://localhost:7376](http://localhost:7376)
    - email: donghuuhieu1520@gmail.com
    - password: Asd123456!
- **Kafka UI:** [http://localhost:8080](http://localhost:8080)

---

## 📖 API Endpoints (Sample)
- `GET /products/search?query=...` — Search products
- `POST /products` — Add a product

---

## 🤝 Contributing
Pull requests and issues are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT

---

## 🙋 Contact
For questions, contact [donghuuhieu1520@gmail.com](mailto:donghuuhieu1520@gmail.com)

---

*Happy hacking!*
