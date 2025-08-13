if (typeof global === 'undefined') {
  (window as Window & typeof globalThis).global = window;
}

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

import { Buffer } from 'buffer';

if (typeof Buffer === 'undefined') {
  window.Buffer = Buffer;
}

interface Process {
  version: string;
  env: {
    NODE_ENV: string | undefined;
  };
}

((window as unknown) as Window & { process?: Process }).process = {
  version: '',
  env: {
    NODE_ENV: (typeof process !== 'undefined' ? process.env.NODE_ENV : undefined)
  }
};