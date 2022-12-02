const parser = require("./parse")
const { WASI } = require("wasi");
const { readFileSync, writeFileSync } = require("fs");
let  { instantiateStreaming } = require('wasm-instantiate-streaming')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)


// const completeBufferFromMemory = 
//     new Uint8Array(memory.buffer);

const wasmFunctionContext = async  (initMemory) => {
    const buffer = readFileSync("./WAT/build/memory.wasm");
    const module = await WebAssembly.compile(buffer);
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 10000 });
    const i32 = new Uint32Array(memory.buffer);

    initMemory(i32)
    return instantiateStreaming(readFile('./WAT/build/memory.wasm'), {
        js: { mem: memory },
      })
}

const addFunc = async (arr) => await wasmFunctionContext((i32)=> {
    for (let i = 0; i < arr.length; i++) {
        i32[i] = arr[i];
      }      
}).then((results) => {
    const sum = results.instance.exports.accumulate(0, arr.length);
    return sum;
  });

const  stringEquality = async (a,b) => {
    const buffer = readFileSync("./WAT/build/memory.wasm");
    const module = await WebAssembly.compile(buffer);
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 10000 });
    const i32 = new Uint32Array(memory.buffer);

    const str = (new TextEncoder()).encode(a)
    const str1 = (new TextEncoder()).encode(b)
    let i = 0;
    for (; i < str.length; i++) {
    i32[i] = str[i];
    }
    console.log(i)
    for (let j = 0; j < str1.length; j++) {
        i32[i++] = str1[j];

    }
    console.log(i32.reduce((p,c)=>p+c))
    

    return await instantiateStreaming(readFile('./WAT/build/memory.wasm'), {
        js: { mem: memory },
        imports: {
            imports: { imported_func: (arg) => 42 },
          }
      })
      .then((results) => {
        const res = results.instance.exports.equal(0, str.length, str1.length);
        return res == 1
      });
}


const jyss = async (commands) => {
    let exprcs = parser.parse(commands)
    console.log(exprcs)
    const handleFunction = async (func,e) => {  
      for (let key of Object.keys(e)) {
        console.log(key,func)
        let res = await stringEquality(func,key)
        console.log(res)
        if (res) {
          return  e[key];
        }
      }

    }
    // if (exprcs[0] == "AppC") {
    //     return (await  handleFunction(exprcs[1]))(exprcs.slice(2,))
    // }
    const env = {
        "+" :  async (l) => await addFunc(l)
    }

    const interp =  async (exprc,env) => {


        if (exprc[0] == "AppC") {
            let params = (await Promise.all(exprc.slice(1,).map((e)=> interp(e))))
            return (await  params[0])(params)
        }
        if (exprc[0] == "FundefC") {
            let params = exprc[2]
            let body = await interp(exprc[3],env)
            return  async (l,env) => body(l,env)
        }

        if (env[exprc])
            return env[exprc]
        
        return exprc
    }
    
    return await interp(exprcs)
  }

 
module.exports = jyss