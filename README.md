# 文档模板生成器

一个用于生成各类文档的模板工具，提供表单化填写界面，支持实时预览和自动保存功能。目前预置了提测文档模板，后续可扩展更多文档模板。

## 功能特点

- 📝 表单化填写，简单直观
- 💾 实时自动保存
- 👀 实时预览（支持富文本和Markdown格式）
- 📤 一键导出Markdown文件
- 🔄 支持动态添加内容
- 📱 响应式设计，支持各种设备
- 🎨 可扩展的模板系统

## 技术栈

- Next.js
- React
- TypeScript
- Ant Design
- Day.js

## 开发环境设置

1. 克隆项目
```bash
git clone [repository-url]
cd doc-template-generator
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## 项目结构

```
doc-template-generator/
├── src/
│   ├── pages/          # 页面组件
│   ├── components/     # 可复用组件
│   ├── templates/      # 文档模板定义
│   │   └── testReport.ts   # 提测文档模板（预置）
│   └── styles/         # 样式文件
├── docs/              # 文档
│   └── 使用指南.md     # 详细使用说明
├── public/            # 静态资源
└── package.json       # 项目配置
```

## 预置模板

### 提测文档模板
- 基本信息（项目名称、提测时间等）
- 相关文档链接
- 项目信息（支持多个前端/后端项目）
- 服务端配置（Apollo、数据库等）
- 分支信息
- 项目参与人员
- 其他信息（注意事项、备注）

## 模板扩展
您可以通过以下步骤添加新的文档模板：

1. 在 `src/templates` 目录下创建新的模板定义文件
2. 定义表单结构和字段配置
3. 实现 Markdown 生成逻辑
4. 在页面中引入新模板

## 使用说明

详细的使用说明请参考 [使用指南](docs/使用指南.md)。

## 贡献指南

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。 