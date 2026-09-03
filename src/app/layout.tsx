import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from '@clerk/localizations';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'JOSM Ground Guide | Guia de Desenho de Solo - VATSIM Brasil',
  description:
    'Guia completo para criação e padronização de desenhos de solo (ground layouts) no JOSM para aeroportos da VATSIM Brasil.',
  icons: {
    icon: '/josm_logo.png',
  },
  openGraph: {
    title: 'JOSM Ground Guide | Guia de Desenho de Solo - VATSIM Brasil',
    description: 'Aprenda a criar ground layouts profissionais para aeroportos brasileiros no JOSM e QGIS.',
    images: ['/josm_logo.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk';

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      localization={ptBR}
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorPrimary: '#0054DB',
          colorBackground: '#0c1017',
          colorText: '#ffffff',
          colorTextSecondary: '#a0aec0',
          colorInputBackground: '#151a24',
          colorInputText: '#ffffff',
          borderRadius: '0.5rem',
        },
        elements: {
          card: {
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            backgroundColor: '#0c1017',
          },
          header: {
            display: 'none',
          },
          headerTitle: {
            display: 'none',
          },
          headerSubtitle: {
            display: 'none',
          },
          headerLogo: {
            display: 'none',
          },
          socialButtonsBlockButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
          },
          socialButtonsBlockButtonText: {
            color: '#ffffff',
            fontWeight: 600,
          },
          socialButtonsIconButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
          },
          footerAction: {
            display: 'none',
          },
          userButtonPopoverCard: {
            backgroundColor: '#0c1017',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
          },
          userButtonPopoverActionButtonText: {
            color: '#e2e8f0',
          },
          userButtonPopoverActionButtonIcon: {
            color: '#38bdf8',
          },
          userPreviewMainIdentifier: {
            color: '#ffffff',
          },
          userPreviewSecondaryIdentifier: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        }
      }}
    >
      <html lang="pt-BR" className={inter.className}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
