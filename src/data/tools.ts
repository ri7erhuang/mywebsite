export interface Tool {
  name: string;
  href: string;
  description: string;
}

export const TOOLS: Tool[] = [
  { name: "时间戳转换", href: "/tools/timestamp", description: "Unix 时间戳与日期时间互转" },
  { name: "JSON 格式化", href: "/tools/json", description: "格式化、压缩与校验 JSON" },
  { name: "Base64 编解码", href: "/tools/base64", description: "文本与 Base64 互转，支持中文" },
  { name: "颜色转换", href: "/tools/color", description: "HEX / RGB / HSL 互转与预览" },
  { name: "二维码生成", href: "/tools/qrcode", description: "把文本或链接生成二维码" },
];
