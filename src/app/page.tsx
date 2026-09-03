'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { PolygonGuide } from '../components/PolygonGuide';
import { TutorialSection } from '../components/TutorialSection';
import { Footer } from '../components/Footer';
import { subscribeToAirports } from '../lib/airports-service';
import { Airport } from '../types/airport';
import { INITIAL_AIRPORTS } from '../lib/initial-airports';
import { scrollToElement } from '../lib/smooth-scroll';

export default function HomePage() {
  const [airports, setAirports] = useState<Airport[]>(INITIAL_AIRPORTS);

  useEffect(() => {
    const unsubscribe = subscribeToAirports((list) => {
      setAirports(list);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        scrollToElement(id, 80, 850);
      }, 250);
    }
  }, []);

  return (
    <main>
      <Navbar />
      <Hero airports={airports} />
      <AboutSection />
      <PolygonGuide />
      <TutorialSection />
      <Footer />
    </main>
  );
}
