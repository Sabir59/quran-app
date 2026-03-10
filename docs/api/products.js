// api/products.js

import { cmsClient } from "./config/clients";

const PRODUCTS_ENDPOINTS = {
  LIST: "/products/cms/products-list",
};

/**
 * Guardrails (practical safety nets)
 * - Prevents silent infra failures (414 URI Too Long / truncation)
 * - Prevents accidental "huge list" requests from blowing up payload size
 */
const MAX_CREATORS_PER_REQUEST = 100; // safely above your current usage (~40)
const MAX_QUERYSTRING_LENGTH = 7000;  // conservative cap to avoid common URL limits

/**
 * @typedef {Object} ProductsTag
 * @property {string} name
 */

/**
 * Request payload for CMS products list (FE-friendly).
 *
 * @typedef {Object} ProductsBulkPayload
 * @property {ProductsTag[]|string[]} [tags]                 - Supports [{name}] or ["frontpage"]
 * @property {string|string[]} [productCreators]             - Preferred. e.g. "A,B" or ["A","B"]
 *
 * Legacy compatibility (used by older checkout code):
 * @property {string} [product]                              - legacy single creator filter
 * @property {boolean} [includePrices]                       - legacy alias for includeProductPrices
 *
 * Category filters:
 * @property {string|string[]} [categoryUUIDs]               - optional, supports CSV or array
 *
 * @property {string} [currency]                             - UI hint to compute unit_amount from prices
 *
 * @property {string} [name]                                 - optional
 * @property {string} [domain]                               - UI context fallback when API returns domain:null
 * @property {boolean} [filterDomain]                        - If true, send `domain` to backend as FILTER
 *
 * @property {number} [limit]                                - default: 20 (but we auto-cap for creator lists)
 * @property {string|null} [cursor]
 * @property {string} [lang]                                 - optional
 * @property {string|string[]} [fieldTypes]                  - optional
 *
 * Include toggles (ALL optional; defaults chosen for minimal ProductUi)
 * @property {boolean} [includeCategory]                     - default false
 * @property {boolean} [includeMobileResources]              - default false
 * @property {boolean} [includeWebResources]                 - default true (for image_link)
 * @property {boolean} [includeProductPrices]                - default true (for currencies)
 */

/**
 * Final UI payload (matches FE contract) + legacy-friendly extras.
 *
 * @typedef {Object} ProductUi
 * @property {string} product_id
 * @property {number|null} id
 * @property {string} creator
 * @property {string} name
 * @property {string} description
 * @property {string} short_description
 * @property {string|null} product_type
 * @property {boolean} custom_amount
 * @property {"day"|"month"|"year"|string} recurring
 * @property {boolean} is_addon
  * @property {number} status
 * @property {number} order
 * @property {number|null} quick_donate_order
 * @property {string} domain
 * @property {string|null} image_link
 *
 * @property {number} usd
 * @property {number} eur
 * @property {number} gbp
 * @property {number} aed
 * @property {number} aud
 * @property {number} cad
 * @property {number} idr
 * @property {number} inr
 * @property {number} myr
 * @property {number} sgd
 *
 * Added for checkout compatibility:
 * @property {number} unit_amount
 * @property {{ amount: number, currency: string }[]} price_points
 *
 * @property {{ id: string, name: string, legacy_category_id: number }[]} [categories]
 */

function coerceBoolean(v) {
  if (v === true || v === false) return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "yes" || s === "true" || s === "1") return true;
    if (s === "no" || s === "false" || s === "0") return false;
  }
  return false;
}

function normalizeStatus(s) {
  if (typeof s === "number") return s === 1 ? 1 : 0;
  if (typeof s === "string") {
    const t = s.trim().toLowerCase();
    if (t === "1" || t === "active") return 1;
    if (t === "0" || t === "inactive") return 0;
    return Number(t) === 1 ? 1 : 0;
  }
  return 0;
}

/**
 * Status normalization (backward + forward compatible)
 * Some backend responses stopped including `status`.
 * Dropdown widgets hard-filter on `status`, so default to ACTIVE when absent.
 */
function normalizeStatusFromProduct(p) {
  const candidates = [
    p?.status,
    p?.is_active,
    p?.isActive,
    p?.active,
    p?.enabled,
    p?.is_enabled,
    p?.isEnabled,
  ];

  for (const v of candidates) {
    if (v === undefined || v === null || v === "") continue;
    if (v === true) return 1;
    if (v === false) return 0;
    return normalizeStatus(v);
  }

  // If backend doesn't send status at all, assume "active"
  return 1;
}

function toNumberOrZero(v) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
}

/**
 * Keep FE behavior stable:
 * backend often returns "other", "general", "donation" for everything → treat it as null
 * Normalizes specific product types (e.g., "zakat_calculator" → "Zakat Calculator")
 * Only normalizes non-generic product types
 */
function normalizeProductType(v) {
  if (v === null || v === undefined) return null;
  const t = String(v).trim();
  if (!t) return null;
  const low = t.toLowerCase();
  
  // Return null for generic/meaningless product types
  if (low === "other" || low === "default" || low === "general" || low === "donation") {
    return null;
  }
  
  // Normalize specific product types to Title Case
  // Replace underscores and hyphens with spaces, then title case each word
  const words = t
    .replace(/[_-]/g, ' ')  // Replace underscores and hyphens with spaces
    .split(/\s+/)            // Split by one or more spaces
    .filter(Boolean)         // Remove empty strings
    .map(word => {
      // Capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
  return words.join(' ');
}

/**
 * Maps normalized product_type to default routes for static products
 * Returns null if no route mapping exists (components can use short_description or custom logic)
 */
function getProductTypeRoute(productType) {
  if (!productType) return null;
  
  const normalized = String(productType).toLowerCase().replace(/[_\s-]/g, '');
  
  // Map product types to routes
  const routeMap = {
    'zakatcalculator': '/zakat-calculator',
    'zakat': '/zakat',
    'fidya': '/ramadan/fidya-kaffarah?product=fidya',
    'kaffarah': '/ramadan/fidya-kaffarah?product=kafarrah',
    'kaffarahcalculator': '/ramadan/fidya-kaffarah?product=kafarrah',
    'fidyacalculator': '/ramadan/fidya-kaffarah?product=fidya',
  };
  
  return routeMap[normalized] || null;
}

/**
 * Currency code extractor (supports multiple backend shapes):
 * - row.currency_code (old)
 * - row.currency.currency_code (new)
 * - row.currencyCode / row.currency.currencyCode (alt)
 * - fallback via currency_id for known ids
 */
const CURRENCY_ID_FALLBACK = {
  1: "AUD",
  2: "USD",
  3: "GBP",
  4: "CAD",
  5: "EUR",
  6: "SGD",
  7: "MYR",
  8: "AED",
  9: "IDR",
  10: "INR",
};

function getCurrencyCode(row) {
  const direct =
    row?.currency_code ?? row?.currencyCode ?? row?.code ?? null;

  const nested =
    row?.currency?.currency_code ?? row?.currency?.currencyCode ?? row?.currency?.code ?? null;

  const fromId =
    (direct || nested)
      ? null
      : (Number.isFinite(Number(row?.currency_id)) ? CURRENCY_ID_FALLBACK[Number(row.currency_id)] : null);

  const code = direct ?? nested ?? fromId;
  return code ? String(code).trim() : "";
}

/**
 * prices: [{ currency_code:"USD", prod_price: 260 }, ...]
 * -> { usd: 260, ... }
 */
function buildPricesMap(prices) {
  const out = {};
  if (!Array.isArray(prices)) return out;
  for (const row of prices) {
    const code = String(getCurrencyCode(row) || "").trim().toLowerCase();
    if (!code) continue;
    out[code] = toNumberOrZero(row?.prod_price);
  }
  return out;
}

/**
 * prices -> [{ amount, currency }, ...] (currency uppercased)
 */
function buildPricePoints(prices) {
  if (!Array.isArray(prices)) return [];
  return prices
    .map((row) => ({
      currency: String(getCurrencyCode(row) || "").trim().toUpperCase(),
      amount: toNumberOrZero(row?.prod_price),
    }))
    .filter((x) => x.currency);
}

/**
 * Prefer web image.
 */
function pickImageFromResources(resources) {
  if (!Array.isArray(resources) || resources.length === 0) return null;

  const images = resources
    .filter((r) => String(r?.resource_type || "").toLowerCase() === "image" && r?.image_link)
    .map((r) => ({
      link: String(r.image_link),
      order: Number.isFinite(Number(r?.order)) ? Number(r.order) : 9999,
      app: String(r?.app_type || "").toLowerCase(),
    }));

  if (images.length === 0) return null;

  const web = images.filter((x) => x.app === "web").sort((a, b) => a.order - b.order);
  if (web.length > 0) return web[0].link;

  images.sort((a, b) => a.order - b.order);
  return images[0].link;
}

/**
 * Serialize query params:
 * - repeats arrays: tags=a&tags=b
 * - drops null/undefined/"" values
 */
function serializeParams(params) {
  const sp = new URLSearchParams();

  const append = (k, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    sp.append(k, String(v));
  };

  Object.entries(params || {}).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((item) => append(k, item));
    else append(k, v);
  });

  return sp.toString();
}

/**
 * Normalize request into query params for /cms/products-list
 *
 * Defaults are MINIMAL (only what ProductUi needs).
 */
function normalizeProductsListRequest(payload, options = {}) {
  const raw = payload || {};
  const { config } = options || {};

  const uiDomainFallback = raw?.domain ? String(raw.domain).trim() : "";

  // Used ONLY client-side (to compute unit_amount). Not sent to backend.
  const requestedCurrency = raw?.currency ? String(raw.currency).trim().toUpperCase() : "";

  const params = {};

  // limit default (but if creators present and limit not passed, cap to creators length)
  params.limit = Number.isFinite(Number(raw.limit)) ? Number(raw.limit) : 20;

  // omit cursor if null/"null"
  if (raw.cursor !== undefined && raw.cursor !== null && raw.cursor !== "null") {
    params.cursor = raw.cursor;
  }

  if (raw.name) params.name = String(raw.name).trim();

  // Optional: lang / fieldTypes only if provided (don’t bloat request)
  if (raw.lang) params.lang = String(raw.lang).trim();

  if (raw.fieldTypes) {
    const ft = Array.isArray(raw.fieldTypes)
      ? raw.fieldTypes.map((x) => String(x).trim()).filter(Boolean)
      : String(raw.fieldTypes)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    if (ft.length === 1) params.fieldTypes = ft[0];
    else if (ft.length > 1) params.fieldTypes = ft;
  }

  // ✅ MINIMAL defaults
  const includeCategory =
    raw.includeCategory !== undefined ? coerceBoolean(raw.includeCategory) : false;
  const includeMobileResources =
    raw.includeMobileResources !== undefined ? coerceBoolean(raw.includeMobileResources) : false;
  const includeWebResources =
    raw.includeWebResources !== undefined ? coerceBoolean(raw.includeWebResources) : true;

  // legacy alias: includePrices -> includeProductPrices
  const includeProductPrices =
    raw.includeProductPrices !== undefined
      ? coerceBoolean(raw.includeProductPrices)
      : raw.includePrices !== undefined
        ? coerceBoolean(raw.includePrices)
        : true;

  if (includeCategory) params.includeCategory = true;
  if (includeMobileResources) params.includeMobileResources = true;
  if (includeWebResources) params.includeWebResources = true;
  if (includeProductPrices) params.includeProductPrices = true;

  // Domain is a FILTER only when explicitly requested
  if (coerceBoolean(raw.filterDomain) && raw.domain) {
    params.domain = String(raw.domain).trim();
  }

  // Preferred filter: productCreators
  // Legacy filter: product (single creator)
  const creatorsInput = raw.productCreators ?? raw.product;

  if (creatorsInput) {
    const creatorsList = Array.isArray(creatorsInput)
      ? creatorsInput.map((x) => String(x).trim()).filter(Boolean)
      : String(creatorsInput)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    if (creatorsList.length > 0) {
      // Guardrail #1: creators count
      if (creatorsList.length > MAX_CREATORS_PER_REQUEST) {
        throw new Error(
          `getProductsBulk: Too many productCreators (${creatorsList.length}). Max allowed is ${MAX_CREATORS_PER_REQUEST}.`
        );
      }

      params.productCreators = creatorsList.join(",");

      // ✅ Auto-cap limit if caller didn’t provide it
      if (raw.limit === undefined) params.limit = creatorsList.length;
    }
  }

  // Tags
  if (Array.isArray(raw.tags) && raw.tags.length > 0) {
    const tagNames = raw.tags
      .map((t) => (typeof t === "string" ? t.trim() : String(t?.name || "").trim()))
      .filter(Boolean);

    if (tagNames.length === 1) params.tags = tagNames[0];
    else if (tagNames.length > 1) params.tags = tagNames;

    // Don’t auto-cap limit for tags; tags can be broad.
  }

  // Categories (UUID) – accept single or CSV via categoryUUID (no plural key)
  if (raw.categoryUUID) {
    const categoryList = String(raw.categoryUUID)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (categoryList.length === 1) params.categoryUUID = categoryList[0];
    else if (categoryList.length > 1) params.categoryUUID = categoryList;
  }

  // Addon filter (isAddon or is_addon) - only include if true
  if (raw.isAddon !== undefined && coerceBoolean(raw.isAddon)) {
    params.isAddon = true;
  } else if (raw.is_addon !== undefined && coerceBoolean(raw.is_addon)) {
    params.isAddon = true;
  }

  // config params win
  if (config?.params && typeof config.params === "object") {
    Object.assign(params, config.params);
  }

  // Guardrail #2: query string length (after all params are finalized)
  const qs = serializeParams(params);
  if (qs.length > MAX_QUERYSTRING_LENGTH) {
    throw new Error(
      `getProductsBulk: Query string too long (${qs.length} chars). ` +
      `Reduce productCreators count or request a POST endpoint from backend.`
    );
  }

  return { params, uiDomainFallback, requestedCurrency };
}

function normalizeRecurring(v) {
  if (v === null || v === undefined) return "Allowed";
  const s = String(v).trim();
  if (!s) return "";
  if (s.toLowerCase() === "allowed") return "Allowed";
  return s;
}

function normalizeCategories(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((c) => ({
      id: String(c?.id || ""),
      name: String(c?.name || ""),
      legacy_category_id: Number.isFinite(Number(c?.legacy_category_id)) ? Number(c.legacy_category_id) : 0,
    }))
    .filter((c) => c.id && c.name);
}

// Newer backend responses sometimes return categories as productCategories:[{category:{...}}]
function normalizeProductCategories(productCategories) {
  if (!Array.isArray(productCategories)) return [];
  return productCategories
    .map((pc) => pc?.category || pc)
    .map((c) => ({
      id: String(c?.id || ""),
      name: String(c?.name || ""),
      legacy_category_id: Number.isFinite(Number(c?.legacy_category_id)) ? Number(c.legacy_category_id) : 0,
    }))
    .filter((c) => c.id && c.name);
}

/**
 * Map CMS product -> ProductUi (FE contract preserved) + extras:
 * - price_points
 * - unit_amount (based on requestedCurrency when provided)
 */
function toProductUi(p, ctx = {}) {
  const pricesMap = buildPricesMap(p?.prices);
  const price_points = buildPricePoints(p?.prices);
  const image = pickImageFromResources(p?.resources);
  const uiDomainFallback = ctx?.uiDomainFallback ? String(ctx.uiDomainFallback) : "";

  const requested = ctx?.requestedCurrency ? String(ctx.requestedCurrency).trim().toLowerCase() : "";
  const unit_amount =
    requested && Object.prototype.hasOwnProperty.call(pricesMap, requested)
      ? toNumberOrZero(pricesMap[requested])
      : Object.prototype.hasOwnProperty.call(pricesMap, "usd")
        ? toNumberOrZero(pricesMap.usd)
        : (Object.keys(pricesMap).length > 0 ? toNumberOrZero(pricesMap[Object.keys(pricesMap)[0]]) : 0);

  // Custom amount aliases (backend sometimes renames this)
  const custom_amount =
    coerceBoolean(
      p?.custom_amount ??
      p?.customAmount ??
      p?.custom_amount_allowed ??
      p?.allow_custom_amount ??
      p?.allowCustomAmount
    );

  // Normalize product_type
  const normalizedProductType = normalizeProductType(p?.product_type);
  
  // For static products (those with product_type), set default route in short_description if empty
  // This allows components to use short_description as staticLink
  const shortDescription = String(p?.short_description || "").trim();
  const defaultRoute = normalizedProductType ? getProductTypeRoute(normalizedProductType) : null;
  const finalShortDescription = shortDescription || defaultRoute || "";

  return {
    product_id: String(p?.product_id || ""),
    id: Number.isFinite(Number(p?.legacy_product_id)) ? Number(p.legacy_product_id) : null,
    creator: String(p?.creator || ""),
    name: String(p?.name || ""),
    description: String(p?.description || ""),
    short_description: finalShortDescription,

    product_type: normalizedProductType,
    custom_amount,
    recurring: normalizeRecurring(p?.recurring),
    is_addon: coerceBoolean(p?.is_addon),

    status: normalizeStatusFromProduct(p),
    order: Number.isFinite(Number(p?.order)) ? Number(p.order) : 0,
    quick_donate_order:
      p?.quick_donate_order === null || p?.quick_donate_order === undefined
        ? null
        : Number.isFinite(Number(p.quick_donate_order))
          ? Number(p.quick_donate_order)
          : null,

    domain: p?.domain ? String(p.domain) : uiDomainFallback || "",
    image_link: image,

    usd: toNumberOrZero(pricesMap.usd),
    eur: toNumberOrZero(pricesMap.eur),
    gbp: toNumberOrZero(pricesMap.gbp),
    aed: toNumberOrZero(pricesMap.aed),
    aud: toNumberOrZero(pricesMap.aud),
    cad: toNumberOrZero(pricesMap.cad),
    idr: toNumberOrZero(pricesMap.idr),
    inr: toNumberOrZero(pricesMap.inr),
    myr: toNumberOrZero(pricesMap.myr),
    sgd: toNumberOrZero(pricesMap.sgd),

    categories: (() => {
      const cats = normalizeCategories(p?.categories);
      if (cats.length > 0) return cats;
      return normalizeProductCategories(p?.productCategories);
    })(),

    // ✅ added fields (non-breaking additions)
    price_points,
    unit_amount,
  };
}

/**
 * Fetch products via /cms/products-list and return ONLY ProductUi items.
 * Output shape remains unchanged: { data: ProductUi[], count, cursor? }
 */
export async function getProductsBulk(payload, options = {}) {
  const { config } = options || {};
  const { params, uiDomainFallback, requestedCurrency } = normalizeProductsListRequest(payload, { config });

  try {
    const res = await cmsClient.get(PRODUCTS_ENDPOINTS.LIST, {
      ...(config || {}),
      params,
      paramsSerializer: { serialize: serializeParams },
    });

    const json = res?.data ?? res;

    const rawList = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    const data = rawList.map((p) => toProductUi(p, { uiDomainFallback, requestedCurrency }));

    const count = Number.isFinite(Number(json?.count)) ? Number(json.count) : data.length;
    const cursor = json?.cursor ?? json?.nextCursor ?? null;

    const hasCursor =
      (json && Object.prototype.hasOwnProperty.call(json, "cursor")) ||
      (json && Object.prototype.hasOwnProperty.call(json, "nextCursor"));

    if (hasCursor) return { data, count, cursor };
    return { data, count };
  } catch (error) {
    console.error('[getProductsBulk] API Error:', {
      message: error?.message,
      code: error?.code,
      response: error?.response?.data,
      status: error?.response?.status,
      baseURL: cmsClient.defaults?.baseURL,
      endpoint: PRODUCTS_ENDPOINTS.LIST,
      params,
    });
    throw error;
  }
}

/**
 * getProductsList wrapper for backward compatibility:
 * - If called with legacy payload.product (single creator),
 *   return data as a SINGLE object (legacy Step-1 expectation),
 *   while still providing list/item for anyone who needs array form.
 * - Otherwise, behaves like getProductsBulk (data array).
 */
export async function getProductsList(payload, options = {}) {
  const isLegacySingle = !!(payload && typeof payload.product === "string" && payload.product.trim());

  const res = await getProductsBulk(payload, options);
  const list = Array.isArray(res?.data) ? res.data : [];
  const item = list.length > 0 ? list[0] : null;

  if (isLegacySingle) {
    return {
      ...res,
      data: item, // ✅ legacy shape
      item,
      list,
    };
  }

  return {
    ...res,
    item,
    list,
  };
}
