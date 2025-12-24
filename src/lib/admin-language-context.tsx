"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'zh'

interface AdminLanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

interface AdminLanguageProviderProps {
  children: ReactNode
}

export function AdminLanguageProvider({ children }: AdminLanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // 从 localStorage 读取保存的语言设置
    const saved = localStorage.getItem('admin-language')
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLanguage(saved)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('admin-language', lang)
    
    // 触发自定义事件，通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('admin-language-changed', { detail: lang }))
  }

  return (
    <AdminLanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext)
  if (context === undefined) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider')
  }
  return context
}

// 导出多语言文本
export const adminTexts = {
  en: {
    // Layout texts
    dashboard: 'Dashboard',
    users: 'Users',
    orders: 'Orders',
    settings: 'Settings',
    logout: 'Logout',
    adminPanel: 'Admin Panel',
    language: 'Language',
    unauthorized: 'Unauthorized Access',
    loading: 'Loading...',
    login: 'Login',
    adminLogin: 'Admin Login',
    invalidCredentials: 'Invalid email or password',
    
    // Settings texts
    systemSettings: 'System Settings',
    languageDesc: 'Set the default language for the admin panel',
    theme: 'Color Theme',
    themeDesc: 'Choose your preferred color scheme for the admin panel',
    security: 'Security',
    securityDesc: 'Manage security settings and permissions',
    database: 'Database',
    databaseDesc: 'Database connection and backup settings',
    save: 'Save Changes',
    saved: 'Settings saved successfully',
    english: 'English',
    chinese: 'Chinese (Simplified)',
    purple: 'Purple Theme',
    blue: 'Blue Theme',
    green: 'Green Theme',
    comingSoon: 'Coming Soon',
    featureNotImplemented: 'This feature will be implemented in future updates.',
    
    // Users page texts
    userManagement: 'User Management',
    searchUsers: 'Search by email...',
    totalUsers: 'Total Users',
    userEmail: 'User Email',
    role: 'Role',
    createdAt: 'Created At',
    actions: 'Actions',
    noUsers: 'No users found',
    error: 'Error loading users',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'total',
    showingResults: 'Showing',
    to: 'to',
    results: 'results',
    user: 'User',
    admin: 'Admin',
    changeRole: 'Change Role',
    cancel: 'Cancel',
    confirm: 'Confirm',
    changeUserRole: 'Change User Role',
    cannotModifyOwnRole: 'You cannot modify your own role',
    // Additional user page texts
    email: 'Email',
    joinDate: 'Join Date',
    lastLogin: 'Last Login',
    credits: 'Credits',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    view: 'View',
    setAsAdmin: 'Set as Admin',
    setAsUser: 'Set as User',
    modalCancel: 'Cancel',
    confirmSetAdmin: 'Are you sure you want to set this user as admin?',
    confirmSetUser: 'Are you sure you want to set this user as regular user?',
    setAdminSuccess: 'User set as admin successfully',
    setUserSuccess: 'User set as regular user successfully',
    setRoleError: 'Error updating user role',
    never: 'Never',
    sortBy: 'Sort by',
    itemsPerPage: 'Items per page',
    
    // Orders page texts
    orderManagement: 'Order Management',
    searchOrders: 'Search by user email...',
    totalOrders: 'Total Orders',
    product: 'Product',
    amount: 'Amount',
    created: 'Created',
    endedAt: 'Ended At',
    noOrders: 'No orders found',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    // Status translations
    trialing: 'Trialing',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Incomplete Expired',
    past_due: 'Past Due',
    unpaid: 'Unpaid',
    paused: 'Paused',
    // Intervals
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly',
    
    // Dashboard texts
    totalRevenue: 'Total Revenue',
    growth: 'Growth',
    recentUsers: 'Recent Users',
    recentOrders: 'Recent Orders',
    viewAll: 'View All',
    
    // Login page specific texts
    modernPlatform: 'Modern Enterprise Management Platform',
    secureLogin: 'Secure Login',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    emailAddress: 'Email Address',
    password: 'Password',
    enterEmail: 'Enter your email address',
    enterPassword: 'Enter your password',
    loginWithAdmin: 'Please login with your admin account',
    adminManagementSystem: 'Admin Management System',
    loginWithAdminMobile: 'Please login with admin account',
    saasStarterAdmin: 'SaaS Starter Admin Panel',
    
    // Feature labels
    secure: 'Secure',
    efficient: 'Efficient',
    smart: 'Smart',
    
    // Unauthorized page texts
    noAdminPrivileges: 'Your current account does not have administrator privileges and cannot access the admin panel.',
    contactAdmin: 'Please contact the system administrator for access permissions.',
    signOutCurrent: 'Sign Out Current Account',
    backToHome: 'Back to Home',
    loginFailedRetry: 'Login failed, please try again later'
  },
  zh: {
    // Layout texts
    dashboard: '仪表板',
    users: '用户管理',
    orders: '订单管理',
    settings: '设置',
    logout: '退出',
    adminPanel: '管理后台',
    language: '语言',
    unauthorized: '未授权访问',
    loading: '加载中...',
    login: '登录',
    adminLogin: '管理员登录',
    invalidCredentials: '邮箱或密码错误',
    
    // Settings texts
    systemSettings: '系统设置',
    languageDesc: '设置管理后台的默认语言',
    theme: '颜色主题',
    themeDesc: '选择您偏好的管理后台配色方案',
    security: '安全',
    securityDesc: '管理安全设置和权限',
    database: '数据库',
    databaseDesc: '数据库连接和备份设置',
    save: '保存更改',
    saved: '设置保存成功',
    english: '英语',
    chinese: '中文（简体）',
    purple: '紫色主题',
    blue: '蓝色主题',
    green: '绿色主题',
    comingSoon: '即将推出',
    featureNotImplemented: '此功能将在未来更新中实现。',
    
    // Users page texts
    userManagement: '用户管理',
    searchUsers: '按邮箱搜索...',
    totalUsers: '总用户数',
    userEmail: '用户邮箱',
    role: '角色',
    createdAt: '创建时间',
    actions: '操作',
    noUsers: '未找到用户',
    error: '加载用户错误',
    previous: '上一页',
    next: '下一页',
    page: '第',
    of: '共',
    showingResults: '显示',
    to: '到',
    results: '条结果',
    user: '用户',
    admin: '管理员',
    changeRole: '更改角色',
    cancel: '取消',
    confirm: '确认',
    changeUserRole: '更改用户角色',
    cannotModifyOwnRole: '您无法修改自己的角色',
    // Additional user page texts
    email: '邮箱',
    joinDate: '注册日期',
    lastLogin: '最后登录',
    credits: '积分',
    status: '状态',
    active: '活跃',
    inactive: '非活跃',
    view: '查看',
    setAsAdmin: '设为管理员',
    setAsUser: '设为用户',
    modalCancel: '取消',
    confirmSetAdmin: '确定要将此用户设为管理员吗？',
    confirmSetUser: '确定要将此用户设为普通用户吗？',
    setAdminSuccess: '用户已成功设为管理员',
    setUserSuccess: '用户已成功设为普通用户',
    setRoleError: '更新用户角色失败',
    never: '从未',
    sortBy: '排序',
    itemsPerPage: '每页显示',
    
    // Orders page texts
    orderManagement: '订单管理',
    searchOrders: '按用户邮箱搜索...',
    totalOrders: '总订单数',
    product: '产品',
    amount: '金额',
    created: '创建时间',
    endedAt: '结束时间',
    noOrders: '未找到订单',
    filterByStatus: '按状态筛选',
    allStatuses: '所有状态',
    // Status translations
    trialing: '试用中',
    canceled: '已取消',
    incomplete: '未完成',
    incomplete_expired: '未完成已过期',
    past_due: '逾期',
    unpaid: '未付款',
    paused: '已暂停',
    // Intervals
    day: '每日',
    week: '每周',
    month: '每月',
    year: '每年',
    
    // Dashboard texts
    totalRevenue: '总收入',
    growth: '增长率',
    recentUsers: '最近用户',
    recentOrders: '最近订单',
    viewAll: '查看全部',
    
    // Login page specific texts
    modernPlatform: '现代化企业级管理平台',
    secureLogin: '安全登录',
    signingIn: '登录中...',
    signIn: '登录',
    emailAddress: '邮箱地址',
    password: '密码',
    enterEmail: '请输入您的邮箱',
    enterPassword: '请输入您的密码',
    loginWithAdmin: '请使用管理员账户登录',
    adminManagementSystem: '后台管理系统',
    loginWithAdminMobile: '请使用管理员账户登录',
    saasStarterAdmin: 'SaaS Starter 后台管理',
    
    // Feature labels
    secure: '安全',
    efficient: '高效',
    smart: '智能',
    
    // Unauthorized page texts
    noAdminPrivileges: '您当前登录的账户没有管理员权限，无法访问管理后台。',
    contactAdmin: '如需访问权限，请联系系统管理员。',
    signOutCurrent: '退出当前账户',
    backToHome: '返回首页',
    loginFailedRetry: '登录失败，请稍后重试'
  }
}