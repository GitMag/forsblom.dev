// Small text helpers over site.yaml.

/** "Magnus Forsblom: software developer" → "Software developer" (the part after the colon, capitalised). */
export function roleFrom(title: string): string {
  const after = title.split(/[:|–—]/)[1]?.trim();
  const role = after && after.length > 0 ? after : title;
  return role.charAt(0).toUpperCase() + role.slice(1);
}
