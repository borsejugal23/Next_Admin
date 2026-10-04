import { migrations } from "./index";
import { MigrationModel } from "./migration.model";

export async function runMigrations(): Promise<void> {
  console.log("\n🚀 Running database migrations...\n");

  // Fetch all executed migrations
  const executedMigrations = await MigrationModel.find(
    {},
    { migrationId: 1, _id: 0 },
  ).lean();

  const executedMigrationIds = new Set(
    executedMigrations.map((migration) => migration.migrationId),
  );

  for (const migration of migrations) {
    if (executedMigrationIds.has(migration.id)) {
      console.log(`⏭  Skipping: ${migration.id}`);
      continue;
    }

    console.log(`▶️  Executing: ${migration.id}`);
    console.log(`   ${migration.description}`);

    try {
      await migration.up();

      await MigrationModel.create({
        migrationId: migration.id,
      });

      console.log(`✅ Completed: ${migration.id}\n`);
    } catch (error) {
      console.error(`❌ Migration failed: ${migration.id}`);
      console.error(error);

      throw error;
    }
  }

  console.log("🎉 Database migrations completed.\n");
}
