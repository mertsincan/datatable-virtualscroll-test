export class CarService {
  cars = [];
  brands = ["Vapid", "Carson", "Kitano", "Dabver", "Ibex", "Morello", "Akira", "Titan", "Dover", "Norma"];
  colors = ["Black", "White", "Red", "Blue", "Silver", "Green", "Yellow"];

  constructor() {
    window.cars = this.cars = Array.from({ length: 10000 }).map((m, i) => this.generateCar(i));
  }

  generateCar(id) {
    return {
      id: id.toString(),
      vin: this.generateVin(),
      brand: this.generateBrand(),
      color: this.generateColor(),
      year: this.generateYear()
    };
  }

  generateVin() {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  generateBrand() {
    return this.brands[Math.floor(Math.random() * Math.floor(10))];
  }

  generateColor() {
    return this.colors[Math.floor(Math.random() * Math.floor(7))];
  }

  generateYear() {
    return 2000 + Math.floor(Math.random() * Math.floor(19));
  }

  get({ filter, first, last }) {
    let value = [];
    let count = 0;
    let v = { value, count };

    if (filter.length) {
      value = this.cars.filter((f) => f.id.indexOf(filter) > -1);
      v = { value: value.slice(first, last), count: value.length };
    } else {
      value = this.cars.slice(first, last);
      v = { value, count: this.cars.length };
    }

    console.log(`carService.get({'${filter}', ${first}, ${last}}): `, v);
    return v;
  }
}
