export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  isbn: string;
  publisher: string;
  publishedDate: string;
  pages: number;
  language: string;
  coverImage: string;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  bestseller: boolean;
  newRelease: boolean;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  image: string;
  bookCount: number;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  bookCount: number;
}

export interface Review {
  id: string;
  book_id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
