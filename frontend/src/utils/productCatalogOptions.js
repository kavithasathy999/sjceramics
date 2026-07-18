import { products } from './ProductData';

export const PRODUCT_FILTER_OPTIONS = {
  sizes: [
    '12x12', '12X8', '12X22', '15X10', '16x16', '18x12', '20X20', '24X12',
    '24X24', '40X8', '48X24', '64x32', '72X48', '96X32', '4 Ft', '3 Ft',
    '12x2.92', '36x8',
  ],
  finishes: [
    'Carving', 'Crystal_high_glossy', 'Crystal_hg_carving', 'Ddg', 'Engrave',
    'Glossy', 'Glue', 'Granula', 'Granula_carving', 'Hg_polished_finish',
    'High_glossy_carving', 'Lappato', 'Matt', 'Rainbow', 'Sparkle', 'Sugar',
    'Sugar_glue', 'Varnis',
  ],
  usage: [
    'Elevation / Exterior Tiles', 'Bath_bedroom_living-Kit', 'Bath_bedroom_living',
    'Bathroom_tiles', 'Bedroom_livingroom_kit', 'Commercial_spaces',
    'Elevation_exterior', 'Kitchen', 'Kitchen_bathroom', 'Kitchen_counter_top',
    'Living_room', 'Outdoor', 'Parking', 'Pooja_room', 'Roof', 'Staircase',
    'Swimming_pool',
  ],
  materials: [
    'Classic_high_depth', 'Color_body', 'Double_charge', 'Floor_tiles_material',
    'Full_body_vitrified', 'Nano_vitrified', 'Pgvt', 'Porcelain', 'Vitrified',
    'Wall_tiles',
  ],
  colors: [
    'Dark', 'Light', 'Brown', 'Blue', 'Black', 'Cream', 'Gold', 'Green', 'Ivory',
    'Orange', 'Pearl', 'Pink', 'Red', 'Teal', 'White', 'Gray', 'Yellow',
    'Multicolor',
  ],
  netQuantities: ['1', '2', '3', '4', '5', '6', '8', '9', '10', '12'],
};

export const PRODUCT_TYPE_OPTIONS = [...new Set(products.map((product) => product.type))];
