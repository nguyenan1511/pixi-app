
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config, { dev, isServer }) {
    

    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader"],
    });

    config.resolve.extensions.push(".glsl");

    return config;
  },
}

module.exports = nextConfig
