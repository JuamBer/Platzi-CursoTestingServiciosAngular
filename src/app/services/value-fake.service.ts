import { of } from 'rxjs';

export class FakeValueService {
  constructor() {}

  getValue() {
    return 'fake value';
  }

  setValue(value: string) {}

  getPromiseValue() {
    return Promise.resolve('fake value');
  }

  getObservableValue() {
    return of('fake value');
  }
}
