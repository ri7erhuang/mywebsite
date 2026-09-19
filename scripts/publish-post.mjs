#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile, unlink, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const INBOX = path.join(ROOT, "temp");
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const NO_BUILD = args.has("--no-build");
const NO_PUSH = args.has("--no-push");
const NO_COMMIT = args.has("--no-commit");

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function splitFrontmatter(text) {
  const m = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { lines: [], body: text, had: false };
  return { lines: m[1].split(/\r?\n/), body: text.slice(m[0].length), had: true };
}

function getField(lines, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.*)$`);
  for (const line of lines) {
    const m = line.match(re);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

function stripField(lines, key) {
  const re = new RegExp(`^${key}\\s*:`);
  return lines.filter((l) => !re.test(l));
}

function normalize(lines, sourceName) {
  lines = stripField(lines, "slug");

  if (!getField(lines, "title")) {
    const fallback = path.basename(sourceName, path.extname(sourceName));
    lines.push(`title: ${JSON.stringify(fallback)}`);
  }
  if (!getField(lines, "description")) {
    lines.push(`description: ""`);
  }
  if (!getField(lines, "pubDate")) {
    lines.push(`pubDate: ${today()}`);
  }
  if (!getField(lines, "tags")) {
    lines.push(`tags: []`);
  }
  if (!getField(lines, "draft")) {
    lines.push(`draft: false`);
  }
  return lines;
}

// 如果正文开头有 H1，拿来当标题并去掉（页面本身会渲染标题）
function extractLeadingH1(body) {
  const m = body.match(/^\s*#\s+(.+?)\s*(?:\r?\n|$)/);
  if (!m) return { title: undefined, rest: body };
  return { title: m[1].trim(), rest: body.slice(m[0].length).replace(/^\r?\n/, "") };
}

async function main() {
  await mkdir(INBOX, { recursive: true });

  const entries = (await readdir(INBOX, { withFileTypes: true })).filter(
    (e) => e.isFile() && /\.(md|markdown)$/i.test(e.name),
  );

  if (entries.length === 0) {
    console.log(`\n没有待发布的文章。把 Markdown 文件放到： ${path.relative(ROOT, INBOX)}\\`);
    console.log("文件名会成为网址（可用 slug: 在 frontmatter 里指定）。\n");
    return;
  }

  const published = [];

  for (const entry of entries) {
    const src = path.join(INBOX, entry.name);
    const raw = await readFile(src, "utf8");
    const { lines, body, had } = splitFrontmatter(raw);

    let fmLines = lines;
    let content = body;

    if (!had) {
      const h1 = extractLeadingH1(content);
      content = h1.rest;
      if (h1.title) fmLines.push(`title: ${JSON.stringify(h1.title)}`);
    }

    const normalized = normalize(fmLines, entry.name);

    const title = getField(normalized, "title") ?? entry.name;
    const explicitSlug = (raw.match(/^slug\s*:\s*(.*)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, "");
    let slug = slugify(explicitSlug || entry.name.replace(/\.(md|markdown)$/i, ""));
    if (!slug) slug = `post-${today()}`;

    const target = path.join(BLOG_DIR, `${slug}.md`);
    const isUpdate = await exists(target);

    const out = `---\n${normalized.join("\n")}\n---\n\n${content.replace(/^\r?\n/, "")}`;

    if (DRY_RUN) {
      console.log(`[dry-run] ${entry.name} → src/content/blog/${slug}.md  (${isUpdate ? "更新" : "新增"} / 标题: ${title})`);
      continue;
    }

    await mkdir(BLOG_DIR, { recursive: true });
    await writeFile(target, out, "utf8");
    await unlink(src);
    published.push({ slug, title, isUpdate });
    console.log(`${isUpdate ? "已更新" : "已收录"}: ${entry.name} → src/content/blog/${slug}.md`);
  }

  if (DRY_RUN || published.length === 0) {
    console.log("");
    return;
  }

  if (!NO_BUILD) {
    console.log("\n构建校验中…");
    try {
      execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
    } catch {
      console.error("\n构建失败，已取消发布。请修正上面的错误后重试（文件已放入 src/content/blog/）。");
      process.exit(1);
    }
  }

  const status = execSync("git status --porcelain", { cwd: ROOT }).toString().trim();
  if (!status) {
    console.log("\n没有需要提交的改动。");
    return;
  }

  if (NO_COMMIT) {
    console.log("\n已收录（--no-commit，未提交）。");
    return;
  }

  const titles = published.map((p) => p.title).join("、");
  const msg = published.length === 1 ? `发布文章：${titles}` : `发布 ${published.length} 篇文章：${titles}`;
  execSync(`git add -A && git commit -m ${JSON.stringify(msg)}`, { cwd: ROOT, stdio: "inherit" });

  if (NO_PUSH) {
    console.log("\n已提交（--no-push，未推送）。");
    return;
  }

  console.log("\n推送到 GitHub…");
  execSync("git push", { cwd: ROOT, stdio: "inherit" });
  console.log("\n发布完成 ✅ Cloudflare 会自动构建上线（约 1–2 分钟）。\n");
}

main();
