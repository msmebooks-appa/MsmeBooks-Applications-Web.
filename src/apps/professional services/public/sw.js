const CACHE_NAME = 'msmebooks-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// In-memory scheduled reminder timers in service worker
const reminderTimers = new Map();

// 1. INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching partial assets failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH (Network-first with Cache fallback for offline functionality)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Handle navigation requests (SPA HTML page)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh copy of index
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response('<h1>MsmeBooks is currently offline</h1><p>Please reconnect to the internet.</p>', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Handle static assets & APIs
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. BROWSER PUSH NOTIFICATION HANDLER
// Receives web push events when a certified firm accepts or updates a booking request
self.addEventListener('push', (event) => {
  let payload = {};
  
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = {
        title: '📋 Booking Status Update - MsmeBooks',
        body: event.data.text() || 'A certified firm has updated your consultation request.',
      };
    }
  } else {
    payload = {
      title: '🎉 Booking Request Accepted!',
      body: 'Cedar Professional Services Ltd accepted your booking request (Ref: MSME-BK-9182). Tap to view engagement schedule.',
      bookingId: 'bkg-demo-1',
      status: 'Confirmed & Accepted',
      providerName: 'Cedar Professional Services Ltd',
      serviceTitle: 'Statutory Tax Filing & Withholding Tax Audit'
    };
  }

  const notificationType = payload.type || 'BOOKING_STATUS_UPDATE';
  const isAccepted = notificationType === 'BOOKING_ACCEPTED' || (payload.status && payload.status.toLowerCase().includes('accept'));

  const title = payload.title || (
    isAccepted
      ? `🎉 Booking Accepted: ${payload.serviceTitle || 'Professional Consultation'}`
      : `📋 Booking Status Updated: ${payload.status || 'Update Received'}`
  );

  const body = payload.body || (
    isAccepted
      ? `${payload.providerName || 'Certified Firm'} has accepted your booking request (${payload.reference || payload.bookingId || 'Confirmed'}). Tap to view details.`
      : `${payload.providerName || 'Certified Partner'} updated "${payload.serviceTitle || 'Service'}": Current status is now "${payload.status || 'Updated'}".`
  );

  const options = {
    body,
    icon: payload.icon || '/icon.svg',
    badge: payload.badge || '/icon.svg',
    vibrate: [200, 100, 200, 100, 250],
    tag: payload.tag || `booking-${payload.bookingId || Date.now()}`,
    renotify: true,
    requireInteraction: true,
    data: {
      url: payload.url || '/',
      bookingId: payload.bookingId,
      reference: payload.reference,
      status: payload.status,
      type: notificationType,
      providerName: payload.providerName,
      serviceTitle: payload.serviceTitle,
      timestamp: Date.now()
    },
    actions: [
      { action: 'view_booking', title: '👁️ View Booking' },
      { action: 'open_chat', title: '💬 WhatsApp Firm' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 5. MESSAGE HANDLING (Inter-process and in-app triggers from Provider Portal & Admin)
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  // A. Firm Accepts a Booking Request
  if (data.type === 'BOOKING_ACCEPTED') {
    const {
      bookingId,
      reference,
      serviceTitle,
      providerName,
      appointmentDate,
      timeSlot,
      clientName
    } = data;

    const notifTitle = data.title || `🎉 Booking Request Accepted: ${serviceTitle || 'Service'}`;
    const notifBody = data.body || (
      `${providerName || 'Certified Partner Firm'} has accepted ${clientName ? `${clientName}'s` : 'your'} appointment scheduled for ${appointmentDate || 'scheduled date'}${timeSlot ? ` at ${timeSlot}` : ''}. Reference: ${reference || bookingId || 'MSME-BK'}.`
    );

    self.registration.showNotification(notifTitle, {
      body: notifBody,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [250, 100, 250, 100, 300],
      tag: `booking-accepted-${bookingId || reference || Date.now()}`,
      renotify: true,
      requireInteraction: true,
      data: {
        bookingId,
        reference,
        serviceTitle,
        providerName,
        status: 'Confirmed & Accepted',
        type: 'BOOKING_ACCEPTED',
        timestamp: Date.now()
      },
      actions: [
        { action: 'view_booking', title: '👁️ View Engagement' },
        { action: 'open_chat', title: '💬 WhatsApp Partner' }
      ]
    });
    return;
  }

  // B. Firm Updates a Booking (Milestone advanced, note added, or status changed)
  if (data.type === 'BOOKING_STATUS_UPDATED') {
    const {
      bookingId,
      reference,
      serviceTitle,
      providerName,
      status,
      note,
      milestoneTitle,
      progressPercent
    } = data;

    const notifTitle = data.title || `📋 Booking Status Update: ${status || 'In Progress'}`;
    let notifBody = data.body;
    if (!notifBody) {
      if (milestoneTitle) {
        notifBody = `${providerName || 'Provider'} completed milestone "${milestoneTitle}" (${progressPercent || 0}% complete) for "${serviceTitle}".`;
      } else if (note) {
        notifBody = `${providerName || 'Provider'} updated "${serviceTitle}": ${note}`;
      } else {
        notifBody = `${providerName || 'Certified Partner'} updated the status of "${serviceTitle}" to ${status || 'In Review'}.`;
      }
    }

    self.registration.showNotification(notifTitle, {
      body: notifBody,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      tag: `booking-updated-${bookingId || reference || Date.now()}`,
      renotify: true,
      requireInteraction: true,
      data: {
        bookingId,
        reference,
        serviceTitle,
        providerName,
        status,
        type: 'BOOKING_STATUS_UPDATED',
        timestamp: Date.now()
      },
      actions: [
        { action: 'view_booking', title: '👁️ View Dashboard' },
        { action: 'open_chat', title: '💬 Contact Firm' }
      ]
    });
    return;
  }

  // C. Simulate a Web Push Event for Demo / Testing
  if (data.type === 'SIMULATE_PUSH_UPDATE') {
    const fakePushData = data.payload || {
      title: '🎉 Booking Accepted by Cedar Professional Services Ltd',
      body: 'Your consultation for Statutory Tax Filing (Ref: MSME-BK-9182) has been accepted and confirmed.',
      bookingId: 'bkg-demo-1',
      reference: 'MSME-BK-9182',
      serviceTitle: 'Statutory Tax Filing & Withholding Tax Audit',
      providerName: 'Cedar Professional Services Ltd',
      status: 'Confirmed & Accepted',
      type: 'BOOKING_ACCEPTED'
    };

    self.registration.showNotification(fakePushData.title, {
      body: fakePushData.body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200, 100, 250],
      tag: `booking-simulated-push-${Date.now()}`,
      renotify: true,
      data: fakePushData,
      actions: [
        { action: 'view_booking', title: '👁️ View Booking' },
        { action: 'open_chat', title: '💬 WhatsApp Firm' }
      ]
    });
    return;
  }

  // D. Schedule a 1-hour consultation reminder
  if (data.type === 'SCHEDULE_REMINDER') {
    const { bookingId, serviceTitle, providerName, appointmentTime, delayMs } = data;

    // Clear existing timer if any
    if (reminderTimers.has(bookingId)) {
      clearTimeout(reminderTimers.get(bookingId));
    }

    if (delayMs > 0 && delayMs < 2147483647) {
      const timerId = setTimeout(() => {
        self.registration.showNotification(`⏰ Consultation in 1 Hour: ${serviceTitle}`, {
          body: `With ${providerName || 'Certified Partner'} at ${appointmentTime || 'scheduled time'}. Tap to review details or join WhatsApp.`,
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200],
          tag: `reminder-${bookingId}`,
          data: { bookingId, type: 'CONSULTATION_REMINDER' },
          actions: [
            { action: 'view_booking', title: 'View Details' },
            { action: 'open_chat', title: 'WhatsApp Partner' }
          ]
        });
        reminderTimers.delete(bookingId);
      }, delayMs);

      reminderTimers.set(bookingId, timerId);
    }
    return;
  }

  // D2. Schedule a 24-hour consultation reminder
  if (data.type === 'SCHEDULE_24H_REMINDER') {
    const { bookingId, serviceTitle, providerName, appointmentDate, timeSlot, delayMs } = data;
    const key = `24h-${bookingId}`;

    if (reminderTimers.has(key)) {
      clearTimeout(reminderTimers.get(key));
    }

    if (delayMs > 0 && delayMs < 2147483647) {
      const timerId = setTimeout(() => {
        self.registration.showNotification(`⏰ 24h Reminder: ${serviceTitle || 'Upcoming Appointment'}`, {
          body: `Your consultation with ${providerName || 'Certified Partner'} is scheduled in 24 hours (${appointmentDate || 'tomorrow'} at ${timeSlot || 'scheduled time'}). Tap to prepare requirements or message firm.`,
          icon: '/icon.svg',
          badge: '/icon.svg',
          vibrate: [200, 100, 200, 100, 250],
          tag: `reminder-24h-${bookingId}`,
          requireInteraction: true,
          data: { bookingId, type: '24H_APPOINTMENT_REMINDER' },
          actions: [
            { action: 'view_booking', title: 'View Appointment' },
            { action: 'open_chat', title: 'WhatsApp Firm' }
          ]
        });
        reminderTimers.delete(key);
      }, delayMs);

      reminderTimers.set(key, timerId);
    }
    return;
  }

  // E. Instant Test Reminder Notification (1-Hour)
  if (data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification('⏰ MsmeBooks 1-Hour Reminder Test', {
      body: 'Your upcoming consultation with Cedar Professional Services Limited begins in 1 hour.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      tag: 'msmebooks-test-reminder',
      data: { type: 'TEST_NOTIFICATION' }
    });
    return;
  }

  // E2. Instant Test 24-Hour Reminder Notification
  if (data.type === 'TEST_24H_REMINDER') {
    const { serviceTitle, providerName, appointmentDate, timeSlot } = data;
    self.registration.showNotification(`⏰ 24-Hour Booking Alert: ${serviceTitle || 'Statutory Tax Advisory'}`, {
      body: `Your scheduled session with ${providerName || 'Cedar Professional Services Ltd'} is coming up in 24 hours on ${appointmentDate || 'tomorrow'} at ${timeSlot || '10:00 AM'}. Click to inspect details.`,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200, 100, 250],
      tag: `booking-alert-24h-test-${Date.now()}`,
      requireInteraction: true,
      data: { type: '24H_APPOINTMENT_REMINDER', test: true },
      actions: [
        { action: 'view_booking', title: 'View Booking' },
        { action: 'open_chat', title: 'WhatsApp Partner' }
      ]
    });
    return;
  }
});

// 6. NOTIFICATION CLICK & ACTION DISPATCH
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notifData = event.notification.data || {};
  const action = event.action;

  // Handle WhatsApp direct action
  if (action === 'open_chat') {
    const whatsappUrl = 'https://wa.me/2349158482622?text=' + encodeURIComponent(
      `Hello MsmeBooks, inquiring regarding booking ${notifData.reference || notifData.bookingId || ''} (${notifData.serviceTitle || 'consultation'}).`
    );
    event.waitUntil(
      self.clients.openWindow ? self.clients.openWindow(whatsappUrl) : Promise.resolve()
    );
    return;
  }

  // Default click or 'view_booking' action
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, notify it to open the customer bookings modal and focus it
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'OPEN_CUSTOMER_BOOKINGS',
            bookingId: notifData.bookingId,
            reference: notifData.reference,
            status: notifData.status,
          });
          return client.focus();
        }
      }
      // Otherwise open the app with deep query parameter
      if (self.clients.openWindow) {
        const targetUrl = '/?openBookings=true' + (notifData.bookingId ? `&bookingId=${encodeURIComponent(notifData.bookingId)}` : '');
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
