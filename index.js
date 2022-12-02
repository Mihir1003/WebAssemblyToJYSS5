const { readFileSync } = require("fs");
const compile = require("./compile")



const run = async () => {
    await compile()
    const buffer = readFileSync("./WAT/build/main.wasm");
    const module = await WebAssembly.compile(buffer);
    const instance = await WebAssembly.instantiate(module);
    console.log(instance.exports.helloWorld());






};

run();