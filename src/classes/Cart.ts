import CartInterface from "../interfaces/CartInterface";
import { createImageFromLines, createLinesFromImage } from '../utils/SpritesheetUtils';
const fs = require('fs');

const stringToNumberArray = (str: string) : number[] => {
  const numArray = str.split('').map(c => parseInt(c));
  return numArray;
}

const numberArrayToString = (numberArray: number[]) : string => {
  const result = numberArray.map(n => n.toString()).join('');
  return result;
}

const header = 'pico-8 cartridge // http://www.pico-8.com\nversion 32'
const luaHeader = '__lua__';
const mapHeader = '__map__';
const spritesheetHeader = '__gfx__';

class Cart {
  data: CartInterface;
  filename: string;
  constructor(filename: string, data?: CartInterface){
    this.filename = filename;
    if(!data){
      data = {
        lua: [],
        spritesheet: [],
        map: [],
        spriteflags: [],
        label: [],
        music: []
      }
    }
    this.data = data;
  }

  generateSpriteSheet(){
    const image = createImageFromLines(this.data.spritesheet);
    image.write('./output/spritesheet/spritesheet.png');
  }

  generateLua(){
    const lua = this.data.lua.join('\n');
    fs.writeFileSync('./output/lua/lua.lua', lua);
  }

  generateMap(){
    const array: number[][] = [];
    this.data.map.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync('./output/map/map.json', JSON.stringify(array));
  }

  readIn = async () => {
    this.data.lua = fs.readFileSync('./output/lua/lua.lua', {encoding: 'utf8', flag: 'r'}).split('\n');

    this.data.spritesheet = await createLinesFromImage(__dirname + '/../output/spritesheet/spritesheet.png');

    const mapFile = fs.readFileSync('./output/map/map.json', {encoding: 'utf8', flag: 'r'});
    const mapArray: number[][] = JSON.parse(mapFile);
    this.data.map = mapArray.map(a => numberArrayToString(a));
    console.log(this);
  }

  pack = async () => {
    await this.readIn();
    const outFile: string[] = [];
    outFile.push(header);
    outFile.push(luaHeader);
    outFile.push(...this.data.lua);
    outFile.push(spritesheetHeader);
    outFile.push(...this.data.spritesheet);
    outFile.push(mapHeader);
    outFile.push(...this.data.map);

    fs.writeFileSync(this.filename, outFile.join('\n'));
  }
}

export default Cart;