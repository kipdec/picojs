import path = require("path");
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
  baseDir: string;
  constructor(baseDir: string, filename: string, data?: CartInterface){
    this.baseDir = baseDir
    this.filename = filename;
    if(!data){
      data = {
        lua: [],
        spritesheet: [],
        map: [],
        spriteflags: [],
        label: [],
        music: [],
        sfx: []
      }
    }
    this.data = data;
  }

  generateSpriteSheet(){
    const image = createImageFromLines(this.data.spritesheet);
    image.write(path.join(this.baseDir, `src/spritesheet/${this.filename.slice(0, -3)}_ss.png`));
  }

  generateLua(){
    const lua = this.data.lua.join('\n');
    fs.writeFileSync(path.join(this.baseDir, `src/lua/${this.filename.slice(0,-3)}.lua`), lua);
  }

  generateMap(){
    const array: number[][] = [];
    this.data.map.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/map/${this.filename.slice(0,-3)}_map.json`), JSON.stringify(array));
  }

  readIn = async () => {
    this.data.lua = fs.readFileSync(path.join(this.baseDir, `src/lua/${this.filename.slice(0,-3)}.lua`), {encoding: 'utf8', flag: 'r'}).split('\n');

    this.data.spritesheet = await createLinesFromImage(path.join(this.baseDir, 'src/spritesheet', `${this.filename.slice(0,-3)}_ss.png`));

    const mapFile = fs.readFileSync(path.join(this.baseDir, 'src/map', `${this.filename.slice(0,-3)}_map.json`), {encoding: 'utf8', flag: 'r'});
    const mapArray: number[][] = JSON.parse(mapFile);
    this.data.map = mapArray.map(a => numberArrayToString(a));
    console.log(this);
  }

  pack = async () => {
    // Create a backup
    const date = new Date().toLocaleTimeString();
    fs.mkdirSync(path.join(this.baseDir, 'backup'), {recursive: true});
    fs.copyFileSync(path.join(this.baseDir, this.filename), path.join(this.baseDir, 'backup', `${this.filename.slice(0,-3)}-${date}.p8`));
    
    await this.readIn();
    const outFile: string[] = [];
    outFile.push(header);
    outFile.push(luaHeader);
    outFile.push(...this.data.lua);
    outFile.push(spritesheetHeader);
    outFile.push(...this.data.spritesheet);
    outFile.push(mapHeader);
    outFile.push(...this.data.map);
    console.log(outFile);

    fs.writeFileSync(this.filename, outFile.join('\n'));
  }
}

export default Cart;