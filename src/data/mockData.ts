import { Hookah, Flavor, MenuItem, GalleryItem, User, NotificationItem, AccentColorOption } from '../types';
import { IMAGE_MAP } from '../config/imageMap';

export const heroHookahImg = IMAGE_MAP.heroHookah;
export const loungeInteriorImg = IMAGE_MAP.loungeInterior;
export const royalHookahImg = IMAGE_MAP.royalHookah;
export const appMockupImg = IMAGE_MAP.appMockup;

export const SIGNATURE_HOOKAHS: Hookah[] = [
  {
    id: 'hk-1',
    name: 'Royal Noir',
    description: 'Our signature masterpiece crafted from hand-blown obsidian crystal glass with polished brass detailing and champagne gold accents.',
    price: 2500,
    image: IMAGE_MAP.hookahs.royalNoir,
    recommendedFlavor: 'Tropical Noir',
    strength: 'Balanced',
    baseOptions: ['Ice Chilled Base', 'Infused Fresh Fruit Base', 'Sparkling Champagne Water Base', 'Perrier Mineral Base'],
    features: ['Hand-Blown German Crystal', 'Magnetic Hose Connector', 'Dual Purge System', 'Diffuser Airflow Adjustment'],
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'hk-2',
    name: 'Midnight Gold',
    description: 'An opulent 24K gold-plated stem paired with deep amber tinted glass. Engineered for effortless airflow and thick, velvety clouds.',
    price: 3000,
    image: IMAGE_MAP.hookahs.midnightGold,
    recommendedFlavor: 'Midnight Berry',
    strength: 'Robust',
    baseOptions: ['Mint Infused Cold Base', 'Rosewater & Gold Leaf Base', 'Crushed Ice Chamber'],
    features: ['24K Titanium Gold Coating', 'Medical Grade Silicone Hose', 'Heat Management Device Included'],
    rating: 5.0,
    isPopular: true
  },
  {
    id: 'hk-3',
    name: 'Obsidian',
    description: 'Sleek matte black carbon fiber structure with an architectural geometry. Designed for purists who command extreme flavor purity.',
    price: 3500,
    image: IMAGE_MAP.hookahs.obsidian,
    recommendedFlavor: 'Double Apple',
    strength: 'Intense',
    baseOptions: ['Activated Charcoal Base', 'Glacier Ice Chill', 'Eucalyptus Purifying Base'],
    features: ['Aerospace Carbon Fiber', 'Silently Diffused Draw', 'Ultra-Durable Anodized Aluminum'],
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'hk-4',
    name: 'Imperial',
    description: 'Standing at an imposing 34 inches, the Imperial commands presence. Features dual hose capabilities and a heavy crystal pedestal.',
    price: 4200,
    image: IMAGE_MAP.hookahs.imperial,
    recommendedFlavor: 'Mango Ice',
    strength: 'Robust',
    baseOptions: ['Fruit Basket Infusion Base', 'Chilled Milk & Honey Base', 'Ice Mountain Base'],
    features: ['Dual Hose VIP Configuration', 'Heavy Duty Bohemian Glass', 'Custom Velvet Leather Case'],
    rating: 4.9
  },
  {
    id: 'hk-5',
    name: 'Velvet Smoke',
    description: 'Minimalist contemporary design with a frosted satin finish and subtle ambient LED illumination built into the crystal base.',
    price: 2800,
    image: IMAGE_MAP.hookahs.velvetSmoke,
    recommendedFlavor: 'Blueberry Mint',
    strength: 'Smooth',
    baseOptions: ['Berry Nectar Cold Base', 'Mint Leaves & Lemon Water'],
    features: ['Wireless Mood LED Base Ring', 'Whisper-Quiet Diffuser', 'Custom Soft Touch Handle'],
    rating: 4.7
  },
  {
    id: 'hk-6',
    name: 'Black Diamond',
    description: 'The pinnacle of luxury. Diamond-cut facet glass crystal base housing 24K gold foil flakes and a hand-stitched leather hose handle.',
    price: 5000,
    image: IMAGE_MAP.hookahs.blackDiamond,
    recommendedFlavor: 'Rose Mint',
    strength: 'Intense',
    baseOptions: ['Saffron & Gold Leaf Base', 'Dom Pérignon Vintage Infusion', 'Chilled Rose Water & Ice'],
    features: ['Diamond-Cut Crystal Base', 'Real Gold Flakes Included', 'Personalized Engraved Metal Ring'],
    rating: 5.0,
    isPopular: true
  }
];

export const FLAVORS: Flavor[] = [
  {
    id: 'fl-1',
    name: 'Blueberry Mint',
    category: 'Fruity',
    description: 'Plump sun-ripened mountain blueberries balanced with crisp spearmint leaves for a refreshing finish.',
    intensity: 4,
    coolingLevel: 4,
    recommendedHookah: 'Velvet Smoke',
    price: 800,
    image: IMAGE_MAP.flavors.blueberryMint
  },
  {
    id: 'fl-2',
    name: 'Double Apple',
    category: 'Classic',
    description: 'The timeless classic. Rich sweet red apples blended with tart green apple notes and a subtle touch of anise.',
    intensity: 5,
    coolingLevel: 2,
    recommendedHookah: 'Obsidian',
    price: 750,
    image: IMAGE_MAP.flavors.doubleApple
  },
  {
    id: 'fl-3',
    name: 'Mango Ice',
    category: 'Fruity',
    description: 'Juicy Alphonso mango nectar frozen into an icy tropical breeze that coats the palate in sweetness.',
    intensity: 4,
    coolingLevel: 5,
    recommendedHookah: 'Imperial',
    price: 850,
    image: IMAGE_MAP.flavors.mangoIce
  },
  {
    id: 'fl-4',
    name: 'Grape Mint',
    category: 'Mint',
    description: 'Dark concord grape essence paired with arctic peppermint for a crisp, aromatic vape cloud.',
    intensity: 3,
    coolingLevel: 4,
    recommendedHookah: 'Royal Noir',
    price: 800,
    image: IMAGE_MAP.flavors.grapeMint
  },
  {
    id: 'fl-5',
    name: 'Peach Ice',
    category: 'Fruity',
    description: 'Velvety Georgia peach flesh infused with sub-zero menthol crystals for a smooth inhale.',
    intensity: 3,
    coolingLevel: 4,
    recommendedHookah: 'Velvet Smoke',
    price: 800,
    image: IMAGE_MAP.flavors.peachIce
  },
  {
    id: 'fl-6',
    name: 'Watermelon Chill',
    category: 'Fruity',
    description: 'Sweet pink watermelon slushie with a blast of crushed glacier ice for summer nights.',
    intensity: 3,
    coolingLevel: 5,
    recommendedHookah: 'Midnight Gold',
    price: 850,
    image: IMAGE_MAP.flavors.watermelonChill
  },
  {
    id: 'fl-7',
    name: 'Vanilla Cream',
    category: 'Dessert',
    description: 'Creamy Madagascan vanilla pod custard topped with toasted coconut flakes and soft caramel.',
    intensity: 4,
    coolingLevel: 1,
    recommendedHookah: 'Black Diamond',
    price: 900,
    image: IMAGE_MAP.flavors.vanillaCream
  },
  {
    id: 'fl-8',
    name: 'Rose Mint',
    category: 'Signature',
    description: 'Damascus rose water petals distilled into delicate aromatic vapors with wild wintergreen.',
    intensity: 4,
    coolingLevel: 3,
    recommendedHookah: 'Black Diamond',
    price: 1000,
    image: IMAGE_MAP.flavors.roseMint,
    isExclusive: true
  },
  {
    id: 'fl-9',
    name: 'Tropical Noir',
    category: 'Signature',
    description: 'House secret reserve blend featuring passionfruit, guava nectar, lychee, and golden tobacco leaf.',
    intensity: 5,
    coolingLevel: 3,
    recommendedHookah: 'Royal Noir',
    price: 1200,
    image: IMAGE_MAP.flavors.tropicalNoir,
    isExclusive: true
  },
  {
    id: 'fl-10',
    name: 'Midnight Berry',
    category: 'Premium',
    description: 'Blackcurrant liqueur aroma combined with wild blackberries, elderberries, and menthol breeze.',
    intensity: 4,
    coolingLevel: 4,
    recommendedHookah: 'Midnight Gold',
    price: 950,
    image: IMAGE_MAP.flavors.midnightBerry
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    name: 'Noir Smoked Old Fashioned',
    category: 'Craft Beverages',
    description: 'Non-alcoholic oak-barrel zero-proof bourbon, orange bitters, hickory wood smoke dome presentation.',
    price: 1400,
    image: IMAGE_MAP.menu.smokedOldFashioned,
    tags: ['Signature Drink', 'Smoked Table Presentation']
  },
  {
    id: 'm-2',
    name: 'Champagne Sparkler Mocktail',
    category: 'Craft Beverages',
    description: 'Sparkling white grape elixir, white peach puree, edible 24K gold dust leaf, rosemary sprig.',
    price: 1600,
    image: IMAGE_MAP.menu.champagneSparkler,
    tags: ['Best Seller', '24K Gold']
  },
  {
    id: 'm-3',
    name: 'Pomegranate Saffron Elixir',
    category: 'Craft Beverages',
    description: 'Fresh ruby pomegranate, Persian saffron thread syrup, cardamon mist, crushed ice sphere.',
    price: 1200,
    image: IMAGE_MAP.menu.pomegranateSaffron,
    tags: ['Organic', 'House Recipe']
  },
  {
    id: 'm-4',
    name: 'Imperial Silver Needle Tea',
    category: 'Artisanal Tea',
    description: 'Rare Fujian white tea buds served in an iron kettle with organic blossom honey and dry mint.',
    price: 1100,
    image: IMAGE_MAP.menu.silverNeedleTea,
    tags: ['Artisanal', 'Zero Caffeine Option']
  },
  {
    id: 'm-5',
    name: 'Moroccan Royal Mint Tea',
    category: 'Artisanal Tea',
    description: 'Fresh garden spearmint, pinhead gunpowder tea poured elevated at your table with pine nuts.',
    price: 950,
    image: IMAGE_MAP.menu.moroccanRoyalMintTea,
    tags: ['Traditional', 'Table Service']
  },
  {
    id: 'm-6',
    name: 'Truffle Wagyu Slider Trio',
    category: 'Gourmet Bites',
    description: 'Grade A5 wagyu beef sliders, black truffle aioli, aged caramelized onions, brioche bun.',
    price: 3200,
    image: IMAGE_MAP.menu.truffleWagyuSliders,
    tags: ['Chef Special', 'A5 Wagyu']
  },
  {
    id: 'm-7',
    name: 'Artisanal Mezze Platter',
    category: 'Gourmet Bites',
    description: 'Silky smoked hummus, pomegranate moutabal, falafel bites, stuffed vine leaves, warm pita breads.',
    price: 2400,
    image: IMAGE_MAP.menu.artisanalMezzePlatter,
    tags: ['Vegetarian', 'Sharing Platter']
  },
  {
    id: 'm-8',
    name: 'Gold Leaf Baklava Deluxe',
    category: 'Gourmet Bites',
    description: 'Layered phyllo pastry, pistachio mousse, organic wild honey glaze, 24K gold foil topping.',
    price: 1800,
    image: IMAGE_MAP.menu.goldBaklavaDeluxe,
    tags: ['Dessert', '24K Gold']
  },
  {
    id: 'm-9',
    name: 'VIP Royal Experience Package',
    category: 'VIP Packages',
    description: 'Includes 1 Signature Black Diamond Hookah, 2 Refill Bowls, 2 Craft Mocktails, and 1 Gourmet Mezze Platter.',
    price: 9500,
    image: IMAGE_MAP.menu.vipRoyalBundle,
    tags: ['VIP Choice', 'Complete Bundle']
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Royal Obsidian Suite',
    category: 'VIP',
    image: IMAGE_MAP.gallery.royalObsidianSuite,
    description: 'Private enclosed suite with custom mood lighting and dedicated hookah sommelier service.'
  },
  {
    id: 'g-2',
    title: 'The Royal Noir Hookah',
    category: 'Hookahs',
    image: IMAGE_MAP.gallery.royalNoirHookah,
    description: 'Hand-blown crystal glass base illuminated by warm gold spotlights.'
  },
  {
    id: 'g-3',
    title: 'Main Lounge Evening Glow',
    category: 'Lounge',
    image: IMAGE_MAP.gallery.mainLoungeGlow,
    description: 'Spacious leather seating with low ambient lighting and velvet drapery.'
  },
  {
    id: 'g-4',
    title: 'Smoked Old Fashioned Cocktail',
    category: 'Drinks',
    image: IMAGE_MAP.gallery.smokedOldFashioned,
    description: 'Zero-proof bourbon mocktail presented under a hickory smoke glass bell.'
  },
  {
    id: 'g-5',
    title: 'Artisanal Flavor Preparation',
    category: 'Flavors',
    image: IMAGE_MAP.gallery.flavorPreparation,
    description: 'Hand-mixed dark leaf tobacco with pure fruit essential oils.'
  },
  {
    id: 'g-6',
    title: 'Atmospheric Smoke Canvas',
    category: 'Atmosphere',
    image: IMAGE_MAP.gallery.smokeCanvas,
    description: 'Dense, velvety smoke rings ascending into soft amber beam lighting.'
  }
];

export const CURRENT_USER_MOCK: User = {
  id: 'usr-8821',
  name: 'Ahmad Khan',
  email: 'ahmad.khan@noirhookah.com',
  phone: '+92 300 1234567',
  tier: 'Black VIP',
  membershipTier: 'Black VIP',
  loyaltyPoints: 3450,
  isAdmin: true,
  rewardHistory: [
    { id: 'rw-1', title: 'Complimentary Bowl Upgrade', points: 500, date: '2026-08-15' },
    { id: 'rw-2', title: 'VIP Table Priority Booking', points: 1200, date: '2026-07-28' },
  ],
  orderHistory: [
    { id: 'ord-992', date: '2026-08-30', total: 6300, itemsCount: 3, status: 'Completed' },
    { id: 'ord-811', date: '2026-08-12', total: 4200, itemsCount: 2, status: 'Completed' },
  ],
  reservationsHistory: [
    {
      id: 'res-401',
      name: 'Ahmad Khan',
      phone: '+92 300 1234567',
      email: 'ahmad.khan@noirhookah.com',
      date: '2026-09-18',
      time: '09:00 PM',
      guests: 4,
      seatingPreference: 'VIP',
      specialRequest: 'Anniversary table setup with Rose Mint hookah',
      status: 'Confirmed',
      createdAt: '2026-09-08'
    }
  ]
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Exclusive Drop: Tropical Noir Reserve',
    message: 'Limited edition house tobacco mix now available for Black VIP members.',
    date: '10 mins ago',
    read: false,
    type: 'drop'
  },
  {
    id: 'notif-2',
    title: 'Reservation Confirmed',
    message: 'Your VIP Private Room reservation for Sept 18, 09:00 PM has been confirmed.',
    date: '2 hours ago',
    read: false,
    type: 'reservation'
  },
  {
    id: 'notif-3',
    title: '500 Loyalty Points Awarded',
    message: 'Points added from your last visit at NOIR Clifton Lounge.',
    date: '1 day ago',
    read: true,
    type: 'offer'
  }
];

export const ACCENT_COLOR_OPTIONS: AccentColorOption[] = [
  {
    id: 'gold',
    name: 'Metallic Gold',
    hex: '#d4af37',
    lightHex: '#f7e7ce',
    glowRgb: '212, 175, 55'
  },
  {
    id: 'champagne',
    name: 'Champagne Bronze',
    hex: '#e6c687',
    lightHex: '#fdf6e7',
    glowRgb: '230, 198, 135'
  },
  {
    id: 'rosegold',
    name: 'Rose Gold Noir',
    hex: '#b76e79',
    lightHex: '#fbe3e6',
    glowRgb: '183, 110, 121'
  },
  {
    id: 'platinum',
    name: 'Platinum Silver',
    hex: '#e5e4e2',
    lightHex: '#ffffff',
    glowRgb: '229, 228, 226'
  },
  {
    id: 'sapphire',
    name: 'Sapphire Midnight',
    hex: '#4a90e2',
    lightHex: '#d0e3ff',
    glowRgb: '74, 144, 226'
  }
];
