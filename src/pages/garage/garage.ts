class Garage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static generateCarName() {
    const manufacturers = [
      'Ford',
      'Chevrolet',
      'Toyota',
      'Honda',
      'Nissan',
      'Hyundai',
      'Kia',
      'Mazda',
      'BMW',
      'Mercedes',
    ];
    const models = [
      'Mustang',
      'Camaro',
      'Corolla',
      'Civic',
      'Altima',
      'Elantra',
      'Soul',
      '3',
      '5',
      'C-Class',
    ];
    const manufacturer =
      manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    return `${manufacturer} ${model}`;
  }

  connectedCallback() {
    this.render();

    const totalCars = this.shadowRoot!.getElementById('total-cars');
    this.addEventListener(
      'deleteCar',
      (event) => {
        const match = totalCars!.innerText.match(/\d+/);
        const number = parseInt(match![0], 10);
        totalCars!.innerHTML = `Total Cars: ${number - 1}`;
      },
      true,
    );
    const updateCarForm = this.shadowRoot!.getElementById(
      'update-car-form',
    ) as HTMLFormElement;
    const updateNameInput = this.shadowRoot!.getElementById(
      'update-name-input',
    ) as HTMLInputElement;
    const updateColorInput = this.shadowRoot!.getElementById(
      'update-color-input',
    ) as HTMLInputElement;
    const updateCarId = this.shadowRoot!.getElementById(
      'update-car-id',
    ) as HTMLInputElement;
    this.addEventListener('selectCar', (e) => {
      updateNameInput.value = (e as CustomEvent).detail.name;
      updateCarId!.innerText = (e as CustomEvent).detail.id;
      updateColorInput.value = (e as CustomEvent).detail.color;
    });

    interface Car {
      name: string;
      color: string;
      id: number;
    }
    const serverUrl = 'http://127.0.0.1:3000';
    const carList = this.shadowRoot!.getElementById('car-list');

    async function getCars(
      page?: number,
      limit?: number,
    ): Promise<{ data: Car[]; totalCount: number }> {
      let url = `${serverUrl}/garage`;
      if (page && limit) {
        url += `?_page=${page}&_limit=${limit}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      const totalCount = response.headers.get('X-Total-Count');
      return { data, totalCount: totalCount ? parseInt(totalCount) : 0 };
    }

    function renderCarsList() {
      getCars().then((response) => {
        let counter = 0;
        carList!.innerHTML = '';
        response.data.map((car) => {
          const carItem = document.createElement('car-item');
          carItem.setAttribute('id', car.id.toString());
          carItem.setAttribute('color', car.color);
          carItem.setAttribute('name', car.name);
          carList!.appendChild(carItem);
          counter += 1;
        });
        totalCars!.innerHTML = `Total Cars: ${counter}`;
      });
    }

    // handle car creation with custom data
    const createCarForm = this.shadowRoot!.getElementById(
      'create-car-form',
    ) as HTMLFormElement;
    const nameInput = this.shadowRoot!.getElementById(
      'name-input',
    ) as HTMLInputElement;
    const colorInput = this.shadowRoot!.getElementById(
      'color-input',
    ) as HTMLInputElement;

    createCarForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const car = { name: nameInput.value, color: colorInput.value };
      fetch(`${serverUrl}/garage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      }).then((response) => {
        if (response.ok) {
          console.log('Car created successfully');
          renderCarsList();
        } else {
          console.log('Error creating the car');
        }
      });
    });

    // handle car update

    updateCarForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const car = {
        name: updateNameInput.value,
        color: updateColorInput.value,
      };
      fetch(`${serverUrl}/garage/${updateCarId?.innerHTML}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      }).then((response) => {
        if (response.ok) {
          console.log('Car updated successfully');
          renderCarsList();
        } else {
          console.log('Error updating the car');
        }
      });
    });

    // handle 100 car generation
    const generateBtn = this.shadowRoot?.getElementById('generate-btn');
    generateBtn?.addEventListener('click', () => {
      for (let i = 0; i < 100; i += 1) {
        const car = { name: Garage.generateCarName(), color: 'red' };
        fetch(`${serverUrl}/garage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(car),
        }).then((response) => {
          if (response.ok) {
            console.log('Car created successfully');
            renderCarsList();
          } else {
            console.log('Error creating the car');
          }
        });
      }
    });

    // load cars list on first render
    renderCarsList();
  }

  render() {
    this.shadowRoot!.innerHTML = `
    <style>
    .create-car-container,
    .update-car-container {
      margin: 20px;
      display: flex;
      gap: 10px;
    }
    
    .car-name-input {
      border: 4px solid blue;
      border-radius: 10px;
    }
    
    .update-car-id {
      border: 4px solid blue;
      border-radius: 10px;
      text-align: center;
      padding: 5px;
    }
    
    .pagination-controls {
      display: flex;
      gap: 20px;
    }
    </style>
    <div class="garage-page">
      <div id="content">
        <div class="car-creation-container">
          <form id="create-car-form" class="create-car-container">
            <input
              placeholder="New Car Name"
              class="car-name-input"
              type="text"
              id="name-input"
            />
            <input type="color" id="color-input" value="#e66465" />
            <button type="submit">CREATE</button>
          </form>
          <form id="update-car-form" class="update-car-container">
            <label class="update-car-id" id="update-car-id">0</label>
            <input
              placeholder="Existing Car Name"
              class="car-name-input"
              type="text"
              id="update-name-input"
            />
            <input type="color" id="update-color-input" value="#e66465" />
            <button type="submit">UPDATE</button>
          </form>        </div>
        </div>
        <button id='race-btn'>RACE</button><button id='reset-all-btn'>RESET</button><button id='generate-btn'>GENERATE CARS</button>
        <h2 class="page-name">Garage <span id="total-cars">Total Cars: </span></h2>
        <h3 class="page-number">Page Number:</h3>
        <ul id="car-list"></ul>
        <div class="pagination-controls">
          <button>Prev Page</button> <button>Next Page</button>
        </div>
      </div>
    </div>
        `;
  }
}
export default Garage;
