import { Injectable } from '@angular/core';
import { ValueService } from './value.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private valueSrv: ValueService) {}

  getValue() {
    return this.valueSrv.getValue();
  }
}
