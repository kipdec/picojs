import path = require("path");
import { parse } from "path/posix";
import CartInterface from "../interfaces/CartInterface";
import { createImageFromLines, createLinesFromImage } from '../utils/SpritesheetUtils';
const fs = require('fs');

const emptyLine = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

const stringToNumberArray = (str: string) : number[] => {
  const numArray = str.split('').map(c => parseInt(`0x${c}`));
  return numArray;
}

const numberArrayToString = (numberArray: number[]) : string => {
  const result = numberArray.map(n => n.toString(16)).join('');
  return result;
}

const header = 'pico-8 cartridge // http://www.pico-8.com\nversion 32'
const luaHeader = '__lua__';
const mapHeader = '__map__';
const spritesheetHeader = '__gfx__';
const spriteflagsHeader = '__gff__';
const labelHeader = '__label__';
const sfxHeader = '__sfx__';
const musicHeader = '__music__';

class Cart {
  data: CartInterface;
  filename: string;
  baseDir: string;
  constructor(baseDir: string, filename: string, data?: CartInterface){
    this.baseDir = baseDir
    this.filename = filename;
    if(!data){
      data = {
        lua: [`--${this.filename}--`],
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

  unpack = async() => {
    this.generateLua();
    this.generateLabel();
    await this.generateSpriteSheet();
    this.generateSpriteFlags();
    this.generateMap();
    this.generateSFX();
    this.generateMusic();
  }

  generateSpriteSheet = async () =>{
    const image = createImageFromLines(this.data.spritesheet);
    // prune the unused images
    await image.writeAsync(path.join(this.baseDir, `src/spritesheet/${this.filename.slice(0, -3)}_ss.png`));
  }

  generateLua(){
    const lua = this.data.lua.join('\n');
    fs.writeFileSync(path.join(this.baseDir, `src/lua/${this.filename.slice(0,-3)}.lua`), lua);
  }

  generateSpriteFlags(){     
    const array: number[][] = [];
    this.data.spriteflags.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/spriteflags/${this.filename.slice(0,-3)}_sf.json`), JSON.stringify(array));
  }

  generateLabel(){     
    const array: number[][] = [];
    this.data.label.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/label/${this.filename.slice(0,-3)}_label.json`), JSON.stringify(array));
  }

  generateMap(){
    const array: number[][] = [];
    this.data.map.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/map/${this.filename.slice(0,-3)}_map.json`), JSON.stringify(array));
  }
  
  generateSFX(){     
    const array: number[][] = [];
    this.data.sfx.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/sfx/${this.filename.slice(0,-3)}_sfx.json`), JSON.stringify(array));
  }

  generateMusic(){     
    const array: number[][] = [];
    this.data.music.forEach(s => array.push(stringToNumberArray(s)));
    fs.writeFileSync(path.join(this.baseDir, `src/music/${this.filename.slice(0,-3)}_music.json`), JSON.stringify(array));
  }

  readIn = async () => {
    this.data.lua = fs.readFileSync(path.join(this.baseDir, `src/lua/${this.filename.slice(0,-3)}.lua`), {encoding: 'utf8', flag: 'r'}).split('\n');

    const spritesheet = await createLinesFromImage(path.join(this.baseDir, 'src/spritesheet', `${this.filename.slice(0,-3)}_ss.png`));
    // prune unused lines
    while(spritesheet.slice(-1)[0] == emptyLine) spritesheet.pop();

    this.data.spritesheet = spritesheet;

    this.readSpriteFlags();
    this.readMap();
    this.readLabel()
    this.readSFX();
    this.readMusic();
  }

  readSpriteFlags = () => {
    const sfFile = fs.readFileSync(path.join(this.baseDir, 'src/spriteflags', `${this.filename.slice(0,-3)}_sf.json`), {encoding: 'utf8', flag: 'r'});
    const sfArray: number[][] = JSON.parse(sfFile);
    this.data.spriteflags = sfArray.map(a => numberArrayToString(a));
  }

  readLabel = () => {
    const labelFile = fs.readFileSync(path.join(this.baseDir, 'src/label', `${this.filename.slice(0,-3)}_label.json`), {encoding: 'utf8', flag: 'r'});
    const labelArray: number[][] = JSON.parse(labelFile);
    this.data.label = labelArray.map(a => numberArrayToString(a));
  }

  readMap = () => {
    const mapFile = fs.readFileSync(path.join(this.baseDir, 'src/map', `${this.filename.slice(0,-3)}_map.json`), {encoding: 'utf8', flag: 'r'});
    const mapArray: number[][] = JSON.parse(mapFile);
    this.data.map = mapArray.map(a => numberArrayToString(a));
  }

  readSFX = () => {
    const sfxFile = fs.readFileSync(path.join(this.baseDir, 'src/sfx', `${this.filename.slice(0,-3)}_sfx.json`), {encoding: 'utf8', flag: 'r'});
    const sfxArray: number[][] = JSON.parse(sfxFile);
    this.data.sfx = sfxArray.map(a => numberArrayToString(a));
  }

  readMusic = () => {
    const musicFile = fs.readFileSync(path.join(this.baseDir, 'src/music', `${this.filename.slice(0,-3)}_music.json`), {encoding: 'utf8', flag: 'r'});
    const musicArray: number[][] = JSON.parse(musicFile);
    this.data.music = musicArray.map(a => numberArrayToString(a));
  }

  pack = async () => {
    // Create a backup
    const date = new Date().toLocaleTimeString();
    fs.mkdirSync(path.join(this.baseDir, 'backup'), {recursive: true});
    if(fs.existsSync(path.join(this.baseDir, this.filename))) fs.copyFileSync(path.join(this.baseDir, this.filename), path.join(this.baseDir, 'backup', `${this.filename.slice(0,-3)}-${date}.p8`));
    
    await this.readIn();
    const outFile: string[] = [];
    outFile.push(header);
    outFile.push(luaHeader);
    outFile.push(...this.data.lua);
    if(this.data.spritesheet.length > 0){
      outFile.push(spritesheetHeader);
      outFile.push(...this.data.spritesheet);
    }
    if(this.data.spriteflags.length > 0){
      outFile.push(spriteflagsHeader);
      outFile.push(...this.data.spriteflags);
    }
    if(this.data.label.length > 0){
      outFile.push(labelHeader);
      outFile.push(...this.data.label);
    }
    if(this.data.map.length > 0){
      outFile.push(mapHeader);
      outFile.push(...this.data.map);
    }
    if(this.data.sfx.length > 0){
      outFile.push(sfxHeader);
      outFile.push(...this.data.sfx);
    }
    if(this.data.music.length > 0){
      outFile.push(musicHeader);
      outFile.push(...this.data.music);
    }

    fs.writeFileSync(this.filename, outFile.join('\n'));
  }
}

export default Cart;