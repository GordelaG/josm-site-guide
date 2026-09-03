'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn } from '@clerk/nextjs';
import { Lock, Menu, X } from 'lucide-react';
import { scrollToElement } from '../lib/smooth-scroll';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Atualizações', href: '/atualizacoes', isPage: true },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Polígonos', href: '/#poligonos' },
    { label: 'Tutorial', href: '/#tutorial' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
    if (isPage) {
      setMobileOpen(false);
      return;
    }

    const targetId = href.replace('/#', '').replace('#', '');

    // If already on homepage or root, perform animated smooth slide
    if (pathname === '/' || !pathname) {
      e.preventDefault();
      e.stopPropagation();
      setMobileOpen(false);
      scrollToElement(targetId, 80, 850);
      window.history.pushState(null, '', `/#${targetId}`);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '72px',
        background: scrolled ? 'rgba(12, 16, 23, 0.92)' : 'rgba(12, 16, 23, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.5)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '1560px',
          margin: '0 auto',
          height: '100%',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/josm_logo.png"
              alt="JOSM Ground Guide"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </Link>
        </div>

        {/* Desktop Nav Links (Visible on PC) */}
        <nav className="navbar-links-desktop">
          {navItems.map((item) => {
            const isActive = item.isPage ? pathname === item.href : false;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                style={{
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                  background: isActive ? 'rgba(0, 84, 219, 0.35)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.45)' : 'transparent'}`,
                  boxShadow: isActive ? '0 0 16px rgba(0, 84, 219, 0.35)' : 'none',
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Admin Button + Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SignedIn>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(0, 84, 219, 0.25), rgba(56, 189, 248, 0.15))',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                textDecoration: 'none',
                boxShadow: '0 0 16px rgba(0, 84, 219, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 84, 219, 0.45), rgba(56, 189, 248, 0.25))';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 84, 219, 0.25), rgba(56, 189, 248, 0.15))';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Lock size={13} />
              <span>Painel Admin</span>
            </Link>
          </SignedIn>

          {/* Mobile Menu Button (Hidden on PC) */}
          <button
            type="button"
            className="navbar-hamburger"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only shown when hamburger clicked on mobile) */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: 'rgba(12, 16, 23, 0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem 2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'fade-up 0.2s ease',
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.isPage)}
              style={{
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}

          <SignedIn>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#38bdf8',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0',
                textDecoration: 'none',
              }}
            >
              <Lock size={16} /> Painel Administrativo
            </Link>
          </SignedIn>
        </div>
      )}
    </header>
  );
};
