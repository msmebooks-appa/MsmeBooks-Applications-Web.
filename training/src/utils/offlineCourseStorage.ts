import { Course } from '../types';
import { COURSES } from '../data/mockData';

const OFFLINE_COURSES_KEY = 'msmebooks_offline_courses_v1';

export interface OfflineCourseRecord {
  courseId: string;
  course: Course;
  downloadedAt: string;
  sizeBytesEstimated: number;
  moduleCount?: number;
}

const notifyOfflineCacheChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('msmebooks_offline_courses_changed'));
  }
};

/**
 * Retrieves the list of all courses saved for offline study.
 */
export const getOfflineCourses = (): OfflineCourseRecord[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_COURSES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Auto-seed primary starter course into offline cache so students immediately have cached courses ready
    if (COURSES && COURSES.length > 0) {
      const defaultRecord: OfflineCourseRecord = {
        courseId: COURSES[0].id,
        course: COURSES[0],
        downloadedAt: 'Nov 03, 2026',
        sizeBytesEstimated: 245000,
        moduleCount: COURSES[0].modulesCount || 4
      };
      const initialList = [defaultRecord];
      try {
        localStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify(initialList));
      } catch {}
      return initialList;
    }
    return [];
  } catch (err) {
    console.warn('[OfflineStorage] Error reading offline courses:', err);
    return [];
  }
};

/**
 * Checks if a specific course is already cached offline.
 */
export const isCourseSavedOffline = (courseId: string): boolean => {
  const records = getOfflineCourses();
  return records.some((r) => r.courseId === courseId);
};

/**
 * Saves a course and its full modules/lessons into offline storage and service worker cache.
 */
export const downloadCourseForOffline = async (course: Course): Promise<boolean> => {
  try {
    const existing = getOfflineCourses();
    const filtered = existing.filter((r) => r.courseId !== course.id);

    // Approximate size in bytes (metadata + lessons + description)
    const jsonString = JSON.stringify(course);
    const sizeBytes = new Blob([jsonString]).size + 150000; // estimated including cache shell

    const newRecord: OfflineCourseRecord = {
      courseId: course.id,
      course,
      downloadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      sizeBytesEstimated: sizeBytes,
      moduleCount: course.modulesCount || 4
    };

    localStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify([...filtered, newRecord]));
    notifyOfflineCacheChange();

    // Send cache request to Service Worker if active
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const urlsToCache = [course.thumbnail];
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_COURSE_MODULES',
        courseId: course.id,
        urls: urlsToCache
      });
    }

    return true;
  } catch (err) {
    console.error('[OfflineStorage] Failed to save course offline:', err);
    return false;
  }
};

/**
 * Removes a course from offline storage.
 */
export const removeCourseFromOffline = async (courseId: string): Promise<boolean> => {
  try {
    const existing = getOfflineCourses();
    const updated = existing.filter((r) => r.courseId !== courseId);
    localStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify(updated));
    notifyOfflineCacheChange();
    return true;
  } catch (err) {
    console.error('[OfflineStorage] Failed to remove course offline:', err);
    return false;
  }
};

/**
 * Registers the Service Worker in the browser.
 */
export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[ServiceWorker] Registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[ServiceWorker] Registration failed:', error);
        });
    });
  }
};
