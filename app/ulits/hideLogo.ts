// Domains on which the Fachzubi logo/branding must be hidden.
// Falls back to stellenapp.de if NEXT_PUBLIC_HIDE_LOGO_DOMAIN was not set at build time.
const DEFAULT_HIDE_LOGO_DOMAINS = "stellenapp.de";

const normalize = (host: string) =>
  host.trim().toLowerCase().replace(/^www\./, "");

export const getHideLogoDomains = (): string[] =>
  (process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN || DEFAULT_HIDE_LOGO_DOMAINS)
    .split(",")
    .map(normalize)
    .filter(Boolean);

// Returns the matching domain (e.g. "stellenapp.de") or null.
export const getHideLogoDomain = (): string | null => {
  if (typeof window === "undefined") return null;
  const host = normalize(window.location.hostname);
  return (
    getHideLogoDomains().find(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    ) || null
  );
};

export const shouldHideLogo = (): boolean => getHideLogoDomain() !== null;
