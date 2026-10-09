import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const out = path.join(root, "dist");
const skip = new Set([".git", "node_modules", "dist", ".github"]);
fs.rmSync(out, { recursive: true, force: true });

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}
copyTree(root, out);

const imageExtensions = new Set([".jpg", ".jpeg", ".png"]);
const replacements = [];
async function optimize(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await optimize(file); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    if (!imageExtensions.has(ext) || fs.statSync(file).size < 180_000) continue;
    try {
      const metadata = await sharp(file).metadata();
      if (!metadata.width || !metadata.height) continue;
      const webpName = path.basename(file, ext) + ".webp";
      const webpPath = path.join(path.dirname(file), webpName);
      await sharp(file).rotate().resize({ width: 1800, height: 1400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 }).toFile(webpPath);
      const oldSize = fs.statSync(file).size;
      const newSize = fs.statSync(webpPath).size;
      if (newSize < oldSize * 0.92) {
        replacements.push([entry.name, webpName]);
        fs.unlinkSync(file);
      } else fs.unlinkSync(webpPath);
    } catch (err) {
      console.warn("Image optimization skipped:", entry.name, err.message);
    }
  }
}
await optimize(out);

const textExtensions = new Set([".html", ".css", ".js", ".json", ".xml", ".txt", ".webmanifest"]);
function rewrite(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { rewrite(file); continue; }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    let content = fs.readFileSync(file, "utf8");
    for (const [oldName, newName] of replacements) content = content.split(oldName).join(newName);
    fs.writeFileSync(file, content);
  }
}
rewrite(out);
const saved = replacements.length;
console.log(`Optimized ${saved} image assets for deployment.`);
for (const [oldName, newName] of replacements) console.log(`${oldName} -> ${newName}`);
