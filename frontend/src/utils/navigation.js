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
    children: [
      { label: 'Tiles', path: '/products', state: { filterCategory: 'category', filterValue: 'Tiles' } },
      { label: 'Sanitary Wares', path: '/products', state: { filterCategory: 'category', filterValue: 'Sanitary Wares' } },
      { label: 'Bath Fittings', path: '/products', state: { filterCategory: 'category', filterValue: 'Bath Fittings' } },
      { label: 'Others', path: '/products', state: { filterCategory: 'category', filterValue: 'Others' } },
    ],
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
