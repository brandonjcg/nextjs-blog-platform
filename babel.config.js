module.exports = {
    env: {
        test: {
            presets: [
                'next/babel', // Ensures compatibility with Next.js
                '@babel/preset-react', // Adds support for JSX syntax
                '@babel/preset-typescript' // Adds TypeScript support
            ],
            plugins: [
                '@babel/plugin-syntax-jsx', // Ensures that JSX syntax is properly parsed
            ],
        }
    }
};
