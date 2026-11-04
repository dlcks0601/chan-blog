// duo 작품의 화면 캡처를 다시 만든다 — 홈이나 Resume 가 바뀌면 실행한다.
//   pnpm dev 를 켠 채로: node scripts/capture-duo-screens.mjs
// 접힌 화면 = 모바일 홈(390 × 554), 펼친 화면 = 두 칸(512 × 721 씩)을 합친 한 화면.
// 펼친 화면의 네 귀퉁이는 전체 기준 — 왼쪽 칸엔 심볼 · 소개 · 연락처, 오른쪽 칸엔 Resume 와 메뉴 · 테마.
// Chrome 위치가 다르면 CHROME_PATH 로 알려준다. 결과는 public/artworks/duo/ 에 2배로 저장된다.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SITE = process.env.SITE_URL ?? 'http://localhost:3000';
const OUT = new URL('../public/artworks/duo/', import.meta.url);
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9399;

const PANE_CSS = {
  home: 'main > div > header > nav, main > footer > button { visibility: hidden }',
  resume: [
    'main { height: 100vh; overflow: hidden }',
    'main > div { min-height: 0; overflow: hidden }',
    'main > div > header > div { visibility: hidden }',
    'main > div > header > nav a { color: var(--ink) !important }',
    'main > div > div { padding-top: 0 !important }',
    'main > footer { padding-top: 24px; justify-content: flex-end }',
    'main > footer > div { display: none }',
  ].join(' '),
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'duo-capture-'))}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let targets;
for (let i = 0; i < 50 && !targets; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  } catch {
    await sleep(200);
  }
}
const ws = new WebSocket(
  targets.find(t => t.type === 'page').webSocketDebuggerUrl
);
await new Promise(resolve =>
  ws.addEventListener('open', resolve, { once: true })
);
let id = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  pending.get(message.id)?.(message);
  pending.delete(message.id);
});
const send = (method, params = {}) =>
  new Promise(resolve => {
    pending.set(++id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = expression =>
  send('Runtime.evaluate', { expression, awaitPromise: true });
const viewport = (width, height, mobile) =>
  send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile,
  });
const save = async name => {
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(new URL(name, OUT), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
};

await send('Page.enable');
for (const theme of ['light', 'dark']) {
  await viewport(390, 554, true);
  await send('Page.navigate', { url: `${SITE}/` });
  await sleep(1500);
  await evaluate(`localStorage.setItem('theme', '${theme}')`);
  await send('Page.reload');
  await sleep(2500);
  await save(`mobile-${theme}.png`);

  // 펼친 화면 — 같은 사이트 안에 두 칸을 나란히 띄워 한 번에 찍는다
  await viewport(1024, 721, false);
  await evaluate(`new Promise(resolve => {
    const css = ${JSON.stringify(PANE_CSS)};
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;display:flex;height:100vh;overflow:hidden';
    let ready = 0;
    for (const [pane, path] of [['home', '/'], ['resume', '/resume']]) {
      const frame = document.createElement('iframe');
      frame.style.cssText = 'width:50%;height:100%;border:0;display:block';
      frame.src = path;
      frame.onload = () => {
        frame.contentDocument.head.insertAdjacentHTML('beforeend', '<style>' + css[pane] + '</style>');
        if (++ready === 2) setTimeout(resolve, 1500);
      };
      document.body.append(frame);
    }
  })`);
  await save(`pc-${theme}.png`);
}

ws.close();
chrome.kill();
