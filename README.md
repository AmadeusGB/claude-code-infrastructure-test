# 实时时间显示网页

一个基于 [Next.js](https://nextjs.org) 构建的简单实时时间显示网页应用。

## 功能特点

- ⏰ **实时时间显示** - 每秒自动更新当前时间
- 📅 **完整日期信息** - 显示年月日和星期
- 🌓 **深色模式支持** - 自动适配系统主题
- 🎨 **现代化界面** - 简洁美观的渐变背景和卡片设计
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 开始使用

首先，安装依赖：

```bash
yarn install
# 或
npm install
```

然后，启动开发服务器：

```bash
yarn dev
# 或
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 技术栈

- **Next.js 16.0.1** - React 框架
- **React 19.2.0** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Geist Font** - 字体

## 在线访问

🌐 **生产环境：** [https://claude-code-infrastructure-test-7z6dcxmu9-amadeusgbs-projects.vercel.app](https://claude-code-infrastructure-test-7z6dcxmu9-amadeusgbs-projects.vercel.app)

## 部署

本项目已部署到 [Vercel Platform](https://vercel.com/new)，每次推送到 `main` 分支会自动触发部署。

### 手动部署

使用 Vercel CLI 进行部署：

```bash
# 安装 Vercel CLI（如果未安装）
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
```

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。
