(function () {
  const config = window.exporiumConfig || {};
  const tokenKey = config.tokenStorageKey || "exporiumAdminToken";
  const profileKey = config.profileStorageKey || "exporiumAdminProfile";
  const apiBaseUrl = config.apiBaseUrl || window.location.origin;

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    status: qs("[data-admin-status]"),
    guard: qs("[data-auth-guard]"),
    user: qs("[data-admin-user]"),
    email: qs("[data-admin-email]"),
    role: qs("[data-admin-role]"),
    tokenState: qs("[data-admin-token-state]"),
    refreshSession: qs("[data-session-refresh]"),
    postsBody: qs("[data-posts-body]"),
    postsEmpty: qs("[data-posts-empty]"),
    postsRefresh: qs("[data-posts-refresh]"),
    postForm: qs("[data-post-form]"),
    postCancel: qs("[data-post-cancel]"),
    postMessage: qs("[data-post-message]"),
    settingsForm: qs("[data-settings-form]"),
    settingsInput: qs("[data-settings-json]"),
    settingsMessage: qs("[data-settings-message]"),
    settingsRefresh: qs("[data-settings-refresh]"),
    uploadForm: qs("[data-upload-form]"),
    uploadResult: qs("[data-upload-result]"),
    uploadDeleteForm: qs("[data-upload-delete-form]"),
    uploadDeleteMessage: qs("[data-upload-delete-message]"),
  };

  const state = {
    profile: null,
    posts: [],
    editingPostId: null,
    lastUpload: null,
  };

  const getStoredToken = () => {
    try {
      return localStorage.getItem(tokenKey) || "";
    } catch (error) {
      return "";
    }
  };

  const getStoredProfile = () => {
    try {
      const raw = localStorage.getItem(profileKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  };

  const setStatus = (message, stateName = "info") => {
    if (!elements.status) return;
    elements.status.textContent = message;
    elements.status.dataset.state = stateName;
  };

  const displayFeedback = (node, message, type = "info") => {
    if (!node) return;
    node.textContent = message;
    node.dataset.state = type;
  };

  const apiFetch = async (path, options = {}) => {
    const token = getStoredToken();
    const targetUrl = path.startsWith("http") ? path : `${apiBaseUrl}${path}`;
    const fetchOptions = {
      method: "GET",
      ...options,
    };
    const headers = new Headers(fetchOptions.headers || {});
    const isFormData = fetchOptions.body instanceof FormData;

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (!isFormData && fetchOptions.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    fetchOptions.headers = headers;

    const response = await fetch(targetUrl, fetchOptions);
    const raw = await response.text();
    let data = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (error) {
        data = raw;
      }
    }

    if (!response.ok) {
      const message =
        (data && data.message) ||
        (typeof data === "string" && data.length ? data : `Request failed (${response.status})`);
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return data;
  };

  const updateGuardVisibility = () => {
    const hasToken = Boolean(getStoredToken());
    if (elements.guard) {
      elements.guard.hidden = hasToken;
    }
    if (!hasToken) {
      setStatus("Sign in to continue.", "error");
    }
    return hasToken;
  };

  const hydrateProfile = () => {
    const profile = getStoredProfile();
    state.profile = profile;
    if (elements.user) {
      elements.user.textContent = profile?.name || "Unknown";
    }
    if (elements.email) {
      elements.email.textContent = profile?.email || "—";
    }
    if (elements.role) {
      elements.role.textContent = profile?.role || "—";
    }
    if (elements.tokenState) {
      elements.tokenState.textContent = getStoredToken() ? "Yes" : "No";
    }
    const authStatus = profile ? `Signed in as ${profile.name || profile.email}` : "Not signed in";
    qsa("[data-auth-state]").forEach((node) => {
      node.textContent = authStatus;
    });
    qsa("[data-logout-button]").forEach((node) => {
      node.hidden = !getStoredToken();
    });
  };

  const fetchProfile = async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      state.profile = data?.user || null;
      if (state.profile) {
        try {
          localStorage.setItem(profileKey, JSON.stringify(state.profile));
        } catch (error) {
          // ignore storage issues
        }
      }
      hydrateProfile();
      setStatus("Session validated.", "success");
    } catch (error) {
      hydrateProfile();
      setStatus(error.message || "Unable to load session.", "error");
    }
  };

  const renderPosts = () => {
    if (!elements.postsBody) return;
    if (!state.posts.length) {
      elements.postsBody.innerHTML = "";
      if (elements.postsEmpty) {
        elements.postsEmpty.hidden = false;
      }
      return;
    }

    if (elements.postsEmpty) {
      elements.postsEmpty.hidden = true;
    }

    const rows = state.posts.map((post) => {
      const date = new Date(post.updatedAt || post.createdAt || Date.now());
      return `
        <tr data-post-id="${post.id}">
          <td>
            <strong>${post.title}</strong>
            <small>${post.slug || ""}</small>
          </td>
          <td>${post.status}</td>
          <td>${post.audience}</td>
          <td>${date.toLocaleString()}</td>
          <td>
            <button class="link-button" type="button" data-post-edit="${post.id}">Edit</button>
            <button class="link-button danger" type="button" data-post-delete="${post.id}">Delete</button>
          </td>
        </tr>
      `;
    });
    elements.postsBody.innerHTML = rows.join("");
  };

  const loadPosts = async () => {
    if (!updateGuardVisibility()) return;
    try {
      const data = await apiFetch("/api/posts");
      state.posts = data?.posts || [];
      renderPosts();
      displayFeedback(elements.postMessage, `Loaded ${state.posts.length} posts.`, "success");
    } catch (error) {
      displayFeedback(elements.postMessage, error.message || "Unable to load posts.", "error");
    }
  };

  const resetPostForm = () => {
    state.editingPostId = null;
    if (elements.postForm) {
      elements.postForm.reset();
    }
    if (elements.postCancel) {
      elements.postCancel.hidden = true;
    }
    displayFeedback(elements.postMessage, "Ready.");
  };

  const populatePostForm = (post) => {
    if (!elements.postForm || !post) return;
    elements.postForm.elements.title.value = post.title || "";
    elements.postForm.elements.status.value = post.status || "draft";
    elements.postForm.elements.audience.value = post.audience || "general";
    elements.postForm.elements.heroImageUrl.value = post.heroImageUrl || "";
    elements.postForm.elements.body.value = post.body || "";
    state.editingPostId = post.id;
    if (elements.postCancel) {
      elements.postCancel.hidden = false;
    }
    displayFeedback(elements.postMessage, `Editing "${post.title}"`, "info");
  };

  const handlePostSubmit = async (event) => {
    if (!elements.postForm) return;
    event.preventDefault();
    if (!updateGuardVisibility()) return;

    const formData = new FormData(elements.postForm);
    const payload = {
      title: formData.get("title")?.toString().trim(),
      status: formData.get("status")?.toString(),
      audience: formData.get("audience")?.toString(),
      heroImageUrl: formData.get("heroImageUrl")?.toString() || undefined,
      body: formData.get("body")?.toString(),
    };

    if (!payload.title || !payload.body) {
      displayFeedback(elements.postMessage, "Title and body are required.", "error");
      return;
    }

    const method = state.editingPostId ? "PUT" : "POST";
    const path = state.editingPostId ? `/api/posts/${state.editingPostId}` : "/api/posts";

    try {
      await apiFetch(path, { method, body: JSON.stringify(payload) });
      displayFeedback(elements.postMessage, "Post saved.", "success");
      resetPostForm();
      await loadPosts();
    } catch (error) {
      displayFeedback(elements.postMessage, error.message || "Unable to save post.", "error");
    }
  };

  const handlePostActions = async (event) => {
    const editId = event.target?.dataset?.postEdit;
    const deleteId = event.target?.dataset?.postDelete;

    if (editId) {
      const post = state.posts.find((item) => item.id === editId);
      populatePostForm(post);
      return;
    }

    if (deleteId) {
      if (!window.confirm("Delete this post?")) return;
      try {
        await apiFetch(`/api/posts/${deleteId}`, { method: "DELETE" });
        displayFeedback(elements.postMessage, "Post deleted.", "success");
        await loadPosts();
      } catch (error) {
        displayFeedback(elements.postMessage, error.message || "Unable to delete post.", "error");
      }
    }
  };

  const loadSettings = async () => {
    if (!elements.settingsInput) return;
    if (!updateGuardVisibility()) return;
    try {
      const data = await apiFetch("/api/settings");
      const settings = data?.settings || {};
      elements.settingsInput.value = JSON.stringify(settings, null, 2);
      displayFeedback(elements.settingsMessage, "Settings loaded.", "success");
    } catch (error) {
      displayFeedback(elements.settingsMessage, error.message || "Unable to load settings.", "error");
    }
  };

  const handleSettingsSubmit = async (event) => {
    if (!elements.settingsInput) return;
    event.preventDefault();
    if (!updateGuardVisibility()) return;

    try {
      const parsed = JSON.parse(elements.settingsInput.value || "{}");
      await apiFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(parsed),
      });
      displayFeedback(elements.settingsMessage, "Settings saved.", "success");
    } catch (error) {
      const message = error instanceof SyntaxError ? "Invalid JSON payload." : error.message;
      displayFeedback(elements.settingsMessage, message || "Unable to save settings.", "error");
    }
  };

  const renderUploadResult = (payload) => {
    if (!elements.uploadResult) return;
    if (!payload) {
      elements.uploadResult.innerHTML = "<p class=\"form-status\">No uploads yet.</p>";
      return;
    }

    const absoluteUrl = payload.url?.startsWith("http")
      ? payload.url
      : `${apiBaseUrl.replace(/\/$/, "")}${payload.url}`;

    elements.uploadResult.innerHTML = `
      <p class="form-status" data-state="success">Upload complete.</p>
      <ul class="upload-meta">
        <li><strong>URL:</strong> <a href="${absoluteUrl}" target="_blank" rel="noopener">${absoluteUrl}</a></li>
        <li><strong>Stored as:</strong> ${payload.storedAs}</li>
        <li><strong>Size:</strong> ${(payload.size / 1024).toFixed(1)} KB</li>
      </ul>
      <button class="btn ghost mini" type="button" data-copy-url>Copy URL</button>
    `;

    const copyButton = elements.uploadResult.querySelector("[data-copy-url]");
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(absoluteUrl);
          copyButton.textContent = "Copied";
          setTimeout(() => {
            copyButton.textContent = "Copy URL";
          }, 1500);
        } catch (error) {
          copyButton.textContent = "Copy failed";
        }
      });
    }
  };

  const handleUploadSubmit = async (event) => {
    if (!elements.uploadForm) return;
    event.preventDefault();
    if (!updateGuardVisibility()) return;

    const fileInput = elements.uploadForm.querySelector("input[name='file']");
    if (!fileInput?.files?.length) {
      displayFeedback(elements.uploadResult, "Select a file first.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const payload = await apiFetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      state.lastUpload = payload;
      renderUploadResult(payload);
      elements.uploadForm.reset();
    } catch (error) {
      renderUploadResult(null);
      displayFeedback(elements.uploadResult, error.message || "Upload failed.", "error");
    }
  };

  const handleUploadDelete = async (event) => {
    if (!elements.uploadDeleteForm) return;
    event.preventDefault();
    if (!updateGuardVisibility()) return;
    const formData = new FormData(elements.uploadDeleteForm);
    const filename = formData.get("filename")?.toString().trim();
    if (!filename) {
      displayFeedback(elements.uploadDeleteMessage, "Enter a filename.", "error");
      return;
    }

    try {
      await apiFetch(`/api/uploads/${filename}`, { method: "DELETE" });
      displayFeedback(elements.uploadDeleteMessage, "File deleted.", "success");
      elements.uploadDeleteForm.reset();
    } catch (error) {
      displayFeedback(elements.uploadDeleteMessage, error.message || "Unable to delete file.", "error");
    }
  };

  const attachEvents = () => {
    elements.refreshSession?.addEventListener("click", fetchProfile);
    elements.postsRefresh?.addEventListener("click", loadPosts);
    elements.postForm?.addEventListener("submit", handlePostSubmit);
    elements.postCancel?.addEventListener("click", resetPostForm);
    elements.postsBody?.addEventListener("click", handlePostActions);
    elements.settingsForm?.addEventListener("submit", handleSettingsSubmit);
    elements.settingsRefresh?.addEventListener("click", loadSettings);
    elements.uploadForm?.addEventListener("submit", handleUploadSubmit);
    elements.uploadDeleteForm?.addEventListener("submit", handleUploadDelete);

    const nav = qs(".primary-nav");
    const menuToggle = qs(".menu-toggle");
    const userToggle = qs("[data-user-toggle]");
    const userMenu = qs("[data-user-menu]");

    menuToggle?.addEventListener("click", (event) => {
      event.preventDefault();
      nav?.classList.toggle("open");
    });

    userToggle?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      userMenu?.classList.toggle("open");
      userToggle.setAttribute("aria-expanded", userMenu?.classList.contains("open") ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      if (!userMenu || !userToggle) return;
      if (!userMenu.contains(event.target) && !userToggle.contains(event.target)) {
        userMenu.classList.remove("open");
        userToggle.setAttribute("aria-expanded", "false");
      }
    });
  };

  const init = async () => {
    attachEvents();
    hydrateProfile();
    const hasToken = updateGuardVisibility();
    if (!hasToken) return;
    await fetchProfile();
    await loadPosts();
    await loadSettings();
    renderUploadResult(state.lastUpload);
  };

  document.addEventListener("DOMContentLoaded", init);
})();
