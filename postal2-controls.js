                                                                                 
                                                                          
(() => {
  const canvas = document.getElementById('canvas');
  const hud = document.getElementById('hud');
  const game = () => window.rexcomp;
  const ready = () => game()?._rxc_ev_key && document.getElementById('overlay').classList.contains('hidden');
  const send = (name, ...args) => game()?.['_' + name]?.(...args);
  const dot = document.createElement('span');
  dot.id = 'postal2-menu-cursor'; dot.hidden = true; dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  let menuMouse = false, cursorX = 0, cursorY = 0, dotStyled = false;
  const bounds = () => [game()?.gameW || canvas.width || 1280, game()?.gameH || canvas.height || 720];
  const drawCursor = () => {
    dot.hidden = !menuMouse || !ready() || !document.hasFocus() || document.hidden;
    if (dot.hidden) return;
    if (!dotStyled) {
      Object.assign(dot.style, {position:'fixed', width:'7px', height:'7px', borderRadius:'50%',
        background:'white', border:'1px solid black', boxSizing:'border-box', pointerEvents:'none',
        zIndex:'2147483647', transform:'translate(-50%, -50%)'});
      dotStyled = true;
    }
    const rect = canvas.getBoundingClientRect(), [width, height] = bounds();
    dot.style.left = (rect.left + cursorX * rect.width / width) + 'px';
    dot.style.top = (rect.top + cursorY * rect.height / height) + 'px';
    canvas.style.cursor = 'none';
  };
  window.postal2MenuCursor = (visible, x, y) => {
    menuMouse = !!visible;
    const [width, height] = bounds();
    if (Number.isFinite(x) && Number.isFinite(y)) {
      cursorX = Math.max(0, Math.min(width - 1, x));
      cursorY = Math.max(0, Math.min(height - 1, y));
    }
    drawCursor();
  };
  addEventListener('resize', drawCursor);
  document.addEventListener('fullscreenchange', drawCursor);
  addEventListener('focus', drawCursor);
  const keepTitle = () => { if (document.title !== 'POSTAL 2') document.title = 'POSTAL 2'; };
  keepTitle();
  new MutationObserver(keepTitle).observe(document.head, {subtree:true, childList:true, characterData:true});
                                                                            
                                                                              
  for (const type of ['keydown', 'pointerdown']) addEventListener(type, () => {
    if (game()?.audioEnabled !== false && game()?.setAudioEnabled)
      game().setAudioEnabled(true).catch(() => {});
  }, true);
  for (const type of ['keydown', 'keyup']) addEventListener(type, event => {
    if (!ready() || (event.code !== 'F8' && event.code !== 'F9')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const vk = event.code === 'F8' ? 0x77 : 0x78;
    send('rxc_ev_key', type === 'keydown' ? 1 : 0, vk, event.code === 'F8' ? 0x42 : 0x43, event.repeat ? 1 : 0);
  }, true);
  const capture = document.createElement('button');
  capture.id = 'bmouse'; capture.textContent = 'Capture mouse';
  capture.title = 'Capture for continuous mouse look; Escape releases it.';
  capture.addEventListener('mousedown', event => event.preventDefault());
  let pendingCapture = null, recapturing = false;
  const captureMouse = () => {
    canvas.focus();
    send('rxc_ev_focus', 1);
    if (document.pointerLockElement === canvas || pendingCapture) return;
    try {
      pendingCapture = Promise.resolve(canvas.requestPointerLock())
        .catch(error => { recapturing = true; capture.title = 'Click again to capture mouse: ' + error.message; })
        .finally(() => { pendingCapture = null; });
    } catch (error) { recapturing = true; capture.title = 'Click again to capture mouse: ' + error.message; }
  };
  capture.onclick = () => { if (document.pointerLockElement === canvas) document.exitPointerLock(); else captureMouse(); };
  hud.prepend(capture);
  document.getElementById('bfps').title = 'Show FPS';
  const sound = document.getElementById('bsound');
  sound.addEventListener('click', async event => {
    if (!game()?.setAudioEnabled) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const enabled = game().audioEnabled === false;
    await game().setAudioEnabled(enabled);
    sound.textContent = enabled ? 'Sound: on' : 'Sound: off';
    canvas.focus();
  }, true);
  const pressed = new Set(), suppressed = new Set();
  const release = () => { for (const button of pressed) send('rxc_ev_mouse', 2, -1, -1, button, 0); pressed.clear(); suppressed.clear(); };
  let wasLocked = false;
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    capture.textContent = locked ? 'Release mouse' : 'Capture mouse';
    if (!locked) { if (wasLocked) recapturing = true; release(); }
    wasLocked = locked;
    drawCursor();
  });
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    const [width, height] = bounds();
    if (document.pointerLockElement !== canvas) {
      cursorX = Math.max(0, Math.min(width - 1, Math.round((event.clientX - rect.left) * width / rect.width)));
      cursorY = Math.max(0, Math.min(height - 1, Math.round((event.clientY - rect.top) * height / rect.height)));
      drawCursor(); return;
    }
    event.stopImmediatePropagation();
    const dx = Math.round(event.movementX * width / rect.width), dy = Math.round(event.movementY * height / rect.height);
    cursorX = Math.max(0, Math.min(width - 1, cursorX + dx));
    cursorY = Math.max(0, Math.min(height - 1, cursorY + dy));
    send('rxc_ev_mouse_raw', dx, dy);
    drawCursor();
  }, true);
  canvas.addEventListener('wheel', event => {
    if (!ready() || !event.deltaY) return;
    event.preventDefault();
    send('rxc_ev_mouse', 3, -1, -1, 0, event.deltaY < 0 ? 120 : -120);
  }, {passive:false});
  for (const type of ['pointerdown', 'pointerup', 'pointercancel']) canvas.addEventListener(type, event => {
    if (!ready() || event.pointerType !== 'mouse') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (type === 'pointerdown') {
      if (document.pointerLockElement !== canvas) {
        if (recapturing) { suppressed.add(event.button); recapturing = false; captureMouse(); return; }
        const rect = canvas.getBoundingClientRect();
        send('rxc_ev_mouse', 0, Math.round((event.clientX - rect.left) * (game().gameW || 1280) / rect.width),
          Math.round((event.clientY - rect.top) * (game().gameH || 720) / rect.height), 0, 0);
        captureMouse();
      }
      pressed.add(event.button); send('rxc_ev_mouse', 1, -1, -1, event.button, 0);
    }
    else if (type === 'pointercancel') release();
    else if (suppressed.delete(event.button)) return;
    else if (pressed.delete(event.button)) send('rxc_ev_mouse', 2, -1, -1, event.button, 0);
  }, true);
  const loseFocus = () => {
    if (document.pointerLockElement === canvas) { recapturing = true; document.exitPointerLock(); }
    release();
    drawCursor();
  };
  addEventListener('blur', loseFocus);
  document.addEventListener('visibilitychange', () => { if (document.hidden) loseFocus(); });
})();
