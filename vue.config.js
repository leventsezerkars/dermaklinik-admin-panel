const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "",
  configureWebpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    };
  },
  chainWebpack: (config) => {
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        "process.env.VUE_APP_API_URL": JSON.stringify(
          process.env.VUE_APP_API_URL || "https://your-production-api-url.com"
        ),
      });
      return definitions;
    });
  },
});
