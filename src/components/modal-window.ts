const template = document.createElement('template');
template.innerHTML = `
<style>
.modal {
  display: none; 
  position: fixed; 
  z-index: 1; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}
.show{
  display: flex;
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
</style>
<div id="modal" class="modal">
<div class="modal-content">
  <span class="close">&times;</span>
  <slot></slot>
</div>
</div>
`;

class ModalWindow extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(template.content.cloneNode(true));
    const closeButton = this.shadowRoot!.querySelector('.close');
    closeButton?.addEventListener('click', () => this.hide());
  }

  show() {
    const modal = this.shadowRoot!.getElementById('modal');
    modal?.classList.add('show');
  }

  hide() {
    const modal = this.shadowRoot!.getElementById('modal');
    modal?.classList.remove('show');
  }
}

export default ModalWindow;
