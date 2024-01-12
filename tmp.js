'use strict';

function exeCmd() {
  const {execSync} = require("node:child_process");
  // todo rmdir dist && mkdir dist
  execSync(`IF NOT EXIST "dist" ( mkdir "dist" ) ELSE ( rmdir /s /q "dist" && mkdir "dist" )`);
  execSync("npm run webpack"); // production
}
function zipFile() {
//*******************************************
  const {zipAlotFileOrDir} = require("./zipFile");
  zipAlotFileOrDir("dist", null);
  zipAlotFileOrDir(
    null,
    {append: "--sourcecode"},
    [".zip", "package-lock.json", "yarn.lock"],
    ["dist", "trash", "screenshot"]
  );
  console.log("new Date()=> ", new Date().toLocaleTimeString());
}

exeCmd();
zipFile();