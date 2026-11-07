                                                                               
                                                                                 
(() => {
  const fetchFile = globalThis.fetch.bind(globalThis);
  const settings = globalThis.document?.currentScript?.dataset || {};
  const chunksBase = settings.chunksBase || '';
  const runtimeBase = settings.runtimeBase || '';
  const archives = new Map();
  const runtimeManifests = new Map();
  const complete = new Map(), pending = new Map();
  const failures = new Map();
  const CACHE_PARTS = 3, MAX_DOWNLOADS = 3;
  let active = 0;
  const waiting = [];

  async function manifest(archive, cache = 'default') {
    const url = chunksBase ? new URL('manifest.json', chunksBase).href : new URL('chunks/manifest.json', archive).href;
    if (!archives.has(url)) {
      const task = (async () => {
        const response = await fetchFile(url, {cache});
        if (response.status === 404 && !chunksBase) return null;                                        
        if (!response.ok) throw new Error(`Chunk manifest: HTTP ${response.status}`);
        const info = await response.json();
        if (info.version !== 1 || !Number.isSafeInteger(info.totalSize) || info.totalSize <= 0 ||
            !Number.isSafeInteger(info.chunkSize) || info.chunkSize <= 0 ||
            !Array.isArray(info.parts) || info.parts.length !== Math.ceil(info.totalSize / info.chunkSize)) {
          throw new Error('Invalid POSTAL 2 chunk manifest');
        }
        info.parts.forEach((part, index) => {
          if (part.file !== `postal2-${String(index).padStart(4, '0')}.part` ||
              part.size !== Math.min(info.chunkSize, info.totalSize - index * info.chunkSize) ||
              !/^[a-f0-9]{64}$/.test(part.sha256)) throw new Error(`Invalid chunk ${index}`);
        });
        info.url = url;
        return info;
      })();
      archives.set(url, task);
      task.then(info => { if (!info) archives.delete(url); }, () => archives.delete(url));
    }
    return archives.get(url);
  }

  async function runtimeInfo(archive, name, cache = 'default') {
    const url = new URL('manifest.json', new URL(runtimeBase, archive)).href;
    if (!runtimeManifests.has(url)) {
      const task = (async () => {
        const response = await fetchFile(url, {cache});
        if (!response.ok) throw new Error(`Runtime manifest: HTTP ${response.status}`);
        const info = await response.json();
        if (info.version !== 1 || !Number.isSafeInteger(info.chunkSize) || info.chunkSize <= 0 || !info.files)
          throw new Error('Invalid POSTAL 2 runtime manifest');
        for (const [file, prefix] of [['postal2.wasm', 'postal2-wasm'], ['postal2-image.bin', 'postal2-image']]) {
          const asset = info.files[file];
          if (!asset || !Number.isSafeInteger(asset.size) || asset.size <= 0 ||
              !/^[a-f0-9]{64}$/.test(asset.sha256) || !Array.isArray(asset.parts) ||
              asset.parts.length !== Math.ceil(asset.size / info.chunkSize)) throw new Error(`Invalid runtime asset: ${file}`);
          asset.parts.forEach((part, index) => {
            if (part.file !== `${prefix}-${String(index).padStart(4, '0')}.part` ||
                part.size !== Math.min(info.chunkSize, asset.size - index * info.chunkSize) ||
                !/^[a-f0-9]{64}$/.test(part.sha256)) throw new Error(`Invalid runtime part: ${file} ${index}`);
          });
        }
        return info;
      })();
      runtimeManifests.set(url, task);
      task.catch(() => runtimeManifests.delete(url));
    }
    const info = await runtimeManifests.get(url);
    return {...info.files[name], totalSize:info.files[name].size, chunkSize:info.chunkSize, url};
  }

  async function downloadPart(part, url, cache) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      try {
        const response = await fetchFile(url, {
          cache: attempt || failures.has(url) ? 'no-store' : cache,
          signal: controller.signal,
        });
        if (!response.ok) {
          let detail = '';
          if ((response.headers.get('Content-Type') || '').includes('text/plain'))
            detail = ': ' + (await response.text()).replace(/\s+/g, ' ').slice(0, 180);
          const error = new Error(`HTTP ${response.status}${detail}`);
          error.status = response.status;
          throw error;
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length !== part.size) throw new Error(`incomplete chunk (${bytes.length}/${part.size} bytes)`);
        if (globalThis.crypto?.subtle) {
          const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
          const hex = Array.from(hash, value => value.toString(16).padStart(2, '0')).join('');
          if (hex !== part.sha256) throw new Error('checksum mismatch');
        }
        return bytes;
      } catch (error) {
        if (attempt === 2 || error.status === 404 || error.status === 410)
          throw new Error(`${part.file}: ${error.name}: ${error.message} (${url})`);
        console.warn(`[data] ${part.file}: ${error.message}; retrying without cache`);
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  async function partBytes(info, index, cache = 'default') {
    const part = info.parts[index], url = new URL(part.file, info.url).href;
    if (complete.has(url)) {
      const bytes = complete.get(url);
      complete.delete(url); complete.set(url, bytes);
      return bytes;
    }
    const failed = failures.get(url);
    if (failed && Date.now() < failed.retryAt) throw failed.error;
    if (!pending.has(url)) {
      const task = (async () => {
        if (active >= MAX_DOWNLOADS) await new Promise(resolve => waiting.push(resolve));
        else active++;
        try {
          const bytes = await downloadPart(part, url, cache);
          const previous = failures.get(url);
          failures.delete(url);
          const status = globalThis.document?.getElementById?.('status');
          if (previous && status?.textContent === previous.message) status.textContent = 'Loading…';
          complete.set(url, bytes);
          while (complete.size > CACHE_PARTS) complete.delete(complete.keys().next().value);
          return bytes;
        } catch (error) {
          const message = `Download delayed: ${part.file}. ${error.message}. Retrying in 15 seconds.`;
          failures.set(url, {error, retryAt:Date.now() + 15000, message});
          globalThis.rexcomp?.onStatus?.(message);
          console.error('[data] ' + error.message);
          throw error;
        } finally {
          if (waiting.length) waiting.shift()();
          else active--;
        }
      })();
      pending.set(url, task);
      task.then(() => pending.delete(url), () => pending.delete(url));
    }
    return pending.get(url);
  }

  async function read(info, start, end, cache) {
    const result = new Uint8Array(end - start + 1);
    for (let offset = start; offset <= end;) {
      const index = Math.floor(offset / info.chunkSize), within = offset % info.chunkSize;
      const bytes = await partBytes(info, index, cache);
      const count = Math.min(end - offset + 1, bytes.length - within);
      result.set(bytes.subarray(within, within + count), offset - start);
      offset += count;
    }
    return result;
  }

  globalThis.postal2DataFetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href);
    const name = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
    const runtime = !!runtimeBase && (name === 'postal2.wasm' || name === 'postal2-image.bin');
    if (!runtime && name !== 'postal2.data') return fetchFile(input, init);
    const cache = init.cache || (input instanceof Request ? input.cache : 'default');
    const info = runtime ? await runtimeInfo(url, name, cache) : await manifest(url, cache);
    if (!info) return new Response(null, {status: 404});
    const method = (init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const headers = new Headers({'Content-Type': runtime && name === 'postal2.wasm' ? 'application/wasm' : 'application/octet-stream', 'Accept-Ranges': 'bytes'});
    if (method === 'HEAD') {
      headers.set('Content-Length', String(info.totalSize));
      return new Response(null, {status: 200, headers});
    }
    if (method !== 'GET') return new Response(null, {status: 405});
    const requestHeaders = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const range = requestHeaders.get('Range');
    if (!range) {
                                                                             
      let index = 0;
      headers.set('Content-Length', String(info.totalSize));
      const body = new ReadableStream({async pull(controller) {
        if (index === info.parts.length) { controller.close(); return; }
        try { controller.enqueue(await partBytes(info, index++, cache)); }
        catch (error) { console.error('[data] Stream failed: ' + error.message); controller.error(error); }
      }});
      return new Response(body, {status: 200, headers});
    }
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = 0, end = -1;
    if (match && (match[1] || match[2])) {
      start = match[1] ? Number(match[1]) : Math.max(0, info.totalSize - Number(match[2]));
      end = match[1] ? (match[2] ? Math.min(info.totalSize - 1, Number(match[2])) : info.totalSize - 1) : info.totalSize - 1;
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.totalSize) {
      headers.set('Content-Range', `bytes */${info.totalSize}`);
      return new Response(null, {status: 416, headers});
    }
    const bytes = await read(info, start, end, cache);
    headers.set('Content-Length', String(bytes.length));
    headers.set('Content-Range', `bytes ${start}-${end}/${info.totalSize}`);
    return new Response(bytes, {status: 206, headers});
  };
})();
