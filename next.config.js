/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Add a rule to handle the canvas.node binary module
        // canvas.nodeバイナリモジュールを処理するルールを追加する。
        config.module.rules.push({ test: /\.node$/, use: 'raw-loader' });
    
        // Exclude canvas from being processed by Next.js in the browser
        // ブラウザのNext.jsで処理されるキャンバスを除外する
        if (!isServer) config.externals.push('canvas');
        return config;
    },
}

module.exports = nextConfig
