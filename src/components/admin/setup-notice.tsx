import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AdminSetupNoticeProps = {
  missingVars: string[];
}

export function AdminSetupNotice({ missingVars }: AdminSetupNoticeProps) {
  return (
    <Card className="border-amber-300 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-amber-800">Admin Dashboard Is Not Configured</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-amber-900">
        <p>Set the following environment variables in Vercel Project Settings and redeploy:</p>
        <ul className="list-disc space-y-1 pl-5">
          {missingVars.map((name) => (
            <li key={name} className="font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
