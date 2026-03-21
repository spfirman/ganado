export declare enum SaleSortField {
    TRANSACTION_DATE = "transactionDate",
    TOTAL_AMOUNT = "totalAmount",
    BUYER = "buyer",
    CREATED_AT = "createdAt"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class GetSalesQueryDto {
    skip: number;
    take: number;
    page?: number;
    limit?: number;
    orderBy: string;
    order: string;
    startDate?: string;
    endDate?: string;
    buyerId?: string;
    status?: string;
}
