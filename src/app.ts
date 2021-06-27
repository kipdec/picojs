#!/usr/bin/env node
import * as fs from 'fs';
import * as readline from 'readline';
import CartInterface from './interfaces/CartInterface';
import Cart from './classes/Cart';
import path = require('path');
import { exit } from 'process';

const filename = '../input/dungeongame.p8';

const args = process.argv.slice(2);
const arg = args[0];

const baseDir = process.cwd();

const processArgs = () =>{
  switch(arg){
    case 'unpack':
      console.log('unpacking p8 file...');
      unpack();
      console.log('unpacked!')
      break;
    case 'pack':
      console.log('packing p8 file...')
      pack();
      console.log('packed!');
      break;
    default:
      console.log('unknown command');
  }
}

const getP8File = (): string | undefined => {
   var files = fs.readdirSync(baseDir);
  const p8files = files.filter(f => f.endsWith('.p8'));
  if(p8files.length == 0){
    console.log('No valid p8 file found');
    return;
  }
  if(p8files.length > 1){
    console.log('This program is designed to work with one (1) .p8 file per directory');
    return;
  }

  return p8files[0];
}

const unpack = async () => {
  // Check to make sure p8 file is in folder
  const p8fileName = getP8File(); 
  if(!p8fileName) exit(1);
  // Ensure that src and subfolders exist
  fs.mkdirSync(path.join(baseDir, 'src'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/lua'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/spritesheet'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/spriteflags'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/label'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/map'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/sfx'), {recursive: true});
  fs.mkdirSync(path.join(baseDir, 'src/music'), {recursive: true});

  await processFile(p8fileName);
}
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
const addLineToCartInterface = (section: string, line: string, data: CartInterface) => {
  switch(section){
    case "LUA": data.lua.push(line); break;
    case "GFX": data.spritesheet.push(line); break;
    case "GFF": data.spriteflags.push(line); break;
    case "LABEL": data.label.push(line); break;
    case "MAP": data.map.push(line); break;
    case "SFX": data.sfx.push(line); break;
    case "MUSIC": data.music.push(line); break;
  }
}
const processFile = async (filename) => {
  let currentSection = '';
  
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const data: CartInterface = {
    lua: [],
    spritesheet: [],
    spriteflags: [],
    label: [],
    map: [],
    music: [],
    sfx: []
  }

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
        addLineToCartInterface(currentSection, line, data);
      }
    }
  }

  const cart = new Cart(baseDir, filename, data);
  cart.generateLua();
  cart.generateSpriteSheet();
  cart.generateSpriteFlags();
  cart.generateLabel();
  cart.generateMap();
  cart.generateSFX();
  cart.generateMusic();

}

const pack = () => {
  // read in lua
  // Ensure that p8 file exists
  const p8fileName = getP8File();
  if(!p8fileName) exit(1);
  const cart = new Cart(baseDir, p8fileName);
  cart.pack();
}

processArgs();
