import { Inject, Injectable } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

import { LIARA_STORAGE_CONFIGS } from './liara-storage.constant';
import { LiaraStorageModuleConfigs } from './liara-storage.module';

@Injectable()
export class LiaraStorageService {
  private _s3: AWS.S3;
  private _property: string = 'file';

  constructor(
    @Inject(LIARA_STORAGE_CONFIGS)
    private readonly options: LiaraStorageModuleConfigs,
  ) {
    this._s3 = new AWS.S3({
      endpoint: this.options.endPoint,
      accessKeyId: this.options.accessKey,
      secretAccessKey: this.options.secretKey,
      region: this.options.region,
    });
  }

  // upload media/file
  async put(request: any, property?: string) {
    if (property) {
      this._property = property;
    }

    return new Promise((resolve, reject) => {
      try {
        this.getOptions()(request, null, (error: any) => {
          if (error) {
            return reject(`Failed to upload image file: ${error}`);
          }

          resolve({ ...request.files[0] });
        });
      } catch (error) {
        return reject(`Failed to upload image file: ${error}`);
      }
    });
  }

  // delete media/file
  async delete(Key: string) {
    return new Promise((resolve, reject) => {
      this._s3.deleteObject(
        { Bucket: this.options.bucketName, Key },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        },
      );
    });
  }

  private getOptions() {
    return multer({
      storage: multerS3({
        s3: this._s3,

        bucket: this.options.bucketName,

        key: (_: any, file: any, cb: any) => {
          if (!file) throw new Error('File not uploaded!');

          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          const i = file.originalname.lastIndexOf('.');
          const ext = i < 0 ? '' : file.originalname.substr(i);

          cb(null, `${randomName}${ext}`);
        },
      }),

      limits: {
        fileSize: this.options.limitSize,
      },

      fileFilter: (_: any, file: any, callback: any) => {
        const mimes = this.options.mimes.split(',');

        let idx = file.originalname.lastIndexOf('.');
        const ext = idx < 0 ? '' : file.originalname.substr(++idx);

        if (!mimes.includes(ext)) {
          return callback(new Error('File not supported'), false);
        }

        return callback(null, true);
      },
    }).array(this._property || 'file', 1);
  }

  // S3 client for access to all apis
  get client(): AWS.S3 {
    return this._s3;
  }

  public setRequestProperty(property: string) {
    this._property = property;
    return this;
  }
}
