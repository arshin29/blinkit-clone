import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Public()
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
      },
    }),
  )
  async upload(
    @UploadedFile() file?: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Please upload an image file using multipart/form-data with key "file"',
      );
    }

    const targetFolder = folder?.trim() || 'blinkit/products';
    const result = await this.cloudinaryService.uploadImage(file, targetFolder);

    // Never expose CLOUDINARY_API_SECRET
    const { api_secret, ...safeUploadResult } = result as any;

    return {
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      public_id: result.public_id,
      secure_url: result.secure_url,
      ...safeUploadResult,
    };
  }

  @Public()
  @Post('upload-url')
  @HttpCode(HttpStatus.OK)
  async uploadUrl(
    @Body('url') url?: string,
    @Body('folder') folder?: string,
  ) {
    if (!url || !url.trim()) {
      throw new BadRequestException('Image URL is required');
    }

    const targetFolder = folder?.trim() || 'blinkit/products';
    const result = await this.cloudinaryService.uploadFromUrl(url.trim(), targetFolder);

    const { api_secret, ...safeUploadResult } = result as any;

    return {
      success: true,
      message: 'Image URL uploaded successfully to Cloudinary',
      public_id: result.public_id,
      secure_url: result.secure_url,
      ...safeUploadResult,
    };
  }
}

