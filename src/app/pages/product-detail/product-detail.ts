import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  relatedProducts = signal<Product[]>([]);
  quantity = signal(1);
  addedToCart = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      const product = this.productService.getProductById(id);
      if (product) {
        this.product.set(product);
        this.loadRelatedProducts(product);
        this.quantity.set(1);
        this.addedToCart.set(false);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  private loadRelatedProducts(product: Product): void {
    const related = this.productService
      .getProductsByCategory(product.category)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
    this.relatedProducts.set(related);
  }

  increaseQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity());
      this.addedToCart.set(true);
      setTimeout(() => this.addedToCart.set(false), 2000);
    }
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalf) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }
}
