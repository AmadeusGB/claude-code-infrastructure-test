# Claude Code 基础设施测试项目

本项目是一个测试验证项目，主要用于测试和验证 [Claude Code 基础设施](https://github.com/AmadeusGB/claude-code-infrastructure-showcase) 中的 Skills（技能）和工具集的实际应用效果。

## 项目目的

- 🧪 **Skills 测试验证** - 测试 Claude Code Skills 的自动激活机制和使用场景
- 🔧 **工具集验证** - 验证 Hooks、Agents、Commands 等工具的实际功能
- 📝 **开发实践** - 作为 Claude Code 基础设施的实际应用示例
- 🎯 **功能演示** - 展示技能自动激活、文件跟踪、上下文管理等功能

## 项目演变历程

从 commit 历史可以看到项目的演进过程：

1. **初始集成** (`6dfbcd4`) - 集成 Claude Code 基础设施：添加核心钩子和技能系统
2. **测试指南** (`a3c1690`) - 添加 Claude Code 基础设施测试指南
3. **技能开发** (`9dfc52d`, `20fda40`) - 新增 Next.js 开发技能（nextjs-development）
4. **技能扩展** (`20fda40`) - 新增 API 开发技能（api-development）
5. **功能实现** (`1de3a31`) - 实现多时区时间显示功能（作为测试用例）
6. **部署上线** (`3242f0d`) - 部署到 Vercel 并添加部署文档

## 当前功能

作为测试用例，项目实现了一个简单的实时时间显示网页：

- ⏰ **实时时间显示** - 每秒自动更新当前时间
- 📅 **完整日期信息** - 显示年月日和星期
- 🌍 **多时区支持** - 支持多时区时间显示
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

## Claude Code 基础设施集成

本项目完整集成了 Claude Code 基础设施的核心组件，用于测试和验证各项功能：

### ✅ 已集成的核心组件

#### 1. 自动技能激活系统
- **skill-activation-prompt 钩子** - 自动分析用户提示并建议相关技能
- **skill-rules.json** - 技能触发规则配置，控制技能的自动激活时机
- **工作流程：** 用户输入提示 → 钩子分析 → 自动建议技能 → 用户确认使用

#### 2. 文件变更跟踪
- **post-tool-use-tracker 钩子** - 跟踪文件变更，维护上下文信息
- **作用：** 记录编辑的文件，帮助 Claude 理解项目状态和变更历史

#### 3. 已集成的 Skills

本项目集成了以下技能用于测试验证：

- **skill-developer** - 技能开发和管理的元技能
  - 用途：创建、管理和调试 Claude Code 技能
  - 触发条件：询问技能相关问题、创建技能、修改 skill-rules.json
  
- **nextjs-development** - Next.js 开发最佳实践技能
  - 用途：提供 Next.js 开发规范、最佳实践和常见模式
  - 触发条件：编辑 Next.js 相关文件、询问 Next.js 问题
  
- **api-development** - API 开发技能
  - 用途：API 开发指南、路由设计、数据验证等
  - 触发条件：API 相关开发任务

#### 4. 配置文件结构

```
.claude/
├── hooks/                    # 钩子脚本
│   ├── skill-activation-prompt.sh    # 技能自动激活钩子
│   ├── skill-activation-prompt.ts    # TypeScript 实现
│   └── post-tool-use-tracker.sh      # 文件变更跟踪钩子
├── skills/                   # 技能目录
│   ├── skill-developer/      # 技能开发技能
│   ├── nextjs-development/   # Next.js 开发技能
│   ├── api-development/      # API 开发技能
│   └── skill-rules.json      # 技能触发规则配置
├── settings.json             # Claude Code 配置
├── agents/                   # 代理（预留）
└── commands/                 # 斜杠命令（预留）
```

### 🔍 测试验证场景与步骤

本项目通过实际开发过程验证了以下功能，下面是具体的验证步骤：

#### 1. 技能自动激活测试

**验证步骤：**

1. 在 Cursor 中打开 Claude Code 对话窗口
2. 输入以下任意测试提示：
   ```
   帮我创建一个新技能
   ```
   或
   ```
   explain skill system
   ```
   或
   ```
   我想了解 Next.js 开发的最佳实践
   ```
3. **预期结果：** 
   - Claude 会自动建议使用 `skill-developer` 或 `nextjs-development` 技能
   - 会出现技能选择提示："Use skill 'skill-developer'?"
   - 可以选择使用或跳过

**验证结果：** ✅ 正常工作 - 技能会根据关键词和文件上下文自动激活

**实际测试记录：** 见 commit `a3c1690` 中的测试指南

#### 2. 文件变更跟踪测试

**验证步骤：**

1. 编辑项目中的文件（如 `app/page.tsx`）
2. 在对话中询问：
   ```
   我刚才修改了哪些文件？
   ```
   或
   ```
   帮我看看最近的文件变更
   ```
3. **预期结果：**
   - Claude 能够告诉你最近修改的文件
   - 或提到跟踪到了文件变更（这个功能比较后台，主要用于上下文管理）

**验证结果：** ✅ 正常工作 - `post-tool-use-tracker` 钩子正常跟踪文件变更

#### 3. 技能实际应用测试

**验证步骤：**

1. 在对话中明确请求使用技能：
   ```
   使用 nextjs-development 技能，帮我优化这个 Next.js 页面
   ```
2. 或者先触发自动激活（测试 1），然后继续对话
3. **预期结果：**
   - Claude 加载了 `nextjs-development` 技能
   - Claude 提供了关于 Next.js 开发的详细信息
   - 能够根据技能内容回答具体问题

**验证结果：** ✅ 正常工作 - 技能能够正常加载并提供指导

**实际应用记录：** 
- 使用 `nextjs-development` 技能开发时间显示功能（commit `1de3a31`）
- 使用 `skill-developer` 创建 `nextjs-development` 和 `api-development` 技能（commits `9dfc52d`, `20fda40`）

#### 4. 技能创建测试

**验证步骤：**

1. 在对话中请求：
   ```
   使用 skill-developer 技能，帮我创建一个针对 Next.js 开发的技能
   ```
2. 或者直接触发技能自动激活，然后选择使用 `skill-developer`
3. **预期结果：**
   - Claude 使用 `skill-developer` 技能
   - 提供技能创建的详细指导
   - 帮助创建技能文件和配置 skill-rules.json

**验证结果：** ✅ 正常工作 - 成功创建了 `nextjs-development` 和 `api-development` 技能

**实际创建记录：**
- commit `9dfc52d` - 创建 nextjs-development 技能
- commit `20fda40` - 创建 api-development 技能

#### 5. 技能触发规则测试

**验证步骤：**

1. 查看 `.claude/skills/skill-rules.json` 文件
2. 编辑 Next.js 相关文件（如 `app/page.tsx`）
3. 在对话中询问 Next.js 相关问题
4. **预期结果：**
   - 根据 `skill-rules.json` 中的配置，`nextjs-development` 技能应该被触发
   - 触发条件包括：文件路径匹配（`app/**/*.tsx`）、关键词匹配（"Next.js"、"App Router"等）

**验证结果：** ✅ 正常工作 - skill-rules.json 配置生效

#### 6. 完整工作流程验证

**验证步骤：**

通过实际开发过程验证完整流程：

1. **集成基础设施**（commit `6dfbcd4`）
   - 复制核心钩子文件
   - 配置 settings.json
   - 测试钩子功能

2. **创建技能**（commits `9dfc52d`, `20fda40`）
   - 使用 `skill-developer` 技能创建新技能
   - 配置技能触发规则
   - 测试技能激活

3. **应用技能开发功能**（commit `1de3a31`）
   - 使用技能开发实际功能
   - 验证技能提供的指导是否有效

4. **持续验证**（commit `3242f0d` 及后续）
   - 每次开发任务中验证技能自动激活
   - 验证文件跟踪功能
   - 记录测试结果

**验证结果：** ✅ 所有功能正常工作，完整工作流程已验证

---

**详细的测试指南：** 查看 [.claude/TESTING_GUIDE.md](.claude/TESTING_GUIDE.md) 获取更详细的测试步骤和验证方法。

## 技术栈

### 前端技术
- **Next.js 16.0.1** - React 框架
- **React 19.2.0** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Geist Font** - 字体

### Claude Code 基础设施
- **Claude Code Skills** - 技能系统
- **Hooks 系统** - 自动化钩子（UserPromptSubmit、PostToolUse）
- **技能规则引擎** - skill-rules.json 配置系统

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
