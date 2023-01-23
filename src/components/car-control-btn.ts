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

  stopCar() {
    this.dispatchEvent(
      new CustomEvent('stopCar', {
        bubbles: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }

  startCar(velocity: number) {
    this.dispatchEvent(
      new CustomEvent('startCar', {
        bubbles: true,
        composed: true,
        detail: { id: this.id, velocity },
      }),
    );
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
    const engineControlBtn =
      this.shadowRoot!.getElementById('engine-control-btn');
    engineControlBtn!.addEventListener('click', async () => {
      const newStatus = this.purpose === 'stop' ? 'stopped' : 'started';

      // start the engine
      const startResponse = await fetch(
        `http://127.0.0.1:3000/engine?id=${this.id}&status=${newStatus}`,
        {
          method: 'PATCH',
        },
      );

      // put the pedal to the metal
      if (this.purpose !== 'stop') {
        const startData = await startResponse.json();
        this.startCar(startData.velocity);
        fetch(`http://127.0.0.1:3000/engine?id=${this.id}&status=drive`, {
          method: 'PATCH',
        }).then((response) => {
          if (response.status === 500) {
            // if engine dies
            this.stopCar();
          } else {
            console.log('доехали');
            this.stopCar();
          }
        });
      } else {
        console.log('остановились');
      }

      // if (response.ok) {
      //   const data = await response.json();
      //   console.log(data);
      //   this.status = newStatus;
      //   this.render();
      // } else {
      //   console.error(response.statusText);
      // }
    });
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
