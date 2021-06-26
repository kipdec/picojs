// read in the file
import * as fs from 'fs';
import * as readline from 'readline';
import CartInterface from './interfaces/CartInterface';
import Jimp = require('jimp');

const filename = 'dungeongame.p8';

interface Color {
  [key: number] : { hex: number, name: string}
}
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

var jimg = new Jimp(128,128, 0x000000FF); const makeImage = (lines: string[]) => {
  for(let yindex = 0; yindex < lines.length; yindex++){
    for(let i = 0; i < 128; i++){
      const color = getColor(parseInt(lines[yindex].charAt(i)));
      console.log({hex: color.hex})
      const val = color.hex.toString(16);

      console.log({val});
      jimg.setPixelColor(parseInt(val, 16), i, yindex);
    }
  }
  //jimg.colorType(0);
  jimg.write('test.png');
}

const processFile = async () => {
  let currentSection = '';
  let lua: string[] = [];
  let spritesheet: string[] = [];
  let spriteflags: string[] = [];
  let label: string[] = [];
  let map: string[] = [];
  let sfx: string[] = [];
  let music: string[] = [];

  const getSection = (line: string): string | undefined =>{
    switch(line){
      case "__lua__":
        return "LUA";
      case "__gfx__":
        return "GFX";
      case "__gff__":
        return "GFF";
      case "__label__":
        return "LABEL";
      case "__map__":
        return "MAP";
      case "__sfx__":
        return "SFX";
      case "__music__":
        return "MUSIC";
      default:
        return undefined;
    }
  }

  const addToSection = (section: string, line: string) => {
    switch(section){
      case "LUA": lua.push(line); break;
      case "GFX": spritesheet.push(line); break;
      case "GFF": spriteflags.push(line); break;
      case "LABEL": label.push(line); break;
      case "MAP": map.push(line); break;
      case "SFX": sfx.push(line); break;
      case "MUSIC": music.push(line); break;
    }
  }
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let sectionFound = false;
  for await(const line of rl){
    if(line.startsWith("__")) sectionFound = true;
    if(sectionFound){
      // Check and see if it is a header
      const section = getSection(line);
      var newSection = false;
      if(section){
        newSection = true;
        currentSection = section;
      }

      if(currentSection != '' && !newSection){
        addToSection(currentSection, line);
      }
    }
  }
  
  makeImage(spritesheet);

  const cart: CartInterface = {
    lua,
    spritesheet,
    spriteflags,
    label,
    map,
    music
  }
  //console.log({cart});

}

processFile();

