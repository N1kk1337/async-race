class CarEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['id', 'name', 'color'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'name') {
      this.name = newValue;
    } else if (name === 'id') {
      this.id = newValue;
    } else if (name === 'color') {
      this.color = newValue;
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
          .car-editor {
            display: flex;
            flex-direction: column;
          }
          .car-editor input {
            margin: 8px 0;
            padding: 8px;
            font-size: 16px;
          }
          .car-editor button {
            margin: 8px 0;
            padding: 8px;
            font-size: 16px;
          }
        </style>
        <div class="car-editor">
          <label>
            Name:
            <input type="text" id="name" value="${this.name || ''}">
          </label>
          <label>
            Color:
            <input type="color" id="color" value="${this.color || '#e66465'}">
            </label>
          <button id="save-btn">Save</button>
          <button id="cancel-btn">Cancel</button>
        </div>
      `;

    const saveBtn = this.shadowRoot!.getElementById('save-btn');
    saveBtn!.addEventListener('click', async () => {
      if (!this.id) {
        return;
      }
      const name = (this.shadowRoot!.getElementById('name') as HTMLInputElement)
        .value;
      const color = (
        this.shadowRoot!.getElementById('color') as HTMLInputElement
      ).value;
      await fetch(`/garage/${this.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      this.dispatchEvent(new Event('save'));
    });

    const cancelBtn = this.shadowRoot!.getElementById('cancel-btn');
    cancelBtn!.addEventListener('click', () => {
      this.dispatchEvent(new Event('cancel'));
    });
  }

  get id(): string {
    return this.getAttribute('id')!;
  }

  set id(value: string) {
    this.setAttribute('id', value);
  }

  get name(): string {
    return this.getAttribute('name')!;
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  get color(): string {
    return this.getAttribute('color')!;
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }
}

export default CarEditor;
