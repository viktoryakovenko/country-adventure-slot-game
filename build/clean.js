const fs = require("fs");

fs.rmdir("./dist", {recursive: true}, () => {});