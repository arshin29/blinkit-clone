import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'blinkit-api',
      message: 'Blinkit API is running successfully',
      health: '/api/health',
    };
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'blinkit-api',
      timestamp: new Date().toISOString(),
    };
  }
}
