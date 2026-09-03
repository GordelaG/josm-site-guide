import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Airport, AirportCounts, AirportStatus, AirportUpdate } from '../types/airport';
import { INITIAL_AIRPORTS } from './initial-airports';

const COLLECTION_NAME = 'airports';

// In-memory fallback if Firestore is not configured
let localAirportsCache: Airport[] = [...INITIAL_AIRPORTS];

export function calculateAirportCounts(airports: Airport[]): AirportCounts {
  return airports.reduce(
    (acc, airport) => {
      if (airport.status === 'done') acc.done += 1;
      else if (airport.status === 'in_progress') acc.in_progress += 1;
      else acc.pending += 1;
      acc.total += 1;
      return acc;
    },
    { done: 0, in_progress: 0, pending: 0, total: 0 }
  );
}

/**
 * Escuta atualizações em tempo real da coleção de aeroportos no Firestore.
 * Se o Firebase não estiver configurado ou estiver vazio, executa com os dados locais.
 */
export function subscribeToAirports(
  onUpdate: (airports: Airport[], isFromCloud: boolean) => void
): () => void {
  if (!db) {
    console.info('Firebase não configurado. Usando dataset local.');
    onUpdate(localAirportsCache, false);
    return () => {};
  }

  try {
    const airportsCollection = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      airportsCollection,
      (snapshot) => {
        if (snapshot.empty) {
          console.info('Coleção Firestore vazia. Usando dados padrão.');
          onUpdate(localAirportsCache, false);
        } else {
          const list: Airport[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Airport;
            list.push({
              icao: docSnap.id,
              name: data.name || docSnap.id,
              city: data.city || '',
              lat: data.lat ?? 0,
              lng: data.lng ?? 0,
              status: (data.status as AirportStatus) || 'pending',
              version: data.version || (data.status === 'done' ? 'v1.0.0' : undefined),
              lastUpdateTitle: data.lastUpdateTitle,
              lastUpdateDescription: data.lastUpdateDescription,
              lastUpdateImageUrl: data.lastUpdateImageUrl,
              lastUpdateBeforeImageUrl: data.lastUpdateBeforeImageUrl,
              updatesHistory: data.updatesHistory || [],
              updatedAt: data.updatedAt,
              updatedBy: data.updatedBy,
              notes: data.notes || '',
              assignedTo: data.assignedTo || ''
            });
          });

          // Preenche aeroportos faltantes do dataset base caso existam
          const merged = INITIAL_AIRPORTS.map((base) => {
            const fromCloud = list.find((item) => item.icao === base.icao);
            if (fromCloud) return fromCloud;
            return {
              ...base,
              version: base.status === 'done' ? 'v1.0.0' : undefined,
            };
          });

          localAirportsCache = merged;
          onUpdate(merged, true);
        }
      },
      (error) => {
        console.warn('Erro ao escutar Firestore (usando fallback local):', error);
        onUpdate(localAirportsCache, false);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Erro ao conectar ao Firestore:', err);
    onUpdate(localAirportsCache, false);
    return () => {};
  }
}

/**
 * Busca a lista de aeroportos uma única vez (ideal para SSR e rotas de API/RSS).
 */
export async function getAirportsOnce(): Promise<Airport[]> {
  if (!db) {
    return localAirportsCache;
  }

  try {
    const airportsCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(airportsCollection);

    if (snapshot.empty) {
      return localAirportsCache;
    }

    const list: Airport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Airport;
      list.push({
        icao: docSnap.id,
        name: data.name || docSnap.id,
        city: data.city || '',
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
        status: (data.status as AirportStatus) || 'pending',
        version: data.version || (data.status === 'done' ? 'v1.0.0' : undefined),
        lastUpdateTitle: data.lastUpdateTitle,
        lastUpdateDescription: data.lastUpdateDescription,
        lastUpdateImageUrl: data.lastUpdateImageUrl,
        lastUpdateBeforeImageUrl: data.lastUpdateBeforeImageUrl,
        updatesHistory: data.updatesHistory || [],
        updatedAt: data.updatedAt,
        updatedBy: data.updatedBy,
        notes: data.notes || '',
        assignedTo: data.assignedTo || ''
      });
    });

    const merged = INITIAL_AIRPORTS.map((base) => {
      const fromCloud = list.find((item) => item.icao === base.icao);
      if (fromCloud) return fromCloud;
      return {
        ...base,
        version: base.status === 'done' ? 'v1.0.0' : undefined,
      };
    });

    localAirportsCache = merged;
    return merged;
  } catch (err) {
    console.warn('Erro ao buscar aeroportos no Firestore:', err);
    return localAirportsCache;
  }
}

/**
 * Atualiza o status e informações de um aeroporto no Firestore.
 */
export async function updateAirport(
  icao: string,
  payload: {
    status: AirportStatus;
    updatedBy?: string;
    notes?: string;
    assignedTo?: string;
    version?: string;
  }
): Promise<boolean> {
  const existing = localAirportsCache.find((ap) => ap.icao === icao);
  const versionToSet =
    payload.version ||
    (payload.status === 'done' ? existing?.version || 'v1.0.0' : existing?.version);

  // Update local memory cache first for optimistic UI
  localAirportsCache = localAirportsCache.map((ap) => {
    if (ap.icao === icao) {
      return {
        ...ap,
        ...payload,
        version: versionToSet,
        updatedAt: new Date().toISOString()
      };
    }
    return ap;
  });

  if (!db) {
    return true; // Local update succeeded
  }

  try {
    const airportDoc = doc(db, COLLECTION_NAME, icao);

    await setDoc(
      airportDoc,
      {
        icao,
        name: existing?.name || icao,
        city: existing?.city || '',
        lat: existing?.lat ?? 0,
        lng: existing?.lng ?? 0,
        status: payload.status,
        version: versionToSet || 'v1.0.0',
        updatedAt: new Date().toISOString(),
        updatedBy: payload.updatedBy || 'Administrador',
        notes: payload.notes || '',
        assignedTo: payload.assignedTo || ''
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error(`Erro ao atualizar aeroporto ${icao} no Firestore:`, error);
    throw error;
  }
}

/**
 * Conclui um aeroporto e lança uma versão com changelog e fotos Antes & Depois do EuroScope.
 */
export async function completeAirportWithRelease(
  icao: string,
  payload: {
    version: string;
    title: string;
    description: string;
    imageUrl?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    author?: string;
    notes?: string;
    assignedTo?: string;
  }
): Promise<boolean> {
  const existing = localAirportsCache.find((ap) => ap.icao === icao);
  const previousHistory = existing?.updatesHistory || [];

  const effectiveAfterImage = payload.afterImageUrl || payload.imageUrl;

  const newUpdate: AirportUpdate = {
    version: payload.version,
    title: payload.title,
    description: payload.description,
    imageUrl: effectiveAfterImage,
    beforeImageUrl: payload.beforeImageUrl,
    afterImageUrl: effectiveAfterImage,
    date: new Date().toISOString(),
    author: payload.author || 'Admin',
  };

  const updatedHistory = [newUpdate, ...previousHistory.filter((u) => u.version !== payload.version)];

  // Update local memory cache
  localAirportsCache = localAirportsCache.map((ap) => {
    if (ap.icao === icao) {
      return {
        ...ap,
        status: 'done' as AirportStatus,
        version: payload.version,
        lastUpdateTitle: payload.title,
        lastUpdateDescription: payload.description,
        lastUpdateImageUrl: effectiveAfterImage,
        lastUpdateBeforeImageUrl: payload.beforeImageUrl,
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.author || 'Admin',
        notes: payload.notes ?? ap.notes,
        assignedTo: payload.assignedTo ?? ap.assignedTo,
      };
    }
    return ap;
  });

  if (!db) return true;

  try {
    const airportDoc = doc(db, COLLECTION_NAME, icao);
    await setDoc(
      airportDoc,
      {
        icao,
        name: existing?.name || icao,
        city: existing?.city || '',
        lat: existing?.lat ?? 0,
        lng: existing?.lng ?? 0,
        status: 'done',
        version: payload.version,
        lastUpdateTitle: payload.title,
        lastUpdateDescription: payload.description,
        lastUpdateImageUrl: effectiveAfterImage || '',
        lastUpdateBeforeImageUrl: payload.beforeImageUrl || '',
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.author || 'Admin',
        notes: payload.notes ?? existing?.notes ?? '',
        assignedTo: payload.assignedTo ?? existing?.assignedTo ?? '',
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error(`Erro ao concluir e lançar versão de ${icao}:`, error);
    throw error;
  }
}

/**
 * Registra uma nova versão / nota de atualização para um aeroporto no Firestore.
 */
export async function addAirportUpdate(
  icao: string,
  payload: {
    version: string;
    title: string;
    description: string;
    imageUrl?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    author?: string;
  }
): Promise<boolean> {
  const effectiveAfterImage = payload.afterImageUrl || payload.imageUrl;

  const newUpdate: AirportUpdate = {
    version: payload.version,
    title: payload.title,
    description: payload.description,
    imageUrl: effectiveAfterImage,
    beforeImageUrl: payload.beforeImageUrl,
    afterImageUrl: effectiveAfterImage,
    date: new Date().toISOString(),
    author: payload.author || 'Admin',
  };

  const existing = localAirportsCache.find((ap) => ap.icao === icao);
  const previousHistory = existing?.updatesHistory || [];
  const updatedHistory = [newUpdate, ...previousHistory];

  // Update in-memory cache
  localAirportsCache = localAirportsCache.map((ap) => {
    if (ap.icao === icao) {
      return {
        ...ap,
        status: 'done' as AirportStatus,
        version: payload.version,
        lastUpdateTitle: payload.title,
        lastUpdateDescription: payload.description,
        lastUpdateImageUrl: effectiveAfterImage,
        lastUpdateBeforeImageUrl: payload.beforeImageUrl,
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.author || 'Admin',
      };
    }
    return ap;
  });

  if (!db) return true;

  try {
    const airportDoc = doc(db, COLLECTION_NAME, icao);

    await setDoc(
      airportDoc,
      {
        status: 'done',
        version: payload.version,
        lastUpdateTitle: payload.title,
        lastUpdateDescription: payload.description,
        lastUpdateImageUrl: effectiveAfterImage || '',
        lastUpdateBeforeImageUrl: payload.beforeImageUrl || '',
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.author || 'Admin',
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error(`Erro ao registrar update para ${icao} no Firestore:`, error);
    throw error;
  }
}

/**
 * Edita uma nota de atualização existente no histórico do aeroporto.
 */
export async function editAirportUpdate(
  icao: string,
  targetVersion: string,
  payload: {
    title: string;
    description: string;
    imageUrl?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    author?: string;
  }
): Promise<boolean> {
  const existing = localAirportsCache.find((ap) => ap.icao === icao);
  const history = existing?.updatesHistory || [];

  const effectiveAfterImage = payload.afterImageUrl !== undefined ? payload.afterImageUrl : payload.imageUrl;

  const updatedHistory = history.map((item) => {
    if (item.version === targetVersion) {
      return {
        ...item,
        title: payload.title,
        description: payload.description,
        imageUrl: effectiveAfterImage !== undefined ? effectiveAfterImage : item.imageUrl,
        afterImageUrl: effectiveAfterImage !== undefined ? effectiveAfterImage : item.afterImageUrl,
        beforeImageUrl: payload.beforeImageUrl !== undefined ? payload.beforeImageUrl : item.beforeImageUrl,
        author: payload.author || item.author,
      };
    }
    return item;
  });

  const latest = updatedHistory[0];

  localAirportsCache = localAirportsCache.map((ap) => {
    if (ap.icao === icao) {
      return {
        ...ap,
        lastUpdateTitle: latest?.title || '',
        lastUpdateDescription: latest?.description || '',
        lastUpdateImageUrl: latest?.afterImageUrl || latest?.imageUrl,
        lastUpdateBeforeImageUrl: latest?.beforeImageUrl,
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      };
    }
    return ap;
  });

  if (!db) return true;

  try {
    const airportDoc = doc(db, COLLECTION_NAME, icao);
    await setDoc(
      airportDoc,
      {
        lastUpdateTitle: latest?.title || '',
        lastUpdateDescription: latest?.description || '',
        lastUpdateImageUrl: latest?.afterImageUrl || latest?.imageUrl || '',
        lastUpdateBeforeImageUrl: latest?.beforeImageUrl || '',
        updatesHistory: updatedHistory,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(`Erro ao editar update de ${icao}:`, error);
    throw error;
  }
}

/**
 * Deleta uma nota de atualização do histórico e atualiza a versão ativa do aeroporto.
 */
export async function deleteAirportUpdate(
  icao: string,
  versionToDelete: string
): Promise<boolean> {
  const existing = localAirportsCache.find((ap) => ap.icao === icao);
  const history = existing?.updatesHistory || [];

  const filteredHistory = history.filter((item) => item.version !== versionToDelete);
  const latest = filteredHistory[0];
  const newActiveVersion = latest?.version || 'v1.0.0';

  localAirportsCache = localAirportsCache.map((ap) => {
    if (ap.icao === icao) {
      return {
        ...ap,
        version: newActiveVersion,
        lastUpdateTitle: latest?.title || '',
        lastUpdateDescription: latest?.description || '',
        lastUpdateImageUrl: latest?.afterImageUrl || latest?.imageUrl,
        lastUpdateBeforeImageUrl: latest?.beforeImageUrl,
        updatesHistory: filteredHistory,
        updatedAt: new Date().toISOString(),
      };
    }
    return ap;
  });

  if (!db) return true;

  try {
    const airportDoc = doc(db, COLLECTION_NAME, icao);
    await setDoc(
      airportDoc,
      {
        version: newActiveVersion,
        lastUpdateTitle: latest?.title || '',
        lastUpdateDescription: latest?.description || '',
        lastUpdateImageUrl: latest?.afterImageUrl || latest?.imageUrl || '',
        lastUpdateBeforeImageUrl: latest?.beforeImageUrl || '',
        updatesHistory: filteredHistory,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error(`Erro ao deletar update de ${icao}:`, error);
    throw error;
  }
}

/**
 * Sincroniza e popula todos os 81 aeroportos padrão no Firestore em lote (batch).
 */
export async function seedInitialAirportsToFirebase(userEmail?: string): Promise<{
  success: boolean;
  count: number;
}> {
  if (!db) {
    throw new Error('Firebase não está inicializado. Verifique as credenciais no .env.local');
  }

  const batch = writeBatch(db);
  const airportsCollection = collection(db, COLLECTION_NAME);

  INITIAL_AIRPORTS.forEach((airport) => {
    const airportRef = doc(airportsCollection, airport.icao);
    batch.set(
      airportRef,
      {
        ...airport,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail || 'Sistema Inicial (Seed)',
        notes: '',
        assignedTo: ''
      },
      { merge: true }
    );
  });

  await batch.commit();
  return { success: true, count: INITIAL_AIRPORTS.length };
}
