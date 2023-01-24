export async function handleWin(id: number, time: number) {
  const response = await fetch('http://127.0.0.1:3000/winners');
  const data = await response.json();
  if (!data.some((element: { id: number }) => element.id === id)) {
    fetch('http://127.0.0.1:3000/winners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        wins: 1,
        time,
      }),
    });
  } else {
    console.log(data.find((element: { id: number }) => element.id === id).wins);
    fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wins:
          data.find((element: { id: number }) => element.id === id).wins + 1,
        time,
      }),
    });
  }
}
export function animateCar(that: any, id: number, velocity: number) {
  const event = new CustomEvent('startCar', {
    bubbles: true,
    composed: true,
    detail: { id, velocity },
  });
  that.dispatchEvent(event);
}

export function resetCarAnimation(that: any, id: number) {
  that.dispatchEvent(
    new CustomEvent('resetCar', {
      bubbles: true,
      composed: true,
      detail: { id },
    }),
  );
}

export function stopCarAnimation(that: any, id: number) {
  that.dispatchEvent(
    new CustomEvent('stopCar', {
      bubbles: true,
      composed: true,
      detail: { id },
    }),
  );
}

export function resetCar(that: any, id: number) {
  fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
  resetCarAnimation(that, id);
}

export async function startCar(that: any, id: number) {
  console.log('starting');
  // start the engine
  const startResponse = await fetch(
    `http://127.0.0.1:3000/engine?id=${id}&status=started`,
    {
      method: 'PATCH',
    },
  );

  // put the pedal to the metal

  const startData = await startResponse.json();
  animateCar(that, id, startData.velocity);
  fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  }).then((response) => {
    if (response.status === 500) {
      // if engine dies
      stopCarAnimation(that, id);
    } else {
      that.dispatchEvent(
        new CustomEvent('carFinished', {
          bubbles: true,
          composed: true,
          detail: { id },
        }),
      );
    }
  });
}

export function generateRndCar() {
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
  const carName = `${manufacturer} ${model}`;

  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return { name: carName, color };
}
