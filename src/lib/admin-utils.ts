/**
 * Admin utilities for email-based admin authentication
 */

/**
 * Check if an email is in the admin emails list from environment variable
 * @param email - Email to check
 * @returns boolean - true if email is admin
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS
  if (!adminEmails) {
    console.warn('ADMIN_EMAILS environment variable not set')
    return false
  }
  
  const adminEmailList = adminEmails.split(',').map(e => e.trim().toLowerCase())
  return adminEmailList.includes(email.toLowerCase())
}

/**
 * Get list of admin emails from environment variable
 * @returns string[] - Array of admin emails
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS
  if (!adminEmails) {
    return []
  }
  
  return adminEmails.split(',').map(e => e.trim().toLowerCase())
}