import * as CarControls from './carControls';

class CarItem extends HTMLElement {
  name: string | undefined;

  color: string | undefined;

  velocity: string | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

    const car = this.shadowRoot?.querySelector('.car-img') as HTMLElement;
    this.addEventListener(
      'resetCar',
      (event) => {
        car.classList.remove('animation-start');
        car.classList.remove('animation-stop');
      },
      true,
    );
    this.addEventListener(
      'stopCar',
      (event) => {
        car.classList.remove('animation-start');
        car.classList.add('animation-stop');
      },
      true,
    );
    this.addEventListener(
      'startCar',
      (event) => {
        console.log(event);
        car.style.animationDuration = `${
          300 / (event as CustomEvent).detail.velocity
        }s`;
        car.classList.remove('animation-stop');
        car.classList.add('animation-start');
      },
      true,
    );

    const selectBtn = this.shadowRoot!.getElementById('select-btn');
    selectBtn!.addEventListener('click', async () => {
      this.dispatchEvent(
        new CustomEvent('selectCar', {
          bubbles: true,
          composed: true,
          detail: { id: this.id, color: this.color, name: this.name },
        }),
      );
    });
    const deleteBtn = this.shadowRoot!.getElementById('delete-btn');
    deleteBtn!.addEventListener('click', async () => {
      this.dispatchEvent(
        new CustomEvent('deleteCar', {
          bubbles: true,
          composed: true,
        }),
      );

      await fetch(`http://127.0.0.1:3000/garage/${this.id}`, {
        method: 'DELETE',
      });

      this.remove();
    });
  }

  static get observedAttributes() {
    return ['name', 'color'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'name') {
      this.name = newValue;
    } else if (name === 'id') {
      this.id = newValue;
    } else if (name === 'color') {
      this.color = newValue;
    }

    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
    <style>
    button {
      color: white;
      text-decoration: none;
      background-color: blue;
      font-size: 20px;
      padding: 4px;
      border: 4px solid blue;
      border-radius: 10px;
    }
    .car {
        display: flex;
        flex-direction: column;
        border: 2px solid blue;
        padding: 4px 4px;
        margin: 8px 8px;
    }
    .car-img {
      transform: scaleX(-1);
      position: absolute;
      height: 100%;
      left: 0;
      bottom: 0;


    }
    .car-container {
      position: relative;
      width: 100%;
      height: 100px;
      overflow: hidden;
  }
    
    @keyframes moveCar {
      from {
          left: 0;
      }
      to {
          left: calc(100% - 120px);
      }
    }

    .animation-start {
      animation: moveCar linear;
      animation-fill-mode: forwards;    
    }
    .animation-stop{
      animation-play-state: paused;
    }

    button {
        border: 2px solid blue;
    }
    </style>
    <div class="car">
        <div><button id='select-btn'>Select</button><button id='delete-btn'>Remove</button></div>
                    <p>${this.name}</p> 
                    <div class="car-container">
                      <svg class='car-img animation-stopped'  viewBox="0 0 512 512" id="svg2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg">
                      <defs id="defs4"/>
                      
                      <g id="layer1" transform="translate(0,-540.36218)">
                      
                      <path d="M 288.25 152.25 C 287.41764 153.46294 286.51133 153.96924 285.4375 154.34375 C 281.94622 155.56138 278.74392 156.12226 274.65625 156.625 C 268.4092 157.39334 261.68157 158.66219 255.53125 160 C 247.66384 161.7113 239.94343 164.02705 232.28125 166.5 C 225.34005 168.74024 218.48397 171.26028 211.75 174.0625 C 205.34403 176.72824 199.05708 179.72468 192.875 182.875 C 187.60909 185.55844 182.44732 188.43522 177.375 191.46875 C 172.16943 194.58199 167.05572 197.86896 162.0625 201.3125 C 156.3457 205.25506 150.81938 209.42544 145.3125 213.65625 C 142.11994 216.10903 138.89917 218.56111 135.875 221.21875 C 133.83378 223.01257 134.03041 223.29793 131.375 225.09375 C 129.33983 226.47011 126.85443 226.27375 124.5625 225.1875 C 122.27059 224.10124 118.46875 221.84375 118.46875 221.84375 C 118.46875 221.84375 123.03292 218.43218 126.625 215.9375 C 126.5593 215.948 126.46724 215.9916 126.40625 216 C 124.12349 216.31491 121.18561 215.46359 118.90625 215.125 C 117.52245 214.91944 116.0843 214.8596 114.6875 214.9375 C 111.64863 215.10696 108.67292 215.81402 105.6875 216.40625 C 90.977176 219.32442 76.274686 222.46597 61.875 226.65625 C 51.501133 229.67502 41.233157 233.13784 31.28125 237.34375 C 27.971724 238.74244 24.61727 240.1524 21.65625 242.1875 C 18.925869 244.06408 16.374746 246.282 14.3125 248.875 C 12.365333 251.32331 11.02103 254.23278 9.6875 257.0625 C 8.443078 259.70314 7.1394939 262.35717 6.5625 265.21875 C 5.6645172 269.67228 6.0975788 274.30069 6.125 278.84375 C 6.154543 283.73846 6.3010162 288.66007 6.78125 293.53125 C 7.2737034 298.52638 8.0001281 302.86042 8.21875 307.875 C 8.264498 308.92425 8.2464822 310.63735 7.8125 311.59375 C 7.4858968 312.3135 7.4165433 312.46226 7.1875 313.21875 C 6.9810432 313.90063 7.313646 314.65742 7.59375 315.3125 C 8.2642908 316.8807 9.325253 318.294 10.53125 319.5 C 11.134248 320.103 12.005577 320.38263 12.625 320.96875 C 13.52849 321.82365 14.052754 323.03196 14.9375 323.90625 C 16.815974 325.76252 18.875106 327.50147 21.21875 328.71875 C 24.532585 330.43993 28.263498 331.27257 31.90625 332.09375 C 35.828951 332.97803 39.867446 333.41976 43.875 333.75 C 46.660891 333.97956 49.0265 334.27922 52.25 333.96875 C 54.555451 333.92545 54.189285 333.94575 56.28125 333.90625 C 54.572763 329.00973 53.625 323.72912 53.625 318.25 C 53.625 292.04346 74.887215 270.8125 101.09375 270.8125 C 127.30028 270.8125 148.53125 292.04346 148.53125 318.25 C 148.53125 323.07682 147.8084 327.73657 146.46875 332.125 C 147.96753 332.0995 147.67813 332.12105 149.28125 332.09375 C 253.41238 330.82574 307.17784 329.08064 386.125 327.90625 C 387.51238 327.88565 388.85071 327.8406 390.21875 327.8125 C 389.40803 324.33672 388.96875 320.7227 388.96875 317 C 388.96875 290.79347 410.19972 269.5625 436.40625 269.5625 C 462.61279 269.5625 483.875 290.79347 483.875 317 C 483.875 318.63791 483.78698 320.24858 483.625 321.84375 C 485.05505 321.59818 486.43378 321.15899 487.75 320.5625 C 490.50315 319.31482 492.97494 317.44759 495.3125 315.53125 C 497.83388 313.46421 500.11625 311.11688 502.21875 308.625 C 503.54375 307.05461 505.23776 305.57525 505.78125 303.59375 C 506.46722 301.09276 505.29056 301.66275 505.15625 295.8125 C 504.94454 286.59083 505.165 277.35853 504.53125 268.15625 C 504.27986 264.508 504.20763 260.35412 503.28125 257.25 C 502.95603 256.16024 501.91379 255.09388 501.1875 254.21875 C 500.51826 253.41236 499.20387 253.26087 499.09375 252.21875 C 498.67497 248.25581 498.63041 244.11529 498.4375 240.0625 C 498.31302 237.44747 498.46259 234.82442 498.25 232.21875 C 498.2242 232.39392 498.17819 232.57856 498.125 232.75 C 497.85988 233.60448 496.88713 234.05294 496.46875 234.84375 C 496.02439 235.68366 495.78399 236.62567 495.625 237.5625 C 495.31502 239.38903 495.32395 241.27419 495.40625 243.125 C 495.49225 245.05978 496.00615 246.94414 496.15625 248.875 C 496.25105 250.0944 496.74746 251.44516 496.25 252.5625 C 495.87707 253.40012 495.00381 253.99398 494.15625 254.34375 C 492.50443 255.02541 490.58556 254.97231 488.8125 254.75 C 486.98211 254.52049 485.14515 253.91651 483.5625 252.96875 C 480.44567 251.10225 478.14769 248.11502 475.59375 245.53125 C 471.40475 241.29333 467.15911 237.06353 463.5625 232.3125 C 462.64398 231.09916 461.41613 229.93694 461.15625 228.4375 C 460.93043 227.13462 461.20381 225.64103 461.96875 224.5625 C 463.43831 222.49064 466.17801 221.69135 468.46875 220.59375 C 471.17896 219.29514 474.03602 218.1875 476.96875 217.53125 C 479.09207 217.05612 481.29297 216.92075 483.46875 216.90625 C 485.57181 216.89225 487.72733 216.86144 489.75 217.4375 C 491.59802 217.96382 493.51409 218.70598 494.875 220.0625 C 495.05579 220.24271 495.22713 220.44963 495.375 220.65625 C 494.03121 217.46399 492.01704 214.65289 490.03125 211.8125 C 489.6468 211.6716 485.27229 210.04875 482.84375 209.46875 C 481.08982 209.04987 477.8125 209.0625 477.8125 209.0625 C 477.8125 209.0625 473.57257 202.91683 471.21875 200.03125 C 468.35819 196.52445 465.33525 193.158 462.09375 190 C 458.5631 186.56029 454.81949 183.29976 450.875 180.34375 C 446.97514 177.42117 438.625 172.375 438.625 172.375 L 445.5 168.96875 C 444.47729 167.83752 445.884 164.90507 444.8125 163.59375 C 443.99981 162.59917 442.64014 162.59899 440.9375 162.5625 C 436.32717 162.4637 432.00735 162.21415 427.40625 161.90625 C 421.50963 161.51165 415.67164 160.58469 409.8125 159.8125 C 404.00393 159.04698 398.23009 157.9203 392.40625 157.28125 C 380.35845 155.95923 368.2624 155.14436 356.15625 154.5625 C 342.89493 153.92511 329.58249 154.13874 316.3125 153.71875 C 311.35039 153.5617 306.3953 153.3534 301.4375 153.09375 C 297.03367 152.86312 292.65743 152.14504 288.25 152.25 z M 322.8125 164.09375 C 322.8125 164.09375 332.52344 164.10791 337.375 164.3125 C 344.37203 164.60751 351.36801 165.16118 358.34375 165.78125 C 365.4828 166.41584 372.62293 167.08479 379.71875 168.09375 C 384.88135 168.82783 390.25475 169.74343 395.125 170.8125 C 396.29203 171.06868 397.92407 171.80602 397.96875 173 C 398.24389 180.34602 398.28879 187.33835 398.375 194.5 C 398.4671 202.14936 398.46875 217.4375 398.46875 217.4375 C 398.46875 217.4375 372.55176 217.64439 359.59375 217.875 C 345.51454 218.12557 317.375 218.90625 317.375 218.90625 L 322.8125 164.09375 z M 299.96875 164.21875 C 299.96875 164.21875 296.63483 182.71452 294.53125 191.875 C 292.31644 201.51993 286.96875 220.59375 286.96875 220.59375 C 286.96875 220.59375 271.4625 221.25699 263.71875 221.84375 C 249.37027 222.93096 235.04751 224.40582 220.75 226.03125 C 215.36021 226.644 205.4375 227.40625 205.4375 227.40625 C 205.4375 227.40625 205.48766 223.47398 204.9375 221.625 C 204.38482 219.76785 202.21875 216.5 202.21875 216.5 L 210.46875 183.28125 C 210.46875 183.28125 219.75218 179.24601 224.53125 177.625 C 231.947 175.10966 239.53768 173.15417 247.15625 171.34375 C 254.84755 169.51606 262.61938 167.89068 270.4375 166.71875 C 276.54911 165.80263 282.7145 165.33288 288.875 164.84375 C 292.57195 164.55022 299.96875 164.21875 299.96875 164.21875 z M 410.53125 174.78125 C 410.53125 174.78125 417.32302 176.42632 420.59375 177.625 C 425.17286 179.30319 429.69754 181.2235 433.90625 183.6875 C 439.16992 186.76913 444.10215 190.47791 448.6875 194.5 C 451.80791 197.2371 455.07962 199.98127 457.28125 203.5 C 459.22864 206.61238 458.23182 206.47164 455.375 207.8125 C 449.42874 210.60342 442.80676 211.67952 436.40625 213.15625 C 430.28411 214.56876 417.875 216.5 417.875 216.5 L 410.53125 174.78125 z M 205.65625 185.375 C 203.43503 194.46053 200.2407 204.26301 198 213.34375 C 198 213.34375 194.54447 212.54843 192.875 212.71875 C 191.44221 212.86492 188.81688 213.72265 186.90625 214.71875 C 185.23911 215.5879 183.23439 216.86953 181.78125 218.0625 C 180.21536 219.34803 178.41869 221.64181 177.6875 223.53125 C 176.62584 226.27465 177.6875 231.46875 177.6875 231.46875 C 177.6875 231.46875 173.53793 231.84488 170.875 232.125 C 168.22661 232.40359 162.90625 232.75 162.90625 232.75 C 162.90625 232.75 165.48985 222.01066 167.3125 216.8125 C 168.54483 213.29794 171.71875 206.53125 171.71875 206.53125 C 171.71875 206.53125 175.6123 202.73679 177.78125 201.09375 C 181.93695 197.94567 186.46192 195.28509 191 192.71875 C 195.75923 190.02735 205.65625 185.375 205.65625 185.375 z M 70.28125 235.4375 C 71.022921 235.4185 71.742778 235.50303 72.375 235.875 C 72.994917 236.23976 73.463324 237.06425 73.40625 237.78125 C 73.30755 239.02118 71.96825 239.83421 71.09375 240.71875 C 68.194197 243.6516 64.697956 245.90335 61.46875 248.46875 C 56.949383 252.05908 52.621573 255.91779 47.84375 259.15625 C 45.770754 260.56135 43.674886 261.99115 41.34375 262.90625 C 39.277053 263.71755 37.040721 264.05444 34.84375 264.375 C 30.755745 264.97148 26.630908 265.27506 22.5 265.21875 C 21.026406 265.19865 19.33541 265.60634 18.09375 264.8125 C 17.276037 264.28972 17.242805 263.02977 16.625 262.28125 C 15.679543 261.13575 14.450472 260.21835 13.25 259.34375 C 12.591505 258.86402 11.296762 258.89625 11.15625 258.09375 C 10.736612 255.69706 14.111576 254.20736 15.78125 252.4375 C 17.342075 250.78303 18.692699 248.66832 20.8125 247.84375 C 21.789138 247.46386 22.91761 248.08451 23.9375 247.84375 C 26.522116 247.23361 28.619207 245.32185 31.0625 244.28125 C 34.132258 242.97385 37.331265 241.95116 40.5 240.90625 C 43.690195 239.85426 46.885764 238.73552 50.15625 237.96875 C 53.052374 237.28973 55.985735 236.86834 58.9375 236.5 C 61.441809 236.1875 63.978448 235.97988 66.5 235.875 C 67.721521 235.8242 69.045134 235.46927 70.28125 235.4375 z M 436.40625 275.5 C 413.48892 275.5 394.90625 294.08266 394.90625 317 C 394.90625 339.91734 413.48892 358.5 436.40625 358.5 C 459.32359 358.5 477.90625 339.91734 477.90625 317 C 477.90625 294.08266 459.32359 275.5 436.40625 275.5 z M 101.09375 276.75 C 78.176411 276.75 59.59375 295.33266 59.59375 318.25 C 59.59375 341.16733 78.176411 359.75 101.09375 359.75 C 124.01109 359.75 142.5625 341.16733 142.5625 318.25 C 142.5625 295.33266 124.01109 276.75 101.09375 276.75 z M 436.40625 286.8125 C 453.07431 286.8125 466.59375 300.33195 466.59375 317 C 466.59375 333.66805 453.07431 347.1875 436.40625 347.1875 C 419.7382 347.1875 406.25 333.66805 406.25 317 C 406.25 300.33195 419.7382 286.8125 436.40625 286.8125 z M 101.09375 288.0625 C 117.7618 288.0625 131.25 301.58194 131.25 318.25 C 131.25 334.91805 117.7618 348.4375 101.09375 348.4375 C 84.425695 348.4375 70.90625 334.91805 70.90625 318.25 C 70.90625 301.58194 84.425695 288.0625 101.09375 288.0625 z " id="path3796" style="fill:${this.color};fill-opacity:1;stroke:none" transform="translate(0,540.36218)"/>
                      
                      </g>
                      
                      </svg>
                    </div>
                    
                  </object>
                    <div>
                    <button id='engine-start-btn'>Start Engine
                    </button>
                    <button id='engine-reset-btn'>Reset
                    </button>                   
                    </div>
    </div>
    `;
    const engineStartBtn = this.shadowRoot!.getElementById('engine-start-btn');
    const engineResetBtn = this.shadowRoot!.getElementById('engine-reset-btn');
    engineStartBtn?.addEventListener('click', () => {
      CarControls.startCar(this, Number(this.id));
    });
    engineResetBtn?.addEventListener('click', () => {
      CarControls.resetCar(this, Number(this.id));
    });
  }

  get id(): string {
    return this.getAttribute('id')!;
  }

  set id(value: string) {
    this.setAttribute('id', value);
  }
}

export default CarItem;
