import { Injectable } from '@angular/core';
import { CATEGORIES, PRODUCTS } from '../data/mock-data';
import { Category, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = PRODUCTS;
  private categories = CATEGORIES;

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter((p) => p.featured);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery),
    );
  }

  filterProducts(category: string, minPrice: number, maxPrice: number, searchQuery: string): Product[] {
    let filtered = this.products;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }

    if (maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery),
      );
    }

    return filtered;
  }
}
