export {}

// Add types for global function from sign-in-button-plugin.js
declare global {
    interface Window {
        SignInWithEsignetButton: {
            init: (options?: unknown) => void
        }
    }
}
