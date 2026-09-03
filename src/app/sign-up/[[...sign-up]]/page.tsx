export const dynamic = 'force-dynamic';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <div className="hero-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="hero-grid-overlay"></div>

      <div className="auth-header">
        <Link href="/" className="logo-link" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
          <img src="/josm_logo.png" alt="JOSM Ground Guide" className="auth-brand-logo" />
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
          Criar Conta de Colaborador
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Departamento de Operações &middot; VATSIM Brasil
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/admin"
          appearance={{
            elements: {
              header: { display: 'none' },
              headerTitle: { display: 'none' },
              headerSubtitle: { display: 'none' },
              headerLogo: { display: 'none' },
              socialButtonsBlockButtonText: { color: '#ffffff' },
              socialButtonsBlockButton: {
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
              footerAction: { display: 'none' },
              footer: { display: 'none' },
            },
          }}
        />
      </div>
    </main>
  );
}
