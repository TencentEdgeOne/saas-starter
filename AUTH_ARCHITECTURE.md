# 认证架构说明

## 🏗️ 架构分层

### 1. API 层 (`/api/auth/`) - 服务端认证
**职责：**
- 处理服务端认证逻辑
- 使用 Supabase Service Role Key
- 管理会话和 Cookie
- 提供统一的认证接口

**文件：**
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/signin` - 用户登录
- `POST /api/auth/signout` - 用户登出
- `GET /api/auth/user` - 获取当前用户

**特点：**
- 使用 `createServerClient()` 创建服务端 Supabase 客户端
- 处理 Cookie 设置和清除
- 返回标准化的 JSON 响应
- 处理服务端错误和验证

### 2. 前端层 (`/lib/auth.ts`) - 客户端认证
**职责：**
- 调用 API 接口
- 管理客户端状态
- 处理 UI 交互
- 监听认证状态变化

**函数：**
- `signOut()` - 调用登出 API
- `getCurrentUser()` - 获取用户信息
- `onAuthStateChange()` - 监听状态变化

**特点：**
- 使用 `fetch()` 调用 API
- 处理网络错误
- 使用 Supabase 客户端监听状态变化
- 提供统一的错误处理

## 🔄 数据流

```
用户操作 → 前端函数 → API 接口 → Supabase 服务端 → 数据库
    ↓
UI 更新 ← 状态管理 ← 响应处理 ← JSON 响应 ← 认证结果
```

## 📋 具体分工

### 注册流程
1. **前端** (表单组件)
   - 收集表单数据
   - 直接调用 `/api/auth/signup`
   - 处理响应和错误
   - 更新 UI 状态

2. **API** (`/api/auth/signup`)
   - 验证输入数据
   - 调用 Supabase 注册
   - 处理服务端错误
   - 返回用户信息

### 登录流程
1. **前端** (表单组件)
   - 收集凭据
   - 直接调用 `/api/auth/signin`
   - 处理响应
   - 更新认证状态

2. **API** (`/api/auth/signin`)
   - 验证凭据
   - 调用 Supabase 登录
   - 设置认证 Cookie
   - 返回用户信息

### 登出流程
1. **前端** (`signOut()`)
   - 调用 `/api/auth/signout`
   - 清除本地状态
   - 重定向到登录页

2. **API** (`/api/auth/signout`)
   - 调用 Supabase 登出
   - 清除认证 Cookie
   - 返回成功响应

### 状态管理
1. **前端** (`AuthContext`)
   - 管理全局认证状态
   - 监听状态变化
   - 提供认证 Hook

2. **API** (`/api/auth/user`)
   - 验证当前会话
   - 返回用户信息
   - 处理认证失败

## 🔧 技术实现

### 服务端认证
```typescript
// 使用 Service Role Key
const supabase = createServerClient()

// 处理认证逻辑
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// 设置 Cookie
response.cookies.set('sb-access-token', data.session.access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7
})
```

### 客户端认证
```typescript
// 调用 API
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

// 处理响应
const data = await response.json()
if (!response.ok) {
  return { user: null, error: data.error }
}
```

### 状态监听
```typescript
// 使用 Supabase 客户端监听
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as User || null)
  })
}
```

## 🎯 优势

1. **职责分离**：API 处理服务端逻辑，前端处理 UI 逻辑
2. **安全性**：敏感操作在服务端进行
3. **可维护性**：代码结构清晰，易于维护
4. **可扩展性**：易于添加新的认证功能
5. **错误处理**：统一的错误处理机制

## 🚀 使用示例

### 在组件中使用
```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, signOut } = useAuth()
  
  if (!user) {
    return <div>Please sign in</div>
  }
  
  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### 保护路由
```typescript
import ProtectedRoute from '@/components/auth/protected-route'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

这种架构确保了代码的清晰性和可维护性，同时提供了良好的用户体验和安全性。
