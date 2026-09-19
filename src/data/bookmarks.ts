export interface Bookmark {
  name: string;
  url: string;
  description: string;
  icon?: string;
}

export interface BookmarkCategory {
  title: string;
  items: Bookmark[];
}

export const BOOKMARKS: BookmarkCategory[] = [
  {
    title: "开发",
    items: [
      { name: "MDN", url: "https://developer.mozilla.org", description: "Web 技术权威文档" },
      { name: "GitHub", url: "https://github.com", description: "代码托管与协作" },
      { name: "Astro 文档", url: "https://docs.astro.build", description: "本站所用框架" },
      { name: "Can I use", url: "https://caniuse.com", description: "浏览器兼容性查询" },
      { name: "Stack Overflow", url: "https://stackoverflow.com", description: "问答社区" },
    ],
  },
  {
    title: "工具",
    items: [
      { name: "Cloudflare", url: "https://dash.cloudflare.com", description: "部署与 DNS 管理" },
      { name: "Regex101", url: "https://regex101.com", description: "正则表达式调试" },
      { name: "TinyPNG", url: "https://tinypng.com", description: "图片压缩" },
      { name: "Excalidraw", url: "https://excalidraw.com", description: "手绘风流程图" },
    ],
  },
  {
    title: "学习",
    items: [
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", description: "免费编程课程" },
      { name: "roadmap.sh", url: "https://roadmap.sh", description: "开发者学习路线图" },
      { name: "MDN 学习区", url: "https://developer.mozilla.org/zh-CN/docs/Learn", description: "Web 入门教程" },
    ],
  },
];
