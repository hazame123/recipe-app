import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.method} ${req.url}`);
    next();
  }
}
