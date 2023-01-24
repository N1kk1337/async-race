class ModalWindow extends HTMLElement {
  modalContainer: HTMLDivElement;

  modalOverlay: HTMLDivElement;

  modalContent: HTMLDivElement;

  closeButton: HTMLButtonElement;

  constructor() {
    super();

    // Create the modal container
    this.modalContainer = document.createElement('div');
    this.modalContainer.classList.add('modal-container');

    // Create the modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.classList.add('modal-overlay');

    // Create the modal content container
    this.modalContent = document.createElement('div');
    this.modalContent.classList.add('modal-content');

    // Create the close button
    this.closeButton = document.createElement('button');
    this.closeButton.classList.add('modal-close');
    this.closeButton.innerHTML = 'x';

    // Append the close button to the modal content container
    this.modalContent.appendChild(this.closeButton);

    // Append the modal content container to the modal container
    this.modalContainer.appendChild(this.modalContent);

    // Append the modal container and overlay to the shadow root
    this.attachShadow({ mode: 'open' }).appendChild(this.modalContainer);
    this.attachShadow({ mode: 'open' }).appendChild(this.modalOverlay);

    // Add event listener for the close button
    this.closeButton.addEventListener('click', () => {
      this.hide();
    });
  }

  connectedCallback() {
    // Add the modal content
    this.modalContent.innerHTML = this.innerHTML;
  }

  show() {
    this.modalContainer.classList.add('active');
    this.modalOverlay.classList.add('active');
  }

  hide() {
    this.modalContainer.classList.remove('active');
    this.modalOverlay.classList.remove('active');
  }
}

export default ModalWindow;
