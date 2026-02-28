export declare const RequireModule: (moduleName: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireEntity: (entityName: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireAction: (actionName: "create" | "read" | "update" | "delete" | "list") => import("@nestjs/common").CustomDecorator<string>;
