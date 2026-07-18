import imgMacasarWhite from '../assets/images/resource/products/kag-tiles/macasar-white.png';
import imgCatalinaBianco from '../assets/images/resource/products/kag-tiles/catalina-bianco.png';
import imgCatalinaDecor from '../assets/images/resource/products/kag-tiles/catalina-decor.png';
import imgCatalinaBeige from '../assets/images/resource/products/kag-tiles/catalina-beige.png';
import imgDominoBeige from '../assets/images/resource/products/kag-tiles/domino-beige.png';
import imgDominoGrey from '../assets/images/resource/products/kag-tiles/domino-grey.png';
import imgDominoDecor from '../assets/images/resource/products/kag-tiles/domino-decor.png';
import imgDominoBlue from '../assets/images/resource/products/kag-tiles/domino-blue.png';
import imgFossilGrey from '../assets/images/resource/products/kag-tiles/fossil-grey.png';
import imgFossilBeige from '../assets/images/resource/products/kag-tiles/fossil-beige.png';
import imgFossilBrown from '../assets/images/resource/products/kag-tiles/fossil-brown.png';
import imgFossilBlue from '../assets/images/resource/products/kag-tiles/fossil-blue.png';
import imgGalaxyGrey from '../assets/images/resource/products/kag-tiles/galaxy-grey.png';
import imgGalaxyBlack from '../assets/images/resource/products/kag-tiles/galaxy-black.png';
import imgGalaxyDecor from '../assets/images/resource/products/kag-tiles/galaxy-decor.png';
import imgGalaxyBlue from '../assets/images/resource/products/kag-tiles/galaxy-blue.png';
import imgOnyxWhite from '../assets/images/resource/products/kag-tiles/onyx-white.png';
import imgOnyxBeige from '../assets/images/resource/products/kag-tiles/onyx-beige.png';
import imgOnyxGrey from '../assets/images/resource/products/kag-tiles/onyx-grey.png';
import imgOnyxBlack from '../assets/images/resource/products/kag-tiles/onyx-black.png';
import imgRoyalWhite from '../assets/images/resource/products/kag-tiles/royal-white.png';
import imgRoyalBeige from '../assets/images/resource/products/kag-tiles/royal-beige.png';
import imgRoyalGrey from '../assets/images/resource/products/kag-tiles/royal-grey.png';
import imgRoyalBlack from '../assets/images/resource/products/kag-tiles/royal-black.png';
import imgElevationSlate from '../assets/images/resource/products/kag-tiles/elevation-slate.png';
import imgParkingCobble from '../assets/images/resource/products/kag-tiles/parking-cobble.png';
import imgWoodenStripMaple from '../assets/images/resource/products/kag-tiles/wooden-strip-maple.png';
import imgWaterClosetRimless from '../assets/images/resource/products/kag-tiles/water-closet-rimless.png';
import imgWashBasinTabletop from '../assets/images/resource/products/kag-tiles/wash-basin-tabletop.png';
import imgFaucetLuxuryMixer from '../assets/images/resource/products/kag-tiles/faucet-luxury-mixer.png';
import imgShowerheadPremium from '../assets/images/resource/products/kag-tiles/showerhead-premium.png';
import imgTileAdhesiveBag from '../assets/images/resource/products/kag-tiles/tile-adhesive-bag.png';
import imgPtmtTap from '../assets/images/resource/products/kag-tiles/ptmt-tap.png';

const rawProducts = [
  {
    id: 1,
    name: 'MACASAR WHITE',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 320,
    image: imgMacasarWhite
  },
  {
    id: 2,
    name: 'CATALINA BIANCO',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 280,
    image: imgCatalinaBianco
  },
  {
    id: 3,
    name: 'CATALINA DECOR',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 350,
    image: imgCatalinaDecor
  },
  {
    id: 4,
    name: 'CATALINA BEIGE',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 290,
    image: imgCatalinaBeige
  },
  {
    id: 5,
    name: 'DOMINO BEIGE',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 310,
    image: imgDominoBeige
  },
  {
    id: 6,
    name: 'DOMINO GREY',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 310,
    image: imgDominoGrey
  },
  {
    id: 7,
    name: 'DOMINO DECOR',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 360,
    image: imgDominoDecor
  },
  {
    id: 8,
    name: 'DOMINO BLUE',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 340,
    image: imgDominoBlue
  },
  {
    id: 9,
    name: 'FOSSIL GREY',
    size: '600x1200 mm',
    type: 'GVT',
    application: 'Living Room/Bedroom',
    material: 'Glazed Vitrified (GVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 450,
    image: imgFossilGrey
  },
  {
    id: 10,
    name: 'FOSSIL BEIGE',
    size: '600x1200 mm',
    type: 'GVT',
    application: 'Living Room/Bedroom',
    material: 'Glazed Vitrified (GVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 450,
    image: imgFossilBeige
  },
  {
    id: 11,
    name: 'FOSSIL BROWN',
    size: '600x1200 mm',
    type: 'GVT',
    application: 'Living Room/Bedroom',
    material: 'Glazed Vitrified (GVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 460,
    image: imgFossilBrown
  },
  {
    id: 12,
    name: 'FOSSIL BLUE',
    size: '600x1200 mm',
    type: 'GVT',
    application: 'Living Room/Bedroom',
    material: 'Glazed Vitrified (GVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 480,
    image: imgFossilBlue
  },
  {
    id: 13,
    name: 'GALAXY GREY',
    size: '800x800 mm',
    type: 'PGVT',
    application: 'Office/Commercial/Shop',
    material: 'Polished Glazed Vitrified (PGVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 520,
    image: imgGalaxyGrey
  },
  {
    id: 14,
    name: 'GALAXY BLACK',
    size: '800x800 mm',
    type: 'PGVT',
    application: 'Office/Commercial/Shop',
    material: 'Polished Glazed Vitrified (PGVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 550,
    image: imgGalaxyBlack
  },
  {
    id: 15,
    name: 'GALAXY DECOR',
    size: '800x800 mm',
    type: 'PGVT',
    application: 'Office/Commercial/Shop',
    material: 'Polished Glazed Vitrified (PGVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 580,
    image: imgGalaxyDecor
  },
  {
    id: 16,
    name: 'GALAXY BLUE',
    size: '800x800 mm',
    type: 'PGVT',
    application: 'Office/Commercial/Shop',
    material: 'Polished Glazed Vitrified (PGVT)',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 590,
    image: imgGalaxyBlue
  },
  {
    id: 17,
    name: 'ONYX WHITE',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 340,
    image: imgOnyxWhite
  },
  {
    id: 18,
    name: 'ONYX BEIGE',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 340,
    image: imgOnyxBeige
  },
  {
    id: 19,
    name: 'ONYX GREY',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 340,
    image: imgOnyxGrey
  },
  {
    id: 20,
    name: 'ONYX BLACK',
    size: '600x600 mm',
    type: 'Vitrified',
    application: 'Living Room/Bedroom',
    material: 'Double Charge Vitrified',
    finish: 'Glossy/High Glossy',
    brand: 'KAG',
    price: 360,
    image: imgOnyxBlack
  },
  {
    id: 21,
    name: 'ROYAL WHITE',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 250,
    image: imgRoyalWhite
  },
  {
    id: 22,
    name: 'ROYAL BEIGE',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 250,
    image: imgRoyalBeige
  },
  {
    id: 23,
    name: 'ROYAL GREY',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 250,
    image: imgRoyalGrey
  },
  {
    id: 24,
    name: 'ROYAL BLACK',
    size: '600x600 mm',
    type: 'Ceramic',
    application: 'Bathroom/Toilet/Kitchen',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Satin/Matt',
    brand: 'KAG',
    price: 270,
    image: imgRoyalBlack
  },
  {
    id: 25,
    name: 'ELEVATION SLATE',
    size: '300x600 mm',
    type: 'Elevation',
    application: 'Elevation/Exterior',
    material: 'Ceramic/Glazed Ceramic',
    finish: 'Structured',
    brand: 'KAG',
    price: 180,
    image: imgElevationSlate
  },
  {
    id: 26,
    name: 'PARKING COBBLE',
    size: '300x300 mm',
    type: 'Parking',
    application: 'Parking/Driveway/Garage',
    material: 'Full Body Vitrified',
    finish: 'Rustic/Carving',
    brand: 'KAG',
    price: 210,
    image: imgParkingCobble
  },
  {
    id: 27,
    name: 'WOODEN STRIP MAPLE',
    size: '200x1200 mm',
    type: 'Wooden',
    application: 'Living Room/Bedroom',
    material: 'Glazed Vitrified (GVT)',
    finish: 'Wood',
    brand: 'Others',
    price: 390,
    image: imgWoodenStripMaple
  },
  {
    id: 28,
    name: 'KAG RIMLESS ONE PIECE CLOSET',
    size: 'Standard',
    type: 'Water Closet',
    application: 'Bathroom',
    material: 'Vitreous China',
    finish: 'Glossy White',
    brand: 'KAG',
    price: 8500,
    category: 'Sanitary Wares',
    image: imgWaterClosetRimless
  },
  {
    id: 29,
    name: 'KAG TABLE TOP WASH BASIN',
    size: 'Standard',
    type: 'Wash Basin',
    application: 'Bathroom/Dining',
    material: 'Ceramic',
    finish: 'Glossy White',
    brand: 'KAG',
    price: 3200,
    category: 'Sanitary Wares',
    image: imgWashBasinTabletop
  },
  {
    id: 30,
    name: 'AQUA LUXURY BASIN MIXER',
    size: 'Standard',
    type: 'Faucet/Tap',
    application: 'Bathroom/Kitchen',
    material: 'Brass/Chrome',
    finish: 'Mirror Finish',
    brand: 'Aqua',
    price: 2100,
    category: 'Bath Fittings',
    image: imgFaucetLuxuryMixer
  },
  {
    id: 31,
    name: 'KAG PREMIUM SHOWER HEAD',
    size: 'Standard',
    type: 'Shower',
    application: 'Bathroom',
    material: 'Stainless Steel',
    finish: 'Chrome',
    brand: 'KAG',
    price: 1800,
    category: 'Bath Fittings',
    image: imgShowerheadPremium
  },
  {
    id: 32,
    name: 'KAG PREMIUM TILE ADHESIVE',
    size: '20 kg',
    type: 'Adhesive',
    application: 'Tiling Installation',
    material: 'Cement-based',
    finish: 'Grey Powder',
    brand: 'KAG',
    price: 450,
    category: 'Others',
    image: imgTileAdhesiveBag
  },
  {
    id: 33,
    name: 'PTMT LEAK-PROOF TAP',
    size: 'Standard',
    type: 'Tap',
    application: 'Outdoor/Bathroom',
    material: 'PTMT',
    finish: 'White/Ivory',
    brand: 'Others',
    price: 150,
    category: 'Others',
    image: imgPtmtTap
  }
];

// Temporary storefront pricing configuration. This object can be replaced by
// dashboard/API values later without changing the product card components.
const newArrivalIds = new Set([4, 8, 25, 28, 29, 31, 32]);

export const products = rawProducts.map((product) => {
  const offerPrice = product.price;
  const mrp = Math.ceil((offerPrice * 1.18) / 10) * 10;

  return {
    ...product,
    category: product.category || 'Tiles',
    mrp,
    offerPrice,
    isNewArrival: newArrivalIds.has(product.id),
  };
});
