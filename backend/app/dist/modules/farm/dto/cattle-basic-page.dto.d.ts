import { CattleBasicResponseDto } from './cattle-basic-response.dto';
export declare class CattleBasicPageDto {
    items: CattleBasicResponseDto[];
    nextCursor?: string | null;
    hasMore: boolean;
    total?: number | null;
}
