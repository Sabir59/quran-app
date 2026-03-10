import { useQuery } from "@tanstack/react-query";
import { getProductsList } from "../../api/products";

function creatorsKey(v) {
  if (!v) return "";
  const arr = (Array.isArray(v) ? v : String(v).split(","))
    .map((s) => String(s).trim())
    .filter(Boolean);
  return Array.from(new Set(arr)).sort().join(",");
}

function langKey(lang, preferFrench) {
  if (lang) return String(lang).toLowerCase().split("-")[0];
  return preferFrench ? "fr" : "";
}

function multiValueKey(v) {
  if (!v) return "";
  const arr = (Array.isArray(v) ? v : String(v).split(","))
    .map((s) => String(s).trim())
    .filter(Boolean);
  return Array.from(new Set(arr)).sort().join(",");
}

function coerceBool(v) {
  if (v === undefined) return undefined;
  if (v === true || v === false) return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "yes") return true;
    if (s === "false" || s === "0" || s === "no") return false;
  }
  return Boolean(v);
}

export function useProductsList(payload, options = {}) {
  const { enabled = true, inView = true } = options;

  const creators = creatorsKey(payload?.productCreators);
  const lang = langKey(payload?.lang);
  const categories = multiValueKey(payload?.categoryUUIDs);
  const domainKey = payload?.domain ? String(payload.domain).trim().toLowerCase() : "";
  const currencyKey = payload?.currency ? String(payload.currency).trim().toUpperCase() : "";
  const isAddonKey = coerceBool(payload?.isAddon);
  const includeCategoryKey = coerceBool(payload?.includeCategory);

  // IMPORTANT: align with products API helper defaults (true when omitted)
  const wantsWebResources = payload?.includeWebResources === undefined ? true : coerceBool(payload?.includeWebResources);
  const wantsProductPrices = payload?.includeProductPrices === undefined ? true : coerceBool(payload?.includeProductPrices);

  return useQuery({
    queryKey: [
      "products-bulk",
      creators,
      lang,
      payload?.limit ?? "",
      payload?.cursor ?? "",
      wantsWebResources,
      wantsProductPrices,
      categories,
      domainKey,
      // currencyKey,
      isAddonKey,
      includeCategoryKey,
    ],
    enabled: Boolean(enabled && inView && payload),
    queryFn: async () => {
      const effectivePayload = lang ? { ...payload, lang } : payload;
      return getProductsList(effectivePayload);
    },
    select: (res) => ({ data: res.data, count: res.count }),
    keepPreviousData: true,
  });
}
