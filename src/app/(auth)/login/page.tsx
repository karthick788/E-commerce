import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/');
  }

  return <LoginForm />;
}
