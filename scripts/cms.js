(function () {
  const config = window.exporiumConfig || {};
  const apiBaseUrl = config.apiBaseUrl || window.location.origin;
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
  window.exporiumCms = window.exporiumCms || { settings: {}, posts: [] };

  const setText = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  };

  const renderHero = (settings = {}) => {
    if (!settings.hero) return;
    const hero = settings.hero;
    setText("[data-hero-headline]", hero.headline);
    setText("[data-hero-subline]", hero.subline);

    if (Array.isArray(hero.metrics)) {
      const host = document.querySelector("[data-hero-metrics]");
      if (host) {
        host.innerHTML = hero.metrics
          .map(
            (metric) => `
              <div>
                <span>${metric.value ?? ""}</span>
                <p>${metric.label ?? ""}</p>
              </div>
            `
          )
          .join("");
      }
    }
  };

  const renderFeatured = (settings = {}) => {
    if (!settings.featuredDrop) return;
    const drop = settings.featuredDrop;
    setText("[data-featured-title]", drop.title);
    setText("[data-featured-price]", drop.price);

    const notes = drop.notes || {};
    Object.entries(notes).forEach(([key, value]) => {
      const node = document.querySelector(`[data-featured-note="${key}"]`);
      if (node && value) {
        node.textContent = value;
      }
    });
  };

  const renderPosts = (posts = []) => {
    const host = document.querySelector("[data-post-feed]");
    if (!host) return;
    if (!posts.length) {
      host.innerHTML = `<p class="admin-empty">No updates yet. Check back soon.</p>`;
      return;
    }

    host.innerHTML = posts
      .slice(0, 3)
      .map((post) => {
        const date = new Date(post.createdAt || post.updatedAt || Date.now());
        const snippet = post.body
          ? `${post.body.slice(0, 160)}${post.body.length > 160 ? "..." : ""}`
          : "Update available in the admin log.";
        return `
          <article class="story-card" data-category="${post.audience || "general"}">
            <p class="tag">${post.audience || "Update"}</p>
            <h3>${post.title}</h3>
            <p>${snippet}</p>
            <div class="quote">${post.heroImageUrl ? `Asset: ${post.heroImageUrl}` : post.slug || "Published update"}</div>
            <p class="author">${post.author || "Exporium Ops"} · ${date.toLocaleDateString()}</p>
          </article>
        `;
      })
      .join("");
  };

  const applySettings = (settings) => {
    renderHero(settings);
    renderFeatured(settings);
    const stats = settings.stats;
    if (stats) {
      setText("[data-stat-on-time]", stats.onTime);
      setText("[data-stat-customs]", stats.customs);
      setText("[data-stat-compliance]", stats.compliance);
      setText("[data-stat-damage]", stats.damage);
    }
  };

  const fetchJson = async (path) => {
    const response = await fetch(`${normalizedBaseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    return response.json();
  };

  const loadCms = async () => {
    try {
      const [settingsRes, postsRes] = await Promise.all([
        fetchJson("/api/public/settings"),
        fetchJson("/api/public/posts"),
      ]);

      const settings = settingsRes?.settings || {};
      const posts = postsRes?.posts || [];

      window.exporiumCms = { settings, posts };
      applySettings(settings);
      renderPosts(posts);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Unable to load CMS content", error);
    }
  };

  document.addEventListener("DOMContentLoaded", loadCms);
})();
