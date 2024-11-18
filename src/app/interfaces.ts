export interface Item {
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
  item: Item;
  quantity: number;
}