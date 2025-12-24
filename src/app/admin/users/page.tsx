"use client"

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { Search, Mail, Calendar, ChevronLeft, ChevronRight, Coins, ArrowUpDown, ArrowUp, ArrowDown, Shield, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAdminLanguage, adminTexts } from '@/lib/admin-language-context'

interface UserCredits {
  balance: number
  total_earned: number
  total_spent: number
}

interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  role?: 'user' | 'admin'
  credits: UserCredits
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface SortConfig {
  field: string
  order: 'asc' | 'desc'
}
export default function UsersPage() {
  const { language } = useAdminLanguage()
  const t = adminTexts[language]
  
  const [usersData, setUsersData] = useState<UsersResponse | null>(null)
  const [configloading, setConfigloading] = useState(false)
  const [tableRefreshing, setTableRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false)
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'created_at',
    order: 'desc'
  })

  // Get current logged in user info
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    getCurrentUser()
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page when searching
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch users list
  const fetchUsers = async () => {
    try {
     
      setTableRefreshing(true)
      
      const response = await fetch(`/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch,
          sortBy: sortConfig.field,
          sortOrder: sortConfig.order
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      setUsersData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(t.error)
    } finally {
      setTableRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [ currentPage, pageSize, debouncedSearch, sortConfig])

  // Change user role
  const handleRoleChange = async () => {
    if (!selectedUser) return
    try {
      setConfigloading(true)
      const response = await fetch(`/api/admin/users/set-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: selectedUser.id,
          role: newRole
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      // Refetch users list
      await fetchUsers()
      
      setShowRoleChangeConfirm(false)
      setSelectedUser(null)
      
      // Add success message here
      const successMessage = newRole === 'admin' ? t.setAdminSuccess : t.setUserSuccess
      console.log(successMessage)
    } catch (err) {
      console.error('Error updating user role:', err)
      // Add error message here
      console.log(t.setRoleError)
    }finally{
      setConfigloading(false)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page
  }

  // Handle sorting
  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortConfig.order === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const users = usersData?.users || []
  const pagination = usersData?.pagination

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.userManagement}</h1>
          <p className="text-muted-foreground mt-2">
            {t.totalUsers}: {pagination?.total || 0}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchUsers}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden relative">
        {/* Table refresh overlay */}
        {tableRefreshing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border border-border shadow-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">{t.loading}</span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('email')}
                    disabled={tableRefreshing}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t.email}</span>
                    {getSortIcon('email')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('created_at')}
                    disabled={tableRefreshing}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t.joinDate}</span>
                    {getSortIcon('created_at')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('last_sign_in_at')}
                    disabled={tableRefreshing}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t.lastLogin}</span>
                    {getSortIcon('last_sign_in_at')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.credits}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.role}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    {t.noUsers}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : t.never
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <Coins className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium text-foreground">
                          {user.credits.balance}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {t.admin}
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                              {t.user}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.email_confirmed_at 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {user.email_confirmed_at ? t.active : t.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={tableRefreshing}
                          className="text-muted-foreground hover:text-blue-600 hover:bg-transparent disabled:opacity-50"
                          onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role === 'admin' ? 'user' : 'admin')
                            setShowRoleChangeConfirm(true)
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" /> 
                          {user.role === 'admin' ? t.setAsUser : t.setAsAdmin}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
             {t.of} {pagination.total} {t.results}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t.itemsPerPage}:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={tableRefreshing}
                className="px-3 py-1 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || tableRefreshing}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t.previous}
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={tableRefreshing}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages || tableRefreshing}
            >
              {t.next}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Role change confirmation modal */}
      {showRoleChangeConfirm && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {newRole === 'admin' ? t.confirmSetAdmin : t.confirmSetUser}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedUser.email}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleChangeConfirm(false)
                  setSelectedUser(null)
                }}
                className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                  {t.modalCancel}
              </Button>
              <Button
                loading={configloading}
                variant="default"
                onClick={handleRoleChange}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {newRole === 'admin' ? t.setAsAdmin : t.setAsUser}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}