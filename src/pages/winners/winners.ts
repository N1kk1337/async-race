class Winners extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    const currentPage = 1;
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

    async function getWinners(
      page: number = 1,
      limit?: number,
    ): Promise<{ data: Winner[] }> {
      let url = `${serverUrl}/winners`;

      url += `?_page=${page}&_limit=10`;

      const response = await fetch(url);
      const data = await response.json();
      return { data };
    }
    const renderWinners = () => {
      getWinners(currentPage).then((response) => {
        let counter = 1;
        response.data.map((winner) => {
          getCar(winner.id).then((detailsResponse) => {
            const table = this.shadowRoot!.getElementById(
              'table-body',
            ) as HTMLTableElement;

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
            time.innerHTML = winner.time.toString();
          });
        });
      });
    };
    renderWinners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
        table{
          margin: 20px;
          padding: 10px;
          border: 4px solid blue;
        }
        td {
          padding: 0px 4px;
        }
        tr {
          background-color: #eee;
        }
        </style>
        <h2>Page 1</h2>
        <h2>Total Cars: </h2>
        <table id="winners-table">
  <thead id='table-header'>
    <tr>
      <th>№</th>
      <th>Image</th>
      <th>Name</th>
      <th onclick="sortTable(0)">Wins</th>
      <th onclick="sortTable(1)">Best time</th>
    </tr>
  </thead>
  <tbody id='table-body'></tbody>
</table>
      `;
  }
}
export default Winners;
