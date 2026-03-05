import { Prisma, PrismaClient } from '@time-tracking-app/database/index';
import { HttpException } from '@nestjs/common';

const MAX_RETRIES = 3;

export async function runSerializable<T>(
  prisma: PrismaClient,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw err;
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2034') {
        if (attempt === MAX_RETRIES - 1) {
          throw err;
        }

        continue;
      }

      throw err;
    }
  }

  throw new Error('Transaction failed after retries');
}
