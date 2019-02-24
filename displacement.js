"use strict";
let img;
let map;
const output = document.querySelector("#outputCanvas");
const ctxOutput = output.getContext("2d");
const cImage = document.querySelector("#imageCanvas");
const ctxImage = cImage.getContext("2d");
const cMap = document.querySelector("#mapCanvas");
const ctxMap = cMap.getContext("2d");
const cw = cImage.width;
const ch = cImage.height;
let imageData, mapData;
let outputData = ctxOutput.createImageData(cImage.width, cImage.height);
let maxMOVEMENT = 10;
let x, y;

document.addEventListener("DOMContentLoaded", init);

//define image location
function init() {
  img = new Image();
  map = new Image();
  img.src = "animal-cat-cute-color.png";
  map.src = "animal-cat-cute-map.png";
  //console.log(img, map);
  //load image events
  img.addEventListener("load", drawImages);
  map.addEventListener("load", drawImages);
}

function drawImages() {
  //draw map image
  ctxMap.drawImage(map, 0, 0);
  mapData = ctxMap.getImageData(0, 0, cw, ch);
  //console.log(mapData);

  //draw image
  ctxImage.drawImage(img, 0, 0);
  ctxOutput.drawImage(img, 0, 0);
  imageData = ctxImage.getImageData(0, 0, cw, ch);
  //console.log(imageData);

  //add mouse move event
  output.addEventListener("mousemove", mouseMoved);
}

function mouseMoved(event) {
  //console.log(event);
  // define x and y
  const x = event.offsetX;
  const y = event.offsetY;
  //console.log(x, y);

  // define mouse ratio
  let mouseXratio = (x / cw) * 2 - 1;
  let mouseYratio = (y / ch) * 2 - 1;
  //console.log(mouseXratio, mouseYratio);

  //call function copy pixels
  copyPixels(x, y, mouseXratio, mouseYratio);
  //put image data in output
  ctxOutput.putImageData(outputData, 0, 0);
}

function copyPixels(startX, startY, mouseXratio, mouseYratio) {
  //console.log(mouseXratio, mouseYratio);
  // make displacement
  let displacementX = maxMOVEMENT * mouseXratio;
  let displacementY = maxMOVEMENT * mouseYratio;

  //for loop that makes a 3d effect
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const pixelIndex = (x + y * cw) * 4;

      const greyvalue = mapData.data[pixelIndex] / 255;

      let offsetX = Math.round(x + displacementX * greyvalue);
      let offsetY = Math.round(y + displacementY * greyvalue);

      let originalPixelIndex = (offsetY * cw + offsetX) * 4;

      outputData.data[pixelIndex + 0] = imageData.data[originalPixelIndex + 0];
      outputData.data[pixelIndex + 1] = imageData.data[originalPixelIndex + 1];
      outputData.data[pixelIndex + 2] = imageData.data[originalPixelIndex + 2];
      outputData.data[pixelIndex + 3] = imageData.data[originalPixelIndex + 3];
    }
  }
}
