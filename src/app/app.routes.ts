import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { VendorDashboardComponent } from './components/vendor-dashboard/vendor-dashboard.component';
import { CategoryManagementComponent } from './components/vendor-dashboard/category-management.component';
import { ProductFormComponent } from './components/vendor-dashboard/product-form.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { VendorGuard } from './interceptors/vendor.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'vendor',
    canActivate: [VendorGuard],
    children: [
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'add-product', component: ProductFormComponent },
      { path: 'edit-product/:id', component: ProductFormComponent }
    ]
  },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
