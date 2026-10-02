import { NestFactory } from '@nestjs/core';
import { UserSeedService } from './user/user-seed.service';
import { CategorySeedService } from './category/category-seed.service';
import { ProductSeedService } from './product/product-seed.service';
import { SeedModule } from './seed.module';

export const runPartialSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  try {
    // Order matters: categories must exist before products
    await app.get(UserSeedService).run();
    await app.get(CategorySeedService).run();
    await app.get(ProductSeedService).run();
  } finally {
    await app.close();
  }
};

if (require.main === module) {
  void runPartialSeed().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
