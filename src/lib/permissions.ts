export type Capability =
| 'publishPages'

const POSITIONS: Record<Capability, readonly string[]> = {
    publishPages: [
        'webmaster',
        'website-management-team-member',
        'vice-president-of-operational-affairs',
        'digital-innovation-manager',
        'digital-innovation-website-creation-team-member',
        'digital-innovation-website-creation-team-lead',
        'executive-vice-president',
    ],
}
export function capabilitiesForPositions(
  positions: readonly string[],
): Capability[] {
  return (Object.keys(POSITIONS) as Capability[]).filter((capability) =>
    POSITIONS[capability].some((position) => positions.includes(position)),
  );
}