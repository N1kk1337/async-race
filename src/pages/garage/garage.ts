import * as CarControls from '../../components/carControls';

class Garage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    interface Car {
      name: string;
      color: string;
      id: number;
    }
    const serverUrl = 'http://127.0.0.1:3000';
    const carList = this.shadowRoot!.getElementById('car-list');

    const totalCars = this.shadowRoot!.getElementById('total-cars');
    let totalCarsNumber = 0;
    async function getCars(
      page: number = 1,
      limit?: number,
    ): Promise<{ data: Car[]; totalCarsNumber: number }> {
      let url = `${serverUrl}/garage`;

      url += `?_page=${page}&_limit=7`;

      const response = await fetch(url);
      const data = await response.json();
      totalCarsNumber = Number(response.headers.get('X-Total-Count'));
      totalCars!.innerHTML = `Total Cars: ${totalCarsNumber}`;

      return { data, totalCarsNumber };
    }
    function renderCarsList(page = 1) {
      getCars(page).then((response) => {
        carList!.innerHTML = '';
        response.data.map((car) => {
          const carItem = document.createElement('car-item');
          carItem.setAttribute('data-id', car.id.toString());
          carItem.setAttribute('id', car.id.toString());
          carItem.setAttribute('color', car.color);
          carItem.setAttribute('name', car.name);
          carList!.appendChild(carItem);
        });
      });
    }

    let currentPage = 1;

    this.addEventListener(
      'deleteCar',
      (event) => {
        renderCarsList(currentPage);
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
        const car = CarControls.generateRndCar();
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

    // handle group race
    let raceIsOn = false;
    let startTime: number;

    const raceBtn = this.shadowRoot!.getElementById('race-btn');
    raceBtn?.addEventListener('click', () => {
      raceIsOn = true;
      startTime = new Date().getTime();

      this.shadowRoot!.querySelectorAll('car-item').forEach((e) => {
        CarControls.startCar(e, Number(e.id));
      });
    });

    // function getStartTime() {
    //     startTime = new Date().getTime()
    // }

    // function getEndTime() {
    //     endTime = new Date().getTime()
    // }

    this.addEventListener(
      'carFinished',
      (event) => {
        if (raceIsOn) {
          CarControls.handleWin(
            (event as CustomEvent).detail.id,
            new Date().getTime() - startTime,
          );

          raceIsOn = false;
        }
      },
      true,
    );

    // handle group reset
    const resetBtn = this.shadowRoot!.getElementById('reset-btn');
    resetBtn?.addEventListener('click', () => {
      this.shadowRoot!.querySelectorAll('car-item').forEach((e) => {
        CarControls.resetCar(e, Number(e.id));
      });
    });

    // pagination

    const prevBtn = this.shadowRoot!.getElementById('prev-btn');
    const nextBtn = this.shadowRoot!.getElementById('next-btn');
    const pageNumber = this.shadowRoot!.querySelector('.page-number');
    prevBtn!.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderCarsList(currentPage);
        pageNumber!.innerHTML = `Page Number: ${currentPage}`;
      }
    });
    nextBtn!.addEventListener('click', () => {
      if (currentPage < Math.ceil(totalCarsNumber / 7)) {
        currentPage += 1;
        renderCarsList(currentPage);
        pageNumber!.innerHTML = `Page Number: ${currentPage}`;
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

    ul{
        padding: 0;
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
        <button id='race-btn'>RACE</button><button id='reset-btn'>RESET</button><button id='generate-btn'>GENERATE CARS</button>
        <h2 class="page-name">Garage <span id="total-cars">Total Cars: </span></h2>
        <h3 class="page-number">Page Number: 1</h3>
        <ul id="car-list"></ul>
        <div class="pagination-controls">
          <button id='prev-btn'>Prev Page</button> <button id='next-btn'>Next Page</button>
        </div>
      </div>
    </div>
        `;
  }
}
export default Garage;
