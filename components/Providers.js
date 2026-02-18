"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import ReduxProvider from '@/store/ReduxProvider';

export default function Providers({ children, clientId }) {
    return (
        <ReduxProvider>
            <GoogleOAuthProvider clientId={clientId}>
                {children}
            </GoogleOAuthProvider>
        </ReduxProvider>
    );
}
