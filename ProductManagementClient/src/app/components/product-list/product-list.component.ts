import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup'; // <-- Add this line
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'; // <-- Add this line

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,
    CardModule,
    ToolbarModule ,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RouterModule,
     ConfirmDialogModule, ToastModule, FormsModule, InputGroupModule,
     InputGroupAddonModule ],
    providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  searchName: string = '';
  searchTerm: string = '';
  searchMinPrice: number | undefined;
  searchMaxPrice: number | undefined;

  constructor(private productService: ProductService,  private confirmationService: ConfirmationService,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
  
  onSearch(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService
      .getProducts(this.searchMinPrice, this.searchMaxPrice, this.searchName)
      .subscribe((data) => {
        this.products = data;
      });
  }

  confirmDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProduct(id); // Call deleteProduct if the user accepts
      },
      reject: () => {
        // Optional: Handle rejection (e.g., show a message)
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled',
        });
      },
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts(); // Refresh the list after deletion
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product deleted successfully',
      });
    });
  }

}
