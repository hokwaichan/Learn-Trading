/**
 * Versioned migrations for persisted stores.
 *
 * Each store declares a current version and a map of upgrade steps keyed by
 * the version they upgrade FROM. When saved data is older than the current
 * version, the steps run in order, so a change to a store's shape upgrades
 * existing data instead of wiping it.
 *
 *   const migrate = createMigrate<SettingsState>(2, defaults, {
 *     1: (old) => ({ ...old, riskFreeRate: 0.04 }),   // v1 -> v2
 *   });
 */
export type MigrationStep = (state: Record<string, unknown>) => Record<string, unknown>;

export function createMigrate<T extends object>(
  currentVersion: number,
  defaults: T,
  steps: Record<number, MigrationStep> = {},
) {
  return (persisted: unknown, fromVersion: number): T => {
    if (persisted == null || typeof persisted !== 'object') return defaults;
    // Data from a newer build than this one: keep known fields, do not guess.
    if (fromVersion > currentVersion) return { ...defaults, ...(persisted as Partial<T>) };

    let state = persisted as Record<string, unknown>;
    for (let v = fromVersion; v < currentVersion; v++) {
      const step = steps[v];
      if (step) state = step(state);
    }
    // Defaults fill any field added without an explicit step.
    return { ...defaults, ...(state as Partial<T>) };
  };
}
