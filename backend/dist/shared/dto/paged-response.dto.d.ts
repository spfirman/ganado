export declare class PagedResponseDto<T> {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    items: T[];
    static of<T>(p: number, l: number, total: number, items: T[]): PagedResponseDto<T>;
}
