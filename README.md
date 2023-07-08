<h1 align="center">NestJS Library for Liara.ir Storage</h1>

<br />

> ## Useful package for [Liara.ir Storage](https://liara.ir/products/object-storage/)
>
> **`AWS`**, **`S3`**, **`Multer`**, **`Multer-S3`**

<br />

## Installation

```bash
[npm]
> npm i nest-multer-liara

[yarn]
> yarn add nest-multer-liara
```

<br />

## How too use

```typescript
// app.module.ts
import { LiaraStorageModule } from 'nest-multer-liara';

@Module({
  imports: [
    LiaraStorageModule.register({
      // Required, liara access key
      accessKey: 'LIARA_ACCESS_KEY',

      // Required, liara secret key
      secretKey: 'LIARA_SECRET_KEY',

      // Required, liara bucket name
      bucketName: 'LIARA_BUCKET_NAME',

      // Optional, liara end point
      endPoint: 'storage.iran.liara.space',

      // Optional, The files extension you support to upload. Separate them using comma
      // Default: png,jpg,jpeg,svg,tiff,gif,webm,mpg,mp2,mpeg,mpv,ogg,mp4,m4p,m4v,api,wmv,mov,flv,swf,pdf,m4a,mp3,wav,wma,aac
      mimes: 'png,jpg,jpeg,svg',

      // Optional, Maximum size of each file in bytes. (Default: Infinity)
      limitSize: 1000000,

      // Optional
      region: 'default',
    }),
  ],
})
export class AppModule {}
```

```typescript
// your.service.ts
import { LiaraStorageService } from 'nest-multer-liara';

export class YourService {
  constructor(private readonly storageService: LiaraStorageService) {}

  async upload(request: any): Promise<any> {
    let file = null;

    try {
      file = await this.storageService.put(request, 'file');
      // or
      file = await this.storageService.setRequestProperty('file').put(request);
    } catch (error) {
      console.log(error);
    }

    if (file) {
      const data = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        key: file.key,
        location: file.location,
        size: file.size,
      };

      // your code
    }
  }

  async delete(key: string) {
    try {
      await this.storageService.delete(key);
    } catch (error) {
      console.log(error);
    }
  }
}
```

> You can access to all s3 apis with **this.storageService.client**

### LiaraStorageService Apis

| method                               | description                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| setRequestProperty(property: string) | set request field key                                             |
| put(request: any, property?: string) | upload media, arg 1 is request object, arg 2 is request field key |
| delete(key: string)                  | remove object from storage                                        |
