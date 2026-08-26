const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const STORAGE_BUCKET = 'media';

export function getFileUrl(filename: string): string {
    if (!filename) return '';
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
}

export const supabase = {
    from(table: string) {
        let selectQuery = '*';
        const filters: string[] = [];
        let orderClause = '';
        let limitClause = '';
        let offsetClause = '';
        let isSingle = false;

        const builder = {
            select(fields = '*') {
                selectQuery = fields;
                return builder;
            },
            eq(column: string, value: any) {
                filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`);
                return builder;
            },
            order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
                orderClause = `order=${encodeURIComponent(column)}.${ascending ? 'asc' : 'desc'}`;
                return builder;
            },
            range(from: number, to: number) {
                offsetClause = `offset=${from}`;
                limitClause = `limit=${to - from + 1}`;
                return builder;
            },
            limit(count: number) {
                limitClause = `limit=${count}`;
                return builder;
            },
            single() {
                isSingle = true;
                return builder;
            },
            async then(resolve?: (val: { data: any; error: any }) => any, reject?: (err: any) => any) {
                try {
                    const params = [
                        `select=${encodeURIComponent(selectQuery)}`,
                        ...filters,
                        orderClause,
                        limitClause,
                        offsetClause
                    ].filter(Boolean).join('&');

                    const headers: Record<string, string> = {
                        apikey: SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    };

                    if (isSingle) {
                        headers['Accept'] = 'application/vnd.pgrst.object+json';
                    }

                    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
                        headers,
                    });

                    if (!res.ok) {
                        const error = await res.json().catch(() => ({ message: res.statusText }));
                        const result = { data: null, error };
                        return resolve ? resolve(result) : result;
                    }

                    const data = await res.json();
                    const result = { data, error: null };
                    return resolve ? resolve(result) : result;
                } catch (error) {
                    const result = { data: null, error };
                    return resolve ? resolve(result) : result;
                }
            },
            async insert(values: Record<string, any> | Record<string, any>[]) {
                let returnRepresentation = false;
                let singleInsert = false;

                const insertBuilder = {
                    select(fields = '*') {
                        returnRepresentation = true;
                        return insertBuilder;
                    },
                    single() {
                        singleInsert = true;
                        return insertBuilder;
                    },
                    async then(resolve?: (val: { data: any; error: any }) => any, reject?: (err: any) => any) {
                        try {
                            const headers: Record<string, string> = {
                                'Content-Type': 'application/json',
                                apikey: SUPABASE_ANON_KEY,
                                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                            };
                            if (returnRepresentation) {
                                headers['Prefer'] = 'return=representation';
                            }
                            if (singleInsert) {
                                headers['Accept'] = 'application/vnd.pgrst.object+json';
                            }

                            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                                method: 'POST',
                                headers,
                                body: JSON.stringify(values),
                            });

                            if (!res.ok) {
                                const error = await res.json().catch(() => ({ message: res.statusText }));
                                const result = { data: null, error };
                                return resolve ? resolve(result) : result;
                            }

                            const data = returnRepresentation ? await res.json() : null;
                            const result = { data, error: null };
                            return resolve ? resolve(result) : result;
                        } catch (error) {
                            const result = { data: null, error };
                            return resolve ? resolve(result) : result;
                        }
                    }
                };
                return insertBuilder;
            },
            async update(values: Record<string, any>) {
                const updateFilters: string[] = [...filters];
                let returnRepresentation = false;
                let singleUpdate = false;

                const updateBuilder = {
                    eq(column: string, value: any) {
                        updateFilters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`);
                        return updateBuilder;
                    },
                    select(fields = '*') {
                        returnRepresentation = true;
                        return updateBuilder;
                    },
                    single() {
                        singleUpdate = true;
                        return updateBuilder;
                    },
                    async then(resolve?: (val: { data: any; error: any }) => any, reject?: (err: any) => any) {
                        try {
                            const params = updateFilters.join('&');
                            const headers: Record<string, string> = {
                                'Content-Type': 'application/json',
                                apikey: SUPABASE_ANON_KEY,
                                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                            };
                            if (returnRepresentation) {
                                headers['Prefer'] = 'return=representation';
                            }
                            if (singleUpdate) {
                                headers['Accept'] = 'application/vnd.pgrst.object+json';
                            }

                            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
                                method: 'PATCH',
                                headers,
                                body: JSON.stringify(values),
                            });

                            if (!res.ok) {
                                const error = await res.json().catch(() => ({ message: res.statusText }));
                                const result = { data: null, error };
                                return resolve ? resolve(result) : result;
                            }

                            const data = returnRepresentation ? await res.json() : null;
                            const result = { data, error: null };
                            return resolve ? resolve(result) : result;
                        } catch (error) {
                            const result = { data: null, error };
                            return resolve ? resolve(result) : result;
                        }
                    }
                };
                return updateBuilder;
            }
        };

        return builder;
    }
};
