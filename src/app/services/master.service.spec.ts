import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let service: MasterService;
  let valueSrvSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        {
          provide: ValueService,
          useValue: spy,
        },
      ],
    });
    service = TestBed.inject(MasterService);
    valueSrvSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return call getValue', () => {
    valueSrvSpy.getValue.and.returnValue('fake value');

    expect(service.getValue()).toBe('fake value');
    expect(valueSrvSpy.getValue).toHaveBeenCalled();
    expect(valueSrvSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
