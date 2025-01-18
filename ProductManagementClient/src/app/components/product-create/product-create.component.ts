import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../../services/product/product.service';
import e from 'express';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule,],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
  providers: [MessageService],
})
export class ProductCreateComponent {

  productForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product created successfully',
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
        this.loading = false; // Stop loading when the API call completes
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
