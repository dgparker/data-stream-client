import * as PIXI from 'pixi.js';
import * as io from 'socket.io-client';

const socket = io('http://localhost:3000');

let width = 1280;
let height = 720;
let radius = 1;
let size = { width: width, height: height };
let app = new PIXI.Application(size);
document.body.appendChild(app.view);

// socket.on(streamChoice, data => {
//   createBlip();
// });

function createBlip(data) {
  const blip = new PIXI.Graphics();
  const ticker = new PIXI.ticker.Ticker();
  const color = setColor(data);
  blip.beginFill(color);
  blip.drawCircle(0, 0, 1);
  blip.x = Math.floor(Math.random() * width);
  blip.y = Math.floor(Math.random() * height);

  app.stage.addChild(blip);

  let crayRadius = 1;
  ticker.stop();
  ticker.add(() => {
    if (crayRadius > 10) {
      app.stage.removeChild(blip);
      ticker.destroy();
    }
    crayRadius += 1;
    blip.drawCircle(0, 0, crayRadius);
  });
  ticker.start();
}

function attachCheckboxHandlers() {
  const el = document.getElementById('streamChoice');
  let streamChoice = '';
  el.addEventListener('click', () => {
    if (streamChoice !== el['value']) {
      socket.off(streamChoice);
      streamChoice = el['value'];
      socket.on(streamChoice, data => {
        createBlip(data.socket);
      });
    }
  });
}

function setColor(socket) {
  let color;
  let random;
  switch (socket) {
    case 'socket1':
      color = 0x00611c;
      break;
    case 'socket2':
      color = 0xff0000;
      break;
    case 'socket3':
      color = 0x00ffaa;
      break;
    case 'socket4':
      color = 0x0198e1;
      break;
    default:
      color = 0xffffff;
      break;
  }
  return color;
}

attachCheckboxHandlers();
