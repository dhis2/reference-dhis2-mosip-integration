const config = {
    type: 'app',
    title: 'eSignet verification plugin',
    description: 'Plugin for verifying a patient in the Capture app with eSignet',

    entryPoints: {
        app: './src/App.tsx',
        plugin: './src/Plugin.tsx',
    },
}

module.exports = config
