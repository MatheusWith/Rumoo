import * as axe from 'axe-core';

/**
 * Run axe and return only critical/serious violations. Pure (no expectations),
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
 * violations.  Use in component specs:
 *   expectAccessible(fixture.nativeElement);
 */
export async function expectAccessible(element: HTMLElement): Promise<void> {
  const blocking = await blockingViolations(element);
  expect(blocking).toEqual([]);
}
