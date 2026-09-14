import { blockingViolations } from './a11y';

describe('expectAccessible (helper)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('passes for a simple accessible fragment', async () => {
    container.innerHTML = '<label for="name">Name</label><input id="name" type="text">';
    expect(await blockingViolations(container)).toEqual([]);
  });

  it('fails for a non-accessible element', async () => {
    container.innerHTML = '<button></button>';
    const violations = await blockingViolations(container);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].id).toBe('button-name');
    expect(violations[0].impact).toBe('critical');
  });

  it('reports critical/serious violations', async () => {
    container.innerHTML = '<button>OK</button><button></button>';
    const violations = await blockingViolations(container);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.every((v) => v.impact === 'critical' || v.impact === 'serious')).toBe(true);
  });
});
