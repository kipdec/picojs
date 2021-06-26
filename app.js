"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
// read in the file
var fs = require("fs");
var readline = require("readline");
var Jimp = require("jimp");
var filename = 'dungeongame.p8';
var colors = {
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
};
var getColor = function (c) {
    return colors[c];
};
var jimg = new Jimp(128, 128, 0x000000FF);
var makeImage = function (lines) {
    for (var yindex = 0; yindex < lines.length; yindex++) {
        for (var i = 0; i < 128; i++) {
            var color = getColor(parseInt(lines[yindex].charAt(i)));
            console.log({ hex: color.hex });
            var val = color.hex.toString(16);
            console.log({ val: val });
            jimg.setPixelColor(parseInt(val, 16), i, yindex);
        }
    }
    //jimg.colorType(0);
    jimg.write('test.png');
};
var processFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentSection, lua, spritesheet, spriteflags, label, map, sfx, music, getSection, addToSection, fileStream, rl, sectionFound, rl_1, rl_1_1, line, section, newSection, e_1_1, cart;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                currentSection = '';
                lua = [];
                spritesheet = [];
                spriteflags = [];
                label = [];
                map = [];
                sfx = [];
                music = [];
                getSection = function (line) {
                    switch (line) {
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
                };
                addToSection = function (section, line) {
                    switch (section) {
                        case "LUA":
                            lua.push(line);
                            break;
                        case "GFX":
                            spritesheet.push(line);
                            break;
                        case "GFF":
                            spriteflags.push(line);
                            break;
                        case "LABEL":
                            label.push(line);
                            break;
                        case "MAP":
                            map.push(line);
                            break;
                        case "SFX":
                            sfx.push(line);
                            break;
                        case "MUSIC":
                            music.push(line);
                            break;
                    }
                };
                fileStream = fs.createReadStream(filename);
                rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });
                sectionFound = false;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 12]);
                rl_1 = __asyncValues(rl);
                _b.label = 2;
            case 2: return [4 /*yield*/, rl_1.next()];
            case 3:
                if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3 /*break*/, 5];
                line = rl_1_1.value;
                if (line.startsWith("__"))
                    sectionFound = true;
                if (sectionFound) {
                    section = getSection(line);
                    newSection = false;
                    if (section) {
                        newSection = true;
                        currentSection = section;
                    }
                    if (currentSection != '' && !newSection) {
                        addToSection(currentSection, line);
                    }
                }
                _b.label = 4;
            case 4: return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _b.trys.push([7, , 10, 11]);
                if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1["return"]))) return [3 /*break*/, 9];
                return [4 /*yield*/, _a.call(rl_1)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                makeImage(spritesheet);
                cart = {
                    lua: lua,
                    spritesheet: spritesheet,
                    spriteflags: spriteflags,
                    label: label,
                    map: map,
                    music: music
                };
                return [2 /*return*/];
        }
    });
}); };
processFile();
