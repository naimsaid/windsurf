import { computed, Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  readonly items = this.cartItems.asReadonly();

  readonly itemCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  readonly shipping = computed(() => (this.subtotal() > 100 ? 0 : 9.99));

  readonly tax = computed(() => this.subtotal() * 0.2);

  readonly total = computed(() => this.subtotal() + this.shipping() + this.tax());

  addToCart(product: Product, quantity = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
      };
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.set([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.set(this.cartItems().filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    this.cartItems.set(updatedItems);
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some((item) => item.product.id === productId);
  }
}
