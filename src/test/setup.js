import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Node 25 also exposes storage; tests must use the browser implementation from jsdom.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: globalThis.jsdom.window.localStorage,
});

afterEach(() => cleanup());
