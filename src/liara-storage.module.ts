import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';

import { LiaraStorageService } from './liara-storage.service';

import { DEFAULTS, LIARA_STORAGE_CONFIGS } from './liara-storage.constant';

export type LiaraStorageModuleConfigs = {
  accessKey: string;
  secretKey: string;
  bucketName: string;
  endPoint?: string;
  region?: string;
  mimes?: string;
  limitSize?: number;
};

type LiaraStorageModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<LiaraStorageModuleConfigs>, 'useFactory' | 'inject'>;

@Module({})
export class LiaraStorageModule {
  static register(configs: LiaraStorageModuleConfigs): DynamicModule {
    const clearlyConfigs = this.getClearConfigs(configs);
    return {
      module: LiaraStorageModule,
      providers: [
        {
          useFactory: () => {
            return clearlyConfigs;
          },
          provide: LIARA_STORAGE_CONFIGS,
        },
        ,
        LiaraStorageService,
      ],
      exports: [LiaraStorageService],
    };
  }

  static registerAsync(options: LiaraStorageModuleAsyncOptions): DynamicModule {
    return {
      module: LiaraStorageModule,
      imports: options.imports,
      providers: [
        {
          provide: LIARA_STORAGE_CONFIGS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        LiaraStorageService,
      ],
      exports: [LiaraStorageService],
    };
  }

  static getClearConfigs(configs: LiaraStorageModuleConfigs) {
    return {
      accessKey: configs.accessKey,
      secretKey: configs.secretKey,
      bucketName: configs.bucketName,
      endPoint: configs.endPoint || DEFAULTS.END_POINT,
      region: configs.region || DEFAULTS.REGION,
      mimes: configs.mimes || DEFAULTS.MIMES,
      limitSize: configs.limitSize,
    };
  }
}
