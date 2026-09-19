---
title: Astro 内容集合入门
description: 用 Content Collections 管理 Markdown 博客的简明笔记。
pubDate: 2026-09-18
tags: ["Astro", "前端"]
---

Astro 的内容集合（Content Collections）让你用类型安全的方式管理 Markdown。

## 定义集合

在 `src/content.config.ts` 中声明：

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

## 读取内容

```ts
import { getCollection, render } from "astro:content";

const posts = await getCollection("blog");
const { Content } = await render(posts[0]);
```

配合 `getStaticPaths` 就能生成每篇文章的静态页面。

## 小提示

- frontmatter 的字段会在构建时校验，写错会直接报错。
- 用 `draft: true` 标记草稿，构建时过滤即可。
