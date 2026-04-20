import { revalidatePath } from 'next/cache'
import { AdminCurrencySwitcher } from '@/components/admin/currency-switcher'
import { AdminSetupNotice } from '@/components/admin/setup-notice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminConfigState, getMasterData, parseAdminCurrency } from '@/lib/admin-dashboard'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type AdminMasterDataPageProps = {
  searchParams?: Promise<{ currency?: string }>;
}

async function createPublisherAction(formData: FormData) {
  'use server'

  const name = String(formData.get('name') ?? '').trim()
  if (!name) {
    throw new Error('Publisher name is required.')
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from('master_publishers').insert({ name })
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/master-data')
  revalidatePath('/admin/products')
}

async function togglePublisherAction(formData: FormData) {
  'use server'

  const id = String(formData.get('id') ?? '').trim()
  const nextState = String(formData.get('nextState') ?? '') === 'true'
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase.from('master_publishers').update({ is_active: nextState }).eq('id', id)
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/master-data')
}

async function createRegionAction(formData: FormData) {
  'use server'

  const name = String(formData.get('name') ?? '').trim()
  if (!name) {
    throw new Error('Region name is required.')
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from('master_regions').insert({ name })
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/master-data')
  revalidatePath('/admin/products')
}

async function toggleRegionAction(formData: FormData) {
  'use server'

  const id = String(formData.get('id') ?? '').trim()
  const nextState = String(formData.get('nextState') ?? '') === 'true'
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase.from('master_regions').update({ is_active: nextState }).eq('id', id)
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/master-data')
}

export default async function AdminMasterDataPage({ searchParams }: AdminMasterDataPageProps) {
  const params = await searchParams
  const currency = parseAdminCurrency(params?.currency)
  const config = getAdminConfigState()
  if (!config.ready) {
    return <AdminSetupNotice missingVars={config.missingVars} />
  }

  const { publishers, regions } = await getMasterData()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Master Data</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage global publishers and regions used by product catalog.</p>
        </div>
        <AdminCurrencySwitcher currency={currency} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Publishers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createPublisherAction} className="flex gap-2">
              <input name="name" placeholder="New publisher name" className="flex-1 rounded-md border px-3 py-2" required />
              <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                Add
              </button>
            </form>

            <div className="space-y-2">
              {publishers.map((publisher) => (
                <div key={publisher.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{publisher.name}</p>
                    <p className="text-xs text-muted-foreground">{publisher.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <form action={togglePublisherAction}>
                    <input type="hidden" name="id" value={publisher.id} />
                    <input type="hidden" name="nextState" value={publisher.is_active ? 'false' : 'true'} />
                    <button
                      type="submit"
                      className={`rounded-md px-3 py-1 text-xs font-semibold ${publisher.is_active ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                    >
                      {publisher.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Regions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createRegionAction} className="flex gap-2">
              <input name="name" placeholder="New region name" className="flex-1 rounded-md border px-3 py-2" required />
              <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                Add
              </button>
            </form>

            <div className="space-y-2">
              {regions.map((region) => (
                <div key={region.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <form action={toggleRegionAction}>
                    <input type="hidden" name="id" value={region.id} />
                    <input type="hidden" name="nextState" value={region.is_active ? 'false' : 'true'} />
                    <button
                      type="submit"
                      className={`rounded-md px-3 py-1 text-xs font-semibold ${region.is_active ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                    >
                      {region.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
