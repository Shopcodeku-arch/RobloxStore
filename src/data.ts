export type ProductType = 'flash' | 'first' | 'special' | 'regular';

export interface Product {
  id: number;
  type: ProductType;
  name: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  icon: string;
}

export const PRODUCTS: Product[] = [
  // FLASH SALE
  { id: 1, type: 'flash', name: "400 Robux", price: 65000, oldPrice: 75000, stock: 5, icon: "https://iili.io/fSNTPup.th.png" },
  // INSTAN
  { id: 3, type: 'first', name: "80 Robux", price: 19698, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 48, type: 'first', name: "400 Robux", price: 77999, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 49, type: 'first', name: "500 Robux", price: 79746, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 4, type: 'first', name: "800 Robux", price: 141819, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 50, type: 'first', name: "1000 Robux", price: 154794, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 51, type: 'first', name: "1500 Robux", price: 229246, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 13, type: 'first', name: "1700 Robux", price: 278649, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 52, type: 'first', name: "2000 Robux", price: 303996, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 31, type: 'first', name: "4500 Robux", price: 689141, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 32, type: 'first', name: "10000 Robux", price: 1484899, icon: "https://iili.io/fSNTPup.th.png" },
  { id: 33, type: 'first', name: "22500 Robux", price: 3104999, icon: "https://iili.io/fSNTPup.th.png" },
  // PREMIUM
  { id: 36, type: 'special', name: "Roblox Gift Card 50K",  price: 50000,  icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 37, type: 'special', name: "Roblox Gift Card 65K",  price: 65000,  icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 38, type: 'special', name: "Roblox Gift Card 100K", price: 100000, icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 39, type: 'special', name: "Roblox Gift Card 100K (x2)", price: 200000, icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 40, type: 'special', name: "Roblox Gift Card 300K", price: 300000, icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 41, type: 'special', name: "Roblox Gift Card 380K", price: 380000, icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 42, type: 'special', name: "Roblox Gift Card 500K", price: 500000, icon: "https://iili.io/fSeHWWQ.th.png" },
  { id: 43, type: 'special', name: "Roblox Gift Card 950K", price: 950000, icon: "https://iili.io/fSeHWWQ.th.png" },
  // PASS
  { id: 7, type: 'regular', name: "1 Robux", price: 500, icon: "https://iili.io/fSNhm0J.png" },
  { id: 8, type: 'regular', name: "100 Robux", price: 19400, icon: "https://iili.io/fSNhm0J.png" },
  { id: 10, type: 'regular', name: "500 Robux", price: 75000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 11, type: 'regular', name: "1000 Robux", price: 145000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 12, type: 'regular', name: "1500 Robux", price: 205000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 24, type: 'regular', name: "2000 Robux", price: 285000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 25, type: 'regular', name: "3000 Robux", price: 416000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 26, type: 'regular', name: "4000 Robux", price: 553000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 27, type: 'regular', name: "5000 Robux", price: 689000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 28, type: 'regular', name: "6000 Robux", price: 826000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 29, type: 'regular', name: "7000 Robux", price: 963000, icon: "https://iili.io/fSNhm0J.png" },
  { id: 30, type: 'regular', name: "8000 Robux", price: 1100000, icon: "https://iili.io/fSNhm0J.png" },
];
