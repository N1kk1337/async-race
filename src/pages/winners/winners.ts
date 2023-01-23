class Winners extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
          /* CSS styles for Page 1 */
        </style>
        <h1>Page 1</h1>
        <p>This is the content of Page 1</p>
      `;
  }
}
export default Winners;
