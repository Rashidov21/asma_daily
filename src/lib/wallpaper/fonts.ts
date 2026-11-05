import { readFileSync } from "node:fs";
import path from "node:path";
import * as hb from "harfbuzzjs";

const FONT_DIR = path.join(process.cwd(), "src", "lib", "wallpaper", "fonts");

export type LoadedFont = { font: hb.Font; upem: number; glyphs: Map<number, string> };
const fontCache = new Map<string, LoadedFont>();

function loadFont(file: string): LoadedFont {
  let loaded = fontCache.get(file);
  if (!loaded) {
    const data = readFileSync(path.join(FONT_DIR, file));
    const blob = new hb.Blob(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer,
    );
    const face = new hb.Face(blob);
    loaded = { font: new hb.Font(face), upem: face.upem, glyphs: new Map() };
    fontCache.set(file, loaded);
  }
  return loaded;
}

export const FONTS = {
  sans: () => loadFont("NotoSans-Regular.ttf"),
  sansBold: () => loadFont("NotoSans-Bold.ttf"),
  arabic: () => loadFont("Amiri-Regular.ttf"),
};

export type TextOptions = {
  font: LoadedFont;
  text: string;
  x: number;
  baseline: number;
  size: number;
  fill: string;
  opacity?: number;
  letterSpacing?: number;
  /** Shrink font size so the line never exceeds this width. */
  maxWidth?: number;
  filter?: string;
  /** Fake-bold outline for numbers / emphasis. */
  stroke?: string;
  strokeWidth?: number;
};

/** Shape text with HarfBuzz and emit glyph outlines as SVG paths. */
export function textPath(opts: TextOptions): string {
  const { font: loaded, text, fill } = opts;
  if (!text) return "";

  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(loaded.font, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();

  const spacing = opts.letterSpacing ?? 0;
  const advanceSum = positions.reduce((sum, p) => sum + p.xAdvance, 0);
  const widthAt = (size: number) =>
    (advanceSum * size) / loaded.upem + spacing * Math.max(0, infos.length - 1);

  let size = opts.size;
  if (opts.maxWidth && widthAt(size) > opts.maxWidth) {
    size = size * (opts.maxWidth / widthAt(size));
  }
  const scale = size / loaded.upem;
  let penX = opts.x - widthAt(size) / 2;

  const parts: string[] = [];
  infos.forEach((info, i) => {
    const pos = positions[i]!;
    const gid = info.codepoint;
    let d = loaded.glyphs.get(gid);
    if (d === undefined) {
      d = loaded.font.glyphToPath(gid);
      loaded.glyphs.set(gid, d);
    }
    if (d) {
      const gx = penX + pos.xOffset * scale;
      const gy = opts.baseline - pos.yOffset * scale;
      parts.push(
        `<path transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})" d="${d}"/>`,
      );
    }
    penX += pos.xAdvance * scale + spacing;
  });

  const attrs = [
    `fill="${fill}"`,
    opts.stroke ? `stroke="${opts.stroke}"` : "",
    opts.strokeWidth !== undefined ? `stroke-width="${opts.strokeWidth}"` : "",
    opts.stroke ? `paint-order="stroke fill"` : "",
    opts.opacity !== undefined ? `opacity="${opts.opacity}"` : "",
    opts.filter ? `filter="url(#${opts.filter})"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<g ${attrs}>${parts.join("")}</g>`;
}
