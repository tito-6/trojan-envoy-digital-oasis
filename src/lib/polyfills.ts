
// Polyfill for global object needed by draft-js and other libraries
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || { env: { NODE_ENV: 'production' } };
}

// Additional polyfills for draft-js
if (typeof document !== 'undefined') {
  // Fix for "document.selection" used in older browsers that draft-js sometimes checks
  // @ts-ignore
  if (!document.selection) {
    // @ts-ignore
    document.selection = {
      createRange: function() {
        return {
          text: '',
          parentElement: function() {
            return document.body;
          }
        };
      }
    };
  }
}

export {};
