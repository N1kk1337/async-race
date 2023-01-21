class CarItem extends HTMLElement {
  private name: string | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.name = newValue;
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
    <style>
    .car {
        display: flex;
        flex-direction: column;
        border: 2px solid blue;
        padding: 4px 4px;
        margin: 8px 8px;
    }
    button {
        border: 2px solid blue;
    }
    </style>
    <div class="car">
        <div><button>Select</button><button>Remove</button></div>
                    <p>${this.name}</p>
                    <div>
                        <button>Start Engine</button>
                        <button>Stop Engine</button>
                    </div>
    </div>
    `;
  }
}

export default CarItem;
