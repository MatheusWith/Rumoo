import * as axe from 'axe-core';

/**
 * Run axe and return only critical/serious violations. Pure (no side effects),
 * so it can be asserted on directly.
 */
export async function blockingViolations(element: HTMLElement): Promise<axe.Result[]> {
  const results: axe.AxeResults = await axe.run(element, {
    resultTypes: ['violations'],
  });
  return results.violations.filter(
    (v: axe.Result) => v.impact === 'critical' || v.impact === 'serious'
  );
}

/**
 * Assert that a rendered element has zero axe-core critical or serious
 * violations. Throws when violations exist, so an a11y failure fails the
 * spec.  Use in component specs:
 *   expectAccessible(fixture.nativeElement);
 */
export async function expectAccessible(element: HTMLElement): Promise<void> {
  const blocking = await blockingViolations(element);
  if (blocking.length > 0) {
    throw new Error(
      'Accessibility violations found:\n' +
        blocking.map((v) => `- ${v.help} (${v.id}, impact: ${v.impact})`).join('\n')
    );
  }
}
