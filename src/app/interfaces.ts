export interface Item {
  isInCart?: boolean;
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Cart {
  id: number;
  itemId: number;
  quantity: number;
}