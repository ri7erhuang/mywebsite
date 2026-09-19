# 我的个人站

个人网站，包含三个板块：**博客**、**导航收藏**、**在线工具**。

技术栈：Astro 7 + Tailwind CSS 4，部署在 Cloudflare Pages。

线上地址：https://mywebsite-4rv.pages.dev/

## 功能

- **博客** —— 基于 Astro 内容集合（Content Collections），用 Markdown 写作，支持标签、草稿、代码高亮。
- **导航** —— 分类展示常用网站与资源，数据写在 `src/data/bookmarks.ts`。
- **工具** —— 时间戳转换、JSON 格式化、Base64 编解码、颜色转换、二维码生成，全部在浏览器本地运行。
- 支持深色/浅色主题切换，响应式布局，基础 SEO 标签。

## 常用命令

在项目根目录运行：

| 命令 | 说明 |
| :--- | :--- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务器（http://localhost:4321） |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run check` | Astro 类型检查（改代码后运行） |
| `npm run publish` | 发布 `temp/` 收件箱里的文章（自动校验+提交+推送） |
| `npm run preview` | 本地预览生产构建 |
| `npm run deploy` | 构建并部署到 Cloudflare Pages |
| `npm run cf:login` | 首次登录 Wrangler（Cloudflare 授权） |

## 目录结构

```text
/
├── public/                 静态资源（图标等）
├── temp/                   发布收件箱（本地草稿，已被 gitignore）
├── src/
│   ├── components/         Header、Footer、ToolShell 等组件
│   ├── content/blog/       博客文章（Markdown）
│   ├── data/               bookmarks.ts（导航）、tools.ts（工具列表）
│   ├── layouts/            Layout.astro（页面外壳、主题脚本、SEO）
│   ├── pages/              路由：index、blog/、nav、tools/
│   └── content.config.ts   博客内容集合的类型定义
├── astro.config.mjs        Astro 配置（含 site 域名）
└── wrangler.jsonc          Cloudflare Pages 配置
```

## 写文章并发布

推荐流程：**在 `temp/` 里写 Markdown → 运行 `npm run publish`**。

1. 在项目根目录的 `temp/` 文件夹里新建 `.md` 文件，像平常一样写内容即可，**不写 frontmatter 也行**：

   ```markdown
   # 从收件箱直接发布

   这是我直接写的正文……
   ```

2. 运行发布：

   ```sh
   npm run publish
   ```

脚本会自动完成：
- 把 `temp/` 下的 Markdown 移到 `src/content/blog/`
- 缺少的字段自动补齐：`title`（没有就取正文里的 `# 标题` 或文件名）、`pubDate`（今天）、`description`、`tags`、`draft`
- 文件名转成网址；想自定义网址可在 frontmatter 里写 `slug: my-post`
- 运行 `npm run build` 校验，通过后自动 `git commit` + `git push`，Cloudflare 随即自动部署

常用参数：

```sh
npm run publish -- --dry-run     # 只看会做什么，不改动
npm run publish -- --no-push     # 收录并提交，但不推送
npm run publish -- --no-build    # 跳过构建校验（更快）
```

frontmatter 可选字段（不写会自动补默认值）：

```yaml
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-09-19
tags: ["标签"]
draft: false      # true 则本站不显示
slug: custom-url  # 自定义网址片段
---
```

## 部署

已接入 Cloudflare Pages 的 GitHub 集成：

- 推送到 `main` 分支 → 自动构建并发布到生产环境
- 推送其他分支或开 PR → 生成预览环境
- 构建命令：`npm run build`，输出目录：`dist`

也可以本地手动部署（直接上传，不影响 Git 集成）：

```sh
npm run deploy
```
