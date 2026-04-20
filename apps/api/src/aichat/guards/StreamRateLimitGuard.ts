import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const rateLimits = new Map<string, { count: number; expiresAt: number }>();

@Injectable()
export class StreamRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) return true;

    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const limit = 5;

    let userRecord = rateLimits.get(userId);

    if (userRecord && now > userRecord.expiresAt) {
      userRecord = undefined;
    }

    if (!userRecord) {
      rateLimits.set(userId, { count: 1, expiresAt: now + windowMs });
      return true;
    }

    if (userRecord.count >= limit) {
      throw new HttpException(
        'Request limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    userRecord.count += 1;
    rateLimits.set(userId, userRecord);

    return true;
  }
}
