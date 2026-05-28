import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CustomerInfo } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  readonly cartService = inject(CartService);
  private router = inject(Router);

  orderPlaced = signal(false);
  orderId = signal('');

  customer: CustomerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France',
  };

  paymentMethod = 'card';

  placeOrder(): void {
    this.orderId.set('ORD-' + Date.now().toString(36).toUpperCase());
    this.orderPlaced.set(true);
    this.cartService.clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
