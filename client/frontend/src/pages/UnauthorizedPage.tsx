import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-0 text-center">
        <CardContent className="p-8">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You do not have the necessary permissions to access this page.
          </p>
          <Button asChild className="w-full rounded-2xl">
            {/* Redirect user to their standard homepage, not the admin one */}
            <Link to="/user/home">Back to My Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}