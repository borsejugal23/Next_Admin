export interface Migration {
  /**
   * Unique identifier for the migration.
   * Example: 20260731-add-review-id
   */
  id: string;

  /**
   * Short description of what this migration does.
   */
  description: string;

  /**
   * Executes the migration.
   */
  up(): Promise<void>;
}
