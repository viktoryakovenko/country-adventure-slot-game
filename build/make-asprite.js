#!/usr/bin/env node

let fs = require('fs');
const path = require('path');
let audiosprite = require('audiosprite');
let winston = require('winston');
let sound_list = require('./../resources/assets/sounds/sound_list.json');
let SND_PATH = "./resources/assets/sounds/";

winston.level = 'debug';

console.log(sound_list);

let sounds = Object.keys(sound_list);
let files = sounds.map(i => SND_PATH + i);
console.log(files);
let loops = sounds.filter(function (el) {
    return sound_list[el] === "loop";
});
loops = loops.map(i => path.parse(i).name);
console.log(loops);


// mobile: low quality, mono
//let opts = {output: 'SOUND_FILE', format: 'skb', minlength: 0.1, channels: 1, bitrate: 56, export: 'mp3', gap: 0.5, loop: loops, logger: winston}

// desktop: high quality, stereo
// choose bitrate based on provided input files by sound artist and take into consideration resulting file size - usually 96 or 128

let opts = {
    output: './dist/assets/sounds/SOUND_FILE',
    format: 'howler2',
    minlength: 0.1,
    channels: 2,
    bitrate: 96,
    export: 'mp3,ogg',
    gap: 0.5,
    loop: loops,
    logger: winston
};

audiosprite(files, opts, function (err, obj) {
    if (err) return console.error(err);

    let map = JSON.stringify(obj, null, 2);
    map = map.replace(/\.\/dist\//g, "./");
    console.log(map);
    let jsonFile = SND_PATH + 'SOUND_FILE.soundmap.json';
    console.log(`jsonFile: ${jsonFile}`);
    fs.writeFileSync(jsonFile, map)
});