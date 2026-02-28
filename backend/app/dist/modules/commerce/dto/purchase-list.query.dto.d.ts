export declare class PurchaseListQueryDto {
    page: number;
    limit: number;
    from?: string;
    to?: string;
    provider?: string;
    status: 'all' | 'open' | 'received';
}
