import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7144/api/products';

  constructor(private http: HttpClient) {}

  getProducts(
    minPrice?: number,
    maxPrice?: number,
    name?: string
  ): Observable<Product[]> {
    let params = new HttpParams();

    if (minPrice !== undefined && minPrice !== null) {
      params = params.set('minPrice', minPrice?.toString());
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.set('maxPrice', maxPrice?.toString());
    }

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
