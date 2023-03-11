import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import {
  generateManyProduct,
  generateOneProduct,
} from '../models/product.mock';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
import { ProductService } from './product.service';
import { TokenService } from './token.service';

fdescribe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('pruebas para getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProduct(10);
      spyOn(tokenService, 'getToken').and.returnValue('123');

      service.getAllSimple().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      req.flush(mockData);
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
    });

    it('should return a product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        { ...generateOneProduct(), price: 100 },
        { ...generateOneProduct(), price: 200 },
        { ...generateOneProduct(), price: 0 },
        { ...generateOneProduct(), price: -100 },
      ];
      service.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      req.flush(mockData);
    });

    it('should return a product list with limit 10 offset 3', (doneFn) => {
      const mockData: Product[] = generateManyProduct(20);
      const limit = 10;
      const offset = 3;

      service.getAll(limit, offset).subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      );
      const params = req.request.params;

      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      req.flush(mockData);
    });
  });

  describe('pruebas para create', () => {
    it('should return a new product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const dto: CreateProductDTO = {
        title: '',
        price: 100,
        images: [],
        description: '',
        categoryId: 1,
      };
      service.create({ ...dto }).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/products`
      );
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      };
      const productId = '1';
      // Act
      service.update(productId, { ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';
      // Act
      service.delete(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should getOne a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const productId = '1';
      // Act
      service.getOne(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });
  });

  describe('test for getOne ERR', () => {
    it('should 404', (doneFn) => {
      // Arrange
      const msg = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msg,
      };
      const productId = '1';
      // Act
      service.getOne(productId).subscribe({
        error: (err) => {
          expect(err).toEqual('El producto no existe');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msg, mockError);
    });
  });
});
