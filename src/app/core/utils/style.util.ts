export function assignIcon(category: string) {
  return `fa-solid fa-${CATEGORY_ICONS[category]}`;
}

export function assignIconColor(category: string) {
  return { 'background-color': COLOR_CATEGORIES[category], color: '#1a2551' };
}

export function assignAccountTypeIcon(type: string) {
  return `fa-solid fa-${ACCOUNT_TYPE_ICONS[type]}`;
}

export function assignAccountTypeIconColor(type: string) {
  return { 'background-color': ACCOUNT_TYPE_COLORS[type], color: '#1a2551' };
}

export const CATEGORY_ICONS: any = {
  'Food & Dining': 'utensils',
  Groceries: 'cart-shopping',
  Transportation: 'car',
  Entertainment: 'wine-bottle',
  'Health & Wellness': 'dumbbell',
  Shopping: 'tag',
  Utilities: 'bolt',
  Rent: 'house',
  Travel: 'plane',
  Education: 'book',
  Subscriptions: 'arrows-rotate',
  'Gifts & Donations': 'gift',
  Insurance: 'shield',
  'Personal Care': 'shower',
  Other: 'o',
  Income: 'money-bill',
  'Credit Card Payment': 'credit-card',
  Transfer: 'right-left',
  Unknown: 'question',
};

export const COLOR_CATEGORIES: any = {
  'Food & Dining': '#A26769', // Dusty Rose
  Groceries: '#D4A373', // Muted Sand
  Transportation: '#6B9080', // Soft Teal
  Entertainment: '#905E96', // Dusky Purple
  'Health & Wellness': '#90A955', // Moss Green
  Shopping: '#E59866', // Peachy Beige
  Utilities: '#7286A0', // Muted Blue-Gray
  Rent: '#8E7DBE', // Lavender Gray
  Travel: '#6C91C2', // Cool Blue
  Education: '#A3A380', // Sage
  Subscriptions: '#CC8B79', // Soft Clay
  'Gifts & Donations': '#C4A77D', // Vintage Tan
  Insurance: '#799AA3', // Grayish Blue
  'Personal Care': '#B685A2', // Muted Pink
  Other: '#6E635D', // Warm Gray
  Income: '#138A36', //Forest Green
  'Credit Card Payment': '#a5857e',
  Transfer: '#848e5b',
};

export const ACCOUNT_TYPE_ICONS: any = {
  Banks: 'building-columns',
  'Credit Cards': 'credit-card',
  Investments: 'arrow-trend-up',
  Retirement: 'person-cane',
};

export const ACCOUNT_TYPE_COLORS: any = {
  Banks: '#A26769', // Dusty Rose
  'Credit Cards': '#D4A373', // Muted Sand
  Investments: '#6B9080', // Soft Teal
  Retirement: '#905E96', // Dusky Purple
};
