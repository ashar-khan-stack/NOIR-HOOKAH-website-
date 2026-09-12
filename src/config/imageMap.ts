import heroHookahImg from '../assets/images/noir_hero_hookah_1789128618797.jpg';
import loungeInteriorImg from '../assets/images/noir_lounge_interior_1789128639892.jpg';
import royalHookahImg from '../assets/images/noir_royal_hookah_1789128658689.jpg';
import appMockupImg from '../assets/images/noir_app_mockup_1789128681597.jpg';

/**
 * Centralized Image Asset Mapping for NOIR HOOKAH.
 * Maps exact item names, product IDs, and categories to curated 3D renders & luxury photography.
 */
export const IMAGE_MAP = {
  // Local Named Assets
  heroHookah: heroHookahImg,
  loungeInterior: loungeInteriorImg,
  royalHookah: royalHookahImg,
  appMockup: appMockupImg,

  // Signature 3D Hookah Products
  hookahs: {
    royalNoir: royalHookahImg,
    midnightGold: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', // Gold stem & amber crystal
    obsidian: heroHookahImg, // Matte black carbon fiber structure
    imperial: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop', // Imposing 34-inch dual hose crystal
    velvetSmoke: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=1200&auto=format&fit=crop', // Frosted satin finish LED base
    blackDiamond: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1200&auto=format&fit=crop', // Diamond-cut glass with 24K gold flakes
  },

  // Artisanal Tobacco Flavors
  flavors: {
    blueberryMint: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=1000&auto=format&fit=crop', // Fresh blueberries & mint
    doubleApple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000&auto=format&fit=crop', // Sweet red & green apples
    mangoIce: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop', // Frozen Alphonso mango nectar
    grapeMint: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=1000&auto=format&fit=crop', // Concord grapes & peppermint
    peachIce: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=1000&auto=format&fit=crop', // Georgia peach & menthol
    watermelonChill: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?q=80&w=1000&auto=format&fit=crop', // Watermelon glacier ice
    vanillaCream: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1000&auto=format&fit=crop', // Madagascan vanilla pod cream
    roseMint: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop', // Damascus rose petals & wintergreen
    tropicalNoir: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1000&auto=format&fit=crop', // Secret reserve passionfruit & guava
    midnightBerry: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=1000&auto=format&fit=crop', // Wild blackberries & menthol
  },

  // Gourmet Pairings & Craft Beverages
  menu: {
    smokedOldFashioned: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop', // Smoked zero-proof bourbon
    champagneSparkler: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop', // White peach & 24K gold dust
    pomegranateSaffron: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1000&auto=format&fit=crop', // Ruby pomegranate & saffron
    silverNeedleTea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop', // Fujian white needle tea
    moroccanRoyalMintTea: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1000&auto=format&fit=crop', // Fresh spearmint & gunpowder tea
    truffleWagyuSliders: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop', // A5 Wagyu beef & black truffle aioli
    artisanalMezzePlatter: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=1000&auto=format&fit=crop', // Smoked hummus & moutabal
    goldBaklavaDeluxe: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=1000&auto=format&fit=crop', // Pistachio baklava & gold foil
    vipRoyalBundle: loungeInteriorImg,
  },

  // Gallery Categories & Experiences
  gallery: {
    royalObsidianSuite: loungeInteriorImg,
    royalNoirHookah: royalHookahImg,
    mainLoungeGlow: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1000&auto=format&fit=crop',
    smokedOldFashioned: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
    flavorPreparation: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1000&auto=format&fit=crop',
    smokeCanvas: heroHookahImg,
  },

  // Experience & Private Events Renders
  experiences: {
    sommelierService: royalHookahImg,
    privateSuite: loungeInteriorImg,
    molecularMixology: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
  },
};
