import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  generateManyProduct,
  generateOneProduct,
} from '../models/product.mock';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

fdescribe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('pruebas para getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProduct(10);
      service.getAllSimple().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      req.flush(mockData);
      httpController.verify;
    });
  });

  describe('pruebas para getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProduct(10);
      service.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(
          mockData.map((i) => ({ ...i, taxes: i.price * 0.19 }))
        );
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      req.flush(mockData);
      httpController.verify();
    });

    it('should return a product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        { ...generateOneProduct(), price: 100 },
        { ...generateOneProduct(), price: 200 },
      ];
      service.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      req.flush(mockData);
      httpController.verify();
    });
  });
});
