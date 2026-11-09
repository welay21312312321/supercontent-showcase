#!/usr/bin/env node
import { readFile, writeFile, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, isAbsolute, parse, sep } from 'node:path';
import { createHash } from 'node:crypto';

const SOURCE_FILES = ["shell.html","style.css","deck.css","app.js","deck.js"];

const EDITORIAL = ["assets/editorial/douyin.webp","assets/editorial/xiaohongshu.webp","assets/editorial/tiktok.webp","assets/editorial/qianchuan.webp","assets/editorial/v14-d-frame-1.webp","assets/editorial/v14-d-frame-2.webp","assets/editorial/v14-d-frame-3.webp","assets/editorial/v14-o-frame-1.webp","assets/editorial/v14-o-frame-2.webp","assets/editorial/v14-o-frame-3.webp","assets/editorial/v14-c-frame-1.webp","assets/editorial/v14-c-frame-2.webp","assets/editorial/v14-c-frame-3.webp"];

const BRAND = ["assets/science-stage/clipo-logo.png","assets/science-stage/favicon.svg"];

function removeViewportWidthRules(source) {
  let result = '', cursor = 0;
  const pattern = /@media\s+[^{}]*\{/g;
  let match;
  while ((match = pattern.exec(source))) {
    let end = pattern.lastIndex, depth = 1;
    while (end < source.length && depth) {
      if (source[end] === '{') depth++;
      if (source[end] === '}') depth--;
      end++;
    }
    result += source.slice(cursor, match.index);
    if (!/\(\s*(?:min|max)-width\s*:/.test(match[0])) result += source.slice(match.index, end);
    cursor = end;
    pattern.lastIndex = end;
  }
  return result + source.slice(cursor);
}

function publicJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function assertPublicText(text, label) {
  const forbidden = [
    [/https?:\/\/|feishu\.cn|larksuite\.com/i, 'external URL'],
    [/\/(?:Users|Volumes|private|home)\/|file:\/\/|[A-Z]:\\(?:Users|Documents)\\/i, 'private filesystem path'],
    [/\.openai(?:\/|\\|\b)|\.codex-product(?:\/|\\|\b)|(?:^|[\s"'\/])research\//im, 'private project material'],
    [/(?:sk[-_]|vda_|ghp_|github_pat_|xox[baprs]-)[A-Za-z0-9_-]{15,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._~+/-]{15,}/i, 'credential token'],
    [/[A-Za-z0-9_.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, 'email address'],
  ];
  for (const [pattern, reason] of forbidden) {
    if (pattern.test(text)) throw new Error(`${label} contains a forbidden ${reason}; export stopped without printing the value.`);
  }
}

function validatePayloadKeys(value, label) {
  if (Array.isArray(value)) {
    for (const item of value) validatePayloadKeys(item, label);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (/^(?:source_?url|private_?path|local_?path|provider_?url|api_?key|access_?token|refresh_?token|authorization|credentials?|secrets?)$/i.test(key)) {
        throw new Error(`${label} has a private field; export stopped without printing its value.`);
      }
      validatePayloadKeys(item, label);
    }
  }
}

function runtimeAssets(media) {
  if (!Array.isArray(media.works) || !media.works.length) throw new Error('Public media.works must be a non-empty array.');
  const workFields = new Set(['id', 'scenarioId', 'title', 'description', 'deliveryStatus', 'caption', 'batchNote', 'src', 'poster', 'duration', 'width', 'height', 'sourceId']);
  const evidenceFields = new Set(['id', 'label', 'summary', 'date', 'status', 'publicNote']);
  const ids = new Set(), assets = [];
  if (!Array.isArray(media.evidence)) throw new Error('Public media.evidence must be an array.');
  for (const evidence of media.evidence) {
    for (const key of Object.keys(evidence)) if (!evidenceFields.has(key)) throw new Error('Unexpected field in public media evidence.');
  }
  for (const work of media.works) {
    for (const key of Object.keys(work)) if (!workFields.has(key)) throw new Error('Unexpected field in public media work.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) throw new Error('Media IDs must be unique safe filenames.');
    ids.add(work.id);
    if (work.src !== `assets/real-work/${work.id}.mp4` || work.poster !== `assets/real-work/${work.id}.jpg`) throw new Error('Media must use matching local MP4/JPG paths.');
    for (const key of ['width', 'height', 'duration']) if (!Number.isFinite(work[key]) || work[key] <= 0) throw new Error(`Invalid media ${key}.`);
    assets.push(work.src, work.poster);
  }
  return [...assets, ...EDITORIAL, ...BRAND];
}

function buildHtml(parts, content, media) {
  for (const [label, text] of Object.entries(parts)) assertPublicText(text, label);
  for (const [label, payload] of [['content.json', content], ['media.json', media]]) {
    validatePayloadKeys(payload, label);
    assertPublicText(JSON.stringify(payload), label);
  }
  const markers = ['/* INLINE_CSS */', '/* INLINE_DATA */', '/* INLINE_MEDIA */', '/* INLINE_JS */'];
  for (const marker of markers) if (parts['shell.html'].split(marker).length !== 2) throw new Error(`shell.html must contain exactly one ${marker}.`);
  if (parts['app.js'].split('/* INLINE_DECK */').length !== 2) throw new Error('app.js must contain exactly one inline deck marker.');
  if (/INLINE_DESIGN|design-data|compiled-copy/.test(parts['shell.html'] + parts['app.js'] + parts['deck.js'])) throw new Error('Retired PPT-copy runtime is still present.');
  const css = removeViewportWidthRules(parts['style.css']) + '\n' + parts['deck.css'];
  const js = parts['app.js'].replace('/* INLINE_DECK */', () => parts['deck.js']);
  const html = parts['shell.html']
    .replace('/* INLINE_CSS */', () => css)
    .replace('/* INLINE_DATA */', () => publicJson(content))
    .replace('/* INLINE_MEDIA */', () => publicJson(media))
    .replace('/* INLINE_JS */', () => js);
  assertPublicText(html, 'Runtime HTML');
  if (/\/\* INLINE_[A-Z_]+ \*\//.test(html)) throw new Error('Unresolved inline runtime marker.');
  const allowed = new Set(runtimeAssets(media));
  for (const match of html.matchAll(/assets\/[A-Za-z0-9_./-]+\.(?:mp4|jpg|webp|png|svg)/g)) {
    if (!allowed.has(match[0])) throw new Error(`Runtime references an asset outside the public allowlist: ${match[0]}`);
  }
  return html;
}

async function assertRegularFile(path) {
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('An expected ordinary file is missing or is a symlink.');
  return info;
}

async function safeTarget(dest, name) {
  const path = resolve(dest, name);
  const rel = relative(dest, path);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error('Invalid destination path.');
  const filesystemRoot = parse(path).root;
  const segments = relative(filesystemRoot, path).split(sep);
  let cursor = filesystemRoot;
  for (const segment of segments) {
    cursor = join(cursor, segment);
    try {
      const info = await lstat(cursor);
      if (info.isSymbolicLink()) throw new Error('Destination contains a symlink; export stopped.');
    } catch (error) {
      if (error.code === 'ENOENT') break;
      throw error;
    }
  }
  return path;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const parts = Object.fromEntries(await Promise.all(SOURCE_FILES.map(async name => [name, await readFile(join(root, 'source', name), 'utf8')])));
  const [content, media] = await Promise.all(['content.json', 'media.json'].map(async name => JSON.parse(await readFile(join(root, 'source', name), 'utf8'))));
  const html = buildHtml(parts, content, media);
  const assets = runtimeAssets(media);
  for (const asset of assets) await assertRegularFile(join(root, asset));
  const targets = await Promise.all(['index.html', 'SuperContent.html'].map(name => safeTarget(root, name)));
  for (const target of targets) await writeFile(target, html);
  console.log(JSON.stringify({ output: ['index.html', 'SuperContent.html'], htmlBytes: Buffer.byteLength(html), htmlSha256: createHash('sha256').update(html).digest('hex'), works: media.works.length, assets: assets.length, externalDependencies: 0 }, null, 2));
} catch (error) {
  console.error('Build failed: ' + error.message);
  process.exitCode = 1;
}
