const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      ...[
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
        },
      ],
    ];
    config.resolve = Object.assign(config.resolve, {
      fallback: {
        fs: false,
      },
    });
    config.resolveLoader.modules = ["node_modules"];
  },
  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"));
  },
});
