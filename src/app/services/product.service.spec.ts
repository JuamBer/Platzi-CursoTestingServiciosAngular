import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
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
      const mockData: Product[] = [
        {
          id: '1',
          title: 'title',
          price: 100,
          description: 'description',
          category: {
            id: 1,
            name: 'name',
          },
          images: ['img1', 'img2'],
        },
      ];
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
});
