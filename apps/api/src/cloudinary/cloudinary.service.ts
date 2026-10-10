import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    const rawCloudName =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const rawApiKey =
      this.configService.get<string>('CLOUDINARY_API_KEY') ||
      process.env.CLOUDINARY_API_KEY;
    const rawApiSecret =
      this.configService.get<string>('CLOUDINARY_API_SECRET') ||
      process.env.CLOUDINARY_API_SECRET;

    const cloud_name = rawCloudName?.replace(/^["']|["']$/g, '').trim();
    const api_key = rawApiKey?.replace(/^["']|["']$/g, '').trim();
    const api_secret = rawApiSecret?.replace(/^["']|["']$/g, '').trim();

    if (!cloud_name || !api_key || !api_secret) {
      this.logger.warn(
        'Cloudinary credentials are not fully configured. Please verify your apps/api/.env settings.',
      );
    }

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });

    this.logger.log(`Cloudinary configured for cloud_name: ${cloud_name}`);
  }

  /**
   * Upload an image file buffer to Cloudinary
   * @param file Express.Multer.File object from multer
   * @param folder Cloudinary folder path (defaults to 'blinkit/products')
   * @returns Promise<UploadApiResponse>
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'blinkit/products',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No image file provided for upload');
    }

    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Invalid file type. Only image files (e.g., JPEG, PNG, WEBP, GIF, SVG) are allowed.',
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`, error);
            return reject(
              new BadRequestException(
                error.message || 'Failed to upload image to Cloudinary',
              ),
            );
          }

          if (!result) {
            return reject(
              new InternalServerErrorException(
                'Cloudinary upload returned an empty result',
              ),
            );
          }

          resolve(result);
        },
      );

      uploadStream.on('error', (err) => {
        this.logger.error(`Cloudinary stream error: ${err.message}`, err);
        reject(
          new InternalServerErrorException(
            err.message || 'Stream upload encountered an error',
          ),
        );
      });

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload an image from a remote URL to Cloudinary
   * @param imageUrl Remote HTTP/HTTPS image URL
   * @param folder Cloudinary folder path
   * @returns Promise<UploadApiResponse>
   */
  async uploadFromUrl(
    imageUrl: string,
    folder = 'blinkit/products',
  ): Promise<UploadApiResponse> {
    if (!imageUrl || !imageUrl.trim().startsWith('http')) {
      throw new BadRequestException('A valid HTTP/HTTPS image URL is required');
    }

    try {
      const resp = await fetch(imageUrl.trim(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to download image: HTTP ${resp.status}`);
      }

      const contentType = resp.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;

      const uploadResult = await cloudinary.uploader.upload(base64Data, {
        folder,
        resource_type: 'image',
      });

      return uploadResult;
    } catch (err: any) {
      this.logger.error(`Failed to upload image from URL to Cloudinary: ${err.message}`, err);
      throw new BadRequestException(
        err.message || 'Failed to upload remote image to Cloudinary',
      );
    }
  }
}

