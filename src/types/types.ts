export interface Product {
  id: string;
  name: string;
  description: string;

  [key: string]: any;
}

export interface CartProduct extends Product {
  variation: string;
  amount: number;
  similarDisPlay: boolean;
  variationDisPlay: boolean;
  variationList: string[];

  [key: string]: any;  // For other potential properties
}
