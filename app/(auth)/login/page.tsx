import React from 'react'
import LoginPageClient from './page-client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const LoginPage = async () => {

    // Check if user is authenticated
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        redirect("/transactions");
    }

    return (
        <div>
            <LoginPageClient />
        </div>
    )
}

export default LoginPage;
