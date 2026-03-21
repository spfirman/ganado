import { BrandService } from '../services/brand.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { BrandResponseDto } from '../dto/brand-response.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class BrandController {
    private readonly brandService;
    private readonly logger;
    constructor(brandService: BrandService);
    create(sessionUser: SessionUserDto, dto: CreateBrandDto, file: Express.Multer.File): Promise<BrandResponseDto>;
    findOne(id: string, sessionUser: SessionUserDto): Promise<BrandResponseDto>;
    update(id: string, sessionUser: SessionUserDto, dto: UpdateBrandDto, file: Express.Multer.File): Promise<BrandResponseDto>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
    list(sessionUser: SessionUserDto): Promise<BrandResponseDto[]>;
    syncBrands(sessionUser: SessionUserDto, brandsJson: string, files: Express.Multer.File[]): Promise<{
        results: any[];
    }>;
}
