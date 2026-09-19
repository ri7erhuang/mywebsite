export const SITE = {
  title: "我的个人站",
  description: "个人博客、导航收藏与在线工具集合。",
  author: "博主",
  lang: "zh-CN",
} as const;

export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "博客", href: "/blog" },
  { label: "导航", href: "/nav" },
  { label: "工具", href: "/tools" },
] as const;
