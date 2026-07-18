import { products } from './ProductData';

const productCategoryOrder = ['Tiles', 'Sanitary Wares', 'Bath Fittings', 'Others'];

const productMenuChildren = productCategoryOrder.map((category) => {
  const categoryProducts = products.filter((product) => product.category === category);
  const types = [...new Set(categoryProducts.map((product) => product.type))];

  return {
    label: category,
    path: '/products',
    state: { filterCategory: 'category', filterValue: category },
    children: types.map((type) => ({
      label: type,
      path: '/products',
      state: {
        filterCategory: 'type',
        filterValue: type,
        parentCategory: category,
      },
      children: categoryProducts
        .filter((product) => product.type === type)
        .map((product) => ({
          label: product.name,
          path: '/products',
          state: {
            filterCategory: 'product',
            filterValue: product.name,
            parentCategory: category,
            parentType: type,
          },
        })),
    })),
  };
});

// Central navigation data so the desktop and mobile menus never fall out of sync.
export const navigation = [
  {
    label: 'Home',
    path: '/',
    // children: [
    //   { label: 'Home page 01', path: '/' },
    //   { label: 'Home page 02', path: '#' },
    //   { label: 'Home page 03', path: '#' },
    //   { label: 'Dark Layer', path: '#' },
    // ],
  },
  {
    label: 'About Us',
    path: '/about',
    // children: [
    //   { label: 'About us', path: '/about' },
    //   { label: 'Faq', path: '#' },
    //   { label: 'Pricing', path: '#' },
    //   { label: 'Gallery', path: '#' },
    //   { label: 'Team', path: '#' },
    // ],
  },
  {
    label: 'Products',
    path: '/products',
    children: productMenuChildren,
  },
  {
    label: 'Blogs',
    path: '/blogs',
  },
  // {
    // label: 'Services',
    // path: '/services',
    // children: [
    //   { label: 'Services', path: '#' },
    //   { label: 'Service Detail', path: '#' },
    // ],
  // },
  // {
  //   label: 'Blog',
  //   path: '#',
  //   children: [
  //     { label: 'Blog', path: '#' },
  //     { label: 'Blog Classic', path: '#' },
  //     { label: 'Blog Detail', path: '#' },
  //   ],
  // },
  // {
  //   label: 'Shop',
  //   path: '#',
  //   children: [
  //     { label: 'Shop', path: '#' },
  //     { label: 'Shop Detail', path: '#' },
  //     { label: 'Shopping Cart', path: '#' },
  //     { label: 'Checkout', path: '#' },
  //   ],
  // },
  { label: 'Contact Us', path: '/contact' },
];
