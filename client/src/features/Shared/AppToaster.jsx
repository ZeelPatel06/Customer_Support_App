import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
                duration: 3500,
                className: 'font-sans text-xs font-semibold tracking-wide shadow-2xl rounded-2xl border',
                style: {
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: '1px solid #E2E8F0',
                    padding: '12px 18px',
                    boxShadow: '0px 20px 25px -5px rgba(15, 23, 42, 0.08), 0px 8px 10px -6px rgba(15, 23, 42, 0.03)',
                },
                success: {
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#ECFDF5',
                    },
                    style: {
                        borderLeft: '4px solid #10B981',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FEF2F2',
                    },
                    style: {
                        borderLeft: '4px solid #EF4444',
                    },
                },
            }}
        />
    );
}