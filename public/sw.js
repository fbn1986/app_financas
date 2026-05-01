const CACHE = 'financaspro-v1'

// Não cacheia rotas internas do Next.js nem chamadas ao Supabase
function shouldHandle(url) {
  const { origin, pathname } = new URL(url)
  if (origin !== self.location.origin) return false
  if (pathname.startsWith('/_next/')) return false
  if (pathname.startsWith('/api/')) return false
  return true
}

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (!shouldHandle(event.request.url)) return
  if (event.request.method !== 'GET') return

  // Navegação: tenta a rede primeiro, cai no cache se offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(event.request, clone))
          return res
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match('/'))
        )
    )
    return
  }

  // Demais recursos: cache primeiro, depois rede
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(event.request, clone))
          }
          return res
        })
    )
  )
})
