> 本文件面向 Claude Code 等 AI 助手，内容与 `AGENTS.md` 保持一致。

## 常用命令

- `npm run dev` —— 启动本地开发服务器
- `npm run build` —— 构建静态站点到 `dist/`
- `npm run check` —— Astro 类型检查（改代码后运行）
- `npm run publish` —— 把 `temp/` 收件箱里的 Markdown 发布上线（自动校验+提交+推送）
- `npm run preview` —— 本地预览生产构建
- `npm run deploy` —— 构建并部署到 Cloudflare Pages（Wrangler）
- `npm run cf:login` —— 登录/授权 Wrangler

## 项目结构

- `src/pages/` —— 路由：`index`、`blog/`、`nav`、`tools/`
- `src/content/blog/` —— 博客 Markdown 文章（内容集合，模型定义在 `src/content.config.ts`）
- `src/data/bookmarks.ts` —— 导航页收藏数据
- `src/data/tools.ts` —— `/tools` 展示的工具清单
- `src/layouts/Layout.astro` —— 共用页面外壳、主题脚本、SEO 标签
- `src/components/Header.astro`、`Footer.astro`、`ToolShell.astro`
- `scripts/publish-post.mjs` —— `npm run publish` 使用的发布脚本（读取 `temp/` 收件箱）
- `wrangler.jsonc` —— Cloudflare Pages 配置（`pages_build_output_dir: ./dist`）
- 上线前记得把 `astro.config.mjs` 里的 `site` 换成真实域名

## 开发

启动开发服务器时使用后台模式：

```
astro dev --background
```

用 `astro dev stop`、`astro dev status`、`astro dev logs` 管理后台服务器。

## 文档

完整文档：https://docs.astro.build

做相关任务前先查阅对应指南：

- [添加页面、动态路由或中间件](https://docs.astro.build/en/guides/routing/)
- [使用 Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [使用 React、Vue、Svelte 等框架组件](https://docs.astro.build/en/guides/framework-components/)
- [添加或管理内容](https://docs.astro.build/en/guides/content-collections/)
- [添加样式或使用 Tailwind](https://docs.astro.build/en/guides/styling/)
- [多语言支持](https://docs.astro.build/en/guides/internationalization/)
