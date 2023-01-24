export function animateCar(that: any, id: number, velocity: number) {
  console.log('animating');
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
      console.log('доехали');
    }
  });
}
