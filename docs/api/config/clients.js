import createApiClient from "./createApiClient";

const CMS_API = process.env.REACT_APP_CMS_API;
const USERS_API = process.env.REACT_APP_USERS_API;
const TOP_PRODUCTS_API = process.env.REACT_APP_TOP_PRODUCTS_API;
const PAYMENTS_API = process.env.REACT_APP_PAYMENTS_API;
const NOTIFICATION_API = process.env.REACT_APP_NOTIFICATION_API;

export const cmsClient = createApiClient({
  baseURL: CMS_API,
});
export const menusClient = createApiClient({
  baseURL: CMS_API,
});
export const bannersClient = createApiClient({
  baseURL: CMS_API,
});
export const categoriesClient = createApiClient({
  baseURL: CMS_API,
});
export const topProductsClient = createApiClient({
  baseURL: TOP_PRODUCTS_API,
});
export const top20ProductsClient = createApiClient({
  baseURL: TOP_PRODUCTS_API,
});
export const usersClient = createApiClient({
  baseURL: USERS_API,
});
// Legacy / monolith base (used by older endpoints like /contact-form, /volunteer, etc.)
export const contactFormClient = createApiClient({
  baseURL: USERS_API,
});
export const paymentsClient = createApiClient({
  baseURL: PAYMENTS_API,
});
export const ramadanTickerClient = createApiClient({
  baseURL: CMS_API,
});
export const flexibleDonationsClient = createApiClient({
  baseURL: PAYMENTS_API,
});
export const notificationClient = createApiClient({
  baseURL: NOTIFICATION_API,
});