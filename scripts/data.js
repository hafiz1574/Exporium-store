(function () {
  const imageSets = {
    nike: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    ],
    "nike sb": [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    ],
    "air jordan": [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513104487127-813ea879b8da?auto=format&fit=crop&w=1200&q=80",
    ],
    puma: [
      "https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572169061-9dd866bbe3a0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&w=1200&q=80",
    ],
    adidas: [
      "https://images.unsplash.com/photo-1521335751419-603f61523713?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464472186645-712c8b886a06?auto=format&fit=crop&w=1200&q=80",
    ],
    asics: [
      "https://images.unsplash.com/photo-1500614922032-b6dd337b1315?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513997242603-4f1396b9d5d4?auto=format&fit=crop&w=1200&q=80",
    ],
    "alexander mcqueen": [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528701800489-20be3c0da4d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    onitsuka: [
      "https://images.unsplash.com/photo-1503342250614-ca4407868a5b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517867065801-833f4aa94414?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
    default: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
    ],
  };

  const baseLogistics = {
    consolidation: "Weekly Shenzhen consolidation",
    customs: "Green lane eligible",
    qc: "Photo + video QC proof",
    packaging: "Retail-ready carton",
  };

  const defaultFeatures = [
    "Humidity-ready lining for Dhaka climate",
    "Retail packaging localized in Bangla",
    "MOQ split option across two colorways",
    "Transit visibility dashboard access",
  ];

  const catalogEntries = [
    {
      id: "puma-y23",
      name: "Puma Y23 (Sizes 36-44)",
      brand: "Puma",
      colors: ["White", "Dark Blue"],
      priceBdt: 0,
      badge: "Pre-book",
      badgeVariant: "warning",
      segment: "lifestyle",
      audience: "boutique",
    },
    {
      id: "asics-skateboard",
      name: "ASICS Skateboard",
      brand: "ASICS",
      colors: ["White", "Dark Blue"],
      priceBdt: 2810,
      segment: "athleisure",
    },
    {
      id: "nike-sb-force-58",
      name: "Nike SB Force 58",
      brand: "Nike",
      colors: ["Desert Sand", "Obsidian"],
      priceBdt: 2720,
      segment: "skate",
    },
    {
      id: "tyler-lv",
      name: "Tyler LV",
      brand: "Tyler LV",
      colors: ["White", "Green", "Black"],
      priceBdt: 3206,
      badge: "Limited",
      badgeVariant: "accent",
      segment: "statement",
      audience: "boutique",
    },
    {
      id: "aj1-classic",
      name: "AJ1 Classic",
      brand: "Air Jordan",
      colors: ["Black", "White", "Blue", "Purple", "Red"],
      priceBdt: 2648,
      segment: "lifestyle",
    },
    {
      id: "aj4-fire-red",
      name: "AJ4 Fire Red",
      brand: "Air Jordan",
      colors: ["Fire Red"],
      priceBdt: 2990,
      badge: "Drop",
      badgeVariant: "accent",
      segment: "statement",
      audience: "boutique",
    },
    {
      id: "aj4-core",
      name: "AJ4 Core",
      brand: "Air Jordan",
      colors: ["Black", "White", "Blue", "Red"],
      priceBdt: 2900,
      segment: "performance",
      audience: "boutique",
    },
    {
      id: "air-force-1-low",
      name: "Air Force 1 Low-Top",
      brand: "Nike",
      colors: ["Black", "White"],
      priceBdt: 2864,
      segment: "lifestyle",
    },
    {
      id: "nike-court-borough-low",
      name: "Nike Court Borough Low Recraft (GS)",
      brand: "Nike",
      colors: ["Midnight Navy", "Team Orange", "Light Silver", "Hyper Royal"],
      priceBdt: 2648,
      segment: "youth",
      audience: "chain",
    },
    {
      id: "nike-air-force-1-wukong",
      name: "Nike Air Force 1 Low Wukong",
      brand: "Nike",
      colors: ["Wukong", "Black Myth"],
      priceBdt: 2846,
      segment: "limited",
      audience: "boutique",
    },
    {
      id: "sb-classic",
      name: "SB Classic",
      brand: "Nike SB",
      colors: ["White", "Red", "Blue", "Black", "Green"],
      priceBdt: 2774,
      segment: "skate",
    },
    {
      id: "js-classic",
      name: "JS",
      brand: "Jordan Series",
      colors: ["Assorted"],
      priceBdt: 2900,
      segment: "lifestyle",
    },
    {
      id: "js90",
      name: "JS90",
      brand: "Jordan Series",
      colors: ["Assorted"],
      priceBdt: 2900,
      segment: "lifestyle",
    },
    {
      id: "full-force-low-dragon",
      name: "Full Force Low — Year of the Dragon",
      brand: "Nike",
      colors: ["Crimson", "Gold"],
      priceBdt: 2810,
      badge: "Festival",
      badgeVariant: "accent",
      segment: "limited",
      audience: "boutique",
    },
    {
      id: "air-zoom-pegasus-41",
      name: "Air Zoom Pegasus 41",
      brand: "Nike",
      colors: ["Black", "White", "Blue"],
      priceBdt: 2990,
      segment: "performance",
    },
    {
      id: "air-jordan-courtside-23",
      name: "Air Jordan Courtside 23",
      brand: "Air Jordan",
      colors: ["Silver Gray"],
      priceBdt: 2846,
      segment: "lifestyle",
    },
    {
      id: "nike-v2k-run",
      name: "Nike V2K Run",
      brand: "Nike",
      colors: ["White"],
      priceBdt: 2990,
      segment: "athleisure",
    },
    {
      id: "mcqueen-combo",
      name: "McQueen Combo",
      brand: "Alexander McQueen",
      colors: ["Combo Colors"],
      priceBdt: 2918,
      badge: "Premium",
      badgeVariant: "accent",
      segment: "statement",
      audience: "boutique",
    },
    {
      id: "adidas-samba-og",
      name: "Adidas Samba OG",
      brand: "Adidas",
      colors: ["White", "Red", "Blue", "Black"],
      priceBdt: 2720,
      segment: "heritage",
    },
    {
      id: "puma-ca-pro",
      name: "Puma CA Pro",
      brand: "Puma",
      colors: ["White", "Gum"],
      priceBdt: 2756,
      segment: "lifestyle",
    },
    {
      id: "nike-air-force-1-classic",
      name: "Nike Air Force 1 Sneaker",
      brand: "Nike",
      colors: ["Multi"],
      priceBdt: 2774,
      segment: "lifestyle",
    },
    {
      id: "puma-smash-v2",
      name: "Puma Smash V2 Vulc CV",
      brand: "Puma",
      colors: ["Multi"],
      priceBdt: 2684,
      segment: "skate",
      audience: "chain",
    },
    {
      id: "run-3",
      name: "Run 3",
      brand: "Run Series",
      colors: ["Assorted"],
      priceBdt: 2810,
      segment: "athleisure",
    },
    {
      id: "air-force-1-react-qs",
      name: "Air Force 1 React QS",
      brand: "Nike",
      colors: ["Multi"],
      priceBdt: 3170,
      badge: "Drop",
      badgeVariant: "accent",
      segment: "statement",
    },
    {
      id: "air-monarch-iv",
      name: "Air Monarch IV Men's",
      brand: "Nike",
      colors: ["Multi"],
      priceBdt: 2990,
      segment: "performance",
    },
    {
      id: "nike-sb-dunk-born-raised",
      name: "Nike SB Dunk Low \"Born x Raised\"",
      brand: "Nike SB",
      colors: ["Blue", "Pink"],
      priceBdt: 2990,
      badge: "Limited",
      badgeVariant: "warning",
      segment: "skate",
      audience: "boutique",
    },
    {
      id: "onitsuka-tokuten",
      name: "Onitsuka Tiger Tokuten",
      brand: "Onitsuka Tiger",
      colors: ["Blue", "Red", "Black", "White", "Green"],
      priceBdt: 2810,
      segment: "heritage",
    },
  ];

  const formatColors = (colors = []) =>
    colors.map((color) => color.trim()).filter(Boolean);

  const pickImages = (brand) => {
    const key = brand.toLowerCase();
    if (imageSets[key]) return imageSets[key];
    if (key.includes("jordan")) return imageSets["air jordan"];
    if (key.includes("nike")) return imageSets.nike;
    if (key.includes("puma")) return imageSets.puma;
    if (key.includes("adidas")) return imageSets.adidas;
    if (key.includes("asics")) return imageSets.asics;
    if (key.includes("onitsuka")) return imageSets.onitsuka;
    return imageSets.default;
  };

  const defaultSpecs = {
    upper: "Premium synthetics",
    midsole: "EVA + Air blend",
    outsole: "Durable rubber",
    weight: "310 g (EU 42)",
  };

  const normalizeEntry = (entry) => {
    const gallery = pickImages(entry.brand);
    const audience = entry.audience || (entry.priceBdt >= 2950 ? "boutique" : "chain");
    const landedCost =
      entry.priceBdt && entry.priceBdt > 0
        ? `${entry.priceBdt.toLocaleString()} BDT / pair`
        : "Custom quote";

    return {
      id: entry.id,
      name: entry.name,
      brand: entry.brand,
      brandSlug: entry.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline:
        entry.tagline || `${entry.brand} staple tuned for Bangladesh retailers.`,
      excerpt:
        entry.excerpt ||
        `${entry.name} ships lane-ready with humidity-proof lining.`,
      description:
        entry.description ||
        `${entry.name} keeps your assortment fresh with disciplined QC, Dhaka-ready packaging, and transparent landed costing.`,
      badge: entry.badge || "Premium",
      badgeVariant: entry.badgeVariant || "neutral",
      category: audience,
      segment: entry.segment || "lifestyle",
      price: entry.priceBdt || 0,
      priceBdt: entry.priceBdt || 0,
      moq: entry.moq || 120,
      leadTime: entry.leadTime || "9 days",
      shipWindow: entry.shipWindow || "7-10 days",
      landedCost,
      compliance: entry.compliance || "QC by Exporium Dhaka",
      image: gallery[0],
      gallery,
      features: entry.features || defaultFeatures,
      specs: entry.specs || defaultSpecs,
      logistics: entry.logistics || baseLogistics,
      colors: formatColors(entry.colors),
      story:
        entry.story ||
        `${entry.brand} partners rely on Exporium to launch ${entry.name} across Dhaka, Chittagong, and Sylhet with blended freight lanes.`,
    };
  };

  window.exporiumProducts = catalogEntries.map(normalizeEntry);
})();
