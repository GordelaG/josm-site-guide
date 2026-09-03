'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Airport } from '../types/airport';

interface LaptopMapProps {
  airports: Airport[];
}

export const LaptopMap: React.FC<LaptopMapProps> = ({ airports }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('Aguardando tráfego...');

  useEffect(() => {
    let isMounted = true;
    let mapInstance: any = null;
    let laptopLayers: any[] = [];
    let trafficInterval: any = null;
    let airportInterval: any = null;
    let resizeIntervals: any[] = [];

    async function init() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Initialize Leaflet map
      mapInstance = L.map(mapContainerRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      }).setView([-23.4356, -46.4731], 15);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(mapInstance);

      // Repeatedly invalidate size while the laptop lid 3D animation opens
      [300, 800, 1400, 2200, 3000].forEach((delay) => {
        const id = setTimeout(() => {
          if (isMounted && mapInstance) {
            mapInstance.invalidateSize();
          }
        }, delay);
        resizeIntervals.push(id);
      });

      let airportsData: Record<string, any[]> = {};
      try {
        const response = await fetch(`/data/airports_geometry.json?v=${Date.now()}`);
        airportsData = await response.json();
      } catch (err) {
        console.error('Failed to load airports_geometry.json', err);
      }

      // Determine done airports
      const doneAirports = airports.filter((ap) => ap.status === 'done').map((ap) => ap.icao);
      let airportCycle = doneAirports.length > 0 ? doneAirports : ['SBGR', 'SBSP', 'SBRJ', 'SBCT', 'SBKP'];
      let currentIndex = 0;

      function cycleAirport() {
        if (!isMounted || !mapInstance || Object.keys(airportsData).length === 0) return;

        laptopLayers.forEach((l) => mapInstance.removeLayer(l));
        laptopLayers = [];
        if (trafficInterval) clearInterval(trafficInterval);

        const icao = airportCycle[currentIndex % airportCycle.length];
        const features = airportsData[icao];

        if (!features || features.length === 0) {
          currentIndex++;
          return cycleAirport();
        }

        setLabel(`${icao} — Renderização Dinâmica`);

        const bounds: [number, number][] = [];
        const parkingNodes: any[] = [];

        features.forEach((f: any) => {
          if (f.type === 'node' && f.aeroway === 'parking_position') {
            parkingNodes.push(f);
          } else if (f.type === 'way') {
            f.coords?.forEach((ll: [number, number]) => bounds.push(ll));
          }
        });

        if (bounds.length > 0) {
          const leafBounds = L.latLngBounds(bounds);
          const center = leafBounds.getCenter();
          mapInstance.invalidateSize();
          const targetZoom = Math.min(18, mapInstance.getBoundsZoom(leafBounds, false, [0, 0]) + 1);
          mapInstance.flyTo(center, targetZoom, { animate: true, duration: 1.5 });
        }

        // Spawn Parked Traffic
        parkingNodes.forEach((p) => {
          if (Math.random() > 0.5) {
            const icon = L.divIcon({
              html: `<div class="plane-icon" style="transform: rotate(${Math.floor(Math.random() * 360)}deg) scale(0.6);"></div>`,
              className: 'dynamic-plane',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });
            const marker = L.marker(p.coords, { icon }).addTo(mapInstance);
            laptopLayers.push(marker);
          }
        });

        // Animated Traffic
        const movingPlanes: any[] = [];

        function spawnMovingPlane(ways: any[], isTakeoff: boolean) {
          if (!ways || ways.length === 0) return;
          const way = ways[Math.floor(Math.random() * ways.length)];
          const coords = way.coords;
          if (!coords || coords.length < 2) return;

          const icon = L.divIcon({
            html: `<div class="plane-icon" style="transform: rotate(0deg) scale(${isTakeoff ? 0.9 : 0.6});"></div>`,
            className: 'dynamic-plane',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const marker = L.marker(coords[0], { icon }).addTo(mapInstance);
          laptopLayers.push(marker);

          movingPlanes.push({
            marker,
            coords,
            currentIndex: 0,
            progress: 0,
            speed: isTakeoff ? 0.04 : 0.015,
          });
        }

        const runwayWays = features.filter((f: any) => f.type === 'way' && f.aeroway === 'runway');
        const taxiwayWays = features.filter((f: any) => f.type === 'way' && f.aeroway === 'taxiway');

        spawnMovingPlane(runwayWays, true);
        spawnMovingPlane(taxiwayWays, false);
        spawnMovingPlane(taxiwayWays, false);

        function animateTraffic() {
          movingPlanes.forEach((plane) => {
            if (plane.currentIndex >= plane.coords.length - 1) {
              plane.currentIndex = 0;
              plane.progress = 0;
              plane.marker.setLatLng(plane.coords[0]);
              return;
            }

            plane.progress += plane.speed;
            if (plane.progress >= 1) {
              plane.progress = 0;
              plane.currentIndex++;
              if (plane.currentIndex >= plane.coords.length - 1) return;
            }

            const p1 = plane.coords[plane.currentIndex];
            const p2 = plane.coords[plane.currentIndex + 1];

            const lat = p1[0] + (p2[0] - p1[0]) * plane.progress;
            const lng = p1[1] + (p2[1] - p1[1]) * plane.progress;
            plane.marker.setLatLng([lat, lng]);

            const dy = p2[0] - p1[0];
            const dx = p2[1] - p1[1];
            const angle = Math.atan2(dx, dy) * (180 / Math.PI);
            const iconEl = plane.marker.getElement();
            if (iconEl) {
              const inner = iconEl.querySelector('.plane-icon');
              if (inner) {
                inner.style.transform = `rotate(${angle}deg) scale(${plane.speed > 0.03 ? 0.9 : 0.6})`;
              }
            }
          });
        }

        trafficInterval = setInterval(animateTraffic, 50);
        currentIndex++;
      }

      cycleAirport();
      airportInterval = setInterval(cycleAirport, 18000);
    }

    init();

    return () => {
      isMounted = false;
      resizeIntervals.forEach(clearTimeout);
      if (trafficInterval) clearInterval(trafficInterval);
      if (airportInterval) clearInterval(airportInterval);
      if (mapInstance) mapInstance.remove();
    };
  }, [airports]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        ref={mapContainerRef}
        id="laptop-map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f8fafc',
          zIndex: 1,
        }}
      />
      <div
        id="laptop-airport-label"
        className="laptop-label"
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(4, 13, 33, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(116, 203, 255, 0.4)',
          color: '#74cbff',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '6px',
          zIndex: 1000,
          letterSpacing: '0.04em',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>
    </div>
  );
};
