import 'server-only'
import { randomUUID } from 'node:crypto'

import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export type AdminCurrency = 'USD' | 'MYR'

const ADMIN_CURRENCY_RATE: Record<AdminCurrency, number> = {
  USD: 1,
  MYR: 4.7,
}

export type AdminConfigState = {
  ready: boolean;
  missingVars: string[];
}

export function getAdminConfigState(): AdminConfigState {
  const missingVars = [
    !process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
    !process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
    !process.env.ADMIN_DASHBOARD_USER ? 'ADMIN_DASHBOARD_USER' : null,
    !process.env.ADMIN_DASHBOARD_PASSWORD ? 'ADMIN_DASHBOARD_PASSWORD' : null,
  ].filter(Boolean) as string[]

  return {
    ready: missingVars.length === 0,
    missingVars,
  }
}

export function parseAdminCurrency(rawValue: string | undefined): AdminCurrency {
  return rawValue === 'MYR' ? 'MYR' : 'USD'
}

export function convertAdminAmount(amountInUsd: number, currency: AdminCurrency): number {
  return amountInUsd * ADMIN_CURRENCY_RATE[currency]
}

export function convertAdminAmountToUsd(amountInSelectedCurrency: number, currency: AdminCurrency): number {
  return amountInSelectedCurrency / ADMIN_CURRENCY_RATE[currency]
}

export function formatAdminAmount(amountInUsd: number, currency: AdminCurrency): string {
  return new Intl.NumberFormat(currency === 'MYR' ? 'ms-MY' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertAdminAmount(amountInUsd, currency))
}

export async function uploadProductImage(file: File, options: { folder: 'banner' | 'icon'; slug: string }) {
  const supabase = getSupabaseAdminClient()

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${options.folder}/${options.slug}-${randomUUID()}.${extension}`
  const arrayBuffer = await file.arrayBuffer()
  const fileBuffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from('product-media')
    .upload(path, fileBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage.from('product-media').getPublicUrl(path)
  if (!data.publicUrl) {
    throw new Error('Unable to generate public URL for uploaded image.')
  }

  return data.publicUrl
}

export type AdminSummary = {
  productCount: number;
  packageCount: number;
  customerCount: number;
  orderCount: number;
  pendingOrders: number;
  paidRevenueUsd: number;
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const supabase = getSupabaseAdminClient()

  const [
    { count: productCount },
    { count: packageCount },
    { count: orderCount },
    { count: pendingOrders },
    { data: paidOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('product_packages').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('orders').select('total').eq('status', 'Paid'),
  ])

  const paidRevenueUsd = (paidOrders ?? []).reduce((sum, order) => {
    const numeric = Number(order.total ?? 0)
    return Number.isFinite(numeric) ? sum + numeric : sum
  }, 0)

  const usersResponse = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const customerCount = usersResponse.data?.users?.length ?? 0

  return {
    productCount: productCount ?? 0,
    packageCount: packageCount ?? 0,
    customerCount,
    orderCount: orderCount ?? 0,
    pendingOrders: pendingOrders ?? 0,
    paidRevenueUsd,
  }
}

export async function getAdminProducts() {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      description,
      banner_url,
      icon_url,
      is_active,
      sort_order,
      publisher:master_publishers(id, name),
      region:master_regions(id, name),
      product_packages(id, code, name, price_usd, is_popular, sort_order)
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function getMasterData() {
  const supabase = getSupabaseAdminClient()

  const [{ data: publishers, error: publisherError }, { data: regions, error: regionError }] = await Promise.all([
    supabase.from('master_publishers').select('id, name, is_active, created_at').order('name', { ascending: true }),
    supabase.from('master_regions').select('id, name, is_active, created_at').order('name', { ascending: true }),
  ])

  if (publisherError) {
    throw new Error(publisherError.message)
  }

  if (regionError) {
    throw new Error(regionError.message)
  }

  return { publishers: publishers ?? [], regions: regions ?? [] }
}

export async function getAdminOrders() {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .select('id, external_id, customer_name, email, total, currency, status, source, created_at, paid_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function getAdminAccounts() {
  const supabase = getSupabaseAdminClient()

  const [{ data: usersResponse, error: usersError }, { data: orders, error: ordersError }] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from('orders').select('user_id, status, total'),
  ])

  if (usersError) {
    throw new Error(usersError.message)
  }

  if (ordersError) {
    throw new Error(ordersError.message)
  }

  const orderMap = new Map<string, { totalOrders: number; paidOrders: number; spentUsd: number }>()

  for (const order of orders ?? []) {
    const userId = order.user_id
    if (!userId) {
      continue
    }

    const stats = orderMap.get(userId) ?? { totalOrders: 0, paidOrders: 0, spentUsd: 0 }
    stats.totalOrders += 1
    if (order.status === 'Paid') {
      stats.paidOrders += 1
      stats.spentUsd += Number(order.total ?? 0)
    }
    orderMap.set(userId, stats)
  }

  return (usersResponse?.users ?? []).map((user) => ({
    id: user.id,
    email: user.email ?? '-',
    name:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.first_name as string | undefined) ??
      user.email?.split('@')[0] ??
      'User',
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
    isAnonymous: user.is_anonymous,
    orders: orderMap.get(user.id) ?? { totalOrders: 0, paidOrders: 0, spentUsd: 0 },
  }))
}
