// Domains on which the Fachzubi logo/branding must be hidden.
// Falls back to stellenapp.de if NEXT_PUBLIC_HIDE_LOGO_DOMAIN was not set at build time.
const DEFAULT_HIDE_LOGO_DOMAINS = "stellenapp.de";

const DEFAULT_BRAND = { name: "Fachzubi", domain: "fachzubi-app.de" };

const normalize = (host: string) =>
  host.trim().toLowerCase().split(":")[0].replace(/^www\./, "");

export const getHideLogoDomains = (): string[] =>
  (process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN || DEFAULT_HIDE_LOGO_DOMAINS)
    .split(",")
    .map(normalize)
    .filter(Boolean);

// Returns the matching hide-logo domain (e.g. "stellenapp.de") for a host, or null.
// Works on the server (pass the request host) and in the browser.
export const getHideLogoDomain = (host?: string | null): string | null => {
  const rawHost =
    host ?? (typeof window !== "undefined" ? window.location.hostname : "");
  if (!rawHost) return null;
  const normalizedHost = normalize(rawHost);
  return (
    getHideLogoDomains().find(
      (domain) =>
        normalizedHost === domain || normalizedHost.endsWith(`.${domain}`)
    ) || null
  );
};

export const shouldHideLogo = (host?: string | null): boolean =>
  getHideLogoDomain(host) !== null;

// Brand shown wherever "Fachzubi" would appear: on a hide-logo domain this is
// the domain itself (e.g. name "Stellenapp", domain "stellenapp.de").
export const getBrand = (host?: string | null) => {
  const domain = getHideLogoDomain(host);
  if (!domain) return DEFAULT_BRAND;
  const label = domain.split(".")[0];
  return { name: label.charAt(0).toUpperCase() + label.slice(1), domain };
};
