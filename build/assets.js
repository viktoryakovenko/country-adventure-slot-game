const texturepackerify = require("texturepackerify");
const fs = require("fs");

let url = "./resources/origin.assets/atlases/";
let finalUrl = "./resources/assets/atlases/";
fs.mkdir(finalUrl, ()=>{
    texturepackerify.pack({url: url, hashUrl: "./assets/", force: false}, () => {
        console.log("assets built");
        let files = fs.readdirSync(url);
        files.forEach(file => {
            if (!fs.lstatSync(url + file).isDirectory()) {
                fs.rename(url + file, finalUrl + file, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Successfully renamed - AKA moved!')
                });
            }
        });
    });
});
