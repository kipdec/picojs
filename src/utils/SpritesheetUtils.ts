import Jimp = require("jimp");
import Color from "../interfaces/Color";

const colors: Color = {
  0: {
    hex: 0x000000FF,
    name: 'black'
  },
  1: {
    hex: 0x1D2B53FF,
    name: 'dark-blue'
  },
  2: {
    hex: 0x7E2553FF,
    name: 'dark-purple'
  },
  3: {
    hex: 0x008751FF,
    name: 'dark-green'
  },
  4: {
    hex: 0xAB5236FF,
    name: 'brown'
  },
  5: {
    hex: 0x5F574FFF,
    name: 'dark-grey'
  },
  6: {
    hex: 0xC2C3C7FF,
    name: 'light-grey'
  },
  7: {
    hex: 0xFFF1E8FF,
    name: 'white'
  },
  8: {
    hex: 0xFF004DFF,
    name: 'red'
  },
  9: {
    hex: 0xFFA300FF,
    name: 'orange'
  },
  10: {
    hex: 0xFFEC27FF,
    name: 'yellow'
  },
  11: {
    hex: 0x00E436FF,
    name: 'green'
  },
  12: {
    hex: 0x29ADFFFF,
    name: 'blue'
  },
  13: {
    hex: 0x83769CFF,
    name: 'lavender'
  },
  14: {
    hex: 0xFF77A8FF,
    name: 'pink'
  },
  15: {
    hex: 0xFFCCAAFF,
    name: 'light-peach'
  }
}

const getColor = (c: number) : { hex: number, name: string } => {
  return colors[c];
}

const createImageFromLines = (lines: string[]): Jimp => {
  const jimg = new Jimp(128,128, 0x000000FF); 
  for(let y = 0; y < lines.length; y++){
    for(let x = 0; x < 128; x++){
      const color = getColor(parseInt(lines[y].charAt(x)));
      jimg.setPixelColor(color.hex, x, y);
    }
  }

  return jimg;
}

export {
  getColor,
  createImageFromLines
}