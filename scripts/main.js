const products = Array.isArray(window.exporiumProducts)
  ? window.exporiumProducts
  : [];

const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

const storageKey = "exporiumProductInterest";
const brandStorageKey = "exporiumBrandFilter";
const brandEventName = "exporium-brand-change";
const isCatalogPage = document.body?.classList.contains("page-catalog");
const favoritesKey = "exporiumFavorites";
const cartKey = "exporiumCart";
const ORDER_URL = "https://script.google.com/macros/s/AKfycby2mlCBlXEHwMDRZC7C_a2R15faIWMQGGNHYNkWp9lEPRYeLm2Y0z-pBn-0snvbAuok/exec";

const readList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const persistList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    // noop
  }
};

let favoriteIds = new Set(readList(favoritesKey));
let cartIds = new Set(readList(cartKey));

const uniqueBrands = products.length
  ? Array.from(
      products.reduce((acc, product) => {
        if (!acc.has(product.brandSlug)) {
          acc.set(product.brandSlug, {
            slug: product.brandSlug,
            name: product.brand,
          });
        }
        return acc;
      }, new Map()).values()
    ).sort((a, b) => a.name.localeCompare(b.name))
  : [];

const nav = select(".primary-nav");
const menuToggle = select(".menu-toggle");
const userToggle = select("[data-user-toggle]");
const userMenu = select("[data-user-menu]");
const yearEl = select("#year");

const getProductById = (id) => products.find((item) => item.id === id);

const setToggleState = (attr, id, isActive) => {
  selectAll(`[data-${attr}="${id}"]`).forEach((button) => {
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const updateIconCounters = () => {
  selectAll("[data-cart-count]").forEach((node) => {
    node.textContent = cartIds.size;
  });
  selectAll("[data-favorite-count]").forEach((node) => {
    node.textContent = favoriteIds.size;
  });
};

const renderCartBoard = () => {
  const list = select("[data-cart-list]");
  const emptyState = select("[data-cart-empty]");
  if (!list) return;

  const cartProducts = products.filter((product) => cartIds.has(product.id));
  if (!cartProducts.length) {
    list.innerHTML = "";
    emptyState && (emptyState.style.display = "block");
    return;
  }

  emptyState && (emptyState.style.display = "none");
  list.innerHTML = cartProducts
    .map(
      (product) => `
        <li>
          <div>
            <strong>${product.name}</strong>
            <small>${product.brand} · MOQ ${product.moq}+</small>
          </div>
          <div class="cart-list__actions">
            <span>${product.landedCost}</span>
            <button type="button" data-cart-toggle="${product.id}" aria-pressed="true">
              Remove
            </button>
          </div>
        </li>
      `
    )
    .join("");
};

const renderFavoritesBoard = () => {
  const container = select("[data-favorite-list]");
  const emptyState = select("[data-favorite-empty]");
  if (!container) return;

  const favoriteProducts = products.filter((product) => favoriteIds.has(product.id));
  if (!favoriteProducts.length) {
    container.innerHTML = "";
    emptyState && (emptyState.style.display = "block");
    return;
  }

  emptyState && (emptyState.style.display = "none");
  container.innerHTML = favoriteProducts
    .map(
      (product) => `
        <article class="favorite-chip">
          <div>
            <p class="eyebrow">${product.brand}</p>
            <h4>${product.name}</h4>
            <small>${product.landedCost}</small>
          </div>
          <button class="icon-button icon-only is-active" type="button" data-favorite-toggle="${product.id}" aria-pressed="true" aria-label="Remove ${product.name} from favorites">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.35-7.5-10A4.5 4.5 0 0 1 9 6.5 4.24 4.24 0 0 1 12 8a4.24 4.24 0 0 1 3-1.5A4.5 4.5 0 0 1 19.5 11c0 5.65-7.5 10-7.5 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </article>
      `
    )
    .join("");
};

const toggleFavorite = (productId) => {
  if (!productId) return;
  if (favoriteIds.has(productId)) {
    favoriteIds.delete(productId);
  } else {
    favoriteIds.add(productId);
  }
  persistList(favoritesKey, Array.from(favoriteIds));
  setToggleState("favorite-toggle", productId, favoriteIds.has(productId));
  renderFavoritesBoard();
  updateIconCounters();
};

const toggleCart = (productId) => {
  if (!productId) return;
  if (cartIds.has(productId)) {
    cartIds.delete(productId);
  } else {
    cartIds.add(productId);
  }
  persistList(cartKey, Array.from(cartIds));
  setToggleState("cart-toggle", productId, cartIds.has(productId));
  renderCartBoard();
  updateIconCounters();
};

const setupOrderForm = () => {
  const form = document.getElementById("orderForm");
  if (!form || !ORDER_URL) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      alert("Order submitted successfully!");
      form.reset();
    } catch (error) {
      alert("Unable to submit order. Please try again.");
    }
  });
};

const getStoredBrand = () => {
  try {
    return sessionStorage.getItem(brandStorageKey) || "all";
  } catch (error) {
    return "all";
  }
};

const storeBrand = (slug) => {
  try {
    sessionStorage.setItem(brandStorageKey, slug || "all");
  } catch (error) {
    // noop
  }
};

const emitBrandChange = (slug) => {
  document.dispatchEvent(
    new CustomEvent(brandEventName, {
      detail: { slug: slug || "all" },
    })
  );
};

const navigateToBrand = (slug = "all") => {
  storeBrand(slug);
  if (isCatalogPage) {
    emitBrandChange(slug);
    select("[data-catalog-grid]")?.scrollIntoView({ behavior: "smooth" });
  } else {
    const target = slug && slug !== "all" ? `catalog.html?brand=${slug}` : "catalog.html";
    window.location.href = target;
  }
};

const toggleNav = () => {
  nav?.classList.toggle("open");
};

const closeNav = () => nav?.classList.remove("open");

const toggleUserMenu = () => {
  userMenu?.classList.toggle("open");
  userToggle?.setAttribute(
    "aria-expanded",
    userMenu?.classList.contains("open") ? "true" : "false"
  );
};

menuToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleNav();
});

userToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleUserMenu();
});

document.addEventListener("click", (event) => {
  if (!nav?.contains(event.target) && !menuToggle?.contains(event.target)) {
    closeNav();
  }

  if (!userMenu?.contains(event.target) && !userToggle?.contains(event.target)) {
    userMenu?.classList.remove("open");
    userToggle?.setAttribute("aria-expanded", "false");
  }
});

selectAll(".primary-nav a").forEach((link) =>
  link.addEventListener("click", () => closeNav())
);

const setupBrandIndex = () => {
  const wrappers = selectAll("[data-brand-index]");
  if (!wrappers.length || !uniqueBrands.length) return;

  const buildMenu = () => {
    const options = [
      { slug: "all", name: "All brands" },
      ...uniqueBrands,
    ];
    return options
      .map(
        (brand) => `
          <button type="button" class="brand-option" data-brand-option="${brand.slug}">
            ${brand.name}
          </button>
        `
      )
      .join("");
  };

  wrappers.forEach((wrapper) => {
    const menu = select("[data-brand-menu]", wrapper);
    const toggle = select("[data-brand-toggle]", wrapper);
    if (!menu || !toggle) return;
    menu.innerHTML = buildMenu();
    toggle.setAttribute("aria-expanded", "false");

    const highlightActive = () => {
      const current = getStoredBrand();
      selectAll("[data-brand-option]", menu).forEach((option) => {
        option.classList.toggle("active", option.dataset.brandOption === current);
      });
    };
    highlightActive();

    const close = () => {
      wrapper.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      wrapper.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      wrapper.classList.toggle("open");
      const expanded = wrapper.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });

    const pointerFine = window.matchMedia ? window.matchMedia("(pointer: fine)") : null;
    if (pointerFine?.matches) {
      wrapper.addEventListener("mouseenter", () => {
        open();
        wrapper.classList.add("hover-ready");
      });
      wrapper.addEventListener("mouseleave", (event) => {
        if (!wrapper.contains(event.relatedTarget)) {
          close();
        }
      });
    }

    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        toggle.blur();
      }
    });

    menu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-brand-option]");
      if (!option) return;
      close();
      navigateToBrand(option.dataset.brandOption);
    });

    document.addEventListener(brandEventName, highlightActive);
  });

  document.addEventListener("click", (event) => {
    wrappers.forEach((wrapper) => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove("open");
        const toggle = select("[data-brand-toggle]", wrapper);
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });
};

const buildSearchResults = (query, limit = 5) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const productMatches = products
    .map((product) => {
      const nameMatch = product.name.toLowerCase().includes(normalized);
      const brandMatch = product.brand.toLowerCase().includes(normalized);
      const segmentMatch = product.segment.toLowerCase().includes(normalized);
      const score = (nameMatch ? 3 : 0) + (brandMatch ? 2 : 0) + (segmentMatch ? 1 : 0);
      if (!score) return null;
      return {
        type: "product",
        label: product.name,
        meta: `${product.brand} · MOQ ${product.moq}+`,
        href: `product.html?id=${product.id}`,
        id: product.id,
        score,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const brandMatches = uniqueBrands
    .filter((brand) => brand.name.toLowerCase().includes(normalized))
    .map((brand) => ({
      type: "brand",
      label: `${brand.name} catalog`,
      meta: "Filter by brand",
      brandSlug: brand.slug,
      href: `catalog.html?brand=${brand.slug}`,
      score: 2,
    }))
    .slice(0, 2);

  const combined = [...productMatches, ...brandMatches];
  return combined.slice(0, limit);
};

const handleSearchDestination = (match) => {
  if (!match) return;
  if (match.type === "brand") {
    navigateToBrand(match.brandSlug);
    return;
  }
  window.location.href = match.href;
};

const setupSearch = () => {
  const inputs = selectAll("[data-search-input]");
  if (!inputs.length || !products.length) return;

  const ensureResultsHost = (input) => {
    let host = input.closest("[data-search-form]")?.querySelector("[data-search-results]");
    if (!host) {
      host = input.parentElement?.querySelector("[data-search-results]");
    }
    if (!host) {
      host = document.createElement("div");
      host.className = "search-results";
      host.dataset.searchResults = "";
      host.hidden = true;
      input.insertAdjacentElement("afterend", host);
    }
    return host;
  };

  inputs.forEach((input) => {
    const form = input.closest("[data-search-form]");
    const resultsHost = ensureResultsHost(input);

    const clearResults = () => {
      resultsHost.innerHTML = "";
      resultsHost.hidden = true;
    };

    const showResults = (matches) => {
      if (!matches.length) {
        clearResults();
        return;
      }
      resultsHost.innerHTML = matches
        .map(
          (match) => `
            <button type="button" class="search-result" data-search-result
              data-result-type="${match.type}"
              data-result-id="${match.id ?? ""}"
              data-brand-slug="${match.brandSlug ?? ""}"
              data-result-href="${match.href}">
              <span>${match.label}</span>
              <small>${match.meta}</small>
            </button>
          `
        )
        .join("");
      resultsHost.hidden = false;
    };

    input.addEventListener("input", () => {
      const matches = buildSearchResults(input.value);
      showResults(matches);
    });

    input.addEventListener("focus", () => {
      if (resultsHost.innerHTML.trim()) {
        resultsHost.hidden = false;
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        resultsHost.hidden = true;
      }, 120);
    });

    resultsHost.addEventListener("click", (event) => {
      const option = event.target.closest("[data-search-result]");
      if (!option) return;
      const type = option.dataset.resultType;
      const href = option.dataset.resultHref;
      const brandSlug = option.dataset.brandSlug;
      const id = option.dataset.resultId;
      handleSearchDestination({
        type,
        href,
        brandSlug,
        id,
      });
      clearResults();
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const [topMatch] = buildSearchResults(input.value, 1);
      if (topMatch) {
        handleSearchDestination(topMatch);
      } else {
        window.location.href = "catalog.html";
      }
      clearResults();
    });

    if (!form) {
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const [topMatch] = buildSearchResults(input.value, 1);
        if (topMatch) {
          handleSearchDestination(topMatch);
        } else {
          window.location.href = "catalog.html";
        }
        clearResults();
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-search-results]") && !event.target.closest("[data-search-input]")) {
      selectAll("[data-search-results]").forEach((host) => {
        host.hidden = true;
      });
    }
  });
};

const setupStoryFilters = () => {
  const storyChips = selectAll("[data-story-chip]");
  const stories = selectAll(".story-card");

  storyChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      storyChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.dataset.filter;
      stories.forEach((story) => {
        const matches =
          category === "all" || story.dataset.category === category;
        story.style.display = matches ? "block" : "none";
      });
    });
  });
};

const getBadgeClass = (product) =>
  product?.badgeVariant ? product.badgeVariant : "";

const createProductCard = (product, options = {}) => {
  if (!product) return "";
  const { compact = false } = options;
  const isFavorite = favoriteIds.has(product.id);
  const isInCart = cartIds.has(product.id);
  return `
    <article class="product-card" data-product-card>
      ${
        product.badge
          ? `<div class="badge ${getBadgeClass(product)}">${product.badge}</div>`
          : ""
      }
      <div class="product-card__quick">
        <button class="icon-button icon-only ${isFavorite ? "is-active" : ""}" type="button" data-favorite-toggle="${product.id}" aria-pressed="${isFavorite}" aria-label="Save ${product.name} to favorites">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.35-7.5-10A4.5 4.5 0 0 1 9 6.5 4.24 4.24 0 0 1 12 8a4.24 4.24 0 0 1 3-1.5A4.5 4.5 0 0 1 19.5 11c0 5.65-7.5 10-7.5 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="icon-button icon-only ${isInCart ? "is-active" : ""}" type="button" data-cart-toggle="${product.id}" aria-pressed="${isInCart}" aria-label="Add ${product.name} to cart">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h-2l-1 3m0 0-1 3h3l3 9h8l3-9h3l-1-3h-17z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <h3>${product.name}</h3>
      <p>${compact ? product.excerpt : product.tagline}</p>
      <ul>
        <li>MOQ ${product.moq} pairs</li>
        <li>Landed cost: ${product.landedCost}</li>
        <li>Ship window: ${product.shipWindow}</li>
      </ul>
      <div class="product-card__meta">
        <span>${product.segment}</span>
        <span>${product.category === "boutique" ? "Boutique" : "Chain"}</span>
      </div>
      <div class="product-card__actions">
        <a class="btn secondary" href="product.html?id=${product.id}">Preview</a>
        <a class="btn primary" data-buy-cta="${product.id}" href="product.html?id=${product.id}&action=buy">Buy wholesale</a>
      </div>
    </article>
  `;
};

const renderFeaturedProducts = () => {
  const grid = select("[data-product-grid]");
  if (!grid || !products.length) return;
  const featured = products.slice(0, 3);
  grid.innerHTML = featured.map((product) => createProductCard(product, { compact: true })).join("");
};

const renderCatalogPage = () => {
  const catalogGrid = select("[data-catalog-grid]");
  if (!catalogGrid) return;

  let activeSegment = "all";
  const activeAudiences = new Set();
  let sortMode = "recent";
  let activeBrand = new URLSearchParams(window.location.search).get("brand") || getStoredBrand();
  let searchQuery = "";

  const segmentButtons = selectAll("[data-segment-filter]");
  const audienceFilters = selectAll("[data-audience-filter]");
  const sortSelect = select("[data-sort-select]");
  const countEl = select("[data-catalog-count]");
  const brandFilter = select("[data-brand-filter]");
  const catalogSearchInput = select(".catalog-search [data-search-input]");

  const updateBrandChips = () => {
    selectAll("[data-brand-chip]").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.brandChip === activeBrand);
    });
  };

  const renderBrandChips = () => {
    if (!brandFilter || !uniqueBrands.length) return;
    const buttons = [
      { slug: "all", name: "All brands" },
      ...uniqueBrands,
    ];
    brandFilter.innerHTML = buttons
      .map(
        (brand) => `
          <button class="chip" data-brand-chip="${brand.slug}">
            ${brand.name}
          </button>
        `
      )
      .join("");

    selectAll("[data-brand-chip]", brandFilter).forEach((chip) => {
      chip.addEventListener("click", () => {
        activeBrand = chip.dataset.brandChip;
        storeBrand(activeBrand);
        updateBrandChips();
        applyFilter();
      });
    });

    updateBrandChips();
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (activeSegment !== "all") {
      filtered = filtered.filter((product) => product.segment === activeSegment);
    }

    if (activeAudiences.size) {
      filtered = filtered.filter((product) => activeAudiences.has(product.category));
    }

    if (activeBrand && activeBrand !== "all") {
      filtered = filtered.filter((product) => product.brandSlug === activeBrand);
    }

    if (searchQuery.trim()) {
      const needle = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle) ||
          product.segment.toLowerCase().includes(needle)
      );
    }

    switch (sortMode) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "moq-low":
        filtered.sort((a, b) => a.moq - b.moq);
        break;
      default:
        filtered.sort((a, b) => products.indexOf(a) - products.indexOf(b));
    }

    if (filtered.length) {
      catalogGrid.innerHTML = filtered
        .map((product) => createProductCard(product))
        .join("");
    } else {
      catalogGrid.innerHTML = `<p>No products match this filter set. Clear filters to see catalog.</p>`;
    }

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} product${
        filtered.length === 1 ? "" : "s"
      }`;
    }
  };

  segmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      segmentButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeSegment = button.dataset.segmentFilter;
      applyFilter();
    });
  });

  audienceFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        activeAudiences.add(checkbox.value);
      } else {
        activeAudiences.delete(checkbox.value);
      }
      applyFilter();
    });
  });

  sortSelect?.addEventListener("change", () => {
    sortMode = sortSelect.value;
    applyFilter();
  });

  catalogSearchInput?.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    applyFilter();
  });

  document.addEventListener(brandEventName, (event) => {
    const slug = event.detail?.slug || "all";
    activeBrand = slug;
    updateBrandChips();
    applyFilter();
  });

  renderBrandChips();
  applyFilter();
};

const renderRelatedProducts = (currentId) => {
  const relatedGrid = select("[data-related-products]");
  if (!relatedGrid) return;

  const related = products
    .filter((product) => product.id !== currentId)
    .slice(0, 3);

  relatedGrid.innerHTML = related
    .map((product) => createProductCard(product, { compact: true }))
    .join("");
};

const renderProductDetail = () => {
  const detailSection = select("[data-product-detail]");
  if (!detailSection || !products.length) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  let product = products.find((item) => item.id === requestedId);
  if (!product) {
    product = products[0];
  }
  if (!product) {
    detailSection.innerHTML = `<div class="shell"><p>Product unavailable.</p></div>`;
    return;
  }

  const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];

  detailSection.innerHTML = `
    <div class="shell product-hero__grid">
      <div class="product-media">
        ${
          product.badge
            ? `<span class="badge ${getBadgeClass(product)}">${product.badge}</span>`
            : ""
        }
        <img src="${gallery[0]}" alt="${product.name}" data-product-main />
        <div class="product-media__thumbs">
          ${gallery
            .map(
              (image, index) => `
                <button class="${index === 0 ? "active" : ""}" data-product-thumb="${image}">
                  <img src="${image}" alt="${product.name} view ${index + 1}" loading="lazy" />
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="product-summary">
        <p class="pill">${product.segment} · MOQ ${product.moq}+</p>
        <h1>${product.name}</h1>
        <p>${product.tagline}</p>
        <p>${product.description}</p>
        <div class="product-summary__stats">
          <div>
            <span>${product.landedCost}</span>
            <p>Landed cost</p>
          </div>
          <div>
            <span>${product.leadTime}</span>
            <p>Lead time</p>
          </div>
          <div>
            <span>${product.shipWindow}</span>
            <p>Ship window</p>
          </div>
        </div>
        <div class="product-card__actions">
          <a class="btn primary" data-buy-cta="${product.id}" href="#order">Start order</a>
          <a class="btn ghost" href="catalog.html">Back to catalog</a>
        </div>
      </div>
    </div>
  `;

  const storyRoot = select("[data-product-story]");
  if (storyRoot) {
    storyRoot.innerHTML = `
      <p class="eyebrow">Product narrative</p>
      <h3>Why retailers love ${product.name}</h3>
      <p>${product.story}</p>
      <ul>
        ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
    `;
  }

  const logisticsRoot = select("[data-product-logistics]");
  if (logisticsRoot) {
    logisticsRoot.innerHTML = `
      <p class="eyebrow">Specs & logistics</p>
      <h3>Build + compliance</h3>
      <div class="info-grid">
        <div><span>Upper</span><span>${product.specs.upper}</span></div>
        <div><span>Midsole</span><span>${product.specs.midsole}</span></div>
        <div><span>Outsole</span><span>${product.specs.outsole}</span></div>
        <div><span>Weight</span><span>${product.specs.weight}</span></div>
      </div>
      <h4>Logistics</h4>
      <div class="info-grid">
        <div><span>Consolidation</span><span>${product.logistics.consolidation}</span></div>
        <div><span>Customs</span><span>${product.logistics.customs}</span></div>
        <div><span>QC</span><span>${product.logistics.qc}</span></div>
        <div><span>Packaging</span><span>${product.logistics.packaging}</span></div>
      </div>
    `;
  }

  const mainImage = select("[data-product-main]");
  selectAll("[data-product-thumb]").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      selectAll("[data-product-thumb]").forEach((button) =>
        button.classList.remove("active")
      );
      thumb.classList.add("active");
      if (mainImage) {
        mainImage.src = thumb.dataset.productThumb;
      }
    });
  });

  updateOrderForm(product);
  renderRelatedProducts(product.id);

  if (params.get("action") === "buy") {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  }
};

const updateOrderForm = (product) => {
  const orderLabel = select("[data-order-product]");
  const orderNotes = select("[data-order-notes]");
  if (orderLabel) {
    orderLabel.textContent = product?.name ?? "this drop";
  }
  if (orderNotes && product && !orderNotes.value) {
    orderNotes.value = `Interested in ${product.name} (${product.moq}+ pairs, ${product.segment}).`;
  }
};

const persistInterest = (productId) => {
  try {
    sessionStorage.setItem(storageKey, productId);
  } catch (error) {
    // noop
  }
};

const consumeInterest = () => {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      sessionStorage.removeItem(storageKey);
      return stored;
    }
  } catch (error) {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("product");
};

const prefillContactNotes = () => {
  const notesField = select("[data-notes-field]");
  if (!notesField) return;
  const interest = consumeInterest();
  if (!interest) return;
  const product = products.find((item) => item.id === interest);
  if (!product) return;
  notesField.value = `Interested in ${product.name} (${product.moq}+ pairs).`;
};

document.addEventListener("click", (event) => {
  const favoriteTrigger = event.target.closest("[data-favorite-toggle]");
  if (favoriteTrigger) {
    event.preventDefault();
    toggleFavorite(favoriteTrigger.dataset.favoriteToggle);
    return;
  }

  const cartTrigger = event.target.closest("[data-cart-toggle]");
  if (cartTrigger) {
    event.preventDefault();
    toggleCart(cartTrigger.dataset.cartToggle);
    return;
  }
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-buy-cta]");
  if (!trigger) return;
  const productId = trigger.dataset.buyCta;
  if (productId) {
    persistInterest(productId);
  }
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

setupStoryFilters();
renderFeaturedProducts();
renderCatalogPage();
renderProductDetail();
prefillContactNotes();
setupBrandIndex();
setupSearch();
renderCartBoard();
renderFavoritesBoard();
updateIconCounters();
setupOrderForm();
