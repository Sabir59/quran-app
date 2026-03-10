import { createApiClient } from "./createApiClient";

const QURAN_API = 'https://api.alquran.cloud/v1';

export const quranClient = createApiClient(QURAN_API);

