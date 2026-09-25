export const SITE = {
  title: "ri7er.cn",
  description:
    "Android 性能优化笔记：抓 trace、读源码、修卡顿。另有我日常在用的站点收藏与在线小工具。",
  author: "ri7er",
  lang: "zh-CN",
} as const;

export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "博客", href: "/blog" },
  { label: "导航", href: "/nav" },
  { label: "工具", href: "/tools" },
] as const;
