export function escapeSql(value: unknown): string {
    return String(value).replace(/'/g, "''");
}