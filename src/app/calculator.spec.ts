import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  it('#multiply should return 9', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta = calculator.multiply(3, 3);
    //Assert
    expect(rta).toEqual(9);
  });
  it('#multiply should return 4', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta = calculator.multiply(1, 4);
    //Assert
    expect(rta).toEqual(4);
  });
  it('#divide should return 2', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta1 = calculator.divide(4, 2);
    const rta2 = calculator.divide(6, 3);
    //Assert
    expect(rta1).toEqual(2);
    expect(rta2).toEqual(2);
  });
});
