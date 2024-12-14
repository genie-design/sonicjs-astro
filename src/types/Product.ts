export interface ProductSize {
  size: string;
  weight: string;
  price: number;
}

export interface Product {
  name: string;
  slug: string;
  description: string;
  features: string[];
  sizes: ProductSize[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
}
