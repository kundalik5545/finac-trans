import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import RegisterClientPage from './page-client';

const RegisterPage = async () => {

    // Check if user is authenticated
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        redirect("/transactions");
    }

    return (
        <div>
            <RegisterClientPage />
        </div>
    )
}

export default RegisterPage;
