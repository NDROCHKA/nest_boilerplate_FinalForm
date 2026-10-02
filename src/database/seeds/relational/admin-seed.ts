import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './user/user-seed.service';

export const runAdminSeed = async (): Promise<void> => {
  const app = await NestFactory.createApplicationContext(SeedModule);
  try {
    await app.get(UserSeedService).run();
  } finally {
    await app.close();
  }
};

if (require.main === module) {
  void runAdminSeed().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
