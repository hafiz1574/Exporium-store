(function () {
  const existingConfig = window.exporiumConfig || {};
  const defaultApiBase =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:4000"
      : "https://exporium-store.onrender.com";

  window.exporiumConfig = Object.freeze({
    apiBaseUrl: existingConfig.apiBaseUrl || defaultApiBase,
    tokenStorageKey: existingConfig.tokenStorageKey || "exporiumAdminToken",
    profileStorageKey: existingConfig.profileStorageKey || "exporiumAdminProfile",
  });
})();
