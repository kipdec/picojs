// read in the file
import * as fs from 'fs';
import * as readline from 'readline';
import CartInterface from './interfaces/CartInterface';
import Cart from './classes/Cart';

const filename = '../input/dungeongame.p8';

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

  const cart: CartInterface = {
    lua,
    spritesheet,
    spriteflags,
    label,
    map,
    music
  }
  //console.log({cart});

  const cart2 = new Cart(cart);
  cart2.generateSpriteSheet();

}

processFile();

