import { dataSourceOptions } from '../database/data-source';

export const typeOrmConfig = {
  ...dataSourceOptions,
  autoLoadEntities: true,
};
