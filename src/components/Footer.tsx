'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToElement } from '../lib/smooth-scroll';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/' || !pathname) {
      e.preventDefault();
      scrollToElement(targetId, 80, 850);
      window.history.pushState(null, '', `/#${targetId}`);
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* Main Grid: 3 Columns */}
        <div className="site-footer-grid">
          {/* Column 1: Brand & Bio */}
          <div className="site-footer-brand">
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <img
                src="/josm_logo.png"
                alt="JOSM Ground Guide - VATSIM Brasil"
                className="site-footer-brand-logo"
              />
            </Link>
            <p className="site-footer-brand-desc">
              Do traçado vetorial à tela do radar. A referência definitiva para desenhar e padronizar layouts de solo no JOSM para o EuroScope da VATSIM Brasil. Simples, fluido e milimetricamente preciso.
            </p>
          </div>

          {/* Column 2: Links Rápidos */}
          <div>
            <h4 className="site-footer-col-title">Links Rápidos</h4>
            <ul className="site-footer-links">
              <li>
                <a
                  href="/#hero"
                  onClick={(e) => handleNavClick(e, 'hero')}
                  className="site-footer-link"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/#sobre"
                  onClick={(e) => handleNavClick(e, 'sobre')}
                  className="site-footer-link"
                >
                  Sobre o Projeto
                </a>
              </li>
              <li>
                <a
                  href="/#poligonos"
                  onClick={(e) => handleNavClick(e, 'poligonos')}
                  className="site-footer-link"
                >
                  Guia de Polígonos
                </a>
              </li>
              <li>
                <a
                  href="/#tutorial"
                  onClick={(e) => handleNavClick(e, 'tutorial')}
                  className="site-footer-link"
                >
                  Tutorial Passo a Passo
                </a>
              </li>
              <li>
                <Link href="/atualizacoes" className="site-footer-link">
                  Atualizações &amp; Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Comunidade */}
          <div>
            <h4 className="site-footer-col-title">Comunidade</h4>
            <ul className="site-footer-links">
              <li>
                <a
                  href="https://discord.gg/vatsimbrasil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-link"
                >
                  Entrar no Discord
                </a>
              </li>
              <li>
                <a
                  href="https://vatsim.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-link"
                >
                  VATSIM Brasil
                </a>
              </li>
              <li>
                <a
                  href="https://vatsim.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-link"
                >
                  VATSIM Global
                </a>
              </li>
              <li>
                <a
                  href="https://www.openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-link"
                >
                  OpenStreetMap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credits */}
        <div className="site-footer-bottom">
          <p className="site-footer-copyright">
            &copy; {new Date().getFullYear()} VATBRZ Operações. Todos os direitos reservados. Não somos afiliados a nenhuma autoridade de aviação civil do mundo real.
          </p>

          <p className="site-footer-credit">
            Desenvolvido com precisão pela{' '}
            <a
              href="https://vatsim.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-credit-highlight"
            >
              Diretoria de Operações
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
