const fs = require("fs");

copyFilesToDist();

function copyFilesToDist() {
    let filesArr = [];
    // filesArr.push({ filePath: "./src/index.html", outputPath: "dist/" });
    // filesArr.push({ filePath: "node_modules/pixi.js/dist/pixi.min.js", outputPath: "dist/libs/" });
    // filesArr.push({ filePath: "node_modules/moment/moment.js", outputPath: "dist/libs/" });
    filesArr.push(...getFilesDataFromDir("resources/assets/atlases/", "dist/assets/atlases/", false));
    filesArr.push(...getFilesDataFromDir("resources/assets/images/", "dist/assets/images/", false));
    filesArr.push(...getFilesDataFromDir("resources/assets/favicon/", "dist/assets/favicon/", false));
    filesArr.push(...getFilesDataFromDir("resources/assets/fonts/", "dist/assets/fonts/", false));
    filesArr.push(...getFilesDataFromDir("resources/assets/fonts/bitmap/", "dist/assets/fonts/bitmap/", true));
    // filesArr.push(...getFilesDataFromDir("src/assets/data/", "dist/assets/data/", true));
    // filesArr.push(...getFilesDataFromDir("src/assets/fonts/", "dist/assets/fonts/", true));
    filesArr.push(...getFilesDataFromDir("resources/assets/images/", "dist/assets/images/", true));
    // filesArr.push(...getFilesDataFromDir("src/assets/sounds/", "dist/assets/sounds/", false));
    filesArr.push(...getFilesDataFromDir("resources/assets/cursors/", "dist/assets/cursors/", false));

    if (filesArr.length) {
        copyFiles(filesArr);
    }
}

function getFilesDataFromDir(filePath, outputPath, includeSubfolders) {
    let arr = [];
    if (fs.existsSync(filePath)) {
        let files = fs.readdirSync(filePath);
        files.forEach(file => {
            if (fs.lstatSync(filePath + file).isDirectory()) {
                if (includeSubfolders) {
                    arr.push(...getFilesDataFromDir(filePath + file + "/", outputPath, includeSubfolders));
                }
            } else {
                arr.push({ filePath: filePath + file, outputPath: outputPath });
            }
        });
    }
    return arr;
}

function copyFiles(arr) {
    let data = arr.pop();
    let file = data.filePath;
    let url = file.substring(0, file.lastIndexOf("/") + 1);
    let fileName = file.substring(url.length);

    let path = data.outputPath.split("/");
    checkDir(0);

    function checkDir(index, str) {
        let dirName = path[index];
        let url = str !== undefined ? `${str}/${dirName}` : dirName;
        if (!fs.existsSync(url)) {
            fs.mkdirSync(url);
        }
        if (index < path.length - 2) {
            checkDir(++index, url)
        }
    }

    let outputPath = data.outputPath + fileName;

    fs.copyFile(file, outputPath, (err) => {
        if (err) throw err;
        if (arr.length) {
            copyFiles(arr);
        }
    });
}
