import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AdminStatCardProps = {
  title: string;
  value: string;
  hint?: string;
}

export function AdminStatCard({ title, value, hint }: AdminStatCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
