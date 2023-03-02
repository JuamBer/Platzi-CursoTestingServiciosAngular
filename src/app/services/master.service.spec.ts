import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(() => {
    const serviceDep = new ValueService();
    service = new MasterService(serviceDep);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return myvalue', () => {
    expect(service.getValue()).toBe('my value');
  });

  it('should return othervalue', () => {
    const serviceDep = new FakeValueService();
    service = new MasterService(serviceDep as unknown as ValueService);
    expect(service.getValue()).toBe('fake value');
  });

  it('should return fake object', () => {
    const fake = { getValue: () => 'fake value' };
    service = new MasterService(fake as ValueService);
    expect(service.getValue()).toBe('fake value');
  });
});
