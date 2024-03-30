import fs from "fs";
import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
console.log("Hello World");

const sequence = arr => arr.reduce((prev, job) => prev.then(job), Promise.resolve());
const colors = {
    reset: "\x1b[0m",
    //text color
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    //background color
    blackBg: "\x1b[40m",
    redBg: "\x1b[41m",
    greenBg: "\x1b[42m",
    yellowBg: "\x1b[43m",
    blueBg: "\x1b[44m",
    magentaBg: "\x1b[45m",
    cyanBg: "\x1b[46m",
    whiteBg: "\x1b[47m",
}

function tiny(assetsPath, src) {
    return new Promise((resolve) => {
        const out = src.substring(0, src.lastIndexOf("/"));
        const plugins = [imageminPngquant({/* quality: [0.5, 0.5] */})];
        const path = `${assetsPath}/${src}`;
        if (!fs.existsSync(path)) {
            trace("No File", path, colors.red);
            resolve();
        } else {
            trace('Out', `${assetsPath}/${out}`, colors.green)
            imagemin([path], {destination: `${assetsPath}/${out}`, plugins}).then(() => {
                trace("Compress", path, colors.cyan);
                resolve();
            });
        }
    });
}

async function compressImages(path) {
    let files = fs.readdirSync(path);
    console.log([path]);
    const arr = files.filter(file => {
        return !fs.lstatSync(`${path}/${file}`).isDirectory() && file.includes(".png")
    });
    console.log(arr);
    await sequence(arr.map(src => () => tiny(path, src)));
}

function trace(prefix, str, color) {
    prefix = prefix ? prefix + " " : "";
    color = color || "";
    console.log(`${prefix}${color}${str}\x1b[0m`);
}

const path = "./dist/assets/atlases";
void compressImages(path);

