export type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildUrl(base: string, path: string, params?: QueryParams) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(normalizedPath, base.endsWith('/') ? base : base + '/');
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
        });
    }
    return url.toString();
}

export function createApiClient(baseUrl: string) {
    return {
        async get<T>(path: string, params?: QueryParams): Promise<T> {
            const url = buildUrl(baseUrl, path, params);
            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`API error: ${res.status} ${text}`);
            }
            return res.json() as Promise<T>;
        },
    };
}

