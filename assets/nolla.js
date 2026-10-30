/* nolla theme: bag, free pillow, product panel, gallery, size guide, menu, FAQ, timer, videos, email sign-up.
   Markup and classes match the original Nolla site exactly; this file only adds behaviour. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DATA = JSON.parse($('#nolla-data')?.textContent || '{}');
  const CURRENCY = DATA.currency || 'GBP';
  const PILLOW_ID = Number(DATA.pillowVariantId || 0);
  const PRODUCT_URL = '/products/nuv-velvet-blanket';

  /* ───────────── Money: same rules as the original site ───────────── */
  const AMBIGUOUS = ['CAD', 'AUD', 'NZD', 'MXN'];
  let fmt;
  const money = (cents) => {
    if (!fmt) {
      const own = CURRENCY === 'GBP' || CURRENCY === 'USD';
      fmt = new Intl.NumberFormat(CURRENCY === 'USD' ? 'en-US' : 'en-GB', {
        style: 'currency',
        currency: CURRENCY,
        currencyDisplay: own || AMBIGUOUS.includes(CURRENCY) ? 'symbol' : 'narrowSymbol',
      });
    }
    return fmt.format(cents / 100);
  };
  const TM = '<span class="ml-[0.02em] align-super font-sans text-[0.42em] font-normal tracking-normal">™</span>';
  const tm = (s) => esc(s).replace(/™/g, TM);
  const sized = (src, w) => (src ? src + (src.includes('?') ? '&' : '?') + 'width=' + w : '');
  const ICON_GIFT = (cls) =>
    `<svg aria-hidden="true" class="lucide lucide-gift ${cls}" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><rect height="4" rx="1" width="18" x="3" y="8"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path></svg>`;
  const IMG_STYLE = 'position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent';

  /* ───────────── Bag (Shopify cart) + the free pillow ───────────── */
  const isBlanket = (item) => (item.handle || '').startsWith('nuv-velvet-blanket');
  const blanketCount = (cart) => cart.items.filter(isBlanket).reduce((n, i) => n + i.quantity, 0);

  const Cart = {
    state: null,
    lastAdded: null,
    async get() {
      const r = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      this.state = await r.json();
      return this.state;
    },
    /** One free pillow for every blanket: added, adjusted or removed automatically */
    async syncPillow(cart) {
      if (!PILLOW_ID) return cart;
      const want = blanketCount(cart);
      const have = cart.items.filter((i) => i.variant_id === PILLOW_ID).reduce((n, i) => n + i.quantity, 0);
      if (want === have) return cart;
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ updates: { [PILLOW_ID]: want } }),
      });
      return this.get();
    },
    async add(variantId, quantity = 1) {
      const r = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity }] }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).description || 'Could not add to bag');
      const added = await r.json();
      this.lastAdded = added.items?.[0]?.key ?? null;
      return this.syncPillow(await this.get());
    },
    async change(key, quantity) {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity }),
      });
      return this.syncPillow(await this.get());
    },
  };

  /* Drawer */
  const drawer = $('[data-cart-drawer]');
  let drawerOpener = null;
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('pointer-events-auto', open);
    drawer.classList.toggle('pointer-events-none', !open);
    drawer.inert = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    $('[data-cart-overlay]', drawer).classList.toggle('opacity-100', open);
    $('[data-cart-overlay]', drawer).classList.toggle('opacity-0', !open);
    $('[data-cart-panel]', drawer).classList.toggle('translate-x-0', open);
    $('[data-cart-panel]', drawer).classList.toggle('translate-x-full', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      drawerOpener = document.activeElement;
      setTimeout(() => $('[data-cart-close]', drawer)?.focus(), 50);
    } else {
      drawerOpener?.focus?.({ preventScroll: true });
      Cart.lastAdded = null;
    }
    document.dispatchEvent(new CustomEvent('nolla:drawer', { detail: { open } }));
  }
  const drawerIsOpen = () => drawer?.classList.contains('pointer-events-auto');

  function renderCount(cart) {
    const n = blanketCount(cart);
    $$('[data-cart-button]').forEach((b) => {
      b.setAttribute('aria-label', n ? `Open bag, ${n} blanket${n === 1 ? '' : 's'}` : 'Open bag');
      let badge = $('[data-cart-count]', b);
      if (!n) return badge?.remove();
      if (!badge) {
        badge = document.createElement('span');
        badge.dataset.cartCount = '';
        badge.className =
          'absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] animate-fade place-items-center rounded-full bg-mocha px-1 text-[0.62rem] font-semibold tabular-nums text-ivory';
        b.appendChild(badge);
      }
      badge.textContent = n;
    });
  }

  function renderDrawer(cart) {
    if (!drawer) return;
    renderCount(cart);
    const body = $('[data-cart-body]', drawer);
    const title = $('[data-cart-title-count]', drawer);
    const lines = cart.items.filter(isBlanket);
    const pillows = cart.items.filter((i) => i.variant_id === PILLOW_ID).reduce((n, i) => n + i.quantity, 0) || blanketCount(cart);
    const count = blanketCount(cart);
    title.innerHTML = count > 0 ? `<span class="ml-2 font-sans text-[0.85rem] text-charcoal/50">(${count})</span>` : '';

    if (!lines.length) {
      body.innerHTML = `<div class="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p class="font-serif text-[1.6rem] font-light tracking-[-0.02em]">Your bag is empty.</p>
          <p class="mt-2 max-w-[30ch] text-[0.92rem] text-charcoal/60">Every blanket comes with a free cloud pillow.</p>
          <a href="${PRODUCT_URL}" data-cart-close-link class="relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium tracking-[0.01em] transition-[background-color,color,border-color,text-decoration-color,transform] duration-300 ease-soft active:scale-[0.985] bg-charcoal text-ivory hover:bg-espresso h-14 px-8 text-[0.98rem] mt-8">Shop the blanket</a>
        </div>`;
      return;
    }

    const justAdded = Cart.lastAdded && lines.some((l) => l.key === Cart.lastAdded);
    const pillowImg = DATA.pillowImage || '';
    body.innerHTML = `<div class="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
        <div class="mt-4 flex items-center gap-3 rounded-soft bg-espresso px-4 py-3 text-ivory">${ICON_GIFT('h-4 w-4 shrink-0')}
          <p class="text-[0.85rem]"><span class="font-medium">Free cloud pillow unlocked</span><span class="text-ivory/70"> · ${pillows > 1 ? `${pillows} pillows, one with each blanket` : 'one with every blanket'}</span></p>
        </div>
        ${justAdded ? `<p class="mt-4 flex animate-fade items-center gap-2 text-[0.85rem] text-charcoal/75"><span class="grid h-5 w-5 place-items-center rounded-full bg-charcoal text-ivory"><svg aria-hidden="true" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>Added to your bag, with a free cloud pillow</p>` : ''}
        <ul class="divide-y divide-charcoal/10">
          ${lines
            .map((l) => {
              const opts = (l.options_with_values || []).map((o) => o.value);
              const label = opts.join(' · ');
              return `<li class="flex gap-4 py-5">
              <div class="relative h-[6.5rem] w-[5.2rem] shrink-0 overflow-hidden rounded-soft bg-oat-soft">${l.image ? `<img alt="" class="object-cover" decoding="async" loading="lazy" src="${esc(sized(l.image, 200))}" style="${IMG_STYLE}">` : ''}</div>
              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[0.95rem] font-medium leading-snug">Nuv${TM} Velvet Blanket</p>
                    <p class="mt-1 text-[0.82rem] text-charcoal/60">${esc(label)}</p>
                  </div>
                  <p class="shrink-0 text-[0.95rem] tabular-nums">${money(l.final_line_price)}</p>
                </div>
                <div class="mt-auto flex items-center justify-between pt-3">
                  <div class="flex items-center rounded-full border border-charcoal/15">
                    <button type="button" data-qty="${esc(l.key)}" data-to="${l.quantity - 1}" aria-label="Decrease quantity of ${esc(label)}" class="grid h-10 w-10 place-items-center rounded-full hover:bg-charcoal/[0.05]"><svg aria-hidden="true" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
                    <span class="w-6 text-center text-[0.9rem] tabular-nums" aria-label="Quantity ${l.quantity}">${l.quantity}</span>
                    <button type="button" data-qty="${esc(l.key)}" data-to="${l.quantity + 1}" ${l.quantity >= 10 ? 'disabled' : ''} aria-label="Increase quantity of ${esc(label)}" class="grid h-10 w-10 place-items-center rounded-full hover:bg-charcoal/[0.05] disabled:opacity-35"><svg aria-hidden="true" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
                  </div>
                  <button type="button" data-qty="${esc(l.key)}" data-to="0" class="px-1 py-2 text-[0.8rem] text-charcoal/55 underline decoration-charcoal/20 underline-offset-4 hover:text-charcoal">Remove<span class="sr-only"> ${esc(label)}</span></button>
                </div>
              </div>
            </li>`;
            })
            .join('')}
          <li class="flex items-center gap-4 py-5">
            <div class="relative h-[5.2rem] w-[5.2rem] shrink-0 overflow-hidden rounded-soft bg-oat">${pillowImg ? `<img alt="" class="object-cover" decoding="async" loading="lazy" src="${esc(sized(pillowImg, 200))}" style="${IMG_STYLE}">` : ''}</div>
            <div class="min-w-0 flex-1">
              <p class="inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-mocha">${ICON_GIFT('h-3.5 w-3.5')} Free gift</p>
              <p class="mt-1 text-[0.95rem] font-medium leading-snug">Nimbus${TM} cloud pillow${pillows > 1 ? `<span class="ml-1.5 font-normal text-charcoal/60">× ${pillows}</span>` : ''}</p>
              <p class="mt-0.5 text-[0.8rem] text-charcoal/55">One with every blanket. Added automatically.</p>
            </div>
            <p class="shrink-0 text-[0.9rem] font-medium text-mocha">Free</p>
          </li>
        </ul>
      </div>
      <div class="shrink-0 border-t border-charcoal/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-7">
        <dl class="space-y-1.5 text-[0.9rem]">
          <div class="flex items-baseline justify-between"><dt class="font-medium">Subtotal</dt><dd class="text-[1.15rem] font-medium tabular-nums">${money(cart.total_price)}</dd></div>
          <div class="flex items-baseline justify-between gap-4 text-charcoal/60"><dt>Delivery</dt><dd class="text-right">Free</dd></div>
          <div class="flex items-baseline justify-between gap-4 text-charcoal/60"><dt>Arrives in</dt><dd class="text-right">4–10 working days</dd></div>
        </dl>
        <a href="/checkout" class="relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium tracking-[0.01em] transition-[background-color,color,border-color,text-decoration-color,transform] duration-300 ease-soft active:scale-[0.985] bg-charcoal text-ivory hover:bg-espresso h-14 px-8 text-[0.98rem] w-full mt-5">Checkout</a>
        <p class="mt-2.5 text-center text-[0.75rem] text-charcoal/50">Secure checkout. Card, Apple Pay, Google Pay and Shop Pay.</p>
      </div>`;
  }

  async function refreshCart({ open = false } = {}) {
    const cart = await Cart.syncPillow(await Cart.get());
    renderDrawer(cart);
    if (open) setDrawer(true);
    return cart;
  }

  if (drawer) {
    document.addEventListener('click', async (e) => {
      const t = e.target.closest('[data-cart-button]');
      if (t) {
        e.preventDefault();
        await refreshCart();
        setDrawer(true);
        return;
      }
      if (e.target.closest('[data-cart-close], [data-cart-overlay], [data-cart-close-link]')) {
        if (!e.target.closest('[data-cart-close-link]')) e.preventDefault();
        setDrawer(false);
        return;
      }
      const q = e.target.closest('[data-qty]');
      if (q && drawer.contains(q)) {
        q.disabled = true;
        const cart = await Cart.change(q.dataset.qty, Number(q.dataset.to));
        renderDrawer(cart);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerIsOpen()) setDrawer(false);
    });
    // Keep the pillow right even if the bag was changed elsewhere (e.g. the cart page)
    refreshCart().catch(() => {});
  }

  /* ───────────── Header: shadow on scroll, mobile menu, currency ───────────── */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => {
      const s = window.scrollY > 8;
      header.classList.toggle('border-charcoal/10', s);
      header.classList.toggle('bg-cream/90', s);
      header.classList.toggle('backdrop-blur-md', s);
      header.classList.toggle('border-transparent', !s);
      header.classList.toggle('bg-cream', !s);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  const menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('pointer-events-auto', open);
    menu.classList.toggle('pointer-events-none', !open);
    menu.inert = !open;
    const [overlay, panel] = menu.children;
    overlay.classList.toggle('opacity-100', open);
    overlay.classList.toggle('opacity-0', !open);
    panel.classList.toggle('translate-y-0', open);
    panel.classList.toggle('opacity-100', open);
    panel.classList.toggle('-translate-y-4', !open);
    panel.classList.toggle('opacity-0', !open);
    $$('[aria-controls="mobile-menu"]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menu) {
    $$('[aria-controls="mobile-menu"]').forEach((b) => b.addEventListener('click', () => setMenu(true)));
    $('[aria-label="Close menu"]', menu)?.addEventListener('click', () => setMenu(false));
    menu.children[0]?.addEventListener('click', () => setMenu(false));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }
  $$('[data-currency-select]').forEach((sel) => sel.addEventListener('change', () => sel.form.submit()));

  /* ───────────── Fun timer: counts down to midnight UK time ───────────── */
  $$('[data-fun-timer]').forEach((el) => {
    const tz = el.dataset.timeZone || 'Europe/London';
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (t) => Number(parts.find((p) => p.type === t)?.value ?? 0);
      const left = Math.max(0, 86400 - (get('hour') * 3600 + get('minute') * 60 + get('second')));
      const h = pad(Math.floor(left / 3600)), m = pad(Math.floor((left % 3600) / 60)), s = pad(left % 60);
      el.textContent = `${h}:${m}:${s}`;
      el.setAttribute('aria-label', `${h} hours, ${m} minutes, ${s} seconds`);
    };
    tick();
    setInterval(tick, 1000);
  });

  /* ───────────── Accordions (FAQ, product details) ───────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[aria-controls][aria-expanded]');
    if (!btn || btn.getAttribute('aria-controls') === 'mobile-menu') return;
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel || !panel.classList.contains('grid')) return;
    const group = btn.closest('.divide-y');
    const open = btn.getAttribute('aria-expanded') !== 'true';
    const setItem = (b, isOpen) => {
      const p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      b.setAttribute('aria-expanded', String(isOpen));
      p.classList.toggle('grid-rows-[1fr]', isOpen);
      p.classList.toggle('opacity-100', isOpen);
      p.classList.toggle('grid-rows-[0fr]', !isOpen);
      p.classList.toggle('opacity-0', !isOpen);
      if (p.firstElementChild) p.firstElementChild.inert = !isOpen;
      const plus = b.querySelector('span[aria-hidden] span:last-child');
      plus?.classList.toggle('scale-y-0', isOpen);
    };
    if (group) $$('button[aria-controls][aria-expanded]', group).forEach((b) => b !== btn && setItem(b, false));
    setItem(btn, open);
  });

  /* ───────────── Real-life videos: play only while on screen ───────────── */
  const videos = $$('video[data-autoplay-inview], section video');
  if (videos.length && !reducedMotion() && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target: v, isIntersecting }) => {
          if (isIntersecting) {
            if (v.preload !== 'auto') v.preload = 'auto';
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.35 },
    );
    videos.forEach((v) => {
      v.muted = true;
      io.observe(v);
    });
  }

  /* ───────────── Email sign-up (Klaviyo, as on the original site) ───────────── */
  $$('form[data-klaviyo]').forEach((form) => {
    const companyId = form.dataset.company, listId = form.dataset.list;
    const input = $('input[type=email]', form);
    const button = $('button[type=submit]', form);
    const showError = (msg) => {
      let p = $('[data-email-error]', form);
      if (!p) {
        p = document.createElement('p');
        p.dataset.emailError = '';
        p.setAttribute('role', 'alert');
        p.className = 'mt-2 px-2 text-xs text-mocha';
        form.appendChild(p);
      }
      p.textContent = msg;
      input.classList.add('border-mocha');
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showError('Please enter a valid email address.');
      button.disabled = true;
      const label = button.textContent;
      button.textContent = 'One moment…';
      try {
        const r = await fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(companyId)}`, {
          method: 'POST',
          headers: { 'content-type': 'application/vnd.api+json', revision: '2024-10-15' },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                custom_source: 'Nolla website footer',
                profile: { data: { type: 'profile', attributes: { email, properties: { nolla_signup_source: 'footer' } } } },
              },
              relationships: { list: { data: { type: 'list', id: listId } } },
            },
          }),
        });
        if (!r.ok && r.status !== 202) throw new Error();
        const done = document.createElement('p');
        done.setAttribute('role', 'status');
        done.className = 'text-[0.92rem] text-charcoal/75 mt-4';
        done.textContent = 'Thank you. You’re on the list.';
        form.replaceWith(done);
      } catch {
        button.disabled = false;
        button.textContent = label;
        showError('Something went wrong. Please try again.');
      }
    });
  });

  /* ═════════════ Product page ═════════════ */
  const shop = $('[data-product-panel]');
  if (!shop || !DATA.products) return;

  const PRODUCTS = DATA.products; // { classic, custom }
  const colourOf = (v) => v.option1;
  const tierOf = (sizeName) => sizeName.split(' (')[0];
  const baseTier = (tier) => tier.replace(/ Nuv$/, ''); // "Large Nuv" → "Large"
  const collectionOfColour = (label) => ((PRODUCTS.custom && PRODUCTS.custom.colours) || []).includes(label) ? 'custom' : 'classic';
  const sizesOf = (coll) => PRODUCTS[coll].sizes;
  const variantFor = (coll, colour, sizeName) => PRODUCTS[coll].variants.find((v) => v.option1 === colour && v.option2 === sizeName);
  const stripAlt = (alt) => (alt || '').replace(/^[^|]*\|\s*/, '');
  const photosFor = (coll, colour) =>
    (PRODUCTS[coll].media || [])
      .filter((m) => (m.alt || '').startsWith(colour + ' |'))
      .map((m) => ({ src: m.src, alt: stripAlt(m.alt) }));
  const findPhoto = (coll, colour, re, fallbackIndex) => {
    const list = photosFor(coll, colour);
    return list.find((p) => re.test(p.alt)) || list[fallbackIndex] || list[0];
  };

  // Starting choice: ?variant=, else this page's product (White / Extra Large on the classic page)
  const state = { coll: shop.dataset.collection || 'classic', colour: null, size: null };
  const fromUrl = Number(new URLSearchParams(location.search).get('variant'));
  const startVariant =
    PRODUCTS.classic.variants.concat(PRODUCTS.custom?.variants || []).find((v) => v.id === fromUrl) ||
    PRODUCTS[state.coll].variants.find((v) => v.option2.startsWith('Extra Large')) ||
    PRODUCTS[state.coll].variants[0];
  state.colour = colourOf(startVariant);
  state.coll = collectionOfColour(state.colour);
  state.size = startVariant.option2;
  const current = () => variantFor(state.coll, state.colour, state.size);

  /* Gallery */
  const track = $('[data-gallery-track]', shop);
  const thumbs = $('[data-gallery-thumbs]', shop);
  const counter = $('[data-gallery-counter]', shop);
  const prev = $('[data-gallery-prev]', shop), next = $('[data-gallery-next]', shop);
  let images = [], index = 0;

  function galleryImages() {
    const list = photosFor(state.coll, state.colour);
    if (DATA.pillowImage) list.push({ src: DATA.pillowImage, alt: 'Included free: ' + (DATA.pillowAlt || 'The Nimbus cloud pillow.'), gift: true });
    return list;
  }
  function renderGallery() {
    images = galleryImages();
    const n = images.length;
    track.setAttribute('aria-label', `Photos of the ${state.colour} blanket`);
    track.innerHTML = images
      .map(
        (img, i) => `<div aria-label="${i + 1} of ${n}" aria-roledescription="slide" class="relative aspect-[4/5] w-full shrink-0 snap-center snap-always">
        <button aria-label="View photo ${i + 1} of ${n} full screen" class="absolute inset-0 block h-full w-full cursor-zoom-in" tabindex="${i === 0 ? 0 : -1}" type="button" data-zoom="${i}">
          <img alt="${esc(img.alt)}" class="object-cover" decoding="async" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} sizes="(min-width: 1024px) 56vw, 100vw" src="${esc(sized(img.src, 1200))}" srcset="${[600, 900, 1200, 1800].map((w) => `${esc(sized(img.src, w))} ${w}w`).join(', ')}" style="${IMG_STYLE}">
        </button>
        ${
          !img.gift && i === 0
            ? `<span class="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 text-[0.75rem] font-medium text-ivory">${ICON_GIFT('h-3.5 w-3.5')}Free cloud pillow included</span>`
            : ''
        }
        ${img.gift ? `<span class="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[0.75rem] font-medium text-charcoal">${ICON_GIFT('h-3.5 w-3.5 text-mocha')}Included free with every blanket</span>` : ''}
      </div>`,
      )
      .join('');
    thumbs.innerHTML = images
      .map(
        (img, i) => `<li class="w-[17%] shrink-0 sm:w-[13%]"><button aria-label="Show photo ${i + 1}" data-thumb="${i}" class="relative block aspect-[4/5] w-full overflow-hidden rounded-soft bg-oat-soft outline-offset-2 transition-[opacity,box-shadow] duration-300" type="button"><img alt="" class="object-cover" decoding="async" loading="lazy" src="${esc(sized(img.src, 180))}" style="${IMG_STYLE}"></button></li>`,
      )
      .join('');
    goTo(0, false);
  }
  function markIndex(i) {
    index = i;
    counter.textContent = `${i + 1} / ${images.length}`;
    prev.disabled = i === 0;
    next.disabled = i === images.length - 1;
    $$('[data-thumb]', thumbs).forEach((b, j) => {
      const on = j === i;
      b.setAttribute('aria-current', String(on));
      ['opacity-100', 'ring-1', 'ring-charcoal', 'ring-offset-2', 'ring-offset-cream'].forEach((c) => b.classList.toggle(c, on));
      ['opacity-60', 'hover:opacity-100'].forEach((c) => b.classList.toggle(c, !on));
    });
    $$('[data-zoom]', track).forEach((b, j) => (b.tabIndex = j === i ? 0 : -1));
    const thumb = thumbs.children[i];
    if (thumb) thumbs.scrollTo({ left: Math.max(0, thumb.offsetLeft - thumbs.clientWidth / 2 + thumb.clientWidth / 2), behavior: 'smooth' });
  }
  function goTo(i, smooth = true) {
    const c = Math.max(0, Math.min(i, images.length - 1));
    track.scrollTo({ left: c * track.clientWidth, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
    markIndex(c);
  }
  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i !== index) markIndex(i);
    });
  }, { passive: true });
  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));
  thumbs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-thumb]');
    if (b) goTo(Number(b.dataset.thumb));
  });
  track.addEventListener('click', (e) => {
    const b = e.target.closest('[data-zoom]');
    if (b) openLightbox(Number(b.dataset.zoom));
  });

  /* Full-screen viewer */
  function openLightbox(start) {
    const opener = document.activeElement;
    const n = images.length;
    const box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo viewer');
    box.className = 'fixed inset-0 z-[80] flex animate-fade flex-col bg-ivory';
    box.innerHTML = `<div class="flex items-center justify-between px-4 py-3 sm:px-6"><p class="text-sm tabular-nums text-charcoal/60" aria-live="polite" data-lb-count></p>
        <button type="button" data-lb-close aria-label="Close photo viewer" class="grid h-11 w-11 place-items-center rounded-full text-charcoal transition-colors hover:bg-oat-soft"><svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>
      <div class="relative min-h-0 flex-1"><div class="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto" data-lb-track>
        ${images.map((img) => `<div class="relative h-full w-full shrink-0 snap-center snap-always px-2 pb-4 sm:px-16"><div class="relative h-full w-full"><img alt="${esc(img.alt)}" class="object-contain" decoding="async" src="${esc(sized(img.src, 2000))}" style="${IMG_STYLE}"></div></div>`).join('')}
      </div>
      <button type="button" data-lb-prev aria-label="Previous photo" class="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream text-charcoal transition-opacity hover:bg-oat-soft disabled:opacity-0 sm:grid"><svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
      <button type="button" data-lb-next aria-label="Next photo" class="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-cream text-charcoal transition-opacity hover:bg-oat-soft disabled:opacity-0 sm:grid"><svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button></div>`;
    document.body.appendChild(box);
    const lt = $('[data-lb-track]', box);
    let li = start;
    const mark = (i) => {
      li = i;
      $('[data-lb-count]', box).textContent = `${i + 1} / ${n}`;
      $('[data-lb-prev]', box).disabled = i === 0;
      $('[data-lb-next]', box).disabled = i === n - 1;
    };
    const go = (i, smooth = true) => {
      const c = Math.max(0, Math.min(i, n - 1));
      lt.scrollTo({ left: c * lt.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
      mark(c);
    };
    lt.addEventListener('scroll', () => mark(Math.round(lt.scrollLeft / Math.max(1, lt.clientWidth))), { passive: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      box.remove();
      goTo(li, false);
      opener?.focus?.({ preventScroll: true });
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(li + 1);
      if (e.key === 'ArrowLeft') go(li - 1);
    };
    window.addEventListener('keydown', onKey);
    $('[data-lb-close]', box).addEventListener('click', close);
    $('[data-lb-prev]', box).addEventListener('click', () => go(li - 1));
    $('[data-lb-next]', box).addEventListener('click', () => go(li + 1));
    requestAnimationFrame(() => go(start, false));
    $('[data-lb-close]', box).focus();
  }

  /* Swatches (purchase panel + texture section share the choice) */
  const SW_ON = ['shadow-[inset_0_0_0_1.5px_#252321]'];
  const SW_OFF = ['shadow-[inset_0_0_0_1px_rgba(37,35,33,0.12)]', 'hover:shadow-[inset_0_0_0_1px_rgba(37,35,33,0.45)]'];
  const FAB_ON = ['shadow-[inset_0_0_0_1.5px_#FBF9F5]'];
  const FAB_OFF = ['shadow-[inset_0_0_0_1px_rgba(251,249,245,0.2)]', 'hover:shadow-[inset_0_0_0_1px_rgba(251,249,245,0.6)]'];
  const labelOfInput = (input) => input.parentElement.querySelector('span.sr-only')?.textContent.trim();

  function renderSwatches() {
    $$('input[name=colour], input[name=fabric-colour]').forEach((input) => {
      const on = labelOfInput(input) === state.colour;
      input.checked = on;
      const ring = input.nextElementSibling;
      const fabric = input.name === 'fabric-colour';
      (fabric ? FAB_ON : SW_ON).forEach((c) => ring.classList.toggle(c, on));
      (fabric ? FAB_OFF : SW_OFF).forEach((c) => ring.classList.toggle(c, !on));
    });
    const legendName = $('fieldset legend > span > span:last-child', shop);
    if (legendName) legendName.textContent = state.colour;
  }
  document.addEventListener('change', (e) => {
    const input = e.target;
    if (input.name !== 'colour' && input.name !== 'fabric-colour') return;
    const label = labelOfInput(input);
    if (!label || label === state.colour) return;
    const coll = collectionOfColour(label);
    // Moving between collections keeps the same Medium / Large / Extra Large
    if (coll !== state.coll) {
      const tier = tierOf(state.size);
      state.size = sizesOf(coll).find((s) => tierOf(s) === tier) || sizesOf(coll)[sizesOf(coll).length - 1];
      state.coll = coll;
    }
    state.colour = label;
    update({ gallery: true });
  });

  /* Sizes */
  const sizeList = $('[data-size-list]', shop);
  function renderSizes() {
    sizeList.innerHTML = sizesOf(state.coll)
      .map((name) => {
        const v = variantFor(state.coll, state.colour, name);
        if (!v) return '';
        const on = name === state.size;
        const tier = tierOf(name);
        const dims = name.slice(tier.length).trim().replace(/^\(|\)$/g, '');
        const ref = v.compare_at_price && v.compare_at_price > v.price ? v.compare_at_price : null;
        return `<label class="relative flex min-h-[3.5rem] cursor-pointer items-center gap-3.5 rounded-soft border px-4 py-3 transition-[border-color,background-color] duration-300 ease-soft ${on ? 'border-charcoal bg-ivory' : 'border-charcoal/[0.14] hover:border-charcoal/40'} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mocha"><input ${on ? 'checked' : ''} class="sr-only" name="size" type="radio" value="${esc(name)}"${v.available ? '' : ' disabled'}><span aria-hidden="true" class="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors ${on ? 'border-charcoal' : 'border-charcoal/30'}"><span class="h-2 w-2 rounded-full bg-charcoal transition-transform duration-300 ease-soft ${on ? 'scale-100' : 'scale-0'}"></span></span><span class="min-w-0 flex-1"><span class="flex flex-wrap items-center gap-x-2 gap-y-1"><span class="text-[0.95rem] font-medium text-charcoal">${esc(tier)} <span class="font-normal tabular-nums text-charcoal/60">(${esc(dims)})</span></span>${baseTier(tier) === 'Extra Large' ? '<span class="rounded-full bg-oat px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-mocha">Our largest</span>' : ''}</span></span><span class="price-wait shrink-0 text-right tabular-nums" data-ready="true"><span class="block text-[0.95rem] font-medium text-charcoal">${money(v.price)}</span>${ref ? `<s class="block text-[0.78rem] text-charcoal/45 decoration-charcoal/40">${money(ref)}</s>` : ''}</span></label>`;
      })
      .join('');
  }
  sizeList.addEventListener('change', (e) => {
    if (e.target.name !== 'size') return;
    state.size = e.target.value;
    update();
  });

  /* Price block, buttons, sticky bar */
  function renderPrice() {
    const v = current();
    const ref = v.compare_at_price && v.compare_at_price > v.price ? v.compare_at_price : null;
    const box = $('[data-price]', shop);
    box.innerHTML = `<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span class="font-sans text-[1.65rem] font-medium tracking-[-0.01em] tabular-nums text-charcoal">${money(v.price)}</span>${
      ref
        ? `<span class="text-[0.95rem] text-charcoal/50"><span class="sr-only">Regular price: </span><s class="decoration-charcoal/40 tabular-nums">${money(ref)}</s></span><span class="text-[0.8rem] font-medium tabular-nums text-mocha">Save ${money(ref - v.price)}</span>`
        : ''
    }</div>${ref ? '<p class="mt-1.5 text-[0.8rem] text-charcoal/60">Limited-time offer on this size.</p>' : ''}`;
    box.dataset.ready = 'true';
    $$('[data-add-price]').forEach((el) => {
      el.textContent = money(v.price);
      el.dataset.ready = 'true';
    });
    const desc = `${state.colour} / ${state.size}`;
    $$('[data-sticky-desc]').forEach((el) => (el.textContent = desc));
    const thumb = findPhoto(state.coll, state.colour, /draped over/i, 0);
    $$('[data-sticky-img]').forEach((img) => thumb && (img.src = sized(thumb.src, 120)));
    $$('[data-buy]').forEach((b) => (b.disabled = !v.available));
  }

  /* Texture section follows the colour */
  function renderFabric() {
    const sec = $('#fabric');
    if (!sec) return;
    const texture = findPhoto(state.coll, state.colour, /close-up/i, 3);
    const draped = findPhoto(state.coll, state.colour, /draped over/i, 0);
    const [t, d] = $$('img', sec);
    [[t, texture], [d, draped]].forEach(([img, p]) => {
      if (!img || !p) return;
      img.removeAttribute('srcset');
      img.src = sized(p.src, 1200);
      img.alt = p.alt;
    });
    const showing = $('legend span', sec);
    if (showing) showing.textContent = state.colour;
    const link = $('a[href="#shop"]', sec);
    if (link) link.textContent = `Shop the ${state.colour.toLowerCase()} blanket`;
  }

  /* Size guide (section + dialog), drawn to scale for the chosen collection */
  const GUIDE_TEXT = {
    Medium: 'A smaller throw. Right for one person on the sofa, an armchair or the end of the bed.',
    Large: 'Room to stretch out under, or to share with someone on the sofa. More coverage across a bed.',
    'Extra Large': 'Our biggest. Enough to share, to wrap right around you, or to spread generously across a bed.',
  };
  const WEIGHT = { classic: { Medium: 'about 1.1 kg', 'Extra Large': 'about 2.8 kg' }, custom: {} };
  function sizeGuideHTML(compact) {
    const sizes = sizesOf(state.coll).map((name) => {
      const tier = tierOf(name);
      const [w, l] = (name.match(/(\d+)\s*×\s*(\d+)/) || [0, 0, 0]).slice(1).map(Number);
      return { name, tier, w, l };
    });
    const max = sizes[sizes.length - 1];
    const W = 240, scale = W / max.w, H = max.l * scale, pad = 2;
    const rects = [...sizes]
      .reverse()
      .map((s) => {
        const w = s.w * scale, h = s.l * scale, active = s.name === state.size;
        return `<g><rect class="transition-[fill,stroke] duration-500 ${active ? 'fill-oat stroke-charcoal' : 'fill-ivory/70 stroke-charcoal/30'}" height="${h}" rx="2" ${active ? '' : 'stroke-dasharray="3 3"'} stroke-width="${active ? 1.2 : 0.8}" width="${w}" x="${pad}" y="${pad + (H - h)}"></rect><text class="font-sans text-[11px] ${active ? 'fill-charcoal' : 'fill-charcoal/55'}" text-anchor="end" x="${pad + w - 6}" y="${pad + (H - h) + 16}">${s.w} × ${s.l}</text></g>`;
      })
      .join('');
    const rows = sizes
      .map((s) => {
        const active = s.name === state.size;
        const weight = WEIGHT[state.coll][baseTier(s.tier)];
        return `<li><button aria-pressed="${active}" data-pick-size="${esc(s.name)}" class="block w-full py-4 text-left group" type="button"><span class="flex items-baseline justify-between gap-4"><span class="font-serif text-[1.3rem] font-light tracking-[-0.01em] tabular-nums group-hover:text-mocha">${esc(s.name)}</span>${baseTier(s.tier) === 'Extra Large' ? '<span class="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-mocha">Our largest</span>' : ''}</span><span class="mt-1 block text-[0.9rem] leading-relaxed text-charcoal/65">${GUIDE_TEXT[baseTier(s.tier)] || ''}${weight ? `<span class="text-charcoal/45"> Weighs ${weight}.</span>` : ''}</span><span class="mt-2 inline-block text-[0.8rem] text-charcoal/60 underline decoration-charcoal/20 underline-offset-4">${active ? 'Selected' : 'Choose this size'}</span></button></li>`;
      })
      .join('');
    return `<div class="grid items-center gap-8 ${compact ? 'sm:grid-cols-[200px_1fr]' : 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14'}"><figure class="mx-auto w-full ${compact ? 'max-w-[220px]' : 'max-w-[340px]'}"><svg aria-label="The three blanket sizes drawn to scale, overlapping from one corner." class="h-auto w-full" role="img" viewBox="0 0 ${W + pad * 2} ${H + pad * 2}">${rects}</svg><figcaption class="mt-3 text-center text-[0.75rem] text-charcoal/50">Drawn to scale, in centimetres.</figcaption></figure><ul class="divide-y divide-charcoal/10 border-y border-charcoal/10">${rows}</ul></div>`;
  }
  function renderGuides() {
    $$('[data-size-guide]').forEach((el) => (el.innerHTML = sizeGuideHTML(el.hasAttribute('data-compact'))));
  }
  document.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick-size]');
    if (!pick) return;
    state.size = pick.dataset.pickSize;
    update();
    const dialog = pick.closest('[data-size-dialog]');
    if (dialog) return closeGuide();
    $('#shop')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  });
  const guide = $('[data-size-dialog]');
  let guideOpener = null;
  function openGuide() {
    guideOpener = document.activeElement;
    guide.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-size-dialog-close]', guide)?.focus();
  }
  function closeGuide() {
    guide.hidden = true;
    document.body.style.overflow = '';
    guideOpener?.focus?.({ preventScroll: true });
  }
  $('[data-open-size-guide]', shop)?.addEventListener('click', openGuide);
  guide?.addEventListener('click', (e) => {
    if (e.target.closest('[data-size-dialog-close]') || e.target.hasAttribute('data-size-dialog-overlay')) closeGuide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && guide && !guide.hidden) closeGuide();
  });

  /* Add to bag / Buy it now */
  async function addCurrent(btn) {
    const v = current();
    if (!v) return null;
    btn.disabled = true;
    try {
      return await Cart.add(v.id, 1);
    } catch (err) {
      alertLine(btn, err.message);
      return null;
    } finally {
      btn.disabled = false;
    }
  }
  function alertLine(btn, msg) {
    let p = btn.parentElement.querySelector('[data-add-error]');
    if (!p) {
      p = document.createElement('p');
      p.dataset.addError = '';
      p.setAttribute('role', 'alert');
      p.className = 'mt-2 text-center text-[0.84rem] text-mocha';
      btn.insertAdjacentElement('afterend', p);
    }
    p.textContent = msg;
  }
  $$('[data-add]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const cart = await addCurrent(btn);
      if (cart) {
        renderDrawer(cart);
        setDrawer(true);
      }
    }),
  );
  $$('[data-buy-now]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const cart = await addCurrent(btn);
      if (cart) location.href = '/checkout';
    }),
  );

  /* Sticky bar: shows once the main button has scrolled away, steps aside near the end */
  const sticky = $('[data-sticky-bar]');
  const primary = $('#primary-add-to-bag');
  if (sticky && primary) {
    let f = 0;
    const check = () => {
      const past = primary.getBoundingClientRect().bottom < 0;
      const nearEnd = $$('[data-sticky-stop]').some((el) => el.getBoundingClientRect().top < window.innerHeight);
      const show = past && !nearEnd && !drawerIsOpen();
      sticky.classList.toggle('translate-y-0', show);
      sticky.classList.toggle('translate-y-full', !show);
      sticky.inert = !show;
      sticky.setAttribute('aria-hidden', String(!show));
    };
    const onScroll = () => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('nolla:drawer', onScroll);
  }

  /* Everything that depends on the choice */
  function update({ gallery = false } = {}) {
    if (!current()) state.size = sizesOf(state.coll)[sizesOf(state.coll).length - 1];
    renderSwatches();
    renderSizes();
    renderPrice();
    renderFabric();
    renderGuides();
    if (gallery) renderGallery();
    const v = current();
    if (v && shop.dataset.updateUrl !== 'false') {
      const url = new URL(location.href);
      url.pathname = '/products/' + PRODUCTS[state.coll].handle;
      url.searchParams.set('variant', v.id);
      history.replaceState(history.state, '', url);
    }
  }
  update({ gallery: true });
})();
