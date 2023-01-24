import * as CarControls from './carControls';

class CarControlButton extends HTMLElement {
  status: string | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['status'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'id') {
      this.id = newValue;
    } else if (name === 'status') {
      this.status = newValue;
    } else if (name === 'purpose') {
      this.purpose = newValue;
    }
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
      button {
          border: 2px solid blue;
      }
      </style>
      <button id='engine-control-btn'>${
        this.purpose === 'start' ? 'Start Engine' : 'Reset'
      } 
      </button>
      `;
    // const engineControlBtn =
    //   this.shadowRoot!.getElementById('engine-control-btn');
    // engineControlBtn!.addEventListener('click', async () => {
    //   if (this.purpose === 'stop') {
    //     CarControls.stopCar(Number(this.id));
    //   } else {
    //     CarControls.startCar(Number(this.id));
    //   }
    // });
  }

  get id(): string {
    return this.getAttribute('id')!;
  }

  set id(value: string) {
    this.setAttribute('id', value.toString());
  }

  get purpose(): string {
    return this.getAttribute('purpose')!;
  }

  set purpose(value: string) {
    this.setAttribute('purpose', value.toString());
  }
}

export default CarControlButton;
