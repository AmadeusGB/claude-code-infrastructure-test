---
name: nextjs-development
description: Next.js 开发最佳实践指南，涵盖 App Router、Server Components、Client Components、路由、布局、数据获取、性能优化、TypeScript 和 Tailwind CSS 集成。包含 Next.js、React、页面、组件、路由、服务端组件、客户端组件、App Router、Server Component、Client Component 等关键词。
---

# Next.js Development Best Practices

## Purpose

提供 Next.js 开发的全面指导，确保使用最新的 App Router 架构和 React Server Components，遵循性能优化和 TypeScript 最佳实践。

## When to Use

当你：
- 创建或修改 Next.js 页面、组件、路由
- 配置 Next.js 项目设置
- 优化性能和构建
- 实现数据获取和状态管理
- 使用 Server Components 或 Client Components
- 集成 Tailwind CSS 样式

---

## Core Concepts

### 1. App Router Architecture

**目录结构**：
```
app/
├── layout.tsx          # 根布局（必需）
├── page.tsx           # 首页
├── loading.tsx        # 加载状态
├── error.tsx          # 错误处理
├── not-found.tsx      # 404 页面
├── about/
│   └── page.tsx       # /about 路由
└── blog/
    ├── layout.tsx     # 嵌套布局
    ├── page.tsx       # /blog 路由
    └── [slug]/
        └── page.tsx   # /blog/:slug 动态路由
```

**关键规则**：
- ✅ `page.tsx` 创建路由
- ✅ `layout.tsx` 共享 UI（保持状态）
- ✅ 文件夹名 = URL 路径
- ✅ 使用 `[param]` 实现动态路由
- ✅ 使用 `(group)` 实现路由分组（不影响 URL）

---

### 2. Server Components vs Client Components

**默认：Server Components**

所有组件默认是 Server Components，除非使用 `"use client"`。

#### Server Components（服务端组件）

**何时使用**：
- ✅ 数据获取（直接访问数据库/API）
- ✅ 敏感信息（API keys、tokens）
- ✅ 大型依赖（减少客户端包体积）
- ✅ 静态内容

**示例**：
```tsx
// app/blog/page.tsx
// 默认是 Server Component，无需 "use server"

interface Post {
  id: number;
  title: string;
  content: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // 动态数据
    // 或 next: { revalidate: 60 } // ISR
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>博客文章</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

#### Client Components（客户端组件）

**何时使用**：
- ✅ 交互性（onClick、onChange 等事件）
- ✅ React Hooks（useState、useEffect、useReducer 等）
- ✅ 浏览器 API（localStorage、window 等）
- ✅ 自定义 Hooks

**示例**：
```tsx
// components/Counter.tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

**最佳实践**：
- ✅ 尽量使用 Server Components
- ✅ 将 `"use client"` 推到组件树的叶子节点
- ✅ Server Component 可以导入 Client Component
- ❌ Client Component **不能**导入 Server Component（但可以作为 children 传递）

---

### 3. Data Fetching（数据获取）

#### Server Components 中直接 fetch

```tsx
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // 每小时重新验证
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### 缓存策略

```tsx
// 1. 静态数据（默认）
fetch('...', { cache: 'force-cache' })

// 2. 动态数据（每次请求）
fetch('...', { cache: 'no-store' })

// 3. ISR（增量静态再生成）
fetch('...', { next: { revalidate: 60 } }) // 60 秒

// 4. 按需重新验证
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/blog');
revalidateTag('posts');
```

#### 并行数据获取

```tsx
// ✅ 好：并行获取
async function getData() {
  const [user, posts] = await Promise.all([
    fetch('...user').then(r => r.json()),
    fetch('...posts').then(r => r.json())
  ]);

  return { user, posts };
}

// ❌ 避免：顺序获取（慢）
async function getData() {
  const user = await fetch('...user').then(r => r.json());
  const posts = await fetch('...posts').then(r => r.json());
  return { user, posts };
}
```

---

### 4. Routing & Navigation

#### 动态路由

```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPost({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  return <h1>文章：{slug}</h1>;
}

// 生成静态参数（SSG）
export async function generateStaticParams() {
  const posts = await fetch('...').then(r => r.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

#### 路由组（不影响 URL）

```
app/
├── (marketing)/
│   ├── about/page.tsx      # /about
│   └── contact/page.tsx    # /contact
└── (shop)/
    ├── products/page.tsx   # /products
    └── cart/page.tsx       # /cart
```

#### 导航

```tsx
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav>
      {/* 优先使用 Link */}
      <Link href="/about">关于</Link>

      {/* 编程式导航 */}
      <button onClick={() => router.push('/contact')}>
        联系我们
      </button>

      {/* 预加载 */}
      <Link href="/products" prefetch={true}>
        产品
      </Link>
    </nav>
  );
}
```

---

### 5. Layouts & Templates

#### 根布局（必需）

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我的网站',
  description: '网站描述',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header>全局导航</header>
        <main>{children}</main>
        <footer>全局页脚</footer>
      </body>
    </html>
  );
}
```

#### 嵌套布局

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside>侧边栏</aside>
      <div>{children}</div>
    </div>
  );
}
```

---

### 6. Loading & Error States

#### 加载状态

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
}
```

#### 错误处理

```tsx
// app/dashboard/error.tsx
"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  );
}
```

---

### 7. Performance Optimization

#### 图片优化

```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority // 首屏图片
      placeholder="blur" // 模糊占位
      blurDataURL="data:image/..." // 或使用静态导入
    />
  );
}
```

#### 字体优化

```tsx
// app/layout.tsx
import { Inter, Noto_Sans_SC } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], weight: ['400', '700'] });

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${inter.className} ${notoSansSC.className}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### 代码分割

```tsx
// 动态导入（懒加载）
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>加载中...</p>,
  ssr: false // 仅客户端渲染
});

export default function Page() {
  return <DynamicComponent />;
}
```

---

### 8. TypeScript Best Practices

#### 页面类型

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 动态元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `文章 - ${slug}`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

#### 组件类型

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
    >
      {children}
    </button>
  );
}
```

---

### 9. Tailwind CSS Integration

#### 响应式设计

```tsx
export default function Card() {
  return (
    <div className="
      w-full
      sm:w-1/2
      md:w-1/3
      lg:w-1/4
      p-4
      bg-white
      dark:bg-gray-800
      rounded-lg
      shadow-lg
      hover:shadow-xl
      transition-shadow
    ">
      内容
    </div>
  );
}
```

#### 条件类名

```tsx
"use client";

import { useState } from 'react';
import clsx from 'clsx'; // 或使用 cn() 工具函数

export default function Toggle() {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive(!active)}
      className={clsx(
        'px-4 py-2 rounded',
        active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      )}
    >
      切换
    </button>
  );
}
```

---

### 10. Configuration

#### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片域名白名单
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },

  // 重定向
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  // 环境变量（公开）
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

---

## Common Patterns

### 1. 组合 Server 和 Client Components

```tsx
// app/dashboard/page.tsx (Server Component)
import ClientCounter from '@/components/ClientCounter';

async function getData() {
  const res = await fetch('...');
  return res.json();
}

export default async function Dashboard() {
  const data = await getData();

  return (
    <div>
      <h1>仪表盘</h1>
      <p>服务端数据：{data.value}</p>

      {/* Client Component 处理交互 */}
      <ClientCounter initialCount={data.count} />
    </div>
  );
}
```

### 2. 表单处理（Server Actions）

```tsx
// app/contact/page.tsx
import { revalidatePath } from 'next/cache';

async function submitForm(formData: FormData) {
  'use server';

  const name = formData.get('name');
  const email = formData.get('email');

  // 保存到数据库
  await saveToDatabase({ name, email });

  // 重新验证页面
  revalidatePath('/contact');
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <button type="submit">提交</button>
    </form>
  );
}
```

### 3. 环境变量

```bash
# .env.local（不提交到 Git）
DATABASE_URL="postgresql://..."
API_SECRET="..."

# 公开变量（客户端可访问，必须以 NEXT_PUBLIC_ 开头）
NEXT_PUBLIC_API_URL="https://api.example.com"
```

```tsx
// Server Component
const secret = process.env.API_SECRET; // ✅ 安全

// Client Component
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ 公开
const secret = process.env.API_SECRET; // ❌ undefined（不可访问）
```

---

## Checklist

创建新页面时检查：
- [ ] 是否使用 Server Component（默认）？
- [ ] 需要交互性时才使用 `"use client"`
- [ ] 数据获取是否并行？
- [ ] 是否配置了适当的缓存策略？
- [ ] 是否添加了 loading.tsx？
- [ ] 是否添加了 error.tsx？
- [ ] 图片是否使用 `<Image>` 组件？
- [ ] 是否使用 TypeScript 类型？
- [ ] 是否使用 Tailwind CSS 响应式类？
- [ ] 元数据（SEO）是否配置？

---

## Common Pitfalls

❌ **错误**：在 Server Component 中使用 useState
```tsx
// ❌ 不能在 Server Component 中使用 hooks
export default function Page() {
  const [count, setCount] = useState(0); // 错误！
  return <div>{count}</div>;
}
```

✅ **正确**：添加 `"use client"`
```tsx
"use client";

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

---

❌ **错误**：不等待 params
```tsx
export default async function Page({ params }) {
  const slug = params.slug; // ❌ params 是 Promise
  return <div>{slug}</div>;
}
```

✅ **正确**：await params
```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅
  return <div>{slug}</div>;
}
```

---

## Resources

- [Next.js 官方文档](https://nextjs.org/docs)
- [App Router 指南](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

**版本**: 适用于 Next.js 15+ 和 App Router
**最后更新**: 2025-01
