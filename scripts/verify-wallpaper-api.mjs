#!/usr/bin/env node
/**
 * Smoke-check a deployed /api/wallpaper URL.
 * Fails if the response is not a real non-white PNG (e.g. SPA HTML fallback).
 *
 * Usage:
 *   node scripts/verify-wallpaper-api.mjs
 *   node scripts/verify-wallpaper-api.mjs https://asma-daily-wallpaper.netlify.app/api/wallpaper?date=2026-11-07
 */
import { inflateSync } from "node:zlib";

const DEFAULT_BASE = "https://asma-daily-wallpaper.netlify.app/api/wallpaper";
const urls = process.argv.slice(2);
const targets =
  urls.length > 0
    ? urls
    : [DEFAULT_BASE, `${DEFAULT_BASE}?date=2026-11-07`];

function fail(url, msg) {
  console.error(`FAIL  ${url}\n  ${msg}`);
  process.exitCode = 1;
}

function decodePngRgbSamples(buf) {
  if (buf.subarray(0, 8).toString("binary") !== "\x89PNG\r\n\x1a\n") {
    throw new Error("missing PNG signature");
  }
  let pos = 8;
  let width = 0;
  let height = 0;
  const idat = [];
  while (pos + 12 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.subarray(pos + 4, pos + 8).toString("ascii");
    const data = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }
  if (!width || !height || idat.length === 0) {
    throw new Error("incomplete PNG");
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  let i = 0;
  let prev = Buffer.alloc(stride);
  const samples = [];
  for (let y = 0; y < height; y++) {
    const filter = raw[i++];
    const row = Buffer.from(raw.subarray(i, i + stride));
    i += stride;
    if (filter === 1) {
      for (let x = 0; x < stride; x++) {
        row[x] = (row[x] + (x >= 4 ? row[x - 4] : 0)) & 255;
      }
    } else if (filter === 2) {
      for (let x = 0; x < stride; x++) row[x] = (row[x] + prev[x]) & 255;
    } else if (filter === 3) {
      for (let x = 0; x < stride; x++) {
        const left = x >= 4 ? row[x - 4] : 0;
        row[x] = (row[x] + ((left + prev[x]) >> 1)) & 255;
      }
    } else if (filter === 4) {
      for (let x = 0; x < stride; x++) {
        const a = x >= 4 ? row[x - 4] : 0;
        const b = prev[x];
        const c = x >= 4 ? prev[x - 4] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        row[x] = (row[x] + pr) & 255;
      }
    } else if (filter !== 0) {
      throw new Error(`unsupported PNG filter ${filter}`);
    }
    if (y % 120 === 0) {
      for (let x = 0; x < width; x += 120) {
        const o = x * 4;
        samples.push([row[o], row[o + 1], row[o + 2]]);
      }
    }
    prev = row;
  }
  return { width, height, samples };
}

async function check(url) {
  const res = await fetch(url, {
    headers: { Accept: "image/png,*/*;q=0.8" },
    redirect: "follow",
  });
  const ctype = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());

  if (!res.ok) {
    fail(url, `HTTP ${res.status} body=${buf.subarray(0, 120).toString("utf8")}`);
    return;
  }
  if (!ctype.includes("image/png")) {
    fail(
      url,
      `Content-Type is "${ctype}" (expected image/png). ` +
        `Body starts with: ${buf.subarray(0, 60).toString("utf8").replace(/\s+/g, " ")}. ` +
        `Wrong host? Use https://asma-daily-wallpaper.netlify.app/api/wallpaper`,
    );
    return;
  }
  if (buf.length < 20_000) {
    fail(url, `PNG too small (${buf.length} bytes)`);
    return;
  }
  try {
    const { width, height, samples } = decodePngRgbSamples(buf);
    if (width !== 1179 || height !== 2556) {
      fail(url, `unexpected size ${width}x${height}`);
      return;
    }
    const white = samples.filter((p) => p.every((c) => c > 250)).length / samples.length;
    const dark = samples.filter((p) => p[0] < 40 && p[1] < 40 && p[2] < 60).length / samples.length;
    if (white > 0.85) {
      fail(url, `image looks blank/white (white≈${(white * 100).toFixed(0)}%)`);
      return;
    }
    if (dark < 0.3) {
      fail(url, `unexpected palette (dark≈${(dark * 100).toFixed(0)}%, white≈${(white * 100).toFixed(0)}%)`);
      return;
    }
    console.log(
      `OK    ${url}  ${width}x${height}  ${buf.length}B  dark≈${(dark * 100).toFixed(0)}%`,
    );
  } catch (err) {
    fail(url, `PNG decode failed: ${err instanceof Error ? err.message : err}`);
  }
}

for (const url of targets) {
  await check(url);
}

if (process.exitCode) {
  console.error("\nApple Shortcuts Quick Look shows a white screen when the URL returns HTML, not PNG.");
}
