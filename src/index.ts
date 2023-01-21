import './index.scss';
import CarItem from './components/car-item';

customElements.define('car-item', CarItem);

// const carList = document.getElementsByClassName('car-list');

// for (const car of cars) {
//   const carItem = document.createElement('li');
//   carItem.innerHTML = `${car.year} ${car.make} ${car.model}`;
//   carList.appendChild(carItem);
// }
