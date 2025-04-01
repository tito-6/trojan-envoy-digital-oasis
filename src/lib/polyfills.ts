
// Polyfill for global object needed by draft-js and other libraries
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || { env: { NODE_ENV: 'production' } };
}

export {};
