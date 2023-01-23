import './index.scss';
import CarItem from './components/car-item';
import Winners from './pages/winners/winners';
import Garage from './pages/garage/garage';
import CarControlButton from './components/car-control-btn';

customElements.define('car-item', CarItem);
customElements.define('winners-page', Winners);
customElements.define('garage-page', Garage);
customElements.define('car-control-btn', CarControlButton);

const body = document.getElementById('body');
body!.innerHTML = `
    <header class="header">
      <ul class="nav">
        <li><a id="garage-nav-btn" href="#garage">Garage</a></li>
        <li><a id="winners-nav-btn" href="#winners">Winners</a></li>
      </ul>
    </header>
    <main id="root"></main>
`;
const root = document.getElementById('root');
root!.innerHTML = '<garage-page></garage-page>';

const garageNavButton = document.getElementById('garage-nav-btn');
const winnersNavButton = document.getElementById('winners-nav-btn');

garageNavButton?.addEventListener('click', () => {
  root!.innerHTML = '<garage-page></garage-page>';
});

winnersNavButton?.addEventListener('click', () => {
  root!.innerHTML = '<winners-page></winners-page>';
});
