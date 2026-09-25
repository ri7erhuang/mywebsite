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
    title: "娱乐",
    items: [
      { name: "哔哩哔哩", url: "https://www.bilibili.com", description: "视频社区" },
      { name: "V2EX", url: "https://www.v2ex.com", description: "创意工作者的社区" },
    ],
  },
  {
    title: "开发",
    items: [
      {
        name: "Android Performance",
        url: "https://androidperformance.com/",
        description: "Android 性能优化与框架原理技术博客",
      },
    ],
  },
  {
    title: "工具",
    items: [
      { name: "draw.io", url: "https://app.diagrams.net/", description: "在线画流程图 / 架构图" },
    ],
  },
];
