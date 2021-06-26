import Jimp = require("jimp");
import { join } from "path/posix";
import Color from "../interfaces/Color";

const colors: Color[] = [
  {
    num: 0,
    hex: 0x000000FF,
    name: 'black'
  },
  {
    num: 1,
    hex: 0x1D2B53FF,
    name: 'dark-blue'
  },
  {
    num: 2,
    hex: 0x7E2553FF,
    name: 'dark-purple'
  },
  {
    num: 3,
    hex: 0x008751FF,
    name: 'dark-green'
  },
  {
    num: 4,
    hex: 0xAB5236FF,
    name: 'brown'
  },
  {
    num: 5,
    hex: 0x5F574FFF,
    name: 'dark-grey'
  },
  {
    num: 6,
    hex: 0xC2C3C7FF,
    name: 'light-grey'
  },
  {
    num: 7,
    hex: 0xFFF1E8FF,
    name: 'white'
  },
  {
    num: 8,
    hex: 0xFF004DFF,
    name: 'red'
  },
  {
    num: 9,
    hex: 0xFFA300FF,
    name: 'orange'
  },
  {
    num: 10,
    hex: 0xFFEC27FF,
    name: 'yellow'
  },
  {
    num: 11,
    hex: 0x00E436FF,
    name: 'green'
  },
  {
    num: 12,
    hex: 0x29ADFFFF,
    name: 'blue'
  },
  {
    num: 13,
    hex: 0x83769CFF,
    name: 'lavender'
  },
  {
    num: 14,
    hex: 0xFF77A8FF,
    name: 'pink'
  },
  {
    num: 15,
    hex: 0xFFCCAAFF,
    name: 'light-peach'
  }
]

const getColor = (n: number) : { hex: number, name: string } => {
  return colors.filter(c => c.num == n)[0];
}

const getNumber = (hex: number) : number => {
  return colors.filter(c => c.hex == hex)[0].num;
}

const createLinesFromImage = async (imagePath: string): Promise<string[]> => {
  console.log({imagePath});
  console.log({'currentdir': __dirname})
  const jimg = await Jimp.read(imagePath);
  const lines: string[] = [];
  console.log({jimg});
  for(let y = 0; y < 128; y++){
    const nums: number[] = [];
    for(let x = 0; x < 128; x++){
      const num = getNumber(jimg.getPixelColor(x,y));
      nums.push(num);
    }
    lines.push(nums.map(n => n.toString()).join(''));
  }

  return lines;
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
  createImageFromLines,
  createLinesFromImage,
}