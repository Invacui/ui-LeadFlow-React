import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';
import { TokenBadge } from '@/components/common/TokenBadge';

export default function Settings() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" description="Manage your account and preferences." />

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Token balance</p>
              {user && <TokenBadge amount={user.tokenBalance} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
