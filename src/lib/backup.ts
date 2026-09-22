import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { PortfolioContentType, DEFAULT_PORTFOLIO_CONTENT } from '../data/portfolioContent';

export interface BackupMetadata {
  appName: string;
  source: string;
  exportedAt: string;
  schemaVersion: number;
  environment: string;
  itemCounts: {
    portfolio: number;
    briefs: number;
    projectBriefs: number;
    analytics: number;
    media: number;
  };
}

export interface FirestoreBackupFile {
  _meta: BackupMetadata;
  portfolio: {
    content: PortfolioContentType;
  };
  briefs: Array<{ id: string; [key: string]: any }>;
  projectBriefs: Array<{ id: string; [key: string]: any }>;
  analytics: Record<string, any>;
  media: Array<{ id: string; [key: string]: any }>;
}

/**
 * Recursively cleans Firestore Timestamps or special types to serializable primitives.
 */
function serializeData(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object') {
    // Firestore Timestamp check
    if (typeof val.toDate === 'function') {
      return val.toDate().toISOString();
    }
    if (typeof val.seconds === 'number' && typeof val.nanoseconds === 'number') {
      return new Date(val.seconds * 1000 + val.nanoseconds / 1000000).toISOString();
    }
    if (Array.isArray(val)) {
      return val.map(serializeData);
    }
    const cleanObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      cleanObj[k] = serializeData(v);
    }
    return cleanObj;
  }
  return val;
}

/**
 * Queries all Firestore content (portfolio content, briefs, project briefs, analytics, and media)
 * and generates a complete, structured JSON backup object.
 */
export async function exportFirestoreBackup(
  currentContentState?: PortfolioContentType
): Promise<{
  backup: FirestoreBackupFile;
  fileName: string;
  sizeKb: number;
  summaryText: string;
}> {
  // 1. Portfolio Content
  let portfolioData: any = null;
  try {
    const portfolioDoc = await getDoc(doc(db, 'portfolio', 'content'));
    if (portfolioDoc.exists()) {
      portfolioData = portfolioDoc.data();
    }
  } catch (err) {
    console.warn('Could not read portfolio/content from Firestore, using active state fallback:', err);
  }

  // Use Firestore content, fallback to active memory state, or default content
  const mergedPortfolio = portfolioData || currentContentState || DEFAULT_PORTFOLIO_CONTENT;

  // 2. Briefs
  const briefs: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'briefs'));
    snap.forEach((d) => {
      briefs.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying briefs collection for backup:', err);
  }

  // 3. Project Briefs
  const projectBriefs: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'projectBriefs'));
    snap.forEach((d) => {
      projectBriefs.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying projectBriefs collection for backup:', err);
  }

  // 4. Analytics
  const analytics: Record<string, any> = {};
  try {
    const snap = await getDocs(collection(db, 'analytics'));
    snap.forEach((d) => {
      analytics[d.id] = serializeData(d.data());
    });
  } catch (err) {
    console.warn('Notice querying analytics collection for backup:', err);
  }

  // 5. Media
  const media: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'media'));
    snap.forEach((d) => {
      media.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying media collection for backup:', err);
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `emkay-visuals-firestore-backup-${dateStr}.json`;

  const backup: FirestoreBackupFile = {
    _meta: {
      appName: 'Emkay Visuals',
      source: 'Emkay Visuals /admin Firestore Backup',
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      environment: 'production',
      itemCounts: {
        portfolio: portfolioData ? 1 : 0,
        briefs: briefs.length,
        projectBriefs: projectBriefs.length,
        analytics: Object.keys(analytics).length,
        media: media.length,
      },
    },
    portfolio: {
      content: serializeData(mergedPortfolio),
    },
    briefs,
    projectBriefs,
    analytics,
    media,
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const sizeKb = Math.max(1, Math.round(new Blob([jsonString]).size / 1024));
  const totalItems =
    (portfolioData ? 1 : 0) +
    briefs.length +
    projectBriefs.length +
    Object.keys(analytics).length +
    media.length;

  const summaryText = `${totalItems} items (${sizeKb} KB)`;

  return { backup, fileName, sizeKb, summaryText };
}

/**
 * Triggers a browser download of the given JSON data.
 */
export function downloadJsonFile(data: any, fileName: string) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
