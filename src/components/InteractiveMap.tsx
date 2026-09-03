'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map, Popup, Marker } from 'maplibre-gl';
import { Airport, AirportStatus } from '../types/airport';
import {
  Search,
  X,
  Compass,
  Box,
  RotateCw,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';

interface InteractiveMapProps {
  airports: Airport[];
}

type MapLayerTheme = 'osm' | 'satellite';

const LAYER_STYLES: Record<MapLayerTheme, { name: string; url: string; attribution: string }> = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  },
  satellite: {
    name: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ airports }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const orbitIntervalRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AirportStatus>('all');
  const [currentTheme, setCurrentTheme] = useState<MapLayerTheme>('osm');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);

  // Filter airports based on current status filter
  const displayedAirports = useMemo(() => {
    return filterStatus === 'all'
      ? airports
      : airports.filter((ap) => ap.status === filterStatus);
  }, [airports, filterStatus]);

  // Search helper
  const searchLocal = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    return airports.filter(
      (ap) =>
        ap.icao.toUpperCase().includes(q) ||
        ap.name.toUpperCase().includes(q) ||
        (ap.city && ap.city.toUpperCase().includes(q))
    ).slice(0, 6);
  };

  // Fly to airport with 3D camera
  const flyToAirport = useCallback((lat: number, lng: number, name: string, icao: string, status?: AirportStatus, version?: string, enable3D = true) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    stopOrbit();

    map.flyTo({
      center: [lng, lat],
      zoom: 14.5,
      pitch: enable3D ? 58 : 0,
      bearing: enable3D ? -25 : 0,
      duration: 1800,
      essential: true,
    });

    if (enable3D) setIs3DMode(true);
  }, []);

  // Toggle 3D Perspective Mode
  const toggle3DMode = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    stopOrbit();

    if (is3DMode) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3DMode(false);
    } else {
      map.easeTo({ pitch: 60, bearing: -20, duration: 800 });
      setIs3DMode(true);
    }
  };

  // Toggle 3D Orbiting Camera
  const toggleOrbit = () => {
    if (isOrbiting) {
      stopOrbit();
    } else {
      startOrbit();
    }
  };

  const startOrbit = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    setIsOrbiting(true);
    setIs3DMode(true);
    map.easeTo({ pitch: 60, duration: 600 });

    if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    orbitIntervalRef.current = setInterval(() => {
      if (mapInstanceRef.current) {
        const currentBearing = mapInstanceRef.current.getBearing();
        mapInstanceRef.current.setBearing((currentBearing + 0.6) % 360);
      }
    }, 40);
  };

  const stopOrbit = () => {
    if (orbitIntervalRef.current) {
      clearInterval(orbitIntervalRef.current);
      orbitIntervalRef.current = null;
    }
    setIsOrbiting(false);
  };

  // Reset View completely back to initial Brazil overview
  const resetToOriginalView = () => {
    if (!mapInstanceRef.current) return;
    stopOrbit();

    // Close any open popups
    markersRef.current.forEach((m) => {
      const popup = m.getPopup();
      if (popup && popup.isOpen()) popup.remove();
    });

    mapInstanceRef.current.flyTo({
      center: [-51.0, -15.0],
      zoom: 3.8,
      pitch: 0,
      bearing: 0,
      duration: 1500,
      essential: true,
    });
    setIs3DMode(false);
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn({ duration: 300 });
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut({ duration: 300 });
  };

  // Render HTML / SVG Markers for Airports on MapLibre
  const renderAirportMarkers = useCallback((map: Map, list: Airport[]) => {
    // 1. Remove previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 2. Create high-visibility marker for each airport
    list.forEach((ap) => {
      if (typeof ap.lat !== 'number' || typeof ap.lng !== 'number' || isNaN(ap.lat) || isNaN(ap.lng)) return;

      const color = ap.status === 'done' ? '#10b981' : ap.status === 'in_progress' ? '#f59e0b' : '#ef4444';
      const statusLabel = ap.status === 'done' ? 'Concluído' : ap.status === 'in_progress' ? 'Em Andamento' : 'Na Fila';

      // Create Custom Marker DOM Element
      const el = document.createElement('div');
      el.className = `airport-marker airport-marker-${ap.status}`;
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.userSelect = 'none';

      el.innerHTML = `
        <div style="
          position: relative;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${color};
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 12px ${color}, 0 2px 6px rgba(0, 0, 0, 0.7);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          <div style="
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.35;
            pointer-events: none;
          "></div>
        </div>
        <span style="
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 1px 3px #000, 0 0 6px #000;
          margin-top: 2px;
          letter-spacing: 0.5px;
          pointer-events: none;
          white-space: nowrap;
        ">${ap.icao}</span>
      `;

      // Hover animation
      el.addEventListener('mouseenter', () => {
        const dot = el.querySelector('div') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1.35)';
      });
      el.addEventListener('mouseleave', () => {
        const dot = el.querySelector('div') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1)';
      });

      // Check if airport has updates / changelog posts
      const hasUpdates = Boolean(
        (ap.updatesHistory && ap.updatesHistory.length > 0) ||
        ap.lastUpdateTitle
      );

      const latestUpdate = ap.updatesHistory && ap.updatesHistory.length > 0
        ? ap.updatesHistory[0]
        : null;

      const latestTitle = ap.lastUpdateTitle || latestUpdate?.title || '';
      const latestVersion = ap.version || latestUpdate?.version || '';
      const latestDate = latestUpdate?.date
        ? new Date(latestUpdate.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';

      // Enhanced Popup Content
      const popupHTML = `
        <div style="font-family: inherit; min-width: 250px; max-width: 320px; padding: 0.35rem 0.1rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="
                font-family: var(--font-mono, monospace);
                font-size: 0.85rem;
                font-weight: 900;
                color: ${color};
                background: ${color}20;
                border: 1px solid ${color}55;
                padding: 0.18rem 0.5rem;
                border-radius: 6px;
                letter-spacing: 0.5px;
              ">${ap.icao}</span>
              ${latestVersion ? `
                <span style="
                  font-family: var(--font-mono, monospace);
                  font-size: 0.72rem;
                  font-weight: 800;
                  color: #38bdf8;
                  background: rgba(56, 189, 248, 0.12);
                  border: 1px solid rgba(56, 189, 248, 0.3);
                  padding: 0.15rem 0.45rem;
                  border-radius: 4px;
                ">${latestVersion}</span>
              ` : ''}
            </div>

            <span style="
              font-size: 0.72rem;
              font-weight: 800;
              color: ${color};
              display: inline-flex;
              align-items: center;
              gap: 0.25rem;
            ">● ${statusLabel}</span>
          </div>

          <strong style="
            font-size: 0.95rem;
            color: #ffffff;
            display: block;
            margin-bottom: 0.25rem;
            line-height: 1.3;
            font-weight: 800;
          ">
            ${ap.name}
          </strong>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 0.6rem;">
            <span>📍 ${ap.city || 'Brasil'}</span>
            <span style="font-family: var(--font-mono, monospace); font-size: 0.68rem; opacity: 0.75;">${ap.lat.toFixed(2)}, ${ap.lng.toFixed(2)}</span>
          </div>

          ${hasUpdates && latestTitle ? `
            <div style="
              background: linear-gradient(135deg, rgba(0, 84, 219, 0.18), rgba(2, 132, 199, 0.12));
              border: 1px solid rgba(56, 189, 248, 0.3);
              border-radius: 8px;
              padding: 0.5rem 0.65rem;
              margin-bottom: 0.65rem;
            ">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.3rem; margin-bottom: 0.2rem;">
                <span style="font-size: 0.68rem; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.04em;">
                  ✨ Publicação Recente
                </span>
                ${latestDate ? `<span style="font-size: 0.65rem; color: rgba(255, 255, 255, 0.5);">${latestDate}</span>` : ''}
              </div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #ffffff; line-height: 1.25;">
                ${latestTitle}
              </div>
            </div>
          ` : ''}

          <div style="
            display: flex;
            align-items: center;
            gap: 0.45rem;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          ">
            <button 
              id="btn-fly-3d-${ap.icao}"
              style="
                flex: 1;
                background: linear-gradient(135deg, #0054DB, #1d6bf3);
                border: 1px solid rgba(56, 189, 248, 0.4);
                color: #ffffff;
                padding: 0.4rem 0.6rem;
                border-radius: 6px;
                font-weight: 800;
                font-size: 0.72rem;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.3rem;
                box-shadow: 0 4px 12px rgba(0, 84, 219, 0.3);
                transition: all 0.15s ease;
              "
            >
              ✈️ Ver em 3D
            </button>

            ${hasUpdates ? `
              <button 
                id="btn-view-post-${ap.icao}"
                style="
                  flex: 1;
                  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3));
                  border: 1px solid rgba(16, 185, 129, 0.5);
                  color: #34d399;
                  padding: 0.4rem 0.6rem;
                  border-radius: 6px;
                  font-weight: 800;
                  font-size: 0.72rem;
                  cursor: pointer;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  gap: 0.3rem;
                  transition: all 0.15s ease;
                "
              >
                📜 Ver Post
              </button>
            ` : ''}
          </div>
        </div>
      `;

      const popup = new Popup({ offset: 16, closeButton: true, maxWidth: '340px' }).setHTML(popupHTML);

      popup.on('open', () => {
        setTimeout(() => {
          // 3D Fly Button
          const btn3D = document.getElementById(`btn-fly-3d-${ap.icao}`);
          if (btn3D) {
            btn3D.onclick = () => {
              flyToAirport(ap.lat, ap.lng, ap.name, ap.icao, ap.status, ap.version, true);
              popup.remove();
            };
          }

          // View Changelog Post Button
          const btnPost = document.getElementById(`btn-view-post-${ap.icao}`);
          if (btnPost) {
            btnPost.onclick = () => {
              const targetId = `update-${ap.icao}`;
              const targetEl = document.getElementById(targetId);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.8), 0 0 0 2px #38bdf8';
                setTimeout(() => {
                  targetEl.style.transition = 'box-shadow 1.5s ease';
                  targetEl.style.boxShadow = '';
                }, 2500);
              } else {
                window.location.href = `/atualizacoes#update-${ap.icao}`;
              }
            };
          }
        }, 50);
      });

      const marker = new Marker({ element: el })
        .setLngLat([ap.lng, ap.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [flyToAirport]);

  // Switch Tile Style (OSM or Satellite)
  const setMapTheme = (theme: MapLayerTheme) => {
    setCurrentTheme(theme);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const source = map.getSource('raster-tiles') as any;
    if (source) {
      if (map.getLayer('raster-layer')) map.removeLayer('raster-layer');
      map.removeSource('raster-tiles');

      map.addSource('raster-tiles', {
        type: 'raster',
        tiles: [LAYER_STYLES[theme].url],
        tileSize: 256,
        attribution: LAYER_STYLES[theme].attribution,
      });

      map.addLayer({
        id: 'raster-layer',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 20,
      });
    }
  };

  // Search execution
  const handleSearch = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) return;

    setSuggestions([]);

    const localResults = searchLocal(q);
    if (localResults.length === 1) {
      const a = localResults[0];
      flyToAirport(a.lat, a.lng, a.name, a.icao, a.status, a.version, true);
      return;
    }

    if (localResults.length > 1) {
      setSuggestions(localResults);
      return;
    }

    // Overpass Fallback for ICAO
    const qUp = q.toUpperCase();
    if (/^[A-Z]{4}$/.test(qUp)) {
      try {
        const overpassQuery = `[out:json][timeout:6];(node["aeroway"="aerodrome"]["icao"="${qUp}"];way["aeroway"="aerodrome"]["icao"="${qUp}"];relation["aeroway"="aerodrome"]["icao"="${qUp}"];);out center;`;
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery,
          headers: { 'Content-Type': 'text/plain' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.elements && data.elements.length > 0) {
            const el = data.elements[0];
            const lat = el.lat || el.center?.lat;
            const lng = el.lon || el.center?.lon;
            if (lat && lng) {
              flyToAirport(lat, lng, el.tags?.name || qUp, qUp, 'pending', undefined, true);
              return;
            }
          }
        }
      } catch (_) {}
    }
  };

  // Initialize MapLibre GL Map
  useEffect(() => {
    let isMounted = true;

    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize with OpenStreetMap Raster Tiles
    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [LAYER_STYLES.osm.url],
            tileSize: 256,
            attribution: LAYER_STYLES.osm.attribution,
          },
        },
        layers: [
          {
            id: 'raster-layer',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: [-51.0, -15.0],
      zoom: 3.8,
      pitch: 0,
      bearing: 0,
      maxPitch: 75,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      if (!isMounted) return;
      renderAirportMarkers(map, displayedAirports);
    });

    return () => {
      isMounted = false;
      stopOrbit();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever filtered airports change
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
      renderAirportMarkers(mapInstanceRef.current, displayedAirports);
    }
  }, [displayedAirports, renderAirportMarkers]);

  const counts = useMemo(() => {
    let done = 0;
    let wip = 0;
    let pending = 0;
    airports.forEach((a) => {
      if (a.status === 'done') done++;
      else if (a.status === 'in_progress') wip++;
      else pending++;
    });
    return { done, wip, pending, total: airports.length };
  }, [airports]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {/* ── EXTERNAL TOP CONTROL BAR (Outside above the Map) ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          overflow: 'visible',
          position: 'relative',
          zIndex: 40,
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '440px', zIndex: 50 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Buscar ICAO ou cidade (ex: SBGR, SBSP, Salvador)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length >= 2) {
                  setSuggestions(searchLocal(e.target.value));
                } else {
                  setSuggestions([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchQuery);
              }}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 2.2rem 0.6rem 2.4rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0054DB';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 84, 219, 0.35)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                }}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                zIndex: 1000,
                background: '#0f141d',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85)',
                overflow: 'hidden',
              }}
            >
              {suggestions.map((ap) => (
                <button
                  key={ap.icao}
                  type="button"
                  onClick={() => {
                    flyToAirport(ap.lat, ap.lng, ap.name, ap.icao, ap.status, ap.version, true);
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 84, 219, 0.35)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', marginRight: '0.5rem' }}>
                      {ap.icao}
                    </span>
                    <span style={{ fontSize: '0.825rem' }}>{ap.name}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ap.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter Pills (Outside above the Map) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            padding: '0.2rem 0.35rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'all', label: `Todos (${counts.total})` },
            { id: 'done', label: `Prontos (${counts.done})`, color: '#10b981' },
            { id: 'in_progress', label: `Andamento (${counts.wip})`, color: '#f59e0b' },
            { id: 'pending', label: `Fila (${counts.pending})`, color: '#ef4444' },
          ].map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id as any)}
                style={{
                  background: isActive ? '#0054DB' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 10px rgba(0, 84, 219, 0.4)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0c1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 32px rgba(0, 84, 219, 0.15)',
          height: '620px',
          width: '100%',
        }}
      >
        {/* MapLibre Canvas Container */}
        <div
          ref={mapContainerRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: '#090d14',
          }}
        />

        {/* ── FLOATING TOP-LEFT ZOOM CONTROLS (+ and -) ── */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(12, 16, 23, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          <button
            type="button"
            onClick={zoomIn}
            title="Aproximar Zoom"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            title="Afastar Zoom"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Minus size={15} />
          </button>
        </div>

        {/* ── FLOATING TOP-RIGHT 3D & CAMERA HUD CONTROLS ── */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(12, 16, 23, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '0.3rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* 3D Perspective Toggle */}
          <button
            type="button"
            onClick={toggle3DMode}
            title="Alternar perspectiva 3D (60°)"
            style={{
              background: is3DMode ? 'linear-gradient(135deg, #0054DB, #1d6bf3)' : 'transparent',
              border: is3DMode ? '1px solid rgba(56, 189, 248, 0.5)' : 'none',
              color: '#fff',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Box size={14} color={is3DMode ? '#38bdf8' : '#fff'} />
            <span>{is3DMode ? '3D' : '2D'}</span>
          </button>

          {/* 3D Orbit Rotate */}
          <button
            type="button"
            onClick={toggleOrbit}
            title="Iniciar rotação 360° da câmera"
            style={{
              background: isOrbiting ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              border: isOrbiting ? '1px solid rgba(16, 185, 129, 0.5)' : 'none',
              color: '#fff',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <RotateCw size={13} className={isOrbiting ? 'spin-icon' : ''} />
            <span>Girar</span>
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={resetToOriginalView}
            title="Resetar visão inicial do Brasil"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.75)',
              padding: '0.35rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <RotateCcw size={13} />
            <span>Resetar</span>
          </button>
        </div>

        {/* ── FLOATING BOTTOM-RIGHT LAYER SELECTOR (OSM / Satélite) ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(12, 16, 23, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '0.15rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          }}
        >
          {(['osm', 'satellite'] as MapLayerTheme[]).map((themeKey) => (
            <button
              key={themeKey}
              type="button"
              onClick={() => setMapTheme(themeKey)}
              style={{
                background: currentTheme === themeKey ? '#0054DB' : 'transparent',
                color: currentTheme === themeKey ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {LAYER_STYLES[themeKey].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
