import './index.scss';
import CarItem from './components/car-item';
import Winners from './pages/winners/winners';
import Garage from './pages/garage/garage';
import CarControlButton from './components/car-control-btn';
import WinnerElement from './components/winner-item';
import CarSvg from './components/car-svg';
import ModalWindow from './components/modal-window';

customElements.define('car-item', CarItem);
customElements.define('car-svg', CarSvg);
customElements.define('winners-page', Winners);
customElements.define('garage-page', Garage);
customElements.define('car-control-btn', CarControlButton);
customElements.define('winner-item', WinnerElement);
customElements.define('modal-window', ModalWindow);

const body = document.getElementById('body');
body!.innerHTML = `
    <div class="wrapper">
      <header class="header">
        <ul class="nav">
          <li><a id="garage-nav-btn" href="#garage">Garage</a></li>
          <li><a id="winners-nav-btn" href="#winners">Winners</a></li>
        </ul>
      </header>
      <main id="root"></main>
    </div>
`;
const root = document.getElementById('root');
root!.innerHTML = '<garage-page></garage-page>';

const garageNavButton = document.getElementById('garage-nav-btn');
const winnersNavButton = document.getElementById('winners-nav-btn');
let garageCurrentPage = 1;
let winnersCurrentPage = 1;

document.addEventListener('garageCurrentPage', (e: Event) => {
  garageCurrentPage = (e as CustomEvent).detail.currentPage;
});
document.addEventListener('winnersCurrentPage', (e: Event) => {
  winnersCurrentPage = (e as CustomEvent).detail.currentPage;
});

garageNavButton?.addEventListener('click', () => {
  root!.innerHTML = '';
  const garagePage = document.createElement('garage-page') as Garage;
  garagePage.currentPage = garageCurrentPage;
  root!.appendChild(garagePage);
});

winnersNavButton?.addEventListener('click', () => {
  root!.innerHTML = '';
  const winnersPage = document.createElement('winners-page') as Garage;
  winnersPage.currentPage = winnersCurrentPage;
  root!.appendChild(winnersPage);
});
