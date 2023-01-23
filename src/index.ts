import './index.scss';
import CarItem from './components/car-item';
import CarEditor from './components/car-editor';
import Winners from './pages/winners/winners';
import Garage from './pages/garage/garage';

customElements.define('car-item', CarItem);
customElements.define('car-editor', CarEditor);
customElements.define('winners-page', Winners);
customElements.define('garage-page', Garage);

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
