class Winners extends HTMLElement {
  constructor() {
    super();
    this._currentPage = 1;

    this.attachShadow({ mode: 'open' });
  }

  private _currentPage: number;

  public set currentPage(page: number) {
    this._currentPage = page;
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  connectedCallback() {
    this.render();

    const sortTable = (n: number) => {
      const table = this.shadowRoot!.getElementById(
        'winners-table',
      ) as HTMLTableElement;
      let rows;
      let switching;
      let i;
      let x;
      let y;
      let shouldSwitch;
      let dir;
      let switchcount = 0;
      switching = true;
      dir = 'asc';
      while (switching) {
        switching = false;
        rows = table!.rows;

        for (i = 1; i < rows.length - 1; i += 1) {
          shouldSwitch = false;

          x = rows[i].getElementsByTagName('TD')[n];
          y = rows[i + 1].getElementsByTagName('TD')[n];
          console.log(x.innerHTML);
          console.log(y.innerHTML);

          if (dir === 'asc') {
            if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
              // <-- Compare as numbers
              shouldSwitch = true;
              break;
            }
          } else if (dir === 'desc') {
            if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
              // <-- Compare as numbers
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          switchcount += 1;
        } else if (switchcount === 0 && dir === 'asc') {
          dir = 'desc';
          switching = true;
        }
      }
    };
    const winsHeader = this.shadowRoot?.getElementById('wins-header');
    const timeHeader = this.shadowRoot?.getElementById('time-header');
    winsHeader?.addEventListener('click', () => sortTable(3));
    timeHeader?.addEventListener('click', () => sortTable(4));

    const serverUrl = 'http://127.0.0.1:3000';

    interface Winner {
      id: number;
      wins: number;
      time: number;
    }
    const getCar = async (
      id: number,
    ): Promise<{
      name: string;
      color: string;
      id: string;
    }> => {
      const url = `${serverUrl}/garage/${id}`;

      const response = await fetch(url);
      const data = await response.json();

      return data;
    };
    const totalCars = this.shadowRoot!.getElementById('total-cars');
    let totalCarsNumber = 0;

    async function getWinners(
      page: number = 1,
      limit?: number,
    ): Promise<{ data: Winner[] }> {
      let url = `${serverUrl}/winners`;

      url += `?_page=${page}&_limit=10`;

      const response = await fetch(url);
      const data = await response.json();
      totalCarsNumber = Number(response.headers.get('X-Total-Count'));
      totalCars!.innerHTML = `Total Cars: ${totalCarsNumber}`;
      return { data };
    }
    const renderWinners = () => {
      getWinners(this.currentPage).then((response) => {
        const table = this.shadowRoot!.getElementById(
          'table-body',
        ) as HTMLTableElement;
        table.innerHTML = '';
        let counter = 1;
        response.data.map((winner) => {
          getCar(winner.id).then((detailsResponse) => {
            const row = table.insertRow();

            const number = row.insertCell(0);
            number.innerHTML = counter.toString();
            counter += 1;
            const color = row.insertCell(1);
            color.innerHTML = `<car-svg color='${detailsResponse.color}'></car-svg>`;
            const name = row.insertCell(2);
            name.innerHTML = detailsResponse.name;

            const wins = row.insertCell(3);
            wins.innerHTML = winner.wins.toString();
            const time = row.insertCell(4);
            time.innerHTML = `${(winner.time / 1000).toFixed(3)}s`;
          });
        });
      });
    };

    // pagination

    const prevBtn = this.shadowRoot!.getElementById('prev-btn');
    const nextBtn = this.shadowRoot!.getElementById('next-btn');
    const pageNumber = this.shadowRoot!.querySelector('.page-number');
    pageNumber!.innerHTML = `Page: ${this.currentPage}`;

    prevBtn!.addEventListener('click', () => {
      if (this.currentPage! > 1) {
        this.currentPage! -= 1;
        renderWinners();
        pageNumber!.innerHTML = `Page Number: ${this.currentPage}`;
        this.dispatchEvent(
          new CustomEvent('garageCurrentPage', {
            bubbles: true,
            composed: true,
            detail: { currentPage: this.currentPage },
          }),
        );
      }
    });
    nextBtn!.addEventListener('click', () => {
      if (this.currentPage! < Math.ceil(totalCarsNumber / 10)) {
        this.currentPage! += 1;
        renderWinners();
        pageNumber!.innerHTML = `Page Number: ${this.currentPage}`;
        this.dispatchEvent(
          new CustomEvent('garageCurrentPage', {
            bubbles: true,
            composed: true,
            detail: { currentPage: this.currentPage },
          }),
        );
      }
    });

    renderWinners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
        
        table{
          margin: 20px;
          padding: 10px;
          border: 4px solid orange;
        }
        td {
          padding: 0px 4px;
        }
        tr {
          background-color: #eee;
        }
        .pagination-controls {
          margin-top: 20px;
        display: flex;
        gap: 20px;
      }
      button{
        color: black;
        text-decoration: none;
        background-color: orange;
        font-size: 20px;
        padding: 4px;
        border: 4px solid orange;
        border-radius: 10px;
    }
    .clickable{
      cursor:pointer;
    }
        </style>
        <h2 class='page-number'>Page 1</h2>
        <h2 id='total-cars'>Total Cars: </h2>

        <table id="winners-table">
  <thead id='table-header'>
    <tr>
      <th>№</th>
      <th>Image</th>
      <th>Name</th>
      <th class='clickable' id='wins-header'>Wins</th>
      <th class='clickable' id='time-header'>Best time</th>
    </tr>
  </thead>
  <tbody id='table-body'></tbody>
</table>
<div class="pagination-controls">
          <button id='prev-btn'>Prev Page</button> <button id='next-btn'>Next Page</button>
        </div>
      `;
  }
}
export default Winners;
