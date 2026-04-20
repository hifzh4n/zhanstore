import { revalidatePath } from 'next/cache'
import { AdminCurrencySwitcher } from '@/components/admin/currency-switcher'
import { AdminSetupNotice } from '@/components/admin/setup-notice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { convertAdminAmount, convertAdminAmountToUsd, getAdminConfigState, getAdminProducts, getMasterData, parseAdminCurrency, uploadProductImage } from '@/lib/admin-dashboard'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminProductsPageProps = {
  searchParams?: Promise<{ currency?: string }>;
}

async function createProductAction(formData: FormData) {
  'use server'

  const supabase = getSupabaseAdminClient()

  const slug = String(formData.get('slug') ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
  const name = String(formData.get('name') ?? '').trim()
  const publisherId = String(formData.get('publisherId') ?? '').trim()
  const regionId = String(formData.get('regionId') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const tutorialInput = String(formData.get('playerIdTutorial') ?? '').trim()
  const bannerFile = formData.get('bannerFile')
  const iconFile = formData.get('iconFile')
  const fallbackBannerUrl = String(formData.get('bannerUrl') ?? '').trim()
  const fallbackIconUrl = String(formData.get('iconUrl') ?? '').trim()

  if (!slug || !name || !publisherId || !regionId) {
    throw new Error('Missing required product fields.')
  }

  let bannerUrl = fallbackBannerUrl
  let iconUrl = fallbackIconUrl

  if (bannerFile instanceof File && bannerFile.size > 0) {
    bannerUrl = await uploadProductImage(bannerFile, { folder: 'banner', slug })
  }

  if (iconFile instanceof File && iconFile.size > 0) {
    iconUrl = await uploadProductImage(iconFile, { folder: 'icon', slug })
  }

  if (!bannerUrl || !iconUrl) {
    throw new Error('Banner and icon image are required.')
  }

  const tutorialSteps = tutorialInput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const { error } = await supabase.from('products').insert({
    slug,
    name,
    publisher_id: publisherId,
    region_id: regionId,
    description,
    banner_url: bannerUrl,
    icon_url: iconUrl,
    player_id_tutorial: tutorialSteps,
    is_active: true,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
}

async function toggleProductAction(formData: FormData) {
  'use server'

  const supabase = getSupabaseAdminClient()
  const productId = String(formData.get('productId') ?? '')
  const nextState = String(formData.get('nextState') ?? '') === 'true'

  const { error } = await supabase.from('products').update({ is_active: nextState }).eq('id', productId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
}

async function createPackageAction(formData: FormData) {
  'use server'

  const supabase = getSupabaseAdminClient()
  const productId = String(formData.get('productId') ?? '').trim()
  const code = String(formData.get('code') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const currency = parseAdminCurrency(String(formData.get('currency') ?? 'USD'))
  const enteredPrice = Number(formData.get('price') ?? '0')
  const priceUsd = convertAdminAmountToUsd(enteredPrice, currency)
  const isPopular = String(formData.get('isPopular') ?? '') === 'on'

  if (!productId || !code || !name || !priceUsd) {
    throw new Error('Missing required package fields.')
  }

  const { error } = await supabase.from('product_packages').insert({
    product_id: productId,
    code,
    name,
    price_usd: priceUsd,
    is_popular: isPopular,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
}

async function deletePackageAction(formData: FormData) {
  'use server'

  const supabase = getSupabaseAdminClient()
  const packageId = String(formData.get('packageId') ?? '').trim()

  const { error } = await supabase.from('product_packages').delete().eq('id', packageId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams
  const currency = parseAdminCurrency(params?.currency)
  const config = getAdminConfigState()
  if (!config.ready) {
    return <AdminSetupNotice missingVars={config.missingVars} />
  }

  const [{ publishers, regions }, products] = await Promise.all([getMasterData(), getAdminProducts()])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage game products and top-up packages from PostgreSQL.</p>
        </div>
        <AdminCurrencySwitcher currency={currency} />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProductAction} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" encType="multipart/form-data">
            <input name="slug" placeholder="Slug (e.g. free-fire)" className="rounded-md border px-3 py-2" required />
            <input name="name" placeholder="Product name" className="rounded-md border px-3 py-2" required />
            <select name="publisherId" className="rounded-md border px-3 py-2" required>
              <option value="">Select publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>
            <select name="regionId" className="rounded-md border px-3 py-2" required>
              <option value="">Select region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            <div className="rounded-md border px-3 py-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Banner Image (upload)</label>
              <input name="bannerFile" type="file" accept="image/png,image/jpeg,image/webp" className="w-full text-xs" />
            </div>
            <div className="rounded-md border px-3 py-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Icon Image (upload)</label>
              <input name="iconFile" type="file" accept="image/png,image/jpeg,image/webp" className="w-full text-xs" />
            </div>
            <input name="bannerUrl" placeholder="Fallback banner URL (optional)" className="rounded-md border px-3 py-2" />
            <input name="iconUrl" placeholder="Fallback icon URL (optional)" className="rounded-md border px-3 py-2" />
            <textarea name="description" placeholder="Description" className="rounded-md border px-3 py-2 md:col-span-2 xl:col-span-3" rows={3} />
            <textarea
              name="playerIdTutorial"
              placeholder="Player ID tutorial steps (one line per step)"
              className="rounded-md border px-3 py-2 md:col-span-2 xl:col-span-3"
              rows={4}
            />
            <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
              Save Product
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {products.map((product) => (
          <Card key={product.id} className="border-border/60">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.slug} • {(product.publisher as { name?: string })?.name ?? '-'} • {(product.region as { name?: string })?.name ?? '-'}
                </p>
              </div>
              <form action={toggleProductAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="nextState" value={product.is_active ? 'false' : 'true'} />
                <button
                  type="submit"
                  className={`rounded-md px-3 py-2 text-xs font-semibold ${product.is_active ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                >
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </form>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 py-2">Code</th>
                      <th className="px-2 py-2">Name</th>
                      <th className="px-2 py-2">Price ({currency})</th>
                      <th className="px-2 py-2">Popular</th>
                      <th className="px-2 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((product.product_packages as Array<{ id: string; code: string; name: string; price_usd: number; is_popular: boolean }>) ?? []).map((pkg) => (
                      <tr key={pkg.id} className="border-b last:border-b-0">
                        <td className="px-2 py-2 font-mono text-xs">{pkg.code}</td>
                        <td className="px-2 py-2">{pkg.name}</td>
                        <td className="px-2 py-2">{convertAdminAmount(Number(pkg.price_usd), currency).toFixed(2)} {currency}</td>
                        <td className="px-2 py-2">{pkg.is_popular ? 'Yes' : 'No'}</td>
                        <td className="px-2 py-2">
                          <form action={deletePackageAction}>
                            <input type="hidden" name="packageId" value={pkg.id} />
                            <button type="submit" className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form action={createPackageAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="currency" value={currency} />
                <input name="code" placeholder="Package code" className="rounded-md border px-3 py-2" required />
                <input name="name" placeholder="Package name" className="rounded-md border px-3 py-2" required />
                <input name="price" placeholder={`Price (${currency})`} type="number" step="0.01" min="0.01" className="rounded-md border px-3 py-2" required />
                <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <input type="checkbox" name="isPopular" />
                  Popular
                </label>
                <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">
                  Add Package
                </button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
