export const dynamic = 'force-dynamic';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="hero-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <div className="hero-grid-overlay"></div>

      <div className="auth-header">
        <Link href="/" className="logo-link" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
          <img src="/josm_logo.png" alt="JOSM Ground Guide" className="auth-brand-logo" />
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
          Acesso Administrativo
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Departamento de Operações &middot; VATSIM Brasil
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <SignIn
          path="/sign-in"
          routing="path"
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

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
          }}
        >
          <input
            type="checkbox"
            id="rememberSession"
            defaultChecked={true}
            style={{ accentColor: '#2483C5', cursor: 'pointer' }}
          />
          <label htmlFor="rememberSession" style={{ cursor: 'pointer', userSelect: 'none' }}>
            Manter sessão conectada neste navegador
          </label>
        </div>
      </div>
    </main>
  );
}
