                                                                           
                                                                         

                                                                 
                                                                    
var Rexcomp = (() => {
                                                   
                                                         
                                                          
  var _scriptName = globalThis.document?.currentScript?.src;
  return async function(moduleArg = {}) {
  var fetch = moduleArg.dataFetch || globalThis.fetch.bind(globalThis);
    var moduleRtn;

                    
                                    
                                        
                                                                   
                                                                      
                                    
                                                                  
                                                              
                                             
                                                                 
                                                                              
                                                                     
                                                               
                                                                       
                                                                      
                                                 
var Module = moduleArg;

                                                                         
                                                                     
var ENVIRONMENT_IS_WEB = true;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

                                                                             
                                                                
var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

                                                                     
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

                                                                            
var readAsync, readBinary;

                                                                               
                                                                             
                       
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  {
                                           
    readAsync = async url => {
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

var out = console.log.bind(console);

var err = console.error.bind(console);

                        
                       
                                 
                                                                             
                                                    
                                                                 
                                                        
                                                                    
                                                                             
                                                                                           
var wasmBinary;

               
                                          
                     
                                          
                                                                          
                            
var ABORT = false;

                                                          
                                                                                
                                        
var EXITSTATUS;

                                                                           
                                                                          
                   
                                                                
                                    function assert(condition, text) {
  if (!condition) {
                                                                                
                                                                            
                                                                      
    abort(text);
  }
}

   
                                                                                       
            
    var isFileURI = filename => filename.startsWith("file://");

                             
                                  
                                      
                                 
                                     
                            
                                
var readyPromiseResolve, readyPromiseReject;

                    
var                           HEAP8,                            HEAPU8,                            HEAP16,                             HEAPU16,                            HEAP32,                             HEAPU32,                              HEAPF32,                              HEAPF64;

                                                         
var                                   HEAP64,                                                           
                                   HEAPU64;

var runtimeInitialized = false;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

                             
                                 
                                 
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
                          
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
                        
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
  TTY.init();
                      
  wasmExports["__wasm_call_ctors"]();
                            
  FS.ignorePermissions = false;
}

function preMain() {}

function postRun() {
                                                     
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
                           
  callRuntimeCallbacks(onPostRuns);
}

                                    function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
                                                                    
                           
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
                                                                            
                                                                            
                                  
                                                                                      
                                                                                
                                                                              
                                                                                 
                                  
                                                                              
                                                                              
                   
                                                                                                            
                                var e = new WebAssembly.RuntimeError(what);
  readyPromiseReject?.(e);
                                                                           
                                                                          
                                       
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("postal2.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
                                                                              
                                                                 
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
                                                                             
  if (!wasmBinary) {
                                       
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
                                                                    
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
                                                                                      
                                                                             
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
                                                                             
                                                                               
                                        
  Asyncify.instrumentWasmImports(wasmImports);
                    
  var imports = {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
  return imports;
}

                            
                                                  
async function createWasm() {
                                                                                          
                                                                
                                     
                                            function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmExports = Asyncify.instrumentWasmExports(wasmExports);
    wasmExports = applySignatureConversions(wasmExports);
    assignWasmExports(wasmExports);
    updateMemoryViews();
    return wasmExports;
  }
                                                 
  function receiveInstantiationResult(result) {
                                                                                
                                                                                       
                                                                                                                                                                 
                                                                                 
    return receiveInstance(result["instance"]);
  }
  var info = getWasmImports();
                                                                                                              
                                                                             
                                                                               
                
                                                                             
          
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      Module["instantiateWasm"](info, (inst, mod) => {
        resolve(receiveInstance(inst, mod));
      });
    });
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

                           
                        
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
                                             
    callbacks.shift()(Module);
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

   
                          
                           
        function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return HEAP8[ptr >>> 0];

   case "i8":
    return HEAP8[ptr >>> 0];

   case "i16":
    return HEAP16[((ptr) >>> 1) >>> 0];

   case "i32":
    return HEAP32[((ptr) >>> 2) >>> 0];

   case "i64":
    return HEAP64[((ptr) >>> 3) >>> 0];

   case "float":
    return HEAPF32[((ptr) >>> 2) >>> 0];

   case "double":
    return HEAPF64[((ptr) >>> 3) >>> 0];

   case "*":
    return HEAPU32[((ptr) >>> 2) >>> 0];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var noExitRuntime = true;

   
                          
                            
                           
        function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i8":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i16":
    HEAP16[((ptr) >>> 1) >>> 0] = value;
    break;

   case "i32":
    HEAP32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "i64":
    HEAP64[((ptr) >>> 3) >>> 0] = BigInt(value);
    break;

   case "float":
    HEAPF32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "double":
    HEAPF64[((ptr) >>> 3) >>> 0] = value;
    break;

   case "*":
    HEAPU32[((ptr) >>> 2) >>> 0] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var syscallGetVarargI = () => {
                                                                                                    
  var ret = HEAP32[((+SYSCALLS.varargs) >>> 2) >>> 0];
  SYSCALLS.varargs += 4;
  return ret;
};

var syscallGetVarargP = syscallGetVarargI;

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
                                                               
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
                                                                       
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
                         
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
                              
      return ".";
    }
    if (dir) {
                                               
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => view => crypto.getRandomValues(view);

var randomFill = view => {
                                         
  (randomFill = initRandomFill())(view);
};

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
                                       
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
                                                                             
                                                                               
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;

var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
                                                                             
                               
                                                                            
                                                         
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

   
                                                                                  
                                                                           
                                
                                                                               
                           
                                      
                                                                                            
                       
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  idx >>>= 0;
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
                                                                                                                      
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
                                    
                                                     
                                           
                                          
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
                                                                             
                                                                 
                          
                                                      
    var c = str.charCodeAt(i);
                                
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  outIdx >>>= 0;
                                                                         
                                                        
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
                                   
  for (var i = 0; i < str.length; ++i) {
                                                                                  
                                               
                                              
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++ >>> 0] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++ >>> 0] = 192 | (u >> 6);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++ >>> 0] = 224 | (u >> 12);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++ >>> 0] = 240 | (u >> 18);
      heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
                                                                                              
                                                                                  
      i++;
    }
  }
                                              
  heap[outIdx >>> 0] = 0;
  return outIdx - startIdx;
};

                                                   var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (globalThis.window?.prompt) {
                 
      result = window.prompt("Input: ");
                               
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  shutdown() {},
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
                                    
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    },
    write(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
                        
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
                              
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    }
  }
};

var mmapAlloc = size => {
  abort();
};

var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                     
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          lookup: MEMFS.node_ops.lookup,
          mknod: MEMFS.node_ops.mknod,
          rename: MEMFS.node_ops.rename,
          unlink: MEMFS.node_ops.unlink,
          rmdir: MEMFS.node_ops.rmdir,
          readdir: MEMFS.node_ops.readdir,
          symlink: MEMFS.node_ops.symlink
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek
        }
      },
      file: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek,
          read: MEMFS.stream_ops.read,
          write: MEMFS.stream_ops.write,
          mmap: MEMFS.stream_ops.mmap,
          msync: MEMFS.stream_ops.msync
        }
      },
      link: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          readlink: MEMFS.node_ops.readlink
        },
        stream: {}
      },
      chrdev: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: FS.chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
                                                                                                                          
                                                                                                                                               
                                                                                                                                               
                                                                                                                                  
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
                                     
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                                                   
    return new Uint8Array(node.contents);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
                                                               
                                                                                                                                      
                                                                                                                                             
                                                                    
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                                                             
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
                            
    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
                                                         
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
                              
      if (oldContents) {
        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
      }
      node.usedBytes = newSize;
    }
  },
  node_ops: {
    getattr(node) {
      var attr = {};
                                            
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.atime);
      attr.mtime = new Date(node.mtime);
      attr.ctime = new Date(node.ctime);
                                                                                
                                                        
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      for (const key of [ "mode", "atime", "mtime", "ctime" ]) {
        if (attr[key] != null) {
          node[key] = attr[key];
        }
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
                                                                              
                                      
      if (!MEMFS.doesNotExistError) {
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
                                      MEMFS.doesNotExistError.stack = "<generic error, no stack>";
      }
      throw MEMFS.doesNotExistError;
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (new_node) {
        if (FS.isDir(old_node.mode)) {
                                                                                
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
        FS.hashRemoveNode(new_node);
      }
                                 
      delete old_node.parent.contents[old_node.name];
      new_dir.contents[new_name] = old_node;
      old_node.name = new_name;
      new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    readdir(node) {
      return [ ".", "..", ...Object.keys(node.contents) ];
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
                                       
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
                                                               
                                                               
                                                                  
                                      
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                                                             
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
                                                                                                                        
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
                                                                           
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
                                                                                                               
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
                                                    
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
                                                            
      if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
                                                                         
                                                          
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
                                             
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          HEAP8.set(contents, ptr >>> 0);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                                                                 
      return 0;
    }
  }
};

var FS_modeStringToFlags = str => {
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  return new Uint8Array(arrayBuffer);
};

var FS_createDataFile = (...args) => FS.createDataFile(...args);

var getUniqueRunDependency = id => id;

var runDependencies = 0;

var dependenciesFulfilled = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
};

var addRunDependency = id => {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
};

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
                              
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      return plugin["handle"](byteArray, fullname);
    }
  }
                                                                       
               
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
                                                                            
                                                            
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
                                                             
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  filesystems: null,
  syncFSRequests: 0,
  readFiles: {},
  ErrnoError: class {
    name="ErrnoError";
                                                                        
                                                                                                     
                                                                    
                                                                 
                                                                                                                  
                                                                     
    constructor(errno) {
      this.errno = errno;
    }
  },
  FSStream: class {
    shared={};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    node_ops={};
    stream_ops={};
    readMode=292 | 73;
    writeMode=146;
    mounted=null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
  },
  lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
                                                          
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
                                
      var parts = path.split("/").filter(p => !!p);
                          
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = (i === parts.length - 1);
        if (islast && opts.parent) {
                           
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
                                                                          
                            
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
                                                                           
                                                                            
                                                                 
          if ((e?.errno === 44) && islast && opts.noent_okay) {
            return {
              path: current_path
            };
          }
          throw e;
        }
                                                                
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
                                                                                              
                                                                  
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return {
        path: current_path,
        node: current
      };
    }
    throw new FS.ErrnoError(32);
  },
  getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
                                                              
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
                                                         
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || (flags & (512 | 64))) {
                                                             
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  checkOpExists(op, err) {
    if (!op) {
      throw new FS.ErrnoError(err);
    }
    return op;
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
                                                         
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    setattr(arg, attr);
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
                                                     
      stream.stream_ops = device.stream_ops;
                              
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
                      
    for (var mount of mounts) {
      if (mount.type.syncfs) {
        mount.type.syncfs(mount, populate, done);
      } else {
        done(null);
      }
    }
  },
  mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, {
        follow_mount: false
      });
      mountpoint = lookup.path;
                              
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
                                    
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
                            
      node.mounted = mount;
                                                          
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
                                                                 
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    for (var [hash, current] of Object.entries(FS.nameTable)) {
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    }
                             
    node.mounted = null;
                                              
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, {
      follow: true
    }).node);
  },
  statfsStream(stream) {
                                                                           
                                                                           
                           
    return FS.statfsNode(stream.node);
  },
  statfsNode(node) {
                                                                              
                                                                            
                                                 
    var rtn = {
      bsize: 4096,
      frsize: 4096,
      blocks: 1e6,
      bfree: 5e5,
      bavail: 5e5,
      files: FS.nextInode,
      ffree: FS.nextInode - 1,
      fsid: 42,
      flags: 2,
      namelen: 255
    };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  },
  create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
                         
    var lookup, old_dir, new_dir;
                                                                
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                                        
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
                        
    var old_node = FS.lookupNode(old_dir, old_name);
                                                         
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
                                                         
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
                                         
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
                                           
    if (old_node === new_node) {
      return;
    }
                                         
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
                                                       
                                                            
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
                                                                    
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
                                           
    FS.hashRemoveNode(old_node);
                                  
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
                                                               
                    
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
                                                               
                          
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  },
  unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
                                                               
                                                              
                              
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  },
  stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  },
  fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  },
  lstat(path) {
    return FS.stat(path, true);
  },
  doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      ctime: Date.now(),
      dontFollow
    });
  },
  chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  },
  doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, {
      timestamp: Date.now(),
      dontFollow
    });
  },
  chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  },
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  },
  doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, {
      size: len,
      timestamp: Date.now()
    });
  },
  truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: true
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  },
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  },
  utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
    setattr(node, {
      atime,
      mtime
    });
  },
  open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
    if ((flags & 64)) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
                                                                       
                                                                            
                                                        
      var lookup = FS.lookupPath(path, {
        follow: !(flags & 131072),
        noent_okay: true
      });
      node = lookup.node;
      path = lookup.path;
    }
                                         
    var created = false;
    if ((flags & 64)) {
      if (node) {
                                                                              
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
                                               
                                                                           
                                                                            
                        
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
                              
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
                                                           
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
                                                                                
                                                                             
                     
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
                                 
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
                                                                         
    flags &= ~(128 | 512 | 131072);
                                              
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
                                              
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
                                                                         
      ungotten: [],
      error: false
    });
                                          
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
      }
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
                         
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
                                                      
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  mmap(stream, length, position, prot, flags) {
                                                              
                                                                  
                                                                      
                                                                       
                                                                 
                           
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  },
  writeFile(path, data, opts = {}) {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data == "string") {
      data = new Uint8Array(intArrayFromString(data, true));
    }
    if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      abort("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
                  
    FS.mkdir("/dev");
                      
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length,
      llseek: () => 0
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
                                   
                                                                 
                                               
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                           
                                                                         
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
                                                        
                                                          
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
                                                                              
                                                            
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16895, 73);
        node.stream_ops = {
          llseek: MEMFS.stream_ops.llseek
        };
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS.getStreamChecked(fd);
            var ret = {
              parent: null,
              mount: {
                mountpoint: "fake"
              },
              node_ops: {
                readlink: () => stream.path
              },
              id: fd + 1
            };
            ret.parent = ret;
                                                   
            return ret;
          },
          readdir() {
            return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
                                                       
                                                                
                                                     
                                                         
                                                            
                                                          
                    
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
                                                                    
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS
    };
  },
  init(input, output, error) {
    FS.initialized = true;
                                                                                        
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
                                                                      
                               
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
                                                              
    try {
      var lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data == "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
        data = arr;
      }
                                           
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
                                                               
                        
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
                                      
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (globalThis.XMLHttpRequest) {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
                      
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
                                                                           
                                                            
    class LazyUint8Array {
      lengthKnown=false;
      chunks=[];
                                                 
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
                      
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
                              
        if (!hasByteServing) chunkSize = datalength;
                                                       
        var doXHR = (from, to) => {
          if (from > to) abort("invalid range (" + from + ", " + to + ") or no bytes requested!");
          if (to > datalength - 1) abort("only " + datalength + " bytes available! programmer error!");
                                                                                 
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                                                                
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(                            (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
                                
          end = Math.min(end, datalength - 1);
                                                                
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
                                                                                                                                      
          chunkSize = datalength = 1;
                                                                       
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (globalThis.XMLHttpRequest) {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
                                                                             
                                                                                
                                                      
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
                                                                                          
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
                                                                                    
    var stream_ops = {};
    for (const [key, fn] of Object.entries(node.stream_ops)) {
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    }
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
                       
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
                                                
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
                                 
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
                                 
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, HEAP8, ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

   
                                                                            
                                                                                    
      
                          
                                                                              
                                                                                 
                                                                                   
                                                                                   
                                                  
                                                                                            
                       
        var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
  ptr >>>= 0;
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
};

var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
                    
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  },
  writeStat(buf, stat) {
    HEAPU32[((buf) >>> 2) >>> 0] = stat.dev;
    HEAPU32[(((buf) + (4)) >>> 2) >>> 0] = stat.mode;
    HEAPU32[(((buf) + (8)) >>> 2) >>> 0] = stat.nlink;
    HEAPU32[(((buf) + (12)) >>> 2) >>> 0] = stat.uid;
    HEAPU32[(((buf) + (16)) >>> 2) >>> 0] = stat.gid;
    HEAPU32[(((buf) + (20)) >>> 2) >>> 0] = stat.rdev;
    HEAP64[(((buf) + (24)) >>> 3) >>> 0] = BigInt(stat.size);
    HEAP32[(((buf) + (32)) >>> 2) >>> 0] = 4096;
    HEAP32[(((buf) + (36)) >>> 2) >>> 0] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    HEAP64[(((buf) + (40)) >>> 3) >>> 0] = BigInt(Math.floor(atime / 1e3));
    HEAPU32[(((buf) + (48)) >>> 2) >>> 0] = (atime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (56)) >>> 3) >>> 0] = BigInt(Math.floor(mtime / 1e3));
    HEAPU32[(((buf) + (64)) >>> 2) >>> 0] = (mtime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (72)) >>> 3) >>> 0] = BigInt(Math.floor(ctime / 1e3));
    HEAPU32[(((buf) + (80)) >>> 2) >>> 0] = (ctime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (88)) >>> 3) >>> 0] = BigInt(stat.ino);
    return 0;
  },
  writeStatFs(buf, stats) {
    HEAPU32[(((buf) + (4)) >>> 2) >>> 0] = stats.bsize;
    HEAPU32[(((buf) + (60)) >>> 2) >>> 0] = stats.bsize;
    HEAP64[(((buf) + (8)) >>> 3) >>> 0] = BigInt(stats.blocks);
    HEAP64[(((buf) + (16)) >>> 3) >>> 0] = BigInt(stats.bfree);
    HEAP64[(((buf) + (24)) >>> 3) >>> 0] = BigInt(stats.bavail);
    HEAP64[(((buf) + (32)) >>> 3) >>> 0] = BigInt(stats.files);
    HEAP64[(((buf) + (40)) >>> 3) >>> 0] = BigInt(stats.ffree);
    HEAPU32[(((buf) + (48)) >>> 2) >>> 0] = stats.fsid;
    HEAPU32[(((buf) + (64)) >>> 2) >>> 0] = stats.flags;
                
    HEAPU32[(((buf) + (56)) >>> 2) >>> 0] = stats.namelen;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
                                                                      
      return 0;
    }
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function ___syscall_fcntl64(fd, cmd, varargs) {
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

                                                       
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        stream.flags |= arg;
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
                                 
        HEAP16[(((arg) + (offset)) >>> 1) >>> 0] = 2;
        return 0;
      }

     case 13:
     case 14:
                                                                               
                                                                                
                                                                
                                                                       
      return 0;
    }
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_ioctl(fd, op, varargs) {
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
     case 21509:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21505:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcgets) {
          var termios = stream.tty.ops.ioctl_tcgets(stream);
          var argp = syscallGetVarargP();
          HEAP32[((argp) >>> 2) >>> 0] = termios.c_iflag || 0;
          HEAP32[(((argp) + (4)) >>> 2) >>> 0] = termios.c_oflag || 0;
          HEAP32[(((argp) + (8)) >>> 2) >>> 0] = termios.c_cflag || 0;
          HEAP32[(((argp) + (12)) >>> 2) >>> 0] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            HEAP8[(argp + i) + (17) >>> 0] = termios.c_cc[i] || 0;
          }
          return 0;
        }
        return 0;
      }

     case 21510:
     case 21511:
     case 21512:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = HEAP32[((argp) >>> 2) >>> 0];
          var c_oflag = HEAP32[(((argp) + (4)) >>> 2) >>> 0];
          var c_cflag = HEAP32[(((argp) + (8)) >>> 2) >>> 0];
          var c_lflag = HEAP32[(((argp) + (12)) >>> 2) >>> 0];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push(HEAP8[(argp + i) + (17) >>> 0]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        HEAP32[((argp) >>> 2) >>> 0] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     case 21537:
     case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
                                                                          
                                                                  
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          HEAP16[((argp) >>> 1) >>> 0] = winsize[0];
          HEAP16[(((argp) + (2)) >>> 1) >>> 0] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
                                                                            
                                                                              
                                                                     
        if (!stream.tty) return -59;
        return 0;
      }

     case 21515:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     default:
      return -28;
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  path >>>= 0;
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __abort_js = () => abort("");

function __gmtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
                                   
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
  HEAP32[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
                                                                                    
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var __timegm_js = function(tmPtr) {
  tmPtr >>>= 0;
  var ret = (() => {
    var time = Date.UTC(HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] + 1900, HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0], HEAP32[((tmPtr) >>> 2) >>> 0], 0);
    var date = new Date(time);
    HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
    HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
    return date.getTime() / 1e3;
  })();
  return BigInt(ret);
};

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

var __tzset_js = function(timezone, daylight, std_name, dst_name) {
  timezone >>>= 0;
  daylight >>>= 0;
  std_name >>>= 0;
  dst_name >>>= 0;
                                                                            
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
                                                                            
                                                                              
                                                                            
                                                                        
                                                                              
           
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
                                                                         
                                                                   
                                                                          
                                      
                                                                            
  HEAPU32[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
  HEAP32[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
                        
                                                                                                                        
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
                          
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var _emscripten_set_main_loop_timing = (mode, value) => {
  MainLoop.timingMode = mode;
  MainLoop.timingValue = value;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.running) {
    MainLoop.running = true;
  }
  if (mode == 0) {
    MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
      var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, timeUntilNextTick);
    };
    MainLoop.method = "timeout";
  } else if (mode == 1) {
    MainLoop.scheduler = function MainLoop_scheduler_rAF() {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
    MainLoop.method = "rAF";
  } else if (mode == 2) {
    if (!MainLoop.setImmediate) {
      if (globalThis.setImmediate) {
        MainLoop.setImmediate = setImmediate;
      } else {
                                                                                                                                                  
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
                                    var MainLoop_setImmediate_messageHandler = event => {
                                                                                                                                                                                
                                     
          if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", MainLoop_setImmediate_messageHandler, true);
        MainLoop.setImmediate =                                                     (func => {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            Module["setImmediates"] ??= [];
            Module["setImmediates"].push(func);
            postMessage({
              target: emscriptenMainLoopMessageId
            });
          } else postMessage(emscriptenMainLoopMessageId, "*");
        });
      }
    }
    MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
      MainLoop.setImmediate(MainLoop.runner);
    };
    MainLoop.method = "immediate";
  }
  return 0;
};

var _emscripten_get_now = () => performance.now();

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var _proc_exit = code => {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
};

                                         var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  _proc_exit(status);
};

var _exit = exitJS;

var handleException = e => {
                                                                              
                           
                                             
                                                                                    
                                             
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

   
                           
                                    
        var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
  MainLoop.func = iterFunc;
  MainLoop.arg = arg;
  var thisMainLoopId = MainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
      maybeExit();
      return false;
    }
    return true;
  }
                                                                        
                                                                     
                                                                        
                                                                      
                                           
  MainLoop.running = false;
  MainLoop.runner = function MainLoop_runner() {
    if (ABORT) return;
    if (MainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = MainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (MainLoop.remainingBlockers) {
        var remaining = MainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          MainLoop.remainingBlockers = next;
        } else {
                                                                
          next = next + .5;
                                                     
          MainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      MainLoop.updateStatus();
                                                              
      if (!checkIsRunning()) return;
      setTimeout(MainLoop.runner, 0);
      return;
    }
                                              
    if (!checkIsRunning()) return;
                                                 
    MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
    if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
                                                            
      MainLoop.scheduler();
      return;
    } else if (MainLoop.timingMode == 0) {
      MainLoop.tickStartTime = _emscripten_get_now();
    }
    MainLoop.runIter(iterFunc);
                                             
    if (!checkIsRunning()) return;
    MainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps > 0) {
      _emscripten_set_main_loop_timing(0, 1e3 / fps);
    } else {
                                                       
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    func();
    maybeExit();
  } catch (e) {
    handleException(e);
  }
};

var MainLoop = {
  running: false,
  scheduler: null,
  method: "",
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    MainLoop.scheduler = null;
                                                                                                     
    MainLoop.currentlyRunningMainloop++;
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var timingMode = MainLoop.timingMode;
    var timingValue = MainLoop.timingValue;
    var func = MainLoop.func;
    MainLoop.func = null;
                                                                            
    setMainLoop(func, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(timingMode, timingValue);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module["setStatus"]) {
      var message = Module["statusMessage"] || "Please wait...";
      var remaining = MainLoop.remainingBlockers ?? 0;
      var expected = MainLoop.expectedBlockers ?? 0;
      if (remaining) {
        if (remaining < expected) {
          Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
        } else {
          Module["setStatus"](message);
        }
      } else {
        Module["setStatus"]("");
      }
    }
  },
  init() {
    Module["preMainLoop"] && MainLoop.preMainLoop.push(Module["preMainLoop"]);
    Module["postMainLoop"] && MainLoop.postMainLoop.push(Module["postMainLoop"]);
  },
  runIter(func) {
    if (ABORT) return;
    for (var pre of MainLoop.preMainLoop) {
      if (pre() === false) {
        return;
      }
    }
    callUserCallback(func);
    for (var post of MainLoop.postMainLoop) {
      post();
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(func) {
                                              
    var now = Date.now();
    if (MainLoop.nextRAF === 0) {
      MainLoop.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= MainLoop.nextRAF) {
                                                                                 
        MainLoop.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(MainLoop.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame(func) {
    if (globalThis.requestAnimationFrame) {
      requestAnimationFrame(func);
    } else {
      MainLoop.fakeRequestAnimationFrame(func);
    }
  }
};

var AL = {
  QUEUE_INTERVAL: 25,
  QUEUE_LOOKAHEAD: .1,
  DEVICE_NAME: "Emscripten OpenAL",
  CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
  ALC_EXTENSIONS: {
    ALC_SOFT_pause_device: true,
    ALC_SOFT_HRTF: true
  },
  AL_EXTENSIONS: {
    AL_EXT_float32: true,
    AL_SOFT_loop_points: true,
    AL_SOFT_source_length: true,
    AL_EXT_source_distance_model: true,
    AL_SOFT_source_spatialize: true
  },
  _alcErr: 0,
  alcErr: 0,
  deviceRefCounts: {},
  alcStringCache: {},
  paused: false,
  stringCache: {},
  contexts: {},
  currentCtx: null,
  buffers: {
    0: {
      id: 0,
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0
    }
  },
  paramArray: [],
  _nextId: 1,
  newId: () => AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++,
  freeIds: [],
  scheduleContextAudio: ctx => {
                                                                                                                          
                                                                                                                       
                                                                                                          
    if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
      return;
    }
    for (var i in ctx.sources) {
      AL.scheduleSourceAudio(ctx.sources[i]);
    }
  },
  scheduleSourceAudio: (src, lookahead) => {
                                                 
    if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
      return;
    }
    if (src.state !== 4114) {
      return;
    }
    var currentTime = AL.updateSourceTime(src);
    var startTime = src.bufStartTime;
    var startOffset = src.bufOffset;
    var bufCursor = src.bufsProcessed;
                                                       
    for (var i = 0; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      startTime = audioSrc._startTime + audioSrc._duration;
      startOffset = 0;
      bufCursor += audioSrc._skipCount + 1;
    }
    if (!lookahead) {
      lookahead = AL.QUEUE_LOOKAHEAD;
    }
    var lookaheadTime = currentTime + lookahead;
    var skipCount = 0;
    while (startTime < lookaheadTime) {
      if (bufCursor >= src.bufQueue.length) {
        if (src.looping) {
          bufCursor %= src.bufQueue.length;
        } else {
          break;
        }
      }
      var buf = src.bufQueue[bufCursor % src.bufQueue.length];
                                                
      if (buf.length === 0) {
        skipCount++;
                                                                                         
        if (skipCount === src.bufQueue.length) {
          break;
        }
      } else {
        var audioSrc = src.context.audioCtx.createBufferSource();
        audioSrc.buffer = buf.audioBuf;
        audioSrc.playbackRate.value = src.playbackRate;
        if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
          audioSrc.loopStart = buf.audioBuf._loopStart;
          audioSrc.loopEnd = buf.audioBuf._loopEnd;
        }
        var duration = 0;
                                                                                            
        if (src.type === 4136 && src.looping) {
          duration = Number.POSITIVE_INFINITY;
          audioSrc.loop = true;
          if (buf.audioBuf._loopStart) {
            audioSrc.loopStart = buf.audioBuf._loopStart;
          }
          if (buf.audioBuf._loopEnd) {
            audioSrc.loopEnd = buf.audioBuf._loopEnd;
          }
        } else {
          duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
        }
        audioSrc._startOffset = startOffset;
        audioSrc._duration = duration;
        audioSrc._skipCount = skipCount;
        skipCount = 0;
        audioSrc.connect(src.gain);
        if (typeof audioSrc.start != "undefined") {
                                                                          
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.start(startTime, startOffset);
        } else if (typeof audioSrc.noteOn != "undefined") {
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.noteOn(startTime);
        }
        audioSrc._startTime = startTime;
        src.audioQueue.push(audioSrc);
        startTime += duration;
      }
      startOffset = 0;
      bufCursor++;
    }
  },
  updateSourceTime: src => {
    var currentTime = src.context.audioCtx.currentTime;
    if (src.state !== 4114) {
      return currentTime;
    }
                                                                            
                                                                             
                                                                              
                                                                              
    if (!isFinite(src.bufStartTime)) {
      src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
      src.bufOffset = 0;
    }
    var nextStartTime = 0;
    while (src.audioQueue.length) {
      var audioSrc = src.audioQueue[0];
      src.bufsProcessed += audioSrc._skipCount;
      nextStartTime = audioSrc._startTime + audioSrc._duration;
                                                                                                         
      if (currentTime < nextStartTime) {
        break;
      }
      src.audioQueue.shift();
      src.bufStartTime = nextStartTime;
      src.bufOffset = 0;
      src.bufsProcessed++;
    }
    if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
                                                                                               
      AL.setSourceState(src, 4116);
    } else if (src.type === 4136 && src.looping) {
                                                                                                       
      var buf = src.bufQueue[0];
      if (buf.length === 0) {
        src.bufOffset = 0;
      } else {
        var delta = (currentTime - src.bufStartTime) * src.playbackRate;
        var loopStart = buf.audioBuf._loopStart || 0;
        var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
        if (loopEnd <= loopStart) {
          loopEnd = buf.audioBuf.duration;
        }
        if (delta < loopEnd) {
          src.bufOffset = delta;
        } else {
          src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
        }
      }
    } else if (src.audioQueue[0]) {
                                                                                                              
                                                           
      src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
    } else {
                                                                                                         
                                                                                                             
                                                                                                           
                                                                    
      if (src.type !== 4136 && src.looping) {
                                                                                                       
                                                                                                    
        var srcDuration = AL.sourceDuration(src) / src.playbackRate;
        if (srcDuration > 0) {
          src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
        }
      }
                                                                                                 
                                                                                                    
                                     
      for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufsProcessed >= src.bufQueue.length) {
          if (src.looping) {
            src.bufsProcessed %= src.bufQueue.length;
          } else {
            AL.setSourceState(src, 4116);
            break;
          }
        }
        var buf = src.bufQueue[src.bufsProcessed];
        if (buf.length > 0) {
          nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
          if (currentTime < nextStartTime) {
            src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
            break;
          }
          src.bufStartTime = nextStartTime;
        }
        src.bufOffset = 0;
        src.bufsProcessed++;
      }
    }
    return currentTime;
  },
  cancelPendingSourceAudio: src => {
    AL.updateSourceTime(src);
    for (var i = 1; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      audioSrc.stop();
    }
    if (src.audioQueue.length > 1) {
      src.audioQueue.length = 1;
    }
  },
  stopSourceAudio: src => {
    for (var i = 0; i < src.audioQueue.length; i++) {
      src.audioQueue[i].stop();
    }
    src.audioQueue.length = 0;
  },
  setSourceState: (src, state) => {
    if (state === 4114) {
      if (src.state === 4114 || src.state == 4116) {
        src.bufsProcessed = 0;
        src.bufOffset = 0;
      } else {}
      AL.stopSourceAudio(src);
      src.state = 4114;
      src.bufStartTime = Number.NEGATIVE_INFINITY;
      AL.scheduleSourceAudio(src);
    } else if (state === 4115) {
      if (src.state === 4114) {
                                                                  
        AL.updateSourceTime(src);
        AL.stopSourceAudio(src);
        src.state = 4115;
      }
    } else if (state === 4116) {
      if (src.state !== 4113) {
        src.state = 4116;
        src.bufsProcessed = src.bufQueue.length;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    } else if (state === 4113) {
      if (src.state !== 4113) {
        src.state = 4113;
        src.bufsProcessed = 0;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    }
  },
  initSourcePanner: src => {
    if (src.type === 4144) {
      return;
    }
                                                                                 
    var templateBuf = AL.buffers[0];
    for (var i = 0; i < src.bufQueue.length; i++) {
      if (src.bufQueue[i].id !== 0) {
        templateBuf = src.bufQueue[i];
        break;
      }
    }
                                                                                                                               
    if (src.spatialize === 1 || (src.spatialize === 2 && templateBuf.channels === 1)) {
      if (src.panner) {
        return;
      }
      src.panner = src.context.audioCtx.createPanner();
      AL.updateSourceGlobal(src);
      AL.updateSourceSpace(src);
      src.panner.connect(src.context.gain);
      src.gain.disconnect();
      src.gain.connect(src.panner);
    } else {
      if (!src.panner) {
        return;
      }
      src.panner.disconnect();
      src.gain.disconnect();
      src.gain.connect(src.context.gain);
      src.panner = null;
    }
  },
  updateContextGlobal: ctx => {
    for (var i in ctx.sources) {
      AL.updateSourceGlobal(ctx.sources[i]);
    }
  },
  updateSourceGlobal: src => {
    var panner = src.panner;
    if (!panner) {
      return;
    }
    panner.refDistance = src.refDistance;
    panner.maxDistance = src.maxDistance;
    panner.rolloffFactor = src.rolloffFactor;
    panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
                                                                             
    var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
    switch (distanceModel) {
     case 0:
      panner.distanceModel = "inverse";
      panner.refDistance = 340282e33;
      break;

     case 53249:
     case 53250:
      panner.distanceModel = "inverse";
      break;

     case 53251:
     case 53252:
      panner.distanceModel = "linear";
      break;

     case 53253:
     case 53254:
      panner.distanceModel = "exponential";
      break;
    }
  },
  updateListenerSpace: ctx => {
    var listener = ctx.audioCtx.listener;
    if (listener.positionX) {
      listener.positionX.value = ctx.listener.position[0];
      listener.positionY.value = ctx.listener.position[1];
      listener.positionZ.value = ctx.listener.position[2];
    } else {
      listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2]);
    }
    if (listener.forwardX) {
      listener.forwardX.value = ctx.listener.direction[0];
      listener.forwardY.value = ctx.listener.direction[1];
      listener.forwardZ.value = ctx.listener.direction[2];
      listener.upX.value = ctx.listener.up[0];
      listener.upY.value = ctx.listener.up[1];
      listener.upZ.value = ctx.listener.up[2];
    } else {
      listener.setOrientation(ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2], ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2]);
    }
                                                       
    for (var i in ctx.sources) {
      AL.updateSourceSpace(ctx.sources[i]);
    }
  },
  updateSourceSpace: src => {
    if (!src.panner) {
      return;
    }
    var panner = src.panner;
    var posX = src.position[0];
    var posY = src.position[1];
    var posZ = src.position[2];
    var dirX = src.direction[0];
    var dirY = src.direction[1];
    var dirZ = src.direction[2];
    var listener = src.context.listener;
    var lPosX = listener.position[0];
    var lPosY = listener.position[1];
    var lPosZ = listener.position[2];
                                                                                                   
                                                                                                   
                                                                                                        
                                                                                                      
                                                                                                 
                                                                                                        
                                                                        
                                                                                                         
                                                                                                 
                                                                                                         
                                                                                                            
                                        
    if (src.relative) {
                                                           
      var lBackX = -listener.direction[0];
      var lBackY = -listener.direction[1];
      var lBackZ = -listener.direction[2];
      var lUpX = listener.up[0];
      var lUpY = listener.up[1];
      var lUpZ = listener.up[2];
      var inverseMagnitude = (x, y, z) => {
        var length = Math.sqrt(x * x + y * y + z * z);
        if (length < Number.EPSILON) {
          return 0;
        }
        return 1 / length;
      };
                                  
      var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
      lBackX *= invMag;
      lBackY *= invMag;
      lBackZ *= invMag;
                             
      invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
      lUpX *= invMag;
      lUpY *= invMag;
      lUpZ *= invMag;
                                                                                   
      var lRightX = (lUpY * lBackZ - lUpZ * lBackY);
      var lRightY = (lUpZ * lBackX - lUpX * lBackZ);
      var lRightZ = (lUpX * lBackY - lUpY * lBackX);
                                                                                                      
      invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
      lRightX *= invMag;
      lRightY *= invMag;
      lRightZ *= invMag;
                                                                                                          
      lUpX = (lBackY * lRightZ - lBackZ * lRightY);
      lUpY = (lBackZ * lRightX - lBackX * lRightZ);
      lUpZ = (lBackX * lRightY - lBackY * lRightX);
      var oldX = dirX;
      var oldY = dirY;
      var oldZ = dirZ;
                                                                                    
      dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
      oldX = posX;
      oldY = posY;
      oldZ = posZ;
                                      
      posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
                                                                                            
                                                                          
      posX += lPosX;
      posY += lPosY;
      posZ += lPosZ;
    }
    if (panner.positionX) {
                                                                                          
                                                                       
      if (posX != panner.positionX.value) panner.positionX.value = posX;
      if (posY != panner.positionY.value) panner.positionY.value = posY;
      if (posZ != panner.positionZ.value) panner.positionZ.value = posZ;
    } else {
      panner.setPosition(posX, posY, posZ);
    }
    if (panner.orientationX) {
                                                                                            
                                                                       
      if (dirX != panner.orientationX.value) panner.orientationX.value = dirX;
      if (dirY != panner.orientationY.value) panner.orientationY.value = dirY;
      if (dirZ != panner.orientationZ.value) panner.orientationZ.value = dirZ;
    } else {
      panner.setOrientation(dirX, dirY, dirZ);
    }
    var oldShift = src.dopplerShift;
    var velX = src.velocity[0];
    var velY = src.velocity[1];
    var velZ = src.velocity[2];
    var lVelX = listener.velocity[0];
    var lVelY = listener.velocity[1];
    var lVelZ = listener.velocity[2];
    if (posX === lPosX && posY === lPosY && posZ === lPosZ || velX === lVelX && velY === lVelY && velZ === lVelZ) {
      src.dopplerShift = 1;
    } else {
                                        
      var speedOfSound = src.context.speedOfSound;
      var dopplerFactor = src.context.dopplerFactor;
      var slX = lPosX - posX;
      var slY = lPosY - posY;
      var slZ = lPosZ - posZ;
      var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
      var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
      var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
      vls = Math.min(vls, speedOfSound / dopplerFactor);
      vss = Math.min(vss, speedOfSound / dopplerFactor);
      src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
    }
    if (src.dopplerShift !== oldShift) {
      AL.updateSourceRate(src);
    }
  },
  updateSourceRate: src => {
    if (src.state === 4114) {
                                
      AL.cancelPendingSourceAudio(src);
      var audioSrc = src.audioQueue[0];
      if (!audioSrc) {
        return;
      }
      var duration;
      if (src.type === 4136 && src.looping) {
        duration = Number.POSITIVE_INFINITY;
      } else {
                                                                                                                
                                                                   
        duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
      }
      audioSrc._duration = duration;
      audioSrc.playbackRate.value = src.playbackRate;
                                                     
      AL.scheduleSourceAudio(src);
    }
  },
  sourceDuration: src => {
    var length = 0;
    for (var i = 0; i < src.bufQueue.length; i++) {
      var audioBuf = src.bufQueue[i].audioBuf;
      length += audioBuf ? audioBuf.duration : 0;
    }
    return length;
  },
  sourceTell: src => {
    AL.updateSourceTime(src);
    var offset = 0;
    for (var i = 0; i < src.bufsProcessed; i++) {
      if (src.bufQueue[i].audioBuf) {
        offset += src.bufQueue[i].audioBuf.duration;
      }
    }
    offset += src.bufOffset;
    return offset;
  },
  sourceSeek: (src, offset) => {
    var playing = src.state == 4114;
    if (playing) {
      AL.setSourceState(src, 4113);
    }
    if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
      src.bufsProcessed = 0;
      while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
        offset -= src.bufQueue[src.bufsProcessed].audioBuf.duration;
        src.bufsProcessed++;
      }
      src.bufOffset = offset;
    }
    if (playing) {
      AL.setSourceState(src, 4114);
    }
  },
  getGlobalParam: (funcname, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
     case 49152:
      return AL.currentCtx.dopplerFactor;

     case 49155:
      return AL.currentCtx.speedOfSound;

     case 53248:
      return AL.currentCtx.distanceModel;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setGlobalParam: (funcname, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    switch (param) {
     case 49152:
      if (!Number.isFinite(value) || value < 0) {
                                                  
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.dopplerFactor = value;
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 49155:
      if (!Number.isFinite(value) || value <= 0) {
                                                 
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.speedOfSound = value;
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 53248:
      switch (value) {
       case 0:
       case 53249:
       case 53250:
       case 53251:
       case 53252:
       case 53253:
       case 53254:
        AL.currentCtx.distanceModel = value;
        AL.updateContextGlobal(AL.currentCtx);
        break;

       default:
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getListenerParam: (funcname, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
     case 4100:
      return AL.currentCtx.listener.position;

     case 4102:
      return AL.currentCtx.listener.velocity;

     case 4111:
      return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);

     case 4106:
      return AL.currentCtx.gain.gain.value;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setListenerParam: (funcname, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    var listener = AL.currentCtx.listener;
    switch (param) {
     case 4100:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.position[0] = value[0];
      listener.position[1] = value[1];
      listener.position[2] = value[2];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 4102:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.velocity[0] = value[0];
      listener.velocity[1] = value[1];
      listener.velocity[2] = value[2];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 4106:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.gain.gain.value = value;
      break;

     case 4111:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2]) || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.direction[0] = value[0];
      listener.direction[1] = value[1];
      listener.direction[2] = value[2];
      listener.up[0] = value[3];
      listener.up[1] = value[4];
      listener.up[2] = value[5];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getBufferParam: (funcname, bufferId, param) => {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    switch (param) {
     case 8193:
      return buf.frequency;

     case 8194:
      return buf.bytesPerSample * 8;

     case 8195:
      return buf.channels;

     case 8196:
      return buf.length * buf.bytesPerSample * buf.channels;

     case 8213:
      if (buf.length === 0) {
        return [ 0, 0 ];
      }
      return [ (buf.audioBuf._loopStart || 0) * buf.frequency, (buf.audioBuf._loopEnd || buf.length) * buf.frequency ];

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setBufferParam: (funcname, bufferId, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
     case 8196:
      if (value !== 0) {
        AL.currentCtx.err = 40963;
        return;
      }
                                                           
      break;

     case 8213:
      if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
        AL.currentCtx.err = 40963;
        return;
      }
      if (buf.refCount > 0) {
        AL.currentCtx.err = 40964;
        return;
      }
      if (buf.audioBuf) {
        buf.audioBuf._loopStart = value[0] / buf.frequency;
        buf.audioBuf._loopEnd = value[1] / buf.frequency;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getSourceParam: (funcname, sourceId, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return null;
    }
    switch (param) {
     case 514:
      return src.relative;

     case 4097:
      return src.coneInnerAngle;

     case 4098:
      return src.coneOuterAngle;

     case 4099:
      return src.pitch;

     case 4100:
      return src.position;

     case 4101:
      return src.direction;

     case 4102:
      return src.velocity;

     case 4103:
      return src.looping;

     case 4105:
      if (src.type === 4136) {
        return src.bufQueue[0].id;
      }
      return 0;

     case 4106:
      return src.gain.gain.value;

     case 4109:
      return src.minGain;

     case 4110:
      return src.maxGain;

     case 4112:
      return src.state;

     case 4117:
      if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
        return 0;
      }
      return src.bufQueue.length;

     case 4118:
      if ((src.bufQueue.length === 1 && src.bufQueue[0].id === 0) || src.looping) {
        return 0;
      }
      return src.bufsProcessed;

     case 4128:
      return src.refDistance;

     case 4129:
      return src.rolloffFactor;

     case 4130:
      return src.coneOuterGain;

     case 4131:
      return src.maxDistance;

     case 4132:
      return AL.sourceTell(src);

     case 4133:
      var offset = AL.sourceTell(src);
      if (offset > 0) {
        offset *= src.bufQueue[0].frequency;
      }
      return offset;

     case 4134:
      var offset = AL.sourceTell(src);
      if (offset > 0) {
        offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
      }
      return offset;

     case 4135:
      return src.type;

     case 4628:
      return src.spatialize;

     case 8201:
      var length = 0;
      var bytesPerFrame = 0;
      for (var i = 0; i < src.bufQueue.length; i++) {
        length += src.bufQueue[i].length;
        if (src.bufQueue[i].id !== 0) {
          bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
        }
      }
      return length * bytesPerFrame;

     case 8202:
      var length = 0;
      for (var i = 0; i < src.bufQueue.length; i++) {
        length += src.bufQueue[i].length;
      }
      return length;

     case 8203:
      return AL.sourceDuration(src);

     case 53248:
      return src.distanceModel;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setSourceParam: (funcname, sourceId, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
     case 514:
      if (value === 1) {
        src.relative = true;
        AL.updateSourceSpace(src);
      } else if (value === 0) {
        src.relative = false;
        AL.updateSourceSpace(src);
      } else {
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     case 4097:
      if (!Number.isFinite(value)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneInnerAngle = value;
      if (src.panner) {
        src.panner.coneInnerAngle = value % 360;
      }
      break;

     case 4098:
      if (!Number.isFinite(value)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneOuterAngle = value;
      if (src.panner) {
        src.panner.coneOuterAngle = value % 360;
      }
      break;

     case 4099:
      if (!Number.isFinite(value) || value <= 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      if (src.pitch === value) {
        break;
      }
      src.pitch = value;
      AL.updateSourceRate(src);
      break;

     case 4100:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.position[0] = value[0];
      src.position[1] = value[1];
      src.position[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4101:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.direction[0] = value[0];
      src.direction[1] = value[1];
      src.direction[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4102:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.velocity[0] = value[0];
      src.velocity[1] = value[1];
      src.velocity[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4103:
      if (value === 1) {
        src.looping = true;
        AL.updateSourceTime(src);
        if (src.type === 4136 && src.audioQueue.length > 0) {
          var audioSrc = src.audioQueue[0];
          audioSrc.loop = true;
          audioSrc._duration = Number.POSITIVE_INFINITY;
        }
      } else if (value === 0) {
        src.looping = false;
        var currentTime = AL.updateSourceTime(src);
        if (src.type === 4136 && src.audioQueue.length > 0) {
          var audioSrc = src.audioQueue[0];
          audioSrc.loop = false;
          audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
          audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
        }
      } else {
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     case 4105:
      if (src.state === 4114 || src.state === 4115) {
        AL.currentCtx.err = 40964;
        return;
      }
      if (value === 0) {
        for (var i in src.bufQueue) {
          src.bufQueue[i].refCount--;
        }
        src.bufQueue.length = 1;
        src.bufQueue[0] = AL.buffers[0];
        src.bufsProcessed = 0;
        src.type = 4144;
      } else {
        var buf = AL.buffers[value];
        if (!buf) {
          AL.currentCtx.err = 40963;
          return;
        }
        for (var i in src.bufQueue) {
          src.bufQueue[i].refCount--;
        }
        src.bufQueue.length = 0;
        buf.refCount++;
        src.bufQueue = [ buf ];
        src.bufsProcessed = 0;
        src.type = 4136;
      }
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
      break;

     case 4106:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.gain.gain.value = value;
      break;

     case 4109:
      if (!Number.isFinite(value) || value < 0 || value > Math.min(src.maxGain, 1)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.minGain = value;
      break;

     case 4110:
      if (!Number.isFinite(value) || value < Math.max(0, src.minGain) || value > 1) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.maxGain = value;
      break;

     case 4128:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.refDistance = value;
      if (src.panner) {
        src.panner.refDistance = value;
      }
      break;

     case 4129:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.rolloffFactor = value;
      if (src.panner) {
        src.panner.rolloffFactor = value;
      }
      break;

     case 4130:
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneOuterGain = value;
      if (src.panner) {
        src.panner.coneOuterGain = value;
      }
      break;

     case 4131:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.maxDistance = value;
      if (src.panner) {
        src.panner.maxDistance = value;
      }
      break;

     case 4132:
      if (value < 0 || value > AL.sourceDuration(src)) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4133:
      var srcLen = AL.sourceDuration(src);
      if (srcLen > 0) {
        var frequency;
        for (var bufId in src.bufQueue) {
          if (bufId) {
            frequency = src.bufQueue[bufId].frequency;
            break;
          }
        }
        value /= frequency;
      }
      if (value < 0 || value > srcLen) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4134:
      var srcLen = AL.sourceDuration(src);
      if (srcLen > 0) {
        var bytesPerSec;
        for (var bufId in src.bufQueue) {
          if (bufId) {
            var buf = src.bufQueue[bufId];
            bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
            break;
          }
        }
        value /= bytesPerSec;
      }
      if (value < 0 || value > srcLen) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4628:
      if (value !== 0 && value !== 1 && value !== 2) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.spatialize = value;
      AL.initSourcePanner(src);
      break;

     case 8201:
     case 8202:
     case 8203:
      AL.currentCtx.err = 40964;
      break;

     case 53248:
      switch (value) {
       case 0:
       case 53249:
       case 53250:
       case 53251:
       case 53252:
       case 53253:
       case 53254:
        src.distanceModel = value;
        if (AL.currentCtx.sourceDistanceModel) {
          AL.updateContextGlobal(AL.currentCtx);
        }
        break;

       default:
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  captures: {},
  sharedCaptureAudioCtx: null,
  requireValidCaptureDevice: (deviceId, funcname) => {
    if (deviceId === 0) {
      AL.alcErr = 40961;
      return null;
    }
    var c = AL.captures[deviceId];
    if (!c) {
      AL.alcErr = 40961;
      return null;
    }
    var err = c.mediaStreamError;
    if (err) {
      AL.alcErr = 40961;
      return null;
    }
    return c;
  }
};

function _alBufferData(bufferId, format, pData, size, freq) {
  pData >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  var buf = AL.buffers[bufferId];
  if (!buf) {
    AL.currentCtx.err = 40963;
    return;
  }
  if (freq <= 0) {
    AL.currentCtx.err = 40963;
    return;
  }
  var audioBuf = null;
  try {
    switch (format) {
     case 4352:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
        var channel0 = audioBuf.getChannelData(0);
        for (var i = 0; i < size; ++i) {
          channel0[i] = HEAPU8[pData++ >>> 0] * .0078125 - 1;
        }
      }
      buf.bytesPerSample = 1;
      buf.channels = 1;
      buf.length = size;
      break;

     case 4353:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
        var channel0 = audioBuf.getChannelData(0);
        pData >>= 1;
        for (var i = 0; i < size >> 1; ++i) {
          channel0[i] = HEAP16[pData++ >>> 0] * 30517578125e-15;
        }
      }
      buf.bytesPerSample = 2;
      buf.channels = 1;
      buf.length = size >> 1;
      break;

     case 4354:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
        var channel0 = audioBuf.getChannelData(0);
        var channel1 = audioBuf.getChannelData(1);
        for (var i = 0; i < size >> 1; ++i) {
          channel0[i] = HEAPU8[pData++ >>> 0] * .0078125 - 1;
          channel1[i] = HEAPU8[pData++ >>> 0] * .0078125 - 1;
        }
      }
      buf.bytesPerSample = 1;
      buf.channels = 2;
      buf.length = size >> 1;
      break;

     case 4355:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
        var channel0 = audioBuf.getChannelData(0);
        var channel1 = audioBuf.getChannelData(1);
        pData >>= 1;
        for (var i = 0; i < size >> 2; ++i) {
          channel0[i] = HEAP16[pData++ >>> 0] * 30517578125e-15;
          channel1[i] = HEAP16[pData++ >>> 0] * 30517578125e-15;
        }
      }
      buf.bytesPerSample = 2;
      buf.channels = 2;
      buf.length = size >> 2;
      break;

     case 65552:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
        var channel0 = audioBuf.getChannelData(0);
        pData >>= 2;
        for (var i = 0; i < size >> 2; ++i) {
          channel0[i] = HEAPF32[pData++ >>> 0];
        }
      }
      buf.bytesPerSample = 4;
      buf.channels = 1;
      buf.length = size >> 2;
      break;

     case 65553:
      if (size > 0) {
        audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
        var channel0 = audioBuf.getChannelData(0);
        var channel1 = audioBuf.getChannelData(1);
        pData >>= 2;
        for (var i = 0; i < size >> 3; ++i) {
          channel0[i] = HEAPF32[pData++ >>> 0];
          channel1[i] = HEAPF32[pData++ >>> 0];
        }
      }
      buf.bytesPerSample = 4;
      buf.channels = 2;
      buf.length = size >> 3;
      break;

     default:
      AL.currentCtx.err = 40963;
      return;
    }
    buf.frequency = freq;
    buf.audioBuf = audioBuf;
  } catch (e) {
    AL.currentCtx.err = 40963;
    return;
  }
}

function _alDeleteBuffers(count, pBufferIds) {
  pBufferIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0];
                                                             
    if (bufId === 0) {
      continue;
    }
                                           
    if (!AL.buffers[bufId]) {
      AL.currentCtx.err = 40961;
      return;
    }
                                                
    if (AL.buffers[bufId].refCount) {
      AL.currentCtx.err = 40964;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0];
    if (bufId === 0) {
      continue;
    }
    AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
    delete AL.buffers[bufId];
    AL.freeIds.push(bufId);
  }
}

var _alSourcei = (sourceId, param, value) => {
  switch (param) {
   case 514:
   case 4097:
   case 4098:
   case 4103:
   case 4105:
   case 4128:
   case 4129:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 4628:
   case 8201:
   case 8202:
   case 53248:
    AL.setSourceParam("alSourcei", sourceId, param, value);
    break;

   default:
    AL.setSourceParam("alSourcei", sourceId, param, null);
    break;
  }
};

function _alDeleteSources(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    if (!AL.currentCtx.sources[srcId]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
    _alSourcei(srcId, 4105, 0);
    delete AL.currentCtx.sources[srcId];
    AL.freeIds.push(srcId);
  }
}

var _alDisable = param => {
  if (!AL.currentCtx) {
    return;
  }
  switch (param) {
   case 512:
    AL.currentCtx.sourceDistanceModel = false;
    AL.updateContextGlobal(AL.currentCtx);
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
};

var _alDistanceModel = model => {
  AL.setGlobalParam("alDistanceModel", 53248, model);
};

var _alDopplerFactor = value => {
  AL.setGlobalParam("alDopplerFactor", 49152, value);
};

var _alDopplerVelocity = value => {
  warnOnce("alDopplerVelocity() is deprecated, and only kept for compatibility with OpenAL 1.0. Use alSpeedOfSound() instead.");
  if (!AL.currentCtx) {
    return;
  }
  if (value <= 0) {
                                             
    AL.currentCtx.err = 40963;
    return;
  }
};

var _alEnable = param => {
  if (!AL.currentCtx) {
    return;
  }
  switch (param) {
   case 512:
    AL.currentCtx.sourceDistanceModel = true;
    AL.updateContextGlobal(AL.currentCtx);
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
};

function _alGenBuffers(count, pBufferIds) {
  pBufferIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var buf = {
      deviceId: AL.currentCtx.deviceId,
      id: AL.newId(),
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0
    };
    AL.deviceRefCounts[buf.deviceId]++;
    AL.buffers[buf.id] = buf;
    HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0] = buf.id;
  }
}

function _alGenSources(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var gain = AL.currentCtx.audioCtx.createGain();
    gain.connect(AL.currentCtx.gain);
    var src = {
      context: AL.currentCtx,
      id: AL.newId(),
      type: 4144,
      state: 4113,
      bufQueue: [ AL.buffers[0] ],
      audioQueue: [],
      looping: false,
      pitch: 1,
      dopplerShift: 1,
      gain,
      minGain: 0,
      maxGain: 1,
      panner: null,
      bufsProcessed: 0,
      bufStartTime: Number.NEGATIVE_INFINITY,
      bufOffset: 0,
      relative: false,
      refDistance: 1,
      maxDistance: 340282e33,
      rolloffFactor: 1,
      position: [ 0, 0, 0 ],
      velocity: [ 0, 0, 0 ],
      direction: [ 0, 0, 0 ],
      coneOuterGain: 0,
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      distanceModel: 53250,
      spatialize: 2,
      get playbackRate() {
        return this.pitch * this.dopplerShift;
      }
    };
    AL.currentCtx.sources[src.id] = src;
    HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0] = src.id;
  }
}

var _alGetBoolean = param => {
  var val = AL.getGlobalParam("alGetBoolean", param);
  if (val === null) {
    return 0;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    return val !== 0 ? 1 : 0;

   default:
    AL.currentCtx.err = 40962;
    return 0;
  }
};

function _alGetBooleanv(param, pValues) {
  pValues >>>= 0;
  var val = AL.getGlobalParam("alGetBooleanv", param);
                                                                                  
  if (val === null || !pValues) {
    return;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    HEAP8[pValues >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetBufferf(bufferId, param, pValue) {
  pValue >>>= 0;
  var val = AL.getBufferParam("alGetBufferf", bufferId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  AL.currentCtx.err = 40962;
}

function _alGetBufferi(bufferId, param, pValue) {
  pValue >>>= 0;
  var val = AL.getBufferParam("alGetBufferi", bufferId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 8193:
   case 8194:
   case 8195:
   case 8196:
    HEAP32[((pValue) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

var _alGetDouble = param => {
  var val = AL.getGlobalParam("alGetDouble", param);
  if (val === null) {
    return 0;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    return val;

   default:
    AL.currentCtx.err = 40962;
    return 0;
  }
};

function _alGetDoublev(param, pValues) {
  pValues >>>= 0;
  var val = AL.getGlobalParam("alGetDoublev", param);
                                                                                  
  if (val === null || !pValues) {
    return;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    HEAPF64[((pValues) >>> 3) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetEnumValue(pEnumName) {
  pEnumName >>>= 0;
  if (!AL.currentCtx) {
    return 0;
  }
  if (!pEnumName) {
    AL.currentCtx.err = 40963;
    return 0;
  }
  var name = UTF8ToString(pEnumName);
  switch (name) {
                                                                     
                                       
                                                                      
                            
                                                                 
    case "AL_BITS":
    return 8194;

   case "AL_BUFFER":
    return 4105;

   case "AL_BUFFERS_PROCESSED":
    return 4118;

   case "AL_BUFFERS_QUEUED":
    return 4117;

   case "AL_BYTE_OFFSET":
    return 4134;

   case "AL_CHANNELS":
    return 8195;

   case "AL_CONE_INNER_ANGLE":
    return 4097;

   case "AL_CONE_OUTER_ANGLE":
    return 4098;

   case "AL_CONE_OUTER_GAIN":
    return 4130;

   case "AL_DIRECTION":
    return 4101;

   case "AL_DISTANCE_MODEL":
    return 53248;

   case "AL_DOPPLER_FACTOR":
    return 49152;

   case "AL_DOPPLER_VELOCITY":
    return 49153;

   case "AL_EXPONENT_DISTANCE":
    return 53253;

   case "AL_EXPONENT_DISTANCE_CLAMPED":
    return 53254;

   case "AL_EXTENSIONS":
    return 45060;

   case "AL_FORMAT_MONO16":
    return 4353;

   case "AL_FORMAT_MONO8":
    return 4352;

   case "AL_FORMAT_STEREO16":
    return 4355;

   case "AL_FORMAT_STEREO8":
    return 4354;

   case "AL_FREQUENCY":
    return 8193;

   case "AL_GAIN":
    return 4106;

   case "AL_INITIAL":
    return 4113;

   case "AL_INVALID":
    return -1;

   case "AL_ILLEGAL_ENUM":
                 
    case "AL_INVALID_ENUM":
    return 40962;

   case "AL_INVALID_NAME":
    return 40961;

   case "AL_ILLEGAL_COMMAND":
                 
    case "AL_INVALID_OPERATION":
    return 40964;

   case "AL_INVALID_VALUE":
    return 40963;

   case "AL_INVERSE_DISTANCE":
    return 53249;

   case "AL_INVERSE_DISTANCE_CLAMPED":
    return 53250;

   case "AL_LINEAR_DISTANCE":
    return 53251;

   case "AL_LINEAR_DISTANCE_CLAMPED":
    return 53252;

   case "AL_LOOPING":
    return 4103;

   case "AL_MAX_DISTANCE":
    return 4131;

   case "AL_MAX_GAIN":
    return 4110;

   case "AL_MIN_GAIN":
    return 4109;

   case "AL_NONE":
    return 0;

   case "AL_NO_ERROR":
    return 0;

   case "AL_ORIENTATION":
    return 4111;

   case "AL_OUT_OF_MEMORY":
    return 40965;

   case "AL_PAUSED":
    return 4115;

   case "AL_PENDING":
    return 8209;

   case "AL_PITCH":
    return 4099;

   case "AL_PLAYING":
    return 4114;

   case "AL_POSITION":
    return 4100;

   case "AL_PROCESSED":
    return 8210;

   case "AL_REFERENCE_DISTANCE":
    return 4128;

   case "AL_RENDERER":
    return 45059;

   case "AL_ROLLOFF_FACTOR":
    return 4129;

   case "AL_SAMPLE_OFFSET":
    return 4133;

   case "AL_SEC_OFFSET":
    return 4132;

   case "AL_SIZE":
    return 8196;

   case "AL_SOURCE_RELATIVE":
    return 514;

   case "AL_SOURCE_STATE":
    return 4112;

   case "AL_SOURCE_TYPE":
    return 4135;

   case "AL_SPEED_OF_SOUND":
    return 49155;

   case "AL_STATIC":
    return 4136;

   case "AL_STOPPED":
    return 4116;

   case "AL_STREAMING":
    return 4137;

   case "AL_UNDETERMINED":
    return 4144;

   case "AL_UNUSED":
    return 8208;

   case "AL_VELOCITY":
    return 4102;

   case "AL_VENDOR":
    return 45057;

   case "AL_VERSION":
    return 45058;

                    case "AL_AUTO_SOFT":
    return 2;

   case "AL_SOURCE_DISTANCE_MODEL":
    return 512;

   case "AL_SOURCE_SPATIALIZE_SOFT":
    return 4628;

   case "AL_LOOP_POINTS_SOFT":
    return 8213;

   case "AL_BYTE_LENGTH_SOFT":
    return 8201;

   case "AL_SAMPLE_LENGTH_SOFT":
    return 8202;

   case "AL_SEC_LENGTH_SOFT":
    return 8203;

   case "AL_FORMAT_MONO_FLOAT32":
    return 65552;

   case "AL_FORMAT_STEREO_FLOAT32":
    return 65553;

   default:
    AL.currentCtx.err = 40963;
    return 0;
  }
}

var _alGetError = () => {
  if (!AL.currentCtx) {
    return 40964;
  }
                        
  var err = AL.currentCtx.err;
  AL.currentCtx.err = 0;
  return err;
};

var _alGetFloat = param => {
  var val = AL.getGlobalParam("alGetFloat", param);
  if (val === null) {
    return 0;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    return val;

   default:
    return 0;
  }
};

function _alGetFloatv(param, pValues) {
  pValues >>>= 0;
  var val = AL.getGlobalParam("alGetFloatv", param);
                                                                                  
  if (val === null || !pValues) {
    return;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    HEAPF32[((pValues) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

var _alGetInteger = param => {
  var val = AL.getGlobalParam("alGetInteger", param);
  if (val === null) {
    return 0;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    return val;

   default:
    AL.currentCtx.err = 40962;
    return 0;
  }
};

function _alGetIntegerv(param, pValues) {
  pValues >>>= 0;
  var val = AL.getGlobalParam("alGetIntegerv", param);
                                                                                  
  if (val === null || !pValues) {
    return;
  }
  switch (param) {
   case 49152:
   case 49155:
   case 53248:
    HEAP32[((pValues) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetListener3f(param, pValue0, pValue1, pValue2) {
  pValue0 >>>= 0;
  pValue1 >>>= 0;
  pValue2 >>>= 0;
  var val = AL.getListenerParam("alGetListener3f", param);
  if (val === null) {
    return;
  }
  if (!pValue0 || !pValue1 || !pValue2) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4100:
   case 4102:
    HEAPF32[((pValue0) >>> 2) >>> 0] = val[0];
    HEAPF32[((pValue1) >>> 2) >>> 0] = val[1];
    HEAPF32[((pValue2) >>> 2) >>> 0] = val[2];
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetListenerf(param, pValue) {
  pValue >>>= 0;
  var val = AL.getListenerParam("alGetListenerf", param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4106:
    HEAPF32[((pValue) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetListenerfv(param, pValues) {
  pValues >>>= 0;
  var val = AL.getListenerParam("alGetListenerfv", param);
  if (val === null) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4100:
   case 4102:
    HEAPF32[((pValues) >>> 2) >>> 0] = val[0];
    HEAPF32[(((pValues) + (4)) >>> 2) >>> 0] = val[1];
    HEAPF32[(((pValues) + (8)) >>> 2) >>> 0] = val[2];
    break;

   case 4111:
    HEAPF32[((pValues) >>> 2) >>> 0] = val[0];
    HEAPF32[(((pValues) + (4)) >>> 2) >>> 0] = val[1];
    HEAPF32[(((pValues) + (8)) >>> 2) >>> 0] = val[2];
    HEAPF32[(((pValues) + (12)) >>> 2) >>> 0] = val[3];
    HEAPF32[(((pValues) + (16)) >>> 2) >>> 0] = val[4];
    HEAPF32[(((pValues) + (20)) >>> 2) >>> 0] = val[5];
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetListeneri(param, pValue) {
  pValue >>>= 0;
  var val = AL.getListenerParam("alGetListeneri", param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  AL.currentCtx.err = 40962;
}

function _alGetSourcef(sourceId, param, pValue) {
  pValue >>>= 0;
  var val = AL.getSourceParam("alGetSourcef", sourceId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4097:
   case 4098:
   case 4099:
   case 4106:
   case 4109:
   case 4110:
   case 4128:
   case 4129:
   case 4130:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 8203:
    HEAPF32[((pValue) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetSourcefv(sourceId, param, pValues) {
  pValues >>>= 0;
  var val = AL.getSourceParam("alGetSourcefv", sourceId, param);
  if (val === null) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4097:
   case 4098:
   case 4099:
   case 4106:
   case 4109:
   case 4110:
   case 4128:
   case 4129:
   case 4130:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 8203:
    HEAPF32[((pValues) >>> 2) >>> 0] = val[0];
    break;

   case 4100:
   case 4101:
   case 4102:
    HEAPF32[((pValues) >>> 2) >>> 0] = val[0];
    HEAPF32[(((pValues) + (4)) >>> 2) >>> 0] = val[1];
    HEAPF32[(((pValues) + (8)) >>> 2) >>> 0] = val[2];
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alGetSourcei(sourceId, param, pValue) {
  pValue >>>= 0;
  var val = AL.getSourceParam("alGetSourcei", sourceId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 514:
   case 4097:
   case 4098:
   case 4103:
   case 4105:
   case 4112:
   case 4117:
   case 4118:
   case 4128:
   case 4129:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 4135:
   case 4628:
   case 8201:
   case 8202:
   case 53248:
    HEAP32[((pValue) >>> 2) >>> 0] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

function _alGetString(param) {
  if (AL.stringCache[param]) {
    return AL.stringCache[param];
  }
  var ret;
  switch (param) {
   case 0:
    ret = "No Error";
    break;

   case 40961:
    ret = "Invalid Name";
    break;

   case 40962:
    ret = "Invalid Enum";
    break;

   case 40963:
    ret = "Invalid Value";
    break;

   case 40964:
    ret = "Invalid Operation";
    break;

   case 40965:
    ret = "Out of Memory";
    break;

   case 45057:
    ret = "Emscripten";
    break;

   case 45058:
    ret = "1.1";
    break;

   case 45059:
    ret = "WebAudio";
    break;

   case 45060:
    ret = Object.keys(AL.AL_EXTENSIONS).join(" ");
    break;

   default:
    if (AL.currentCtx) {
      AL.currentCtx.err = 40962;
    } else {}
    return 0;
  }
  ret = stringToNewUTF8(ret);
  AL.stringCache[param] = ret;
  return ret;
}

var _alIsBuffer = bufferId => {
  if (!AL.currentCtx) {
    return false;
  }
  if (bufferId > AL.buffers.length) {
    return false;
  }
  if (!AL.buffers[bufferId]) {
    return false;
  }
  return true;
};

var _alIsEnabled = param => {
  if (!AL.currentCtx) {
    return 0;
  }
  switch (param) {
   case 512:
    return AL.currentCtx.sourceDistanceModel ? 0 : 1;

   default:
    AL.currentCtx.err = 40962;
    return 0;
  }
};

var _alIsSource = sourceId => {
  if (!AL.currentCtx) {
    return false;
  }
  if (!AL.currentCtx.sources[sourceId]) {
    return false;
  }
  return true;
};

var _alListener3f = (param, value0, value1, value2) => {
  switch (param) {
   case 4100:
   case 4102:
    AL.paramArray[0] = value0;
    AL.paramArray[1] = value1;
    AL.paramArray[2] = value2;
    AL.setListenerParam("alListener3f", param, AL.paramArray);
    break;

   default:
    AL.setListenerParam("alListener3f", param, null);
    break;
  }
};

var _alListenerf = (param, value) => {
  switch (param) {
   case 4106:
    AL.setListenerParam("alListenerf", param, value);
    break;

   default:
    AL.setListenerParam("alListenerf", param, null);
    break;
  }
};

function _alListenerfv(param, pValues) {
  pValues >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4100:
   case 4102:
    AL.paramArray[0] = HEAPF32[((pValues) >>> 2) >>> 0];
    AL.paramArray[1] = HEAPF32[(((pValues) + (4)) >>> 2) >>> 0];
    AL.paramArray[2] = HEAPF32[(((pValues) + (8)) >>> 2) >>> 0];
    AL.setListenerParam("alListenerfv", param, AL.paramArray);
    break;

   case 4111:
    AL.paramArray[0] = HEAPF32[((pValues) >>> 2) >>> 0];
    AL.paramArray[1] = HEAPF32[(((pValues) + (4)) >>> 2) >>> 0];
    AL.paramArray[2] = HEAPF32[(((pValues) + (8)) >>> 2) >>> 0];
    AL.paramArray[3] = HEAPF32[(((pValues) + (12)) >>> 2) >>> 0];
    AL.paramArray[4] = HEAPF32[(((pValues) + (16)) >>> 2) >>> 0];
    AL.paramArray[5] = HEAPF32[(((pValues) + (20)) >>> 2) >>> 0];
    AL.setListenerParam("alListenerfv", param, AL.paramArray);
    break;

   default:
    AL.setListenerParam("alListenerfv", param, null);
    break;
  }
}

var _alListeneri = (param, value) => {
  AL.setListenerParam("alListeneri", param, null);
};

var _alSource3f = (sourceId, param, value0, value1, value2) => {
  switch (param) {
   case 4100:
   case 4101:
   case 4102:
    AL.paramArray[0] = value0;
    AL.paramArray[1] = value1;
    AL.paramArray[2] = value2;
    AL.setSourceParam("alSource3f", sourceId, param, AL.paramArray);
    break;

   default:
    AL.setSourceParam("alSource3f", sourceId, param, null);
    break;
  }
};

var _alSourcePause = sourceId => {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4115);
};

function _alSourcePausev(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pSourceIds) {
    AL.currentCtx.err = 40963;
  }
  for (var i = 0; i < count; ++i) {
    if (!AL.currentCtx.sources[HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0]]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4115);
  }
}

var _alSourcePlay = sourceId => {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4114);
};

function _alSourcePlayv(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pSourceIds) {
    AL.currentCtx.err = 40963;
  }
  for (var i = 0; i < count; ++i) {
    if (!AL.currentCtx.sources[HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0]]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4114);
  }
}

function _alSourceQueueBuffers(sourceId, count, pBufferIds) {
  pBufferIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  if (src.type === 4136) {
    AL.currentCtx.err = 40964;
    return;
  }
  if (count === 0) {
    return;
  }
                                                                               
  var templateBuf = AL.buffers[0];
  for (var buf of src.bufQueue) {
    if (buf.id !== 0) {
      templateBuf = buf;
      break;
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0];
    var buf = AL.buffers[bufId];
    if (!buf) {
      AL.currentCtx.err = 40961;
      return;
    }
                                                                                                                   
    if (templateBuf.id !== 0 && (buf.frequency !== templateBuf.frequency || buf.bytesPerSample !== templateBuf.bytesPerSample || buf.channels !== templateBuf.channels)) {
      AL.currentCtx.err = 40964;
    }
  }
                                                                                                
  if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
    src.bufQueue.length = 0;
  }
  src.type = 4137;
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0];
    var buf = AL.buffers[bufId];
    buf.refCount++;
    src.bufQueue.push(buf);
  }
                                                                                      
  if (src.looping) {
    AL.cancelPendingSourceAudio(src);
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src);
}

var _alSourceRewind = sourceId => {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
                                                    
  AL.setSourceState(src, 4116);
                                                                   
  AL.setSourceState(src, 4113);
};

function _alSourceRewindv(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pSourceIds) {
    AL.currentCtx.err = 40963;
  }
  for (var i = 0; i < count; ++i) {
    if (!AL.currentCtx.sources[HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0]]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4113);
  }
}

var _alSourceStop = sourceId => {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4116);
};

function _alSourceStopv(count, pSourceIds) {
  pSourceIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pSourceIds) {
    AL.currentCtx.err = 40963;
  }
  for (var i = 0; i < count; ++i) {
    if (!AL.currentCtx.sources[HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0]]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(((pSourceIds) + (i * 4)) >>> 2) >>> 0];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
  }
}

function _alSourceUnqueueBuffers(sourceId, count, pBufferIds) {
  pBufferIds >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
    AL.currentCtx.err = 40963;
    return;
  }
  if (count === 0) {
    return;
  }
  for (var i = 0; i < count; i++) {
    var buf = src.bufQueue.shift();
    buf.refCount--;
                                                      
    HEAP32[(((pBufferIds) + (i * 4)) >>> 2) >>> 0] = buf.id;
    src.bufsProcessed--;
  }
                                                        
  if (src.bufQueue.length === 0) {
    src.bufQueue.push(AL.buffers[0]);
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src);
}

var _alSourcef = (sourceId, param, value) => {
  switch (param) {
   case 4097:
   case 4098:
   case 4099:
   case 4106:
   case 4109:
   case 4110:
   case 4128:
   case 4129:
   case 4130:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 8203:
    AL.setSourceParam("alSourcef", sourceId, param, value);
    break;

   default:
    AL.setSourceParam("alSourcef", sourceId, param, null);
    break;
  }
};

function _alSourcefv(sourceId, param, pValues) {
  pValues >>>= 0;
  if (!AL.currentCtx) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 4097:
   case 4098:
   case 4099:
   case 4106:
   case 4109:
   case 4110:
   case 4128:
   case 4129:
   case 4130:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 8203:
    var val = HEAPF32[((pValues) >>> 2) >>> 0];
    AL.setSourceParam("alSourcefv", sourceId, param, val);
    break;

   case 4100:
   case 4101:
   case 4102:
    AL.paramArray[0] = HEAPF32[((pValues) >>> 2) >>> 0];
    AL.paramArray[1] = HEAPF32[(((pValues) + (4)) >>> 2) >>> 0];
    AL.paramArray[2] = HEAPF32[(((pValues) + (8)) >>> 2) >>> 0];
    AL.setSourceParam("alSourcefv", sourceId, param, AL.paramArray);
    break;

   default:
    AL.setSourceParam("alSourcefv", sourceId, param, null);
    break;
  }
}

function _alcCloseDevice(deviceId) {
  deviceId >>>= 0;
  if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
    return 0;
  }
  delete AL.deviceRefCounts[deviceId];
  AL.freeIds.push(deviceId);
  return 1;
}

var autoResumeAudioContext = ctx => {
  for (var event of [ "keydown", "mousedown", "touchstart" ]) {
    for (var element of [ document, document.getElementById("canvas") ]) {
      element?.addEventListener(event, () => {
        if (ctx.state === "suspended") ctx.resume();
      }, {
        "once": true
      });
    }
  }
};

function _alcCreateContext(deviceId, pAttrList) {
  deviceId >>>= 0;
  pAttrList >>>= 0;
  if (!(deviceId in AL.deviceRefCounts)) {
    AL.alcErr = 40961;
                             return 0;
  }
  var options = null;
  var attrs = [];
  var hrtf = null;
  pAttrList >>= 2;
  if (pAttrList) {
    var attr = 0;
    var val = 0;
    while (true) {
      attr = HEAP32[pAttrList++ >>> 0];
      attrs.push(attr);
      if (attr === 0) {
        break;
      }
      val = HEAP32[pAttrList++ >>> 0];
      attrs.push(val);
      switch (attr) {
       case 4103:
        if (!options) {
          options = {};
        }
        options.sampleRate = val;
        break;

       case 4112:
                     
        case 4113:
                                                           
        break;

       case 6546:
        switch (val) {
         case 0:
          hrtf = false;
          break;

         case 1:
          hrtf = true;
          break;

         case 2:
          break;

         default:
          AL.alcErr = 40964;
          return 0;
        }
        break;

       case 6550:
        if (val !== 0) {
          AL.alcErr = 40964;
          return 0;
        }
        break;

       default:
        AL.alcErr = 40964;
                                return 0;
      }
    }
  }
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var ac = null;
  try {
                                                                                                  
    if (options) {
      ac = new AudioContext(options);
    } else {
      ac = new AudioContext;
    }
  } catch (e) {
    if (e.name === "NotSupportedError") {
      AL.alcErr = 40964;
    } else {
      AL.alcErr = 40961;
    }
    return 0;
  }
  autoResumeAudioContext(ac);
                                                                                               
  if (typeof ac.createGain == "undefined") {
    ac.createGain = ac.createGainNode;
  }
  var gain = ac.createGain();
  gain.connect(ac.destination);
  var ctx = {
    deviceId,
    id: AL.newId(),
    attrs,
    audioCtx: ac,
    listener: {
      position: [ 0, 0, 0 ],
      velocity: [ 0, 0, 0 ],
      direction: [ 0, 0, 0 ],
      up: [ 0, 0, 0 ]
    },
    sources: [],
    interval: setInterval(() => AL.scheduleContextAudio(ctx), AL.QUEUE_INTERVAL),
    gain,
    distanceModel: 53250,
    speedOfSound: 343.3,
    dopplerFactor: 1,
    sourceDistanceModel: false,
    hrtf: hrtf || false,
    _err: 0,
    get err() {
      return this._err;
    },
    set err(val) {
                                                                                            
      if (this._err === 0 || val === 0) {
        this._err = val;
      }
    }
  };
  AL.deviceRefCounts[deviceId]++;
  AL.contexts[ctx.id] = ctx;
  if (hrtf !== null) {
                                                        
    for (var ctxId in AL.contexts) {
      var c = AL.contexts[ctxId];
      if (c.deviceId === deviceId) {
        c.hrtf = hrtf;
        AL.updateContextGlobal(c);
      }
    }
  }
  return ctx.id;
}

function _alcDestroyContext(contextId) {
  contextId >>>= 0;
  var ctx = AL.contexts[contextId];
  if (AL.currentCtx === ctx) {
    AL.alcErr = 40962;
    return;
  }
                       
  if (AL.contexts[contextId].interval) {
    clearInterval(AL.contexts[contextId].interval);
  }
  AL.deviceRefCounts[ctx.deviceId]--;
  delete AL.contexts[contextId];
  AL.freeIds.push(contextId);
}

function _alcGetContextsDevice(contextId) {
  contextId >>>= 0;
  if (contextId in AL.contexts) {
    return AL.contexts[contextId].deviceId;
  }
  return 0;
}

function _alcGetCurrentContext() {
  if (AL.currentCtx !== null) {
    return AL.currentCtx.id;
  }
  return 0;
}

function _alcGetEnumValue(deviceId, pEnumName) {
  deviceId >>>= 0;
  pEnumName >>>= 0;
                
                                               
                                                  
  if (deviceId !== 0 && !(deviceId in AL.deviceRefCounts)) {
                                                                     
                            
    return 0;
  } else if (!pEnumName) {
    AL.alcErr = 40964;
    return 0;
  }
  var name = UTF8ToString(pEnumName);
                                                                       
  switch (name) {
   case "ALC_NO_ERROR":
    return 0;

   case "ALC_INVALID_DEVICE":
    return 40961;

   case "ALC_INVALID_CONTEXT":
    return 40962;

   case "ALC_INVALID_ENUM":
    return 40963;

   case "ALC_INVALID_VALUE":
    return 40964;

   case "ALC_OUT_OF_MEMORY":
    return 40965;

   case "ALC_MAJOR_VERSION":
    return 4096;

   case "ALC_MINOR_VERSION":
    return 4097;

   case "ALC_ATTRIBUTES_SIZE":
    return 4098;

   case "ALC_ALL_ATTRIBUTES":
    return 4099;

   case "ALC_DEFAULT_DEVICE_SPECIFIER":
    return 4100;

   case "ALC_DEVICE_SPECIFIER":
    return 4101;

   case "ALC_EXTENSIONS":
    return 4102;

   case "ALC_FREQUENCY":
    return 4103;

   case "ALC_REFRESH":
    return 4104;

   case "ALC_SYNC":
    return 4105;

   case "ALC_MONO_SOURCES":
    return 4112;

   case "ALC_STEREO_SOURCES":
    return 4113;

   case "ALC_CAPTURE_DEVICE_SPECIFIER":
    return 784;

   case "ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER":
    return 785;

   case "ALC_CAPTURE_SAMPLES":
    return 786;

                    case "ALC_HRTF_SOFT":
    return 6546;

   case "ALC_HRTF_ID_SOFT":
    return 6550;

   case "ALC_DONT_CARE_SOFT":
    return 2;

   case "ALC_HRTF_STATUS_SOFT":
    return 6547;

   case "ALC_NUM_HRTF_SPECIFIERS_SOFT":
    return 6548;

   case "ALC_HRTF_SPECIFIER_SOFT":
    return 6549;

   case "ALC_HRTF_DISABLED_SOFT":
    return 0;

   case "ALC_HRTF_ENABLED_SOFT":
    return 1;

   case "ALC_HRTF_DENIED_SOFT":
    return 2;

   case "ALC_HRTF_REQUIRED_SOFT":
    return 3;

   case "ALC_HRTF_HEADPHONES_DETECTED_SOFT":
    return 4;

   case "ALC_HRTF_UNSUPPORTED_FORMAT_SOFT":
    return 5;

   default:
    AL.alcErr = 40964;
    return 0;
  }
}

function _alcGetError(deviceId) {
  deviceId >>>= 0;
  var err = AL.alcErr;
  AL.alcErr = 0;
  return err;
}

function _alcGetIntegerv(deviceId, param, size, pValues) {
  deviceId >>>= 0;
  pValues >>>= 0;
  if (size === 0 || !pValues) {
                                     
    return;
  }
  switch (param) {
   case 4096:
    HEAP32[((pValues) >>> 2) >>> 0] = 1;
    break;

   case 4097:
    HEAP32[((pValues) >>> 2) >>> 0] = 1;
    break;

   case 4098:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    if (!AL.currentCtx) {
      AL.alcErr = 40962;
      return;
    }
    HEAP32[((pValues) >>> 2) >>> 0] = AL.currentCtx.attrs.length;
    break;

   case 4099:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    if (!AL.currentCtx) {
      AL.alcErr = 40962;
      return;
    }
    for (var i = 0; i < AL.currentCtx.attrs.length; i++) {
      HEAP32[(((pValues) + (i * 4)) >>> 2) >>> 0] = AL.currentCtx.attrs[i];
    }
    break;

   case 4103:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    if (!AL.currentCtx) {
      AL.alcErr = 40962;
      return;
    }
    HEAP32[((pValues) >>> 2) >>> 0] = AL.currentCtx.audioCtx.sampleRate;
    break;

   case 4112:
   case 4113:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    if (!AL.currentCtx) {
      AL.alcErr = 40962;
      return;
    }
    HEAP32[((pValues) >>> 2) >>> 0] = 2147483647;
    break;

   case 6546:
   case 6547:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    var hrtfStatus = 0;
    for (var ctxId in AL.contexts) {
      var ctx = AL.contexts[ctxId];
      if (ctx.deviceId === deviceId) {
        hrtfStatus = ctx.hrtf ? 1 : 0;
      }
    }
    HEAP32[((pValues) >>> 2) >>> 0] = hrtfStatus;
    break;

   case 6548:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    HEAP32[((pValues) >>> 2) >>> 0] = 1;
    break;

   case 131075:
    if (!(deviceId in AL.deviceRefCounts)) {
      AL.alcErr = 40961;
      return;
    }
    if (!AL.currentCtx) {
      AL.alcErr = 40962;
      return;
    }
    HEAP32[((pValues) >>> 2) >>> 0] = 1;

   case 786:
    var c = AL.requireValidCaptureDevice(deviceId, "alcGetIntegerv");
    if (!c) {
      return;
    }
    var n = c.capturedFrameCount;
    var dstfreq = c.requestedSampleRate;
    var srcfreq = c.audioCtx.sampleRate;
    var nsamples = Math.floor(n * (dstfreq / srcfreq));
    HEAP32[((pValues) >>> 2) >>> 0] = nsamples;
    break;

   default:
    AL.alcErr = 40963;
    return;
  }
}

function _alcGetString(deviceId, param) {
  deviceId >>>= 0;
  if (AL.alcStringCache[param]) {
    return AL.alcStringCache[param];
  }
  var ret;
  switch (param) {
   case 0:
    ret = "No Error";
    break;

   case 40961:
    ret = "Invalid Device";
    break;

   case 40962:
    ret = "Invalid Context";
    break;

   case 40963:
    ret = "Invalid Enum";
    break;

   case 40964:
    ret = "Invalid Value";
    break;

   case 40965:
    ret = "Out of Memory";
    break;

   case 4100:
    if (globalThis.AudioContext || globalThis.webkitAudioContext) {
      ret = AL.DEVICE_NAME;
    } else {
      return 0;
    }
    break;

   case 4101:
    if (globalThis.AudioContext || globalThis.webkitAudioContext) {
      ret = AL.DEVICE_NAME + "\0";
    } else {
      ret = "\0";
    }
    break;

   case 785:
    ret = AL.CAPTURE_DEVICE_NAME;
    break;

   case 784:
    if (deviceId === 0) {
      ret = AL.CAPTURE_DEVICE_NAME + "\0";
    } else {
      var c = AL.requireValidCaptureDevice(deviceId, "alcGetString");
      if (!c) {
        return 0;
      }
      ret = c.deviceName;
    }
    break;

   case 4102:
    if (!deviceId) {
      AL.alcErr = 40961;
      return 0;
    }
    ret = Object.keys(AL.ALC_EXTENSIONS).join(" ");
    break;

   default:
    AL.alcErr = 40963;
    return 0;
  }
  ret = stringToNewUTF8(ret);
  AL.alcStringCache[param] = ret;
  return ret;
}

function _alcMakeContextCurrent(contextId) {
  contextId >>>= 0;
  if (contextId === 0) {
    AL.currentCtx = null;
  } else {
    AL.currentCtx = AL.contexts[contextId];
  }
  return 1;
}

function _alcOpenDevice(pDeviceName) {
  pDeviceName >>>= 0;
  if (pDeviceName) {
    var name = UTF8ToString(pDeviceName);
    if (name !== AL.DEVICE_NAME) {
      return 0;
    }
  }
  if (globalThis.AudioContext || globalThis.webkitAudioContext) {
    var deviceId = AL.newId();
    AL.deviceRefCounts[deviceId] = 0;
    return deviceId;
  }
  return 0;
}

function _alcProcessContext(contextId) {
  contextId >>>= 0;
}

function _alcSuspendContext(contextId) {
  contextId >>>= 0;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
                                                                          
                       
  while (ch = HEAPU8[sigPtr++ >>> 0]) {
                                                                       
                                         
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(                                                                  
    ch == 112 ? HEAPU32[((buf) >>> 2) >>> 0] : ch == 106 ? HEAP64[((buf) >>> 3) >>> 0] : ch == 105 ? HEAP32[((buf) >>> 2) >>> 0] : HEAPF64[((buf) >>> 3) >>> 0]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
  code >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runEmAsmFunction(code, sigPtr, argbuf);
}

var _emscripten_date_now = () => Date.now();

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var _emscripten_force_exit = status => {
  __emscripten_runtime_keepalive_clear();
  _exit(status);
};

var getHeapMax = () =>                                                                          
                                                                          
                                                                       
                                                          
4294901760;

function _emscripten_get_heap_max() {
  return getHeapMax();
}

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
                                                                         
    wasmMemory.grow(pages);
                                                          
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

function _emscripten_resize_heap(requestedSize) {
  requestedSize >>>= 0;
  var oldSize = HEAPU8.length;
                                                                                        
                                                                
                         
                                                                             
                               
                                                                        
                                                           
                                                                    
                                                                         
                                                                        
                                                     
                                         
                                                                        
                                                                         
                                                                       
                                                                     
                                                                       
                                                                          
                                                                       
                                                                      
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
                                                                          
                                                                         
                                                                     
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                              
                                                                               
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}

                         var convertFrameToPC = frame => {
  var match;
  if (match = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(frame)) {
                                                                                     
    return +match[1];
  } else if (match = /:(\d+):\d+(?:\)|$)/.exec(frame)) {
                                                                              
                                                                             
                           
    return 2147483648 | +match[1];
  }
                                  
  return 0;
};

var jsStackTrace = () => (new Error).stack.toString();

function _emscripten_return_address(level) {
  var callstack = jsStackTrace().split("\n");
  if (callstack[0] == "Error") {
    callstack.shift();
  }
                                                                     
  var caller = callstack[level + 3];
  return convertFrameToPC(caller);
}

var GLctx;

var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx =>                                                                                                   
!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));

var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx => !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx =>                                                                                                           
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
                                                                         
             
  var supportedExtensions = [                      
  "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance",                                  
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
                                                                                            
  return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
};

var registerPreMainLoop = f => {
                                                    
  typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f);
};

var GL = {
  counter: 1,
  buffers: [],
  mappedBuffers: {},
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: [],
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
                                                                      
                    
    while (table[ret]) {
      ret = GL.counter++;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      HEAP32[(((buffers) + (i * 4)) >>> 2) >>> 0] = id;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: i => 32 - Math.clz32(i === 0 ? 0 : i - 1),
  generateTempBuffers: (quads, context) => {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
                          
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
                                             
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0, v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? HEAPU32[(((length) + (i * 4)) >>> 2) >>> 0] : undefined;
      source += UTF8ToString(HEAPU32[(((string) + (i * 4)) >>> 2) >>> 0], len);
    }
    return source;
  },
  calcBufLength: (size, type, stride, count) => {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings: count => {
    GL.resetBufferBinding = false;
                                                                            
                           
    for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
      var cb = GL.currentContext.clientBuffers[i];
      if (!cb.clientside || !cb.enabled) continue;
      GL.resetBufferBinding = true;
      var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
      var buf = GL.getTempVertexBuffer(size);
      GLctx.bindBuffer(34962, buf);
      GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr >>> 0, cb.ptr + size >>> 0));
      cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0);
    }
  },
  postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
    }
  },
  createContext: (                                 canvas, webGLContextAttributes) => {
                                                                             
                                                                         
                                                       
                                       
                                    
           
                                                                    
                                                                           
                                    
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                                                                                             function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = canvas.getContext("webgl2", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: (ctx, webGLContextAttributes) => {
                                                       
    var handle = GL.getNewId(GL.contexts);
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
                                                                         
                                                                  
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null
      };
    }
    GL.generateTempBuffers(false, context);
    return handle;
  },
  makeContextCurrent: contextHandle => {
                                                 
    GL.currentContext = GL.contexts[contextHandle];
                                   
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
                                                                                
                                                          
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
                                                                            
                                 
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
                                                                             
                                                  
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
                                                                         
                                                    
                                                                
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
                                                                                                  
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
                                                                           
                                                                        
                  
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
    }
                                                                          
                                                                        
                                               
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
                                                                              
                                    
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
                                                                     
        GLctx.getExtension(ext);
      }
    }
  }
};

var webglPowerPreferences = [ "default", "low-power", "high-performance" ];

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

                      var specialHTMLTargets = [ 0, document, window ];

var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || document.querySelector(target);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

function _emscripten_webgl_do_create_context(target, attributes) {
  target >>>= 0;
  attributes >>>= 0;
  var attr32 = ((attributes) >>> 2);
  var powerPreference = HEAP32[attr32 + (8 >> 2) >>> 0];
  var contextAttributes = {
    "alpha": !!HEAP8[attributes + 0 >>> 0],
    "depth": !!HEAP8[attributes + 1 >>> 0],
    "stencil": !!HEAP8[attributes + 2 >>> 0],
    "antialias": !!HEAP8[attributes + 3 >>> 0],
    "premultipliedAlpha": !!HEAP8[attributes + 4 >>> 0],
    "preserveDrawingBuffer": !!HEAP8[attributes + 5 >>> 0],
    "powerPreference": webglPowerPreferences[powerPreference],
    "failIfMajorPerformanceCaveat": !!HEAP8[attributes + 12 >>> 0],
                                                                                                                                              
    majorVersion: HEAP32[attr32 + (16 >> 2) >>> 0],
    minorVersion: HEAP32[attr32 + (20 >> 2) >>> 0],
    enableExtensionsByDefault: HEAP8[attributes + 24 >>> 0],
    explicitSwapControl: HEAP8[attributes + 25 >>> 0],
    proxyContextToMainThread: HEAP32[attr32 + (28 >> 2) >>> 0],
    renderViaOffscreenBackBuffer: HEAP8[attributes + 32 >>> 0]
  };
  var canvas = findCanvasEventTarget(target);
  if (!canvas) {
    return 0;
  }
  if (contextAttributes.explicitSwapControl) {
    return 0;
  }
  var contextHandle = GL.createContext(canvas, contextAttributes);
  return contextHandle;
}

var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

function _emscripten_webgl_enable_extension(contextHandle, extension) {
  contextHandle >>>= 0;
  extension >>>= 0;
  var context = GL.getContext(contextHandle);
  var extString = UTF8ToString(extension);
  if (extString.startsWith("GL_")) extString = extString.slice(3);
                                                                  
                                                                                         
                                                                      
  if (extString == "WEBGL_draw_instanced_base_vertex_base_instance") webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
  if (extString == "WEBGL_multi_draw_instanced_base_vertex_base_instance") webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
  if (extString == "WEBGL_multi_draw") webgl_enable_WEBGL_multi_draw(GLctx);
  if (extString == "EXT_polygon_offset_clamp") webgl_enable_EXT_polygon_offset_clamp(GLctx);
  if (extString == "EXT_clip_control") webgl_enable_EXT_clip_control(GLctx);
  if (extString == "WEBGL_polygon_mode") webgl_enable_WEBGL_polygon_mode(GLctx);
  var ext = context.GLctx.getExtension(extString);
  return !!ext;
}

function _emscripten_webgl_do_get_current_context() {
  return GL.currentContext ? GL.currentContext.handle : 0;
}

var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;

function _emscripten_webgl_get_drawing_buffer_size(contextHandle, width, height) {
  contextHandle >>>= 0;
  width >>>= 0;
  height >>>= 0;
  var GLContext = GL.getContext(contextHandle);
  if (!GLContext || !GLContext.GLctx || !width || !height) {
    return -5;
  }
  HEAP32[((width) >>> 2) >>> 0] = GLContext.GLctx.drawingBufferWidth;
  HEAP32[((height) >>> 2) >>> 0] = GLContext.GLctx.drawingBufferHeight;
  return 0;
}

function _emscripten_webgl_make_context_current(contextHandle) {
  contextHandle >>>= 0;
  var success = GL.makeContextCurrent(contextHandle);
  return success ? 0 : -5;
}

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
                      
                                       
    var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
                                              
    for (var x in ENV) {
                                                                     
                                                                  
                                                             
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  __environ >>>= 0;
  environ_buf >>>= 0;
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    HEAPU32[(((__environ) + (envp)) >>> 2) >>> 0] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  penviron_count >>>= 0;
  penviron_buf_size >>>= 0;
  var strings = getEnvStrings();
  HEAPU32[((penviron_count) >>> 2) >>> 0] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  HEAPU32[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
  return 0;
}

function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

                               var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.read(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
                           
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset, whence, newOffset) {
  offset = bigintToI53Checked(offset);
  newOffset >>>= 0;
  try {
    if (isNaN(offset)) return 61;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    HEAP64[((newOffset) >>> 3) >>> 0] = BigInt(stream.position);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                          
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

                               var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.write(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) {
                                
      break;
    }
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _glActiveTexture = _emscripten_glActiveTexture;

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _glAttachShader = _emscripten_glAttachShader;

var _emscripten_glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _glBeginQuery = _emscripten_glBeginQuery;

function _emscripten_glBindAttribLocation(program, index, name) {
  name >>>= 0;
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}

var _glBindAttribLocation = _emscripten_glBindAttribLocation;

var _emscripten_glBindBuffer = (target, buffer) => {
                                                                         
                                                                           
        
  if (buffer && !GL.buffers[buffer]) {
    var b = GLctx.createBuffer();
    b.name = buffer;
    GL.buffers[buffer] = b;
  }
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  if (target == 35051) {
                                                                              
                                                  
                                                                          
                                                                           
            
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
                                                                           
                                                                          
                                                                            
                                                                           
            
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _glBindBuffer = _emscripten_glBindBuffer;

var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
};

var _glBindFramebuffer = _emscripten_glBindFramebuffer;

var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _glBindRenderbuffer = _emscripten_glBindRenderbuffer;

var _emscripten_glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _glBindSampler = _emscripten_glBindSampler;

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _glBindTexture = _emscripten_glBindTexture;

var _emscripten_glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
};

var _glBindVertexArray = _emscripten_glBindVertexArray;

var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _glBlendColor = _emscripten_glBlendColor;

var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _glBlendEquationSeparate = _emscripten_glBlendEquationSeparate;

var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _glBlendFuncSeparate = _emscripten_glBlendFuncSeparate;

var _emscripten_glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

var _glBlitFramebuffer = _emscripten_glBlitFramebuffer;

function _emscripten_glBufferData(target, size, data, usage) {
  size >>>= 0;
  data >>>= 0;
                                                                           
                                                                     
                                                                         
                       
  GLctx.bufferData(target, data ? HEAPU8.subarray(data >>> 0, data + size >>> 0) : size, usage);
}

var _glBufferData = _emscripten_glBufferData;

function _emscripten_glBufferSubData(target, offset, size, data) {
  offset >>>= 0;
  size >>>= 0;
  data >>>= 0;
  GLctx.bufferSubData(target, offset, HEAPU8.subarray(data >>> 0, data + size >>> 0));
}

var _glBufferSubData = _emscripten_glBufferSubData;

var _emscripten_glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _glCheckFramebufferStatus = _emscripten_glCheckFramebufferStatus;

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _glClear = _emscripten_glClear;

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _glClearColor = _emscripten_glClearColor;

var _emscripten_glClearDepthf = x0 => GLctx.clearDepth(x0);

var _glClearDepthf = _emscripten_glClearDepthf;

var _emscripten_glClearStencil = x0 => GLctx.clearStencil(x0);

var _glClearStencil = _emscripten_glClearStencil;

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _glColorMask = _emscripten_glColorMask;

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

var _glCompileShader = _emscripten_glCompileShader;

function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
  data >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
      return;
    }
  }
  GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8.subarray((data) >>> 0, data + imageSize >>> 0));
}

var _glCompressedTexSubImage2D = _emscripten_glCompressedTexSubImage2D;

var _emscripten_glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
                                                                 
  program.name = id;
                          
                                                                                                                        
  program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
};

var _glCreateProgram = _emscripten_glCreateProgram;

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _glCreateShader = _emscripten_glCreateShader;

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

var _glCullFace = _emscripten_glCullFace;

function _emscripten_glDeleteBuffers(n, buffers) {
  buffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((buffers) + (i * 4)) >>> 2) >>> 0];
    var buffer = GL.buffers[id];
                                                                             
                                              
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
  }
}

var _glDeleteBuffers = _emscripten_glDeleteBuffers;

function _emscripten_glDeleteFramebuffers(n, framebuffers) {
  framebuffers >>>= 0;
  for (var i = 0; i < n; ++i) {
    var id = HEAP32[(((framebuffers) + (i * 4)) >>> 2) >>> 0];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
                                                                                                                            
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
}

var _glDeleteFramebuffers = _emscripten_glDeleteFramebuffers;

var _emscripten_glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
                                                                            
                                                     
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

var _glDeleteProgram = _emscripten_glDeleteProgram;

function _emscripten_glDeleteQueries(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((ids) + (i * 4)) >>> 2) >>> 0];
    var query = GL.queries[id];
    if (!query) continue;
                                                                       
    GLctx.deleteQuery(query);
    GL.queries[id] = null;
  }
}

var _glDeleteQueries = _emscripten_glDeleteQueries;

function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((renderbuffers) + (i * 4)) >>> 2) >>> 0];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
                                                                                                                              
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
}

var _glDeleteRenderbuffers = _emscripten_glDeleteRenderbuffers;

var _emscripten_glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
                                                                           
                                                     
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
};

var _glDeleteShader = _emscripten_glDeleteShader;

function _emscripten_glDeleteTextures(n, textures) {
  textures >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((textures) + (i * 4)) >>> 2) >>> 0];
    var texture = GL.textures[id];
                                                                           
                                        
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
}

var _glDeleteTextures = _emscripten_glDeleteTextures;

function _emscripten_glDeleteVertexArrays(n, vaos) {
  vaos >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((vaos) + (i * 4)) >>> 2) >>> 0];
    GLctx.deleteVertexArray(GL.vaos[id]);
    GL.vaos[id] = null;
  }
}

var _glDeleteVertexArrays = _emscripten_glDeleteVertexArrays;

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _glDepthFunc = _emscripten_glDepthFunc;

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _glDepthMask = _emscripten_glDepthMask;

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _glDepthRangef = _emscripten_glDepthRangef;

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _glDisable = _emscripten_glDisable;

var _emscripten_glDisableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
};

var _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray;

var _emscripten_glDrawArrays = (mode, first, count) => {
                                 
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
};

var _glDrawArrays = _emscripten_glDrawArrays;

var tempFixedLengthArray = [];

function _emscripten_glDrawBuffers(n, bufs) {
  bufs >>>= 0;
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[(((bufs) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.drawBuffers(bufArray);
}

var _glDrawBuffers = _emscripten_glDrawBuffers;

function _emscripten_glDrawElements(mode, count, type, indices) {
  indices >>>= 0;
  var buf;
  var vertexes = 0;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices >>> 0, indices + size >>> 0));
                                                                            
    if (count > 0) {
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (cb.clientside && cb.enabled) {
          let arrayClass;
          switch (type) {
           case 5121:
            arrayClass = Uint8Array;
            break;

           case 5123:
            arrayClass = Uint16Array;
            break;

           case 5125:
            arrayClass = Uint32Array;
            break;

           default:
            GL.recordError(1282);
            return;
          }
          vertexes = new arrayClass(HEAPU8.buffer, indices, count).reduce((max, current) => Math.max(max, current)) + 1;
          break;
        }
      }
    }
                         
    indices = 0;
  }
                                 
  GL.preDrawHandleClientVertexAttribBindings(vertexes);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}

var _glDrawElements = _emscripten_glDrawElements;

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
  indices >>>= 0;
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
}

var _glDrawElementsInstanced = _emscripten_glDrawElementsInstanced;

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _glEnable = _emscripten_glEnable;

var _emscripten_glEnableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
};

var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;

var _emscripten_glEndQuery = x0 => GLctx.endQuery(x0);

var _glEndQuery = _emscripten_glEndQuery;

var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _glFramebufferRenderbuffer = _emscripten_glFramebufferRenderbuffer;

var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _glFramebufferTexture2D = _emscripten_glFramebufferTexture2D;

var _emscripten_glFrontFace = x0 => GLctx.frontFace(x0);

var _glFrontFace = _emscripten_glFrontFace;

function _emscripten_glGenBuffers(n, buffers) {
  buffers >>>= 0;
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
}

var _glGenBuffers = _emscripten_glGenBuffers;

function _emscripten_glGenFramebuffers(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
}

var _glGenFramebuffers = _emscripten_glGenFramebuffers;

function _emscripten_glGenQueries(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createQuery", GL.queries);
}

var _glGenQueries = _emscripten_glGenQueries;

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}

var _glGenRenderbuffers = _emscripten_glGenRenderbuffers;

function _emscripten_glGenSamplers(n, samplers) {
  samplers >>>= 0;
  GL.genObject(n, samplers, "createSampler", GL.samplers);
}

var _glGenSamplers = _emscripten_glGenSamplers;

function _emscripten_glGenTextures(n, textures) {
  textures >>>= 0;
  GL.genObject(n, textures, "createTexture", GL.textures);
}

var _glGenTextures = _emscripten_glGenTextures;

function _emscripten_glGenVertexArrays(n, arrays) {
  arrays >>>= 0;
  GL.genObject(n, arrays, "createVertexArray", GL.vaos);
}

var _glGenVertexArrays = _emscripten_glGenVertexArrays;

var _emscripten_glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var _glGenerateMipmap = _emscripten_glGenerateMipmap;

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
                                                                                     
    var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
    if (size) HEAP32[((size) >>> 2) >>> 0] = info.size;
    if (type) HEAP32[((type) >>> 2) >>> 0] = info.type;
  }
};

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
}

var _glGetActiveUniform = _emscripten_glGetActiveUniform;

function _emscripten_glGetAttribLocation(program, name) {
  name >>>= 0;
  return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}

var _glGetAttribLocation = _emscripten_glGetAttribLocation;

var _emscripten_glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

var _glGetError = _emscripten_glGetError;

var writeI53ToI64 = (ptr, num) => {
  HEAPU32[((ptr) >>> 2) >>> 0] = num;
  var lower = HEAPU32[((ptr) >>> 2) >>> 0];
  HEAPU32[(((ptr) + (4)) >>> 2) >>> 0] = (num - lower) / 4294967296;
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var emscriptenWebGLGet = (name_, p, type) => {
                                               
                                                                        
                                                                              
                                                                              
                                      
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
                                      
    case 36346:
                         
    ret = 1;
    break;

   case 36344:
                               
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
                                                                            
                 
    return;

   case 34814:
                                   
    case 36345:
                                   
    ret = 0;
    break;

   case 34466:
                                        
                                                                          
                                                                         
                                                                        
                           
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;

   case 33309:
                        
    if (GL.currentContext.version < 2) {
                                                                  
      GL.recordError(1282);
      return;
    }
    ret = webglGetExtensions().length;
    break;

   case 33307:
                      
    case 33308:
                       
    if (GL.currentContext.version < 2) {
      GL.recordError(1280);
                        
      return;
    }
    ret = name_ == 33307 ? 3 : 0;
                         
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
                        
      return;

     case "object":
      if (result === null) {
                                                                         
                                                                       
                                                     
        switch (name_) {
         case 34964:
                                
          case 35725:
                           
          case 34965:
                                        
          case 36006:
                                                           
          case 36007:
                                
          case 32873:
                              
          case 34229:
                                                                                                                     
          case 36662:
                                                        
          case 36663:
                                                          
          case 35053:
                                     
          case 35055:
                                       
          case 36010:
                                    
          case 35097:
                           
          case 35869:
                                    
          case 32874:
                              
          case 36389:
                                      
          case 35983:
                                             
          case 35368:
                                  
          case 34068:
          {
                                       
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
                              
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            HEAP32[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 2:
            HEAPF32[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 4:
            HEAP8[(p) + (i) >>> 0] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
                            
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
                        
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    HEAP32[((p) >>> 2) >>> 0] = ret;
    break;

   case 2:
    HEAPF32[((p) >>> 2) >>> 0] = ret;
    break;

   case 4:
    HEAP8[p >>> 0] = ret ? 1 : 0;
    break;
  }
};

function _emscripten_glGetIntegerv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 0);
}

var _glGetIntegerv = _emscripten_glGetIntegerv;

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _glGetProgramInfoLog = _emscripten_glGetProgramInfoLog;

function _emscripten_glGetProgramiv(program, pname, p) {
  p >>>= 0;
  if (!p) {
                                                                        
                                                                             
                                                
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
                         
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    HEAP32[((p) >>> 2) >>> 0] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
      for (var i = 0; i < numActiveUniforms; ++i) {
        program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
      for (var i = 0; i < numActiveAttributes; ++i) {
        program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
      for (var i = 0; i < numActiveUniformBlocks; ++i) {
        program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxUniformBlockNameLength;
  } else {
    HEAP32[((p) >>> 2) >>> 0] = GLctx.getProgramParameter(program, pname);
  }
}

var _glGetProgramiv = _emscripten_glGetProgramiv;

function _emscripten_glGetQueryObjectuiv(id, pname, params) {
  params >>>= 0;
  if (!params) {
                                                                                                                                      
                                                              
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[((params) >>> 2) >>> 0] = ret;
}

var _glGetQueryObjectuiv = _emscripten_glGetQueryObjectuiv;

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _glGetShaderInfoLog = _emscripten_glGetShaderInfoLog;

function _emscripten_glGetShaderiv(shader, pname, p) {
  p >>>= 0;
  if (!p) {
                                                                        
                                                                             
                                                
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
                         
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
                                                                             
                                                                            
                                                                       
                              
    var logLength = log ? log.length + 1 : 0;
    HEAP32[((p) >>> 2) >>> 0] = logLength;
  } else if (pname == 35720) {
                              
    var source = GLctx.getShaderSource(GL.shaders[shader]);
                                                                          
                                            
    var sourceLength = source ? source.length + 1 : 0;
    HEAP32[((p) >>> 2) >>> 0] = sourceLength;
  } else {
    HEAP32[((p) >>> 2) >>> 0] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
}

var _glGetShaderiv = _emscripten_glGetShaderiv;

function _emscripten_glGetString(name_) {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
                                                                                     
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      if (true) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
                                                                                 
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                                            
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
}

var _glGetString = _emscripten_glGetString;

                              var jstoi_q = str => parseInt(str);

                 var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
  var uniformLocsById = program.uniformLocsById,                                       
  uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,                                               
  i, j;
                                                                                 
                                                                             
  if (!uniformLocsById) {
                                                            
    program.uniformLocsById = uniformLocsById = {};
                                                                                                               
    program.uniformArrayNamesById = {};
    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
    for (i = 0; i < numActiveUniforms; ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = webglGetLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
                               
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
                                                                      
                                                                     
                                                                        
                                                                        
                              
      uniformSizeAndIdsByName[arrayName] = [ sz, id ];
                                                                      
                                                                 
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
};

function _emscripten_glGetUniformLocation(program, name) {
  name >>>= 0;
  name = UTF8ToString(name);
  if (program = GL.programs[program]) {
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var uniformLocsById = program.uniformLocsById;
                                          
    var arrayIndex = 0;
    var uniformBaseName = name;
                                                                            
                                                                            
                                                                   
                                                                           
                                                                            
                                                                              
                                                                             
                                      
    var leftBrace = webglGetLeftBracePos(name);
                                                                                          
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
                                                                                                                     
      uniformBaseName = name.slice(0, leftBrace);
    }
                                                          
                                                           
    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
                                                                          
                                                                        
                                          
    if (sizeAndId && arrayIndex < sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
                                                                        
      if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
        return arrayIndex;
      }
    }
  } else {
                                                                              
                                                                        
                                      
    GL.recordError(1281);
  }
  return -1;
}

var _glGetUniformLocation = _emscripten_glGetUniformLocation;

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
                                                                                  
  program.uniformLocsById = 0;
                                                                                   
  program.uniformSizeAndIdsByName = {};
};

var _glLinkProgram = _emscripten_glLinkProgram;

var _emscripten_glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _glPixelStorei = _emscripten_glPixelStorei;

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _glPolygonOffset = _emscripten_glPolygonOffset;

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
                                                                             
                                                                          
                                                                         
          
  var colorChannels = {
                                                   
                                         
    5: 3,
    6: 4,
                                             
    8: 2,
    29502: 3,
    29504: 4,
                                       
    26917: 2,
    26918: 2,
                                               
    29846: 3,
    29847: 4
  };
  return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
                                                                                                           
                                                                  
                                                                                                           
                                   
  type -= 5120;
  if (type == 0) return HEAP8;
  if (type == 1) return HEAPU8;
  if (type == 2) return HEAP16;
  if (type == 4) return HEAP32;
  if (type == 6) return HEAPF32;
  if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32;
  return HEAPU16;
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap) >>> 0, toTypedArrayIndex(pixels + bytes, heap) >>> 0);
};

function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
}

var _glReadPixels = _emscripten_glReadPixels;

var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _glRenderbufferStorage = _emscripten_glRenderbufferStorage;

var _emscripten_glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _glSamplerParameterf = _emscripten_glSamplerParameterf;

var _emscripten_glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _glSamplerParameteri = _emscripten_glSamplerParameteri;

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _glScissor = _emscripten_glScissor;

function _emscripten_glShaderSource(shader, count, string, length) {
  string >>>= 0;
  length >>>= 0;
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
}

var _glShaderSource = _emscripten_glShaderSource;

var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _glStencilFuncSeparate = _emscripten_glStencilFuncSeparate;

var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _glStencilMaskSeparate = _emscripten_glStencilMaskSeparate;

var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

var _glStencilOpSeparate = _emscripten_glStencilOpSeparate;

function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}

var _glTexImage2D = _emscripten_glTexImage2D;

var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

var _glTexParameterf = _emscripten_glTexParameterf;

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _glTexParameteri = _emscripten_glTexParameteri;

var _emscripten_glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _glTexStorage2D = _emscripten_glTexStorage2D;

function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}

var _glTexSubImage2D = _emscripten_glTexSubImage2D;

var webglGetUniformLocation = location => {
  var p = GLctx.currentProgram;
  if (p) {
    var webglLoc = p.uniformLocsById[location];
                                                                 
                            
                                                                           
                                                                 
    if (typeof webglLoc == "number") {
      p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
    }
                                                              
    return webglLoc;
  } else {
    GL.recordError(1282);
  }
};

var _emscripten_glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var _glUniform1f = _emscripten_glUniform1f;

var miniTempWebGLFloatBuffers = [];

function _emscripten_glUniform1fv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
                                                          
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1fv(webglGetUniformLocation(location), view);
}

var _glUniform1fv = _emscripten_glUniform1fv;

var _emscripten_glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var _glUniform1i = _emscripten_glUniform1i;

var miniTempWebGLIntBuffers = [];

function _emscripten_glUniform1iv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
                                                          
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1iv(webglGetUniformLocation(location), view);
}

var _glUniform1iv = _emscripten_glUniform1iv;

var _emscripten_glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

var _glUniform2f = _emscripten_glUniform2f;

function _emscripten_glUniform2fv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
                                                          
    count *= 2;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2fv(webglGetUniformLocation(location), view);
}

var _glUniform2fv = _emscripten_glUniform2fv;

var _emscripten_glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

var _glUniform2i = _emscripten_glUniform2i;

function _emscripten_glUniform2iv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
                                                          
    count *= 2;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2iv(webglGetUniformLocation(location), view);
}

var _glUniform2iv = _emscripten_glUniform2iv;

var _emscripten_glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

var _glUniform3f = _emscripten_glUniform3f;

function _emscripten_glUniform3fv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
                                                          
    count *= 3;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3fv(webglGetUniformLocation(location), view);
}

var _glUniform3fv = _emscripten_glUniform3fv;

var _emscripten_glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

var _glUniform3i = _emscripten_glUniform3i;

function _emscripten_glUniform3iv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
                                                          
    count *= 3;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3iv(webglGetUniformLocation(location), view);
}

var _glUniform3iv = _emscripten_glUniform3iv;

var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _glUniform4f = _emscripten_glUniform4f;

function _emscripten_glUniform4fv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
                                                          
    var view = miniTempWebGLFloatBuffers[4 * count];
                                                                       
    var heap = HEAPF32;
    value = ((value) >>> 2);
    count *= 4;
    for (var i = 0; i < count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4fv(webglGetUniformLocation(location), view);
}

var _glUniform4fv = _emscripten_glUniform4fv;

var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _glUniform4i = _emscripten_glUniform4i;

function _emscripten_glUniform4iv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
                                                          
    count *= 4;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAP32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4iv(webglGetUniformLocation(location), view);
}

var _glUniform4iv = _emscripten_glUniform4iv;

function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 72) {
                                                          
    count *= 4;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
}

var _glUniformMatrix2fv = _emscripten_glUniformMatrix2fv;

function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 32) {
                                                          
    count *= 9;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 9) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
      view[i + 4] = HEAPF32[(((value) + (4 * i + 16)) >>> 2) >>> 0];
      view[i + 5] = HEAPF32[(((value) + (4 * i + 20)) >>> 2) >>> 0];
      view[i + 6] = HEAPF32[(((value) + (4 * i + 24)) >>> 2) >>> 0];
      view[i + 7] = HEAPF32[(((value) + (4 * i + 28)) >>> 2) >>> 0];
      view[i + 8] = HEAPF32[(((value) + (4 * i + 32)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 36) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
}

var _glUniformMatrix3fv = _emscripten_glUniformMatrix3fv;

function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 18) {
                                                          
    var view = miniTempWebGLFloatBuffers[16 * count];
                                                                       
    var heap = HEAPF32;
    value = ((value) >>> 2);
    count *= 16;
    for (var i = 0; i < count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
      view[i + 4] = heap[dst + 4 >>> 0];
      view[i + 5] = heap[dst + 5 >>> 0];
      view[i + 6] = heap[dst + 6 >>> 0];
      view[i + 7] = heap[dst + 7 >>> 0];
      view[i + 8] = heap[dst + 8 >>> 0];
      view[i + 9] = heap[dst + 9 >>> 0];
      view[i + 10] = heap[dst + 10 >>> 0];
      view[i + 11] = heap[dst + 11 >>> 0];
      view[i + 12] = heap[dst + 12 >>> 0];
      view[i + 13] = heap[dst + 13 >>> 0];
      view[i + 14] = heap[dst + 14 >>> 0];
      view[i + 15] = heap[dst + 15 >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 64) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
}

var _glUniformMatrix4fv = _emscripten_glUniformMatrix4fv;

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
                                                                          
                                   
  GLctx.currentProgram = program;
};

var _glUseProgram = _emscripten_glUseProgram;

var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

var _glVertexAttrib4f = _emscripten_glVertexAttrib4f;

var _emscripten_glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _glVertexAttribDivisor = _emscripten_glVertexAttribDivisor;

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
  ptr >>>= 0;
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}

var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _glViewport = _emscripten_glViewport;

var RXCA = {
  node: null
};

function _rxc_js_audio_init(rate) {
  RXCA.node = Module["audioNode"] || null;
  const ctx = Module["audioContext"];
  if (ctx && ctx.sampleRate !== rate) console.warn(`[audio] mixer renders ${rate} Hz, AudioContext runs at ${ctx.sampleRate} Hz (the worklet resamples)`);
  return RXCA.node ? 1 : 0;
}

function _rxc_js_audio_push(ptr, frames) {
  ptr >>>= 0;
  if (!RXCA.node) return;
  const buf = HEAPF32.slice(ptr >>> 2, (ptr >>> 2) + frames * 2);
  RXCA.node.port.postMessage(buf, [ buf.buffer ]);
}

function _rxc_js_canvas_size(wp, hp) {
  const c = document.getElementById("canvas");
  HEAP32[(wp >>> 0) >>> 2 >>> 0] = Module["canvasW"] || c.width;
  HEAP32[(hp >>> 0) >>> 2 >>> 0] = Module["canvasH"] || c.height;
}

function _rxc_js_cursor(v) {
  const c = document.getElementById("canvas");
  if (c) c.style.cursor = v ? "default" : "none";
}

var RXC = {
  manifest: null,
  dirs: null,
  files: [],
  nextFd: 3,
  cache: new Map,
  cacheBytes: 0,
  cacheLimit: 536870912,
  overlay: new Map,
  mkdirs: new Set,
  tot: {
    fetches: 0,
    fetchKB: 0,
    fetchMs: 0
  },
  status: s => {
    if (Module["onStatus"]) Module["onStatus"](s); else {
      const el = document.getElementById("status");
      if (el) el.textContent = s;
    }
  },
  log: s => {
    console.log(s);
    if (Module["onLog"]) Module["onLog"](s);
  },
  norm: p => p.replace(/\//g, "\\").toLowerCase(),
  rel: p => {
    p = RXC.norm(p);
    return p.startsWith("c:\\game\\") ? p.slice(8) : (p === "c:\\game" ? "" : null);
  },
  idb: null,
  persistable: key => key.startsWith("c:\\users\\") || key.startsWith("c:\\game\\save\\") || (key.startsWith("c:\\game\\system\\") && key.endsWith(".ini")),
  async loadOverlay() {
    if (typeof indexedDB === "undefined") return;
    try {
      RXC.idb = await new Promise((res, rej) => {
        const r = indexedDB.open(Module["saveNamespace"] || "rexcomp", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("files");
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      const tx = RXC.idb.transaction("files", "readonly"), req = tx.objectStore("files").openCursor();
      let n = 0;
      await new Promise(done => {
        req.onsuccess = () => {
          const c = req.result;
          if (!c) return done();
          RXC.overlay.set(c.key, {
            data: new Uint8Array(c.value),
            size: c.value.byteLength
          });
          n++;
          c.continue();
        };
        req.onerror = done;
      });
      if (!n && !Module["saveNamespace"]) n = await RXC.migrateSaves();
      if (n) console.log("[web] restored " + n + " saved files from IndexedDB");
    } catch (e) {
      console.warn("[web] IndexedDB unavailable, saves will not persist:", e);
      RXC.idb = null;
    }
  },
  async migrateSaves() {
    if (!indexedDB.databases || !(await indexedDB.databases()).some(d => d.name === "sawasm")) return 0;
    const old = await new Promise((res, rej) => {
      const r = indexedDB.open("sawasm");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    let n = 0;
    if (old.objectStoreNames.contains("files")) {
      const req = old.transaction("files", "readonly").objectStore("files").openCursor();
      await new Promise(done => {
        req.onsuccess = () => {
          const c = req.result;
          if (!c) return done();
          RXC.overlay.set(c.key, {
            data: new Uint8Array(c.value),
            size: c.value.byteLength
          });
          n++;
          c.continue();
        };
        req.onerror = done;
      });
      const st = RXC.idb.transaction("files", "readwrite").objectStore("files");
      for (const [k, ov] of RXC.overlay) st.put(ov.data.slice(0, ov.size).buffer, k);
    }
    old.close();
    indexedDB.deleteDatabase("sawasm");
    return n;
  },
  persist(key) {
    if (!RXC.idb || !RXC.persistable(key)) return;
    try {
      const ov = RXC.overlay.get(key), st = RXC.idb.transaction("files", "readwrite").objectStore("files");
      if (ov) st.put(ov.data.slice(0, ov.size).buffer, key); else st.delete(key);
    } catch (e) {
      console.warn("[web] persist failed", key, e);
    }
  },
  async ensureManifest() {
    if (RXC.manifest) return;
    if (RXC.manifestP) return RXC.manifestP;
    RXC.manifestP = (async () => {
      await RXC.loadOverlay();
      RXC.base = Module["gameBase"] || "";
      let m = await RXC.openData();
      if (!m) m = await (await fetch(RXC.base + "manifest.json")).json();
      RXC.dirs = new Map;
      for (const k of Object.keys(m)) {
        let d = k;
        for (;;) {
          const i = d.lastIndexOf("\\");
          const parent = i < 0 ? "" : d.slice(0, i), name = i < 0 ? d : d.slice(i + 1);
          if (!RXC.dirs.has(parent)) RXC.dirs.set(parent, new Set);
          const had = RXC.dirs.get(parent).has(name);
          RXC.dirs.get(parent).add(name);
          if (i < 0 || had) break;
          d = parent;
        }
      }
      RXC.manifest = m;
      globalThis.__hcrReadFile = path => {
        const ov = RXC.overlay.get(RXC.norm(path));
        return ov ? (new TextDecoder).decode(ov.data.subarray(0, ov.size)) : null;
      };
    })();
    return RXC.manifestP;
  },
  async openData() {
    const url = RXC.base + "postal2.data";
    let r = await fetch(url, {
      headers: {
        Range: "bytes=0-262143"
      }
    });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("rexcomp.data: HTTP " + r.status);
    let head;
    if (r.status === 206) {
                                      
      RXC.dataUrl = url;
      RXC.dataSize = +r.headers.get("Content-Range").split("/")[1];
      head = new Uint8Array(await r.arrayBuffer());
    } else {
                                                            
      const total = +r.headers.get("Content-Length") || 0, reader = r.body.getReader(), parts = [];
      let got = 0, last = 0;
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.length;
        if (got - last > (4 << 20)) {
          last = got;
          RXC.status(`downloading the game data ${(got / 1048576) | 0}${total ? " / " + ((total / 1048576) | 0) : ""} MB`);
        }
      }
      head = RXC.data = new Uint8Array(got);
      let o = 0;
      for (const p of parts) {
        head.set(p, o);
        o += p.length;
      }
    }
    if ((new TextDecoder).decode(head.subarray(0, 8)) !== "RXCDATA1") throw new Error("rexcomp.data: not a game data file");
    const len = new DataView(head.buffer, head.byteOffset).getUint32(8, true);
    if (12 + len > head.length) head = new Uint8Array(await (await fetch(url, {
      headers: {
        Range: `bytes=0-${11 + len}`
      }
    })).arrayBuffer());
    const files = JSON.parse((new TextDecoder).decode(head.subarray(12, 12 + len))).files, m = {};
    RXC.offs = {};
    for (const k in files) {
      RXC.offs[k] = files[k][0];
      m[k] = files[k][1];
    }
    return m;
  },
  BLOCK: 1048576,
  capCache() {
    if (RXC.capped) return;
    RXC.capped = 1;
    const mb = +(new URLSearchParams(location.search).get("filecache") || Module["fileCacheMB"] || 0);
    if (mb > 0) RXC.cacheLimit = mb << 20;
    console.log("[web] block cache limit: " + (RXC.cacheLimit >> 20) + " MB");
  },
  fetchBlock(rel, b) {
    RXC.capCache();
    const key = rel + "#" + b, v = RXC.cache.get(key);
    if (v) {
      if (!(v instanceof Promise)) {
        RXC.cache.delete(key);
        RXC.cache.set(key, v);
      }
      return v;
    }
                
    const size = rel ? RXC.manifest[rel] : RXC.dataSize, start = b * RXC.BLOCK, end = Math.min(size, start + RXC.BLOCK) - 1;
    const url = rel ? RXC.base + "game/" + rel.split("\\").map(encodeURIComponent).join("/") : RXC.dataUrl;
    const p = (async () => {
      let r, blk;
      for (let attempt = 0; ;attempt++) {
        try {
          r = await fetch(url, {
            headers: {
              Range: `bytes=${start}-${end}`
            },
            cache: attempt ? "no-store" : "default"
          });
          if (!r.ok && r.status !== 206) throw new Error("HTTP " + r.status);
          blk = new Uint8Array(await r.arrayBuffer());
          break;
        } catch (e) {
          if (attempt === 0 || attempt % 10 === 9) console.warn(`[web] fetch ${rel} block ${b} failed (${e && e.message || e}), retrying`);
          await new Promise(res => setTimeout(res, Math.min(2e3, 50 * (1 << Math.min(attempt, 6)))));
        }
      }
      if (r.status === 200 && blk.length > end - start + 1) blk = blk.subarray(start, end + 1);
                             
      RXC.cache.set(key, blk);
      RXC.cacheBytes += blk.length;
      RXC.tot.fetches++;
      RXC.tot.fetchKB += blk.length >> 10;
      if (RXC.cacheBytes > RXC.cacheLimit) RXC.evict();
      return blk;
    })();
    RXC.cache.set(key, p);
    p.catch(() => RXC.cache.delete(key));
    return p;
  },
  evict() {
    for (const [k, v] of RXC.cache) {
      if (v instanceof Promise) continue;
      RXC.cache.delete(k);
      RXC.cacheBytes -= v.length;
      if (RXC.cacheBytes < RXC.cacheLimit * .7) break;
    }
  },
  readRange(rel, off, n) {
    const size = RXC.manifest[rel];
    if (off >= size) return new Uint8Array(0);
    if (off + n > size) n = size - off;
    if (!RXC.offs) return RXC.readBlocks(rel, off, n, size);
    const at = RXC.offs[rel] + off;
    return RXC.data ? RXC.data.subarray(at, at + n) : RXC.readBlocks("", at, n, RXC.dataSize);
  },
  readBlocks(rel, off, n, size) {
    const B = RXC.BLOCK, b0 = Math.floor(off / B), b1 = Math.floor((off + n - 1) / B);
    const parts = [];
    let pending = false;
    for (let b = b0; b <= b1; b++) {
      const v = RXC.fetchBlock(rel, b);
      if (v instanceof Promise) pending = true;
      parts.push(v);
    }
    if (b1 + 1 < Math.ceil(size / B) && !RXC.cache.has(rel + "#" + (b1 + 1))) RXC.fetchBlock(rel, b1 + 1).catch(() => {});
                            
    const assemble = blks => {
      if (b0 === b1) return blks[0].subarray(off - b0 * B, off - b0 * B + n);
      const out = new Uint8Array(n);
      let done = 0;
      for (let i = 0; i < blks.length && done < n; i++) {
        const s = i === 0 ? off - b0 * B : 0, take = Math.min(n - done, blks[i].length - s);
        if (take <= 0) break;
        out.set(blks[i].subarray(s, s + take), done);
        done += take;
      }
      return done === n ? out : out.subarray(0, done);
    };
    if (!pending) return assemble(parts);
    const tf = performance.now();
    return Promise.all(parts).then(blks => {
      RXC.tot.fetchMs += performance.now() - tf;
      return assemble(blks);
    });
  },
  hop(f) {
    if (!RXC.hopq) {
      RXC.hopq = [];
      RXC.hopc = new MessageChannel;
      RXC.hopc.port1.onmessage = () => {
        const q = RXC.hopq;
        RXC.hopq = [];
        RXC.lastMacro = performance.now();
        for (const g of q) g();
      };
    }
    RXC.hopq.push(f);
    if (RXC.hopq.length === 1) RXC.hopc.port2.postMessage(0);
  },
  lastMacro: 0
};

function _rxc_js_file_close(fd) {
  const f = RXC.files[fd];
  if (f && f.dirty) RXC.persist(f.key);
  delete RXC.files[fd];
  return 1;
}

async function _rxc_js_file_list(dirp) {
  await RXC.ensureManifest();
  const dir = UTF8ToString(dirp >>> 0), key = RXC.norm(dir).replace(/\\+$/, ""), rel = RXC.rel(key);
  const names = new Set;
  if (rel !== null && RXC.dirs.has(rel)) for (const n of RXC.dirs.get(rel)) names.add(n);
  for (const k of RXC.overlay.keys()) if (k.startsWith(key + "\\")) names.add(k.slice(key.length + 1).split("\\")[0]);
  for (const k of RXC.mkdirs) if (k.startsWith(key + "\\")) names.add(k.slice(key.length + 1).split("\\")[0]);
  if (!names.size) return 0;
  const s = [ ...names ].join("\n");
  const n = lengthBytesUTF8(s) + 1;
  const p = _malloc(n);
  stringToUTF8(s, p, n);
  return p;
}

_rxc_js_file_list.isAsync = true;

function _rxc_js_file_mkdir(pathp) {
  const k = RXC.norm(UTF8ToString(pathp >>> 0));
  if (RXC.mkdirs.has(k)) return 0;
  RXC.mkdirs.add(k);
  return 1;
}

async function _rxc_js_file_open(pathp, write, create, truncate) {
  await RXC.ensureManifest();
  const path = UTF8ToString(pathp >>> 0), key = RXC.norm(path), rel = RXC.rel(path);
  let ov = RXC.overlay.get(key);
  const inGame = rel !== null && rel in RXC.manifest;
  if (!ov && !inGame && !create) return -1;
  if (truncate && ov) {
    ov.data = new Uint8Array(0);
    ov.size = 0;
  }
  if (!ov && (create || write)) {
    ov = {
      data: new Uint8Array(0),
      size: 0
    };
    if (inGame && !truncate) {
      ov.data = (await RXC.readRange(rel, 0, RXC.manifest[rel])).slice();
      ov.size = ov.data.length;
    }
    RXC.overlay.set(key, ov);
  }
  const fd = RXC.nextFd++;
  RXC.files[fd] = {
    key,
    rel: inGame ? rel : null,
    ov
  };
  return fd;
}

_rxc_js_file_open.isAsync = true;

function _rxc_js_file_read_nb(fd, bufp, off, n, donep, resultp) {
  bufp >>>= 0;
  donep >>>= 0;
  resultp >>>= 0;
  const f = RXC.files[fd];
  if (!f) return -1;
  if (f.ov) {
    const end = Math.min(f.ov.size, off + n);
    if (off >= end) return 0;
    HEAPU8.set(f.ov.data.subarray(off, end), bufp >>> 0);
    return end - off;
  }
  const d = RXC.readRange(f.rel, off, n);
  if (!(d instanceof Promise)) {
    HEAPU8.set(d, bufp >>> 0);
    return d.length;
  }
  d.then(data => {
    HEAPU8.set(data, bufp >>> 0);
    HEAP32[resultp >>> 2 >>> 0] = data.length;
    HEAP32[donep >>> 2 >>> 0] = 1;
  }, () => {
    HEAP32[resultp >>> 2 >>> 0] = -1;
    HEAP32[donep >>> 2 >>> 0] = 1;
  });
  return -2;
}

function _rxc_js_file_size(fd) {
  const f = RXC.files[fd];
  if (!f) return 0;
  return f.ov ? f.ov.size : RXC.manifest[f.rel];
}

async function _rxc_js_file_stat(pathp, sizep, isdirp) {
  pathp >>>= 0;
  sizep >>>= 0;
  isdirp >>>= 0;
  await RXC.ensureManifest();
  const path = UTF8ToString(pathp), key = RXC.norm(path).replace(/\\+$/, ""), rel = RXC.rel(key);
  const ov = RXC.overlay.get(key);
  if (ov) {
    HEAPF64[sizep >>> 3 >>> 0] = ov.size;
    HEAP32[isdirp >>> 2 >>> 0] = 0;
    return 1;
  }
  if (rel !== null) {
    if (rel in RXC.manifest) {
      HEAPF64[sizep >>> 3 >>> 0] = RXC.manifest[rel];
      HEAP32[isdirp >>> 2 >>> 0] = 0;
      return 1;
    }
    if (rel === "" || RXC.dirs.has(rel)) {
      HEAPF64[sizep >>> 3 >>> 0] = 0;
      HEAP32[isdirp >>> 2 >>> 0] = 1;
      return 1;
    }
  }
  for (const k of RXC.overlay.keys()) if (k.startsWith(key + "\\")) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  if (RXC.mkdirs.has(key)) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  if (/^c:(\\(users(\\player(\\documents)?)?|windows))?$/.test(key)) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  return 0;
}

_rxc_js_file_stat.isAsync = true;

function _rxc_js_file_unlink(pathp) {
  const k = RXC.norm(UTF8ToString(pathp >>> 0));
  const ok = RXC.overlay.delete(k);
  if (ok) RXC.persist(k);
  return ok ? 1 : 0;
}

function _rxc_js_file_write(fd, bufp, off, n) {
  bufp >>>= 0;
  const f = RXC.files[fd];
  if (!f) return -1;
  f.dirty = true;
  if (!f.ov) {
    f.ov = {
      data: new Uint8Array(0),
      size: 0
    };
    RXC.overlay.set(f.key, f.ov);
  }
  const need = off + n;
  if (need > f.ov.data.length) {
    const nd = new Uint8Array(Math.max(need, f.ov.data.length * 2, 4096));
    nd.set(f.ov.data);
    f.ov.data = nd;
  }
  f.ov.data.set(HEAPU8.subarray(bufp >>> 0, bufp + n >>> 0), off);
  if (need > f.ov.size) f.ov.size = need;
  return n;
}

async function _rxc_js_load_image(dest, size) {
  dest >>>= 0;
  try {
    const r = await fetch("postal2-image.bin");
    if (!r.ok) return 0;
    const reader = r.body.getReader();
    let off = 0, last = 0;
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      if (off + value.length > size) return 0;
      HEAPU8.set(value, dest + off >>> 0);
      off += value.length;
      if (off - last > (4 << 20)) {
        last = off;
        RXC.status(`downloading the game code ${(off / 1048576) | 0} / ${(size / 1048576) | 0} MB`);
      }
    }
    return off === size ? 1 : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

_rxc_js_load_image.isAsync = true;

function _rxc_js_log(p) {
  RXC.log(UTF8ToString(p >>> 0));
}

function _rxc_js_note_program(p) {
  const k = UTF8ToString(p >>> 0);
  try {
    const cur = localStorage.getItem("rxcProgs") || "";
    if (!cur.includes(k) && cur.length < 2e6) localStorage.setItem("rxcProgs", cur + k + "\n");
  } catch (e) {}
}

function _rxc_js_now() {
  return performance.now();
}

function _rxc_js_open_url(p) {
  const url = UTF8ToString(p >>> 0);
  try {
    if (document.pointerLockElement) document.exitPointerLock();
  } catch (e) {}
  window.open(url, "_blank");
}

var _rxc_js_openal_ready = function() {
  const contexts = () => [ ...new Set([ Module["audioContext"], ...Object.values(AL.contexts).map(context => context.audioCtx) ].filter(Boolean)) ];
  Module["setAudioEnabled"] = enabled => {
    Module["audioEnabled"] = !!enabled;
    return Promise.all(contexts().filter(context => context.state !== "closed").map(context => enabled ? context.resume() : context.suspend()));
  };
  if (Module["audioEnabled"] === false) Module["setAudioEnabled"](false);
};

function _rxc_js_present(frames, w, h, progs, texkb, bufkb, glns) {
  if (Module["gameW"] !== w || Module["gameH"] !== h) {
    Module["gameW"] = w;
    Module["gameH"] = h;
    if (Module["onGameSize"]) Module["onGameSize"](w, h);
  }
  const now = performance.now(), st = RXC.fst || (RXC.fst = {
    t0: now,
    n: 0,
    last: now,
    prev: null
  });
  st.n++;
  if (now - st.t0 >= 1e3) {
    globalThis.__hcrFps = st.n * 1e3 / (now - st.t0);
    globalThis.__hcrGlMs = (glns - (st.gl0 || 0)) / 1e6 / st.n;
    st.gl0 = glns;
    st.t0 = now;
    st.n = 0;
    if (Module["onFps"]) Module["onFps"](globalThis.__hcrFps);
  }
                                                                                        
  const dt = now - st.last, t = RXC.tot, p = st.prev || {
    progs,
    texkb,
    bufkb,
    fetches: t.fetches,
    fetchKB: t.fetchKB,
    fetchMs: t.fetchMs
  };
  const ft = globalThis.__hcrFrameTimes || (globalThis.__hcrFrameTimes = []);
  ft.push(dt);
  if (ft.length > 2e4) ft.splice(0, 1e4);
  if (dt > 40 && RXC.presented) {
    const h = {
      t: +(now / 1e3).toFixed(2),
      ms: +dt.toFixed(1),
      progs: progs - p.progs,
      texKB: texkb - p.texkb,
      bufKB: bufkb - p.bufkb,
      fetches: t.fetches - p.fetches,
      fetchKB: t.fetchKB - p.fetchKB,
      fetchWaitMs: +(t.fetchMs - p.fetchMs).toFixed(1)
    };
    (globalThis.__hcrHitches || (globalThis.__hcrHitches = [])).push(h);
    if (globalThis.__hcrHitches.length > 500) globalThis.__hcrHitches.shift();
  }
  st.prev = {
    progs,
    texkb,
    bufkb,
    fetches: t.fetches,
    fetchKB: t.fetchKB,
    fetchMs: t.fetchMs
  };
  st.last = now;
  if (!RXC.presented) {
    RXC.presented = true;
    if (Module["onFirstFrame"]) Module["onFirstFrame"]();
  }
}

function _rxc_js_program_list() {
  const t = Module["programList"] || "";
  if (!t) return 0;
  const n = lengthBytesUTF8(t) + 1, p = _malloc(n);
  stringToUTF8(t, p, n);
  return p;
}

function _rxc_js_set_title(p) {
  document.title = UTF8ToString(p >>> 0);
}

var _rxc_js_sleep = function(ms) {
  const done = r => () => {
    RXC.lastMacro = performance.now();
    r();
  };
  if (ms < 1) return new Promise(r => RXC.hop(done(r)));
  if (globalThis.scheduler && scheduler.postTask) return new Promise(r => scheduler.postTask(done(r), {
    delay: ms,
    priority: "user-blocking"
  }));
  return new Promise(r => setTimeout(done(r), ms));
};

_rxc_js_sleep.isAsync = true;

var _rxc_js_stack_call = function(context, target) {
  return new Promise((resolve, reject) => queueMicrotask(() => {
    try {
      Promise.resolve(Module["_rxc_stack_call"](context >>> 0, target >>> 0)).then(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }));
};

_rxc_js_stack_call.isAsync = true;

function _rxc_js_status(p) {
  RXC.status(UTF8ToString(p >>> 0));
}

async function _rxc_js_tex_png(tex, p, n) {
  p >>>= 0;
  try {
    const bmp = await createImageBitmap(new Blob([ HEAPU8.slice(p, p + n) ], {
      type: "image/png"
    }), {
      premultiplyAlpha: "none",
      colorSpaceConversion: "none"
    });
    const g = GLctx, unit = g.getParameter(g.ACTIVE_TEXTURE);
    g.activeTexture(g.TEXTURE0);
    const prev = g.getParameter(g.TEXTURE_BINDING_2D);
    g.bindTexture(g.TEXTURE_2D, GL.textures[tex]);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false);
    g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, bmp);
    g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.bindTexture(g.TEXTURE_2D, prev);
    g.activeTexture(unit);
    return 1;
  } catch (e) {
    console.error("[credits]", e);
    return 0;
  }
}

_rxc_js_tex_png.isAsync = true;

var RXCT = {
  th: []
};

var stackRestore = val => __emscripten_stack_restore(val);

function _rxc_js_thread_switch(from, to, newStackTop) {
  const f = RXCT.th[from] || (RXCT.th[from] = {});
  const suspended = new Promise(res => {
    f.resume = res;
  });
  const later = fn => (performance.now() - RXC.lastMacro > 16 ? RXC.hop : queueMicrotask)(fn);
  if (newStackTop) {
    later(() => {
      stackRestore(newStackTop);
      const p = Module["_rxc_thread_start"](to);
      if (p && p.catch) p.catch(e => {
        console.error("guest thread " + to + " died:", e);
        const m = e && e.message || (e && e.type) || (typeof e === "object" ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : String(e));
        RXC.status("guest thread " + to + " crashed: " + m);
      });
    });
  } else {
    const t = RXCT.th[to];
    if (!t || !t.resume) {
      console.error("rxc_js_thread_switch: thread " + to + " is not suspended");
      return suspended;
    }
    const r = t.resume;
    t.resume = null;
    if (performance.now() - RXC.lastMacro > 16) RXC.hop(r); else r();
  }
  return suspended;
}

_rxc_js_thread_switch.isAsync = true;

var _rxc_js_yield = function() {
  if (RXC.vsync === undefined) RXC.vsync = new URLSearchParams(location.search).has("vsync") || !!Module["vsync"];
  if (!RXC.vsync) return new Promise(r => RXC.hop(r));
  return new Promise(r => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        RXC.lastMacro = performance.now();
        r();
      }
    };
    requestAnimationFrame(go);
    setTimeout(go, 100);
  });
};

_rxc_js_yield.isAsync = true;

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

var runAndAbortIfError = func => {
  try {
    return func();
  } catch (e) {
    abort(e);
  }
};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

var Asyncify = {
  instrumentWasmImports(imports) {
    var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
    for (let [x, original] of Object.entries(imports)) {
      if (typeof original == "function") {
        let isAsyncifyImport = original.isAsync || importPattern.test(x);
                                                                     
        if (isAsyncifyImport) {
          imports[x] = original = new WebAssembly.Suspending(original);
        }
      }
    }
  },
  instrumentFunction(original) {
    var wrapper = (...args) => original(...args);
    return wrapper;
  },
  instrumentWasmExports(exports) {
    var exportPattern = /^(main|rxc_thread_start|rxc_stack_call|main|__main_argc_argv)$/;
    Asyncify.asyncExports = new Set;
    var ret = {};
    for (let [x, original] of Object.entries(exports)) {
      if (typeof original == "function") {
                                                                  
        let isAsyncifyExport = exportPattern.test(x);
        if (isAsyncifyExport) {
          Asyncify.asyncExports.add(original);
          original = Asyncify.makeAsyncFunction(original);
        }
        var wrapper = Asyncify.instrumentFunction(original);
        ret[x] = wrapper;
      } else {
        ret[x] = original;
      }
    }
    return ret;
  },
  asyncExports: null,
  isAsyncExport(func) {
    return Asyncify.asyncExports?.has(func);
  },
  handleAsync: async startAsync => {
    try {
      return await startAsync();
    } finally {}
  },
  handleSleep: startAsync => Asyncify.handleAsync(() => new Promise(startAsync)),
  makeAsyncFunction(original) {
    return WebAssembly.promising(original);
  }
};

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;

Module["pauseMainLoop"] = MainLoop.pause;

Module["resumeMainLoop"] = MainLoop.resume;

MainLoop.init();

                                                                       
                                                                            
registerPreMainLoop(() => GL.newRenderingFrameStarted());

for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

var miniTempWebGLFloatBuffersStorage = new Float32Array(288);

                                                                                                                          
for (                          var i = 0; i <= 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
}

var miniTempWebGLIntBuffersStorage = new Int32Array(288);

                                                                                                                          
for (                          var i = 0; i <= 288; ++i) {
  miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
}

                      
                          
                                                                          
                                         
{
                          
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
                        
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
}

                        
Module["ENV"] = ENV;

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8"] = stringToUTF8;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

                      
                           
                         
                              
var ASM_CONSTS = {
  2149589176: () => new URLSearchParams(location.search).has("preserve") ? 1 : 0
};

function postal2_ui_cursor(visible, x, y) {
  if (Module["onMenuCursor"]) Module["onMenuCursor"](visible, x, y);
}

postal2_ui_cursor.sig = "viff";

                                
var _free, _malloc, _rxc_ev_mouse, _rxc_ev_mouse_raw, _rxc_ev_key, _rxc_ev_fps, _rxc_ev_dump, _rxc_ev_opt, _rxc_ev_touch, _rxc_ev_char, _rxc_ev_focus, _main, __emscripten_stack_restore, _rxc_thread_start, _rxc_stack_call, __emscripten_stack_alloc, memory, __indirect_function_table, wasmMemory;

function assignWasmExports(wasmExports) {
  _free = Module["_free"] = wasmExports["free"];
  _malloc = Module["_malloc"] = wasmExports["malloc"];
  _rxc_ev_mouse = Module["_rxc_ev_mouse"] = wasmExports["rxc_ev_mouse"];
  _rxc_ev_mouse_raw = Module["_rxc_ev_mouse_raw"] = wasmExports["rxc_ev_mouse_raw"];
  _rxc_ev_key = Module["_rxc_ev_key"] = wasmExports["rxc_ev_key"];
  _rxc_ev_fps = Module["_rxc_ev_fps"] = wasmExports["rxc_ev_fps"];
  _rxc_ev_dump = Module["_rxc_ev_dump"] = wasmExports["rxc_ev_dump"];
  _rxc_ev_opt = Module["_rxc_ev_opt"] = wasmExports["rxc_ev_opt"];
  _rxc_ev_touch = Module["_rxc_ev_touch"] = wasmExports["rxc_ev_touch"];
  _rxc_ev_char = Module["_rxc_ev_char"] = wasmExports["rxc_ev_char"];
  _rxc_ev_focus = Module["_rxc_ev_focus"] = wasmExports["rxc_ev_focus"];
  _main = Module["_main"] = wasmExports["__main_argc_argv"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  _rxc_thread_start = Module["_rxc_thread_start"] = wasmExports["rxc_thread_start"];
  _rxc_stack_call = Module["_rxc_stack_call"] = wasmExports["rxc_stack_call"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  memory = wasmMemory = wasmExports["memory"];
  __indirect_function_table = wasmExports["__indirect_function_table"];
}

var wasmImports = {
                 __syscall_fcntl64: ___syscall_fcntl64,
                 __syscall_ioctl: ___syscall_ioctl,
                 __syscall_openat: ___syscall_openat,
                 _abort_js: __abort_js,
                 _gmtime_js: __gmtime_js,
                 _localtime_js: __localtime_js,
                 _timegm_js: __timegm_js,
                 _tzset_js: __tzset_js,
                 alBufferData: _alBufferData,
                 alDeleteBuffers: _alDeleteBuffers,
                 alDeleteSources: _alDeleteSources,
                 alDisable: _alDisable,
                 alDistanceModel: _alDistanceModel,
                 alDopplerFactor: _alDopplerFactor,
                 alDopplerVelocity: _alDopplerVelocity,
                 alEnable: _alEnable,
                 alGenBuffers: _alGenBuffers,
                 alGenSources: _alGenSources,
                 alGetBoolean: _alGetBoolean,
                 alGetBooleanv: _alGetBooleanv,
                 alGetBufferf: _alGetBufferf,
                 alGetBufferi: _alGetBufferi,
                 alGetDouble: _alGetDouble,
                 alGetDoublev: _alGetDoublev,
                 alGetEnumValue: _alGetEnumValue,
                 alGetError: _alGetError,
                 alGetFloat: _alGetFloat,
                 alGetFloatv: _alGetFloatv,
                 alGetInteger: _alGetInteger,
                 alGetIntegerv: _alGetIntegerv,
                 alGetListener3f: _alGetListener3f,
                 alGetListenerf: _alGetListenerf,
                 alGetListenerfv: _alGetListenerfv,
                 alGetListeneri: _alGetListeneri,
                 alGetSourcef: _alGetSourcef,
                 alGetSourcefv: _alGetSourcefv,
                 alGetSourcei: _alGetSourcei,
                 alGetString: _alGetString,
                 alIsBuffer: _alIsBuffer,
                 alIsEnabled: _alIsEnabled,
                 alIsSource: _alIsSource,
                 alListener3f: _alListener3f,
                 alListenerf: _alListenerf,
                 alListenerfv: _alListenerfv,
                 alListeneri: _alListeneri,
                 alSource3f: _alSource3f,
                 alSourcePause: _alSourcePause,
                 alSourcePausev: _alSourcePausev,
                 alSourcePlay: _alSourcePlay,
                 alSourcePlayv: _alSourcePlayv,
                 alSourceQueueBuffers: _alSourceQueueBuffers,
                 alSourceRewind: _alSourceRewind,
                 alSourceRewindv: _alSourceRewindv,
                 alSourceStop: _alSourceStop,
                 alSourceStopv: _alSourceStopv,
                 alSourceUnqueueBuffers: _alSourceUnqueueBuffers,
                 alSourcef: _alSourcef,
                 alSourcefv: _alSourcefv,
                 alSourcei: _alSourcei,
                 alcCloseDevice: _alcCloseDevice,
                 alcCreateContext: _alcCreateContext,
                 alcDestroyContext: _alcDestroyContext,
                 alcGetContextsDevice: _alcGetContextsDevice,
                 alcGetCurrentContext: _alcGetCurrentContext,
                 alcGetEnumValue: _alcGetEnumValue,
                 alcGetError: _alcGetError,
                 alcGetIntegerv: _alcGetIntegerv,
                 alcGetString: _alcGetString,
                 alcMakeContextCurrent: _alcMakeContextCurrent,
                 alcOpenDevice: _alcOpenDevice,
                 alcProcessContext: _alcProcessContext,
                 alcSuspendContext: _alcSuspendContext,
                 emscripten_asm_const_int: _emscripten_asm_const_int,
                 emscripten_date_now: _emscripten_date_now,
                 emscripten_force_exit: _emscripten_force_exit,
                 emscripten_get_heap_max: _emscripten_get_heap_max,
                 emscripten_get_now: _emscripten_get_now,
                 emscripten_resize_heap: _emscripten_resize_heap,
                 emscripten_return_address: _emscripten_return_address,
                 emscripten_webgl_create_context: _emscripten_webgl_create_context,
                 emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
                 emscripten_webgl_get_current_context: _emscripten_webgl_get_current_context,
                 emscripten_webgl_get_drawing_buffer_size: _emscripten_webgl_get_drawing_buffer_size,
                 emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
                 environ_get: _environ_get,
                 environ_sizes_get: _environ_sizes_get,
                 fd_close: _fd_close,
                 fd_read: _fd_read,
                 fd_seek: _fd_seek,
                 fd_write: _fd_write,
                 glActiveTexture: _glActiveTexture,
                 glAttachShader: _glAttachShader,
                 glBeginQuery: _glBeginQuery,
                 glBindAttribLocation: _glBindAttribLocation,
                 glBindBuffer: _glBindBuffer,
                 glBindFramebuffer: _glBindFramebuffer,
                 glBindRenderbuffer: _glBindRenderbuffer,
                 glBindSampler: _glBindSampler,
                 glBindTexture: _glBindTexture,
                 glBindVertexArray: _glBindVertexArray,
                 glBlendColor: _glBlendColor,
                 glBlendEquationSeparate: _glBlendEquationSeparate,
                 glBlendFuncSeparate: _glBlendFuncSeparate,
                 glBlitFramebuffer: _glBlitFramebuffer,
                 glBufferData: _glBufferData,
                 glBufferSubData: _glBufferSubData,
                 glCheckFramebufferStatus: _glCheckFramebufferStatus,
                 glClear: _glClear,
                 glClearColor: _glClearColor,
                 glClearDepthf: _glClearDepthf,
                 glClearStencil: _glClearStencil,
                 glColorMask: _glColorMask,
                 glCompileShader: _glCompileShader,
                 glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
                 glCreateProgram: _glCreateProgram,
                 glCreateShader: _glCreateShader,
                 glCullFace: _glCullFace,
                 glDeleteBuffers: _glDeleteBuffers,
                 glDeleteFramebuffers: _glDeleteFramebuffers,
                 glDeleteProgram: _glDeleteProgram,
                 glDeleteQueries: _glDeleteQueries,
                 glDeleteRenderbuffers: _glDeleteRenderbuffers,
                 glDeleteShader: _glDeleteShader,
                 glDeleteTextures: _glDeleteTextures,
                 glDeleteVertexArrays: _glDeleteVertexArrays,
                 glDepthFunc: _glDepthFunc,
                 glDepthMask: _glDepthMask,
                 glDepthRangef: _glDepthRangef,
                 glDisable: _glDisable,
                 glDisableVertexAttribArray: _glDisableVertexAttribArray,
                 glDrawArrays: _glDrawArrays,
                 glDrawBuffers: _glDrawBuffers,
                 glDrawElements: _glDrawElements,
                 glDrawElementsInstanced: _glDrawElementsInstanced,
                 glEnable: _glEnable,
                 glEnableVertexAttribArray: _glEnableVertexAttribArray,
                 glEndQuery: _glEndQuery,
                 glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
                 glFramebufferTexture2D: _glFramebufferTexture2D,
                 glFrontFace: _glFrontFace,
                 glGenBuffers: _glGenBuffers,
                 glGenFramebuffers: _glGenFramebuffers,
                 glGenQueries: _glGenQueries,
                 glGenRenderbuffers: _glGenRenderbuffers,
                 glGenSamplers: _glGenSamplers,
                 glGenTextures: _glGenTextures,
                 glGenVertexArrays: _glGenVertexArrays,
                 glGenerateMipmap: _glGenerateMipmap,
                 glGetActiveUniform: _glGetActiveUniform,
                 glGetAttribLocation: _glGetAttribLocation,
                 glGetError: _glGetError,
                 glGetIntegerv: _glGetIntegerv,
                 glGetProgramInfoLog: _glGetProgramInfoLog,
                 glGetProgramiv: _glGetProgramiv,
                 glGetQueryObjectuiv: _glGetQueryObjectuiv,
                 glGetShaderInfoLog: _glGetShaderInfoLog,
                 glGetShaderiv: _glGetShaderiv,
                 glGetString: _glGetString,
                 glGetUniformLocation: _glGetUniformLocation,
                 glLinkProgram: _glLinkProgram,
                 glPixelStorei: _glPixelStorei,
                 glPolygonOffset: _glPolygonOffset,
                 glReadPixels: _glReadPixels,
                 glRenderbufferStorage: _glRenderbufferStorage,
                 glSamplerParameterf: _glSamplerParameterf,
                 glSamplerParameteri: _glSamplerParameteri,
                 glScissor: _glScissor,
                 glShaderSource: _glShaderSource,
                 glStencilFuncSeparate: _glStencilFuncSeparate,
                 glStencilMaskSeparate: _glStencilMaskSeparate,
                 glStencilOpSeparate: _glStencilOpSeparate,
                 glTexImage2D: _glTexImage2D,
                 glTexParameterf: _glTexParameterf,
                 glTexParameteri: _glTexParameteri,
                 glTexStorage2D: _glTexStorage2D,
                 glTexSubImage2D: _glTexSubImage2D,
                 glUniform1f: _glUniform1f,
                 glUniform1fv: _glUniform1fv,
                 glUniform1i: _glUniform1i,
                 glUniform1iv: _glUniform1iv,
                 glUniform2f: _glUniform2f,
                 glUniform2fv: _glUniform2fv,
                 glUniform2i: _glUniform2i,
                 glUniform2iv: _glUniform2iv,
                 glUniform3f: _glUniform3f,
                 glUniform3fv: _glUniform3fv,
                 glUniform3i: _glUniform3i,
                 glUniform3iv: _glUniform3iv,
                 glUniform4f: _glUniform4f,
                 glUniform4fv: _glUniform4fv,
                 glUniform4i: _glUniform4i,
                 glUniform4iv: _glUniform4iv,
                 glUniformMatrix2fv: _glUniformMatrix2fv,
                 glUniformMatrix3fv: _glUniformMatrix3fv,
                 glUniformMatrix4fv: _glUniformMatrix4fv,
                 glUseProgram: _glUseProgram,
                 glVertexAttrib4f: _glVertexAttrib4f,
                 glVertexAttribDivisor: _glVertexAttribDivisor,
                 glVertexAttribPointer: _glVertexAttribPointer,
                 glViewport: _glViewport,
                 postal2_ui_cursor,
                 rxc_js_audio_init: _rxc_js_audio_init,
                 rxc_js_audio_push: _rxc_js_audio_push,
                 rxc_js_canvas_size: _rxc_js_canvas_size,
                 rxc_js_cursor: _rxc_js_cursor,
                 rxc_js_file_close: _rxc_js_file_close,
                 rxc_js_file_list: _rxc_js_file_list,
                 rxc_js_file_mkdir: _rxc_js_file_mkdir,
                 rxc_js_file_open: _rxc_js_file_open,
                 rxc_js_file_read_nb: _rxc_js_file_read_nb,
                 rxc_js_file_size: _rxc_js_file_size,
                 rxc_js_file_stat: _rxc_js_file_stat,
                 rxc_js_file_unlink: _rxc_js_file_unlink,
                 rxc_js_file_write: _rxc_js_file_write,
                 rxc_js_load_image: _rxc_js_load_image,
                 rxc_js_log: _rxc_js_log,
                 rxc_js_note_program: _rxc_js_note_program,
                 rxc_js_now: _rxc_js_now,
                 rxc_js_open_url: _rxc_js_open_url,
                 rxc_js_openal_ready: _rxc_js_openal_ready,
                 rxc_js_present: _rxc_js_present,
                 rxc_js_program_list: _rxc_js_program_list,
                 rxc_js_set_title: _rxc_js_set_title,
                 rxc_js_sleep: _rxc_js_sleep,
                 rxc_js_stack_call: _rxc_js_stack_call,
                 rxc_js_status: _rxc_js_status,
                 rxc_js_tex_png: _rxc_js_tex_png,
                 rxc_js_thread_switch: _rxc_js_thread_switch,
                 rxc_js_yield: _rxc_js_yield
};

                                                             
                                                                  
          
function applySignatureConversions(wasmExports) {
                                                      
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
  wasmExports["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports["_emscripten_stack_alloc"]);
  return wasmExports;
}

                        
                                                     
async function callMain(args = []) {
  var entryFunction = _main;
  args.unshift(thisProgram);
  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  for (var arg of args) {
    HEAPU32[((argv_ptr) >>> 2) >>> 0] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  }
  HEAPU32[((argv_ptr) >>> 2) >>> 0] = 0;
  try {
    var ret = entryFunction(argc, argv);
                                                                               
                                                            
                                                                      
    ret = await ret;
                                                                   
    exitJS(ret,                  true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  preRun();
                                                          
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  async function doRun() {
                                                                                                  
                                                            
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    readyPromiseResolve?.(Module);
    Module["onRuntimeInitialized"]?.();
    var noInitialRun = Module["noInitialRun"] || false;
    if (!noInitialRun) await callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(() => {
      setTimeout(() => Module["setStatus"](""), 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

var wasmExports;

                                                                           
                                                       
wasmExports = await (createWasm());

run();

                            
                                   
                                                                      
                                                                   
                                                                        
                                               
if (runtimeInitialized) {
  moduleRtn = Module;
} else {
                                                                
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}


    return moduleRtn;
  };
})();

                                                              
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = Rexcomp;
                                                                         
                           
  module.exports.default = Rexcomp;
} else if (typeof define === 'function' && define['amd'])
  define([], () => Rexcomp);

