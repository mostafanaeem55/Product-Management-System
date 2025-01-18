import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule,],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
  providers: [MessageService],
})
export class ProductEditComponent {
  productForm: FormGroup;
  loading: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    }
  }

  loadProductDetails(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product details',
        });
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.productId) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully',
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        if (err.error && err.error.errors) {
          const validationErrors = Object.entries((err.error as any).errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');

          this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: validationErrors,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'An unknown error occurred.',
          });
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get price() {
    return this.productForm.get('price');
  }
}
