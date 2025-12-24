"use client"

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { Search, Mail, Calendar, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Package, DollarSign, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminLanguage, adminTexts } from '@/lib/admin-language-context'

interface Order {
  id: string
  user_id: string
  user_email: string
  status: string
  created_at: string
  ended_at: string | null
  product_name: string
  price_amount: number
  currency: string
  interval: string | null
  quantity: number
  cancel_at_period_end: boolean
  current_period_start: string | null
  current_period_end: string | null
}

interface OrdersResponse {
  orders: Order[]
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

const statusOptions = [
  'trialing',
  'active', 
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused'
]

export default function OrdersPage() {
  const { language } = useAdminLanguage()
  const t = adminTexts[language]
  
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null)
  const [tableRefreshing, setTableRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'created',
    order: 'desc'
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page when searching
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch orders list
  const fetchOrders = async () => {
    try {
      setTableRefreshing(true)
      
      const response = await fetch(`/api/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch,
          sortBy: sortConfig.field,
          sortOrder: sortConfig.order,
          statusFilter: statusFilter
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrdersData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(t.error)
    } finally {
      setTableRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, pageSize, debouncedSearch, sortConfig, statusFilter])

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

  // Format amount
  const formatAmount = (amount: number, currency: string) => {
    const formatted = (amount / 100).toFixed(2)
    return `${currency.toUpperCase()} ${formatted}`
  }

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'trialing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'past_due':
      case 'unpaid':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'paused':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const orders = ordersData?.orders || []
  const pagination = ordersData?.pagination

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.orderManagement}</h1>
          <p className="text-muted-foreground mt-2">
            {t.totalOrders}: {pagination?.total || 0}
          </p>
        </div>
      </div>

      {/* Search and Filter bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchOrders}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
          >
            <option value="">{t.allStatuses}</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {t[status as keyof typeof t] || status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders table */}
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
                  {t.userEmail}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.product}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    disabled={tableRefreshing}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t.status}</span>
                    {getSortIcon('status')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t.amount}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('created')}
                    disabled={tableRefreshing}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t.created}</span>
                    {getSortIcon('created')}
                  </button>
                </th>
               
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    {t.noOrders}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-foreground">
                            {order.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {order.product_name}
                          </div>
                          {order.interval && (
                            <div className="text-xs text-muted-foreground">
                              {t[order.interval as keyof typeof t] || order.interval}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {t[order.status as keyof typeof t] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        <span className="font-medium text-foreground">
                          {formatAmount(order.price_amount, order.currency)}
                        </span>
                        {order.quantity > 1 && (
                          <span className="ml-1 text-muted-foreground">
                            × {order.quantity}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
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
              {t.showingResults} {((currentPage - 1) * pageSize) + 1} {t.to} {Math.min(currentPage * pageSize, pagination.total)} {t.of} {pagination.total} {t.results}
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
    </div>
  )
}