import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('screenshots')
export class ScreenshotsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/screenshots',
        filename: (_, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 🔥 5MB limit
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log('📸 File:', file.filename);
    console.log('👤 User:', body.userId);

    return {
      message: 'Screenshot uploaded',
      file: file.filename,
    };
  }
}
