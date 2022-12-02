const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt");
const path = require("path");

const compile =  async function compile() {
    const inputWat = "./WAT/src/memory.wat";
    const outputWasm = "./WAT/build/memory.wasm";
    let module = await wabt()
    const wasmModule = module.parseWat(inputWat, readFileSync(inputWat, "utf8"));
    const { buffer } = wasmModule.toBinary({});
    // console.log(buffer)
    writeFileSync(outputWasm, Buffer.from(buffer));

}
compile()


