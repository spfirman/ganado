import { Request, Response } from 'express';
export declare class AiTestingController {
    verify(req: Request, res: Response): Response<any, Record<string, any>>;
    capabilities(req: Request, res: Response): Response<any, Record<string, any>>;
    sitemap(req: Request, res: Response): Response<any, Record<string, any>>;
    testData(req: Request, res: Response): Response<any, Record<string, any>>;
}
