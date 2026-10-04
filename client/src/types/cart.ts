export interface Product {
  id?: number;
  title?: string;
  price?: number;
  quantity?: number;
  total?: number;
  discountPercentage?: number;
  discountedTotal?: number;
  thumbnail?: string;
}

export interface Cart {
  _id?: string;
  id?: number;
  products?: Product[];
  total?: number;
  discountedTotal?: number;
  userId?: number;
  totalProducts?: number;
  totalQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}
