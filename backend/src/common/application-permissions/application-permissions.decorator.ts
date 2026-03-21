import { SetMetadata } from '@nestjs/common';

export const RequireModule = (moduleName: string) =>
  SetMetadata('requireModule', moduleName);

export const RequireEntity = (entityName: string) =>
  SetMetadata('requireEntity', entityName);

export const RequireAction = (actionName: string) =>
  SetMetadata('requireAction', actionName);
