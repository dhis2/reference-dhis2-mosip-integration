const config = {
    type: 'app',
    title: 'eSignet verification plugin',
    description: 'Plugin for verifying a patient in the Capture app with eSignet',

    entryPoints: {
        plugin: './src/Plugin.tsx',
        // Just for testing
        // app: './src/App.tsx',
    },
}

module.exports = config
