import { supabase } from '@/lib/supabase'

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
}

export interface AuthResult {
  success: boolean
  user?: AdminUser
  error?: string
}

/**
 * 管理员认证函数
 * 使用 API 接口进行认证
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  try {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // 如果登录成功，将会话信息设置到客户端 Supabase
      if (data.session) {
        await supabase.auth.setSession(data.session)
      }
      
      return {
        success: true,
        user: data.user
      }
    } else {
      return {
        success: false,
        error: data.error || '登录失败'
      }
    }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return { success: false, error: '网络错误，请稍后重试' }
  }
}

/**
 * 检查当前用户是否为管理员
 */
export async function checkAdminStatus(): Promise<{ 
  isAdmin: boolean; 
  user?: AdminUser; 
  isLoggedIn: boolean;
  hasAccount: boolean;
}> {
  try {
    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      return { isAdmin: false, isLoggedIn: false, hasAccount: false }
    }

    // 调用 API 检查管理员状态
    const response = await fetch('/api/admin/auth/status', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        isAdmin: data.isAdmin,
        isLoggedIn: data.isLoggedIn,
        hasAccount: data.hasAccount,
        user: data.user
      }
    } else {
      return { isAdmin: false, isLoggedIn: false, hasAccount: false }
    }
  } catch (error) {
    console.error('Admin status check error:', error)
    return { isAdmin: false, isLoggedIn: false, hasAccount: false }
  }
}

/**
 * 管理员登出
 */
export async function adminSignOut(): Promise<void> {
  try {
    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      // 调用 API 登出
      await fetch('/api/admin/auth/logout', {
        method: 'GET',
      })
    }

    // 清除客户端 Supabase 会话
    await supabase.auth.signOut()
   
  } catch (error) {
    console.error('Admin sign out error:', error)
    // 即使出错也要清除客户端会话
    try {
      await supabase.auth.signOut()
    } catch (signOutError) {
      console.error('Force sign out error:', signOutError)
    }
  }
}

/**
 * 获取管理员用户资料
 */
export async function getAdminProfile(): Promise<AdminUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      return null
    }

    const response = await fetch('/api/admin/auth/status', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.isAdmin ? data.user : null
    }

    return null
  } catch (error) {
    console.error('Get admin profile error:', error)
    return null
  }
}