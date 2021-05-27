const {VueLoaderPlugin} =require("vue-loader");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {CleanWebpackPlugin}=require("clean-webpack-plugin");
const path = require("path");
const join = (...args) => path.join(process.cwd(), ...args);

const VueModuleSassLoader=({sassOptions={},cssOptions={importLoaders:2,sourceMap:false}})=>[
  {loader:"vue-style-loader",options:{sourceMap:false,shadowMode:false}},
  {loader:"css-loader",options:cssOptions},
  {loader:"postcss-loader"},
  {loader:"sass-loader",options:sassOptions}
]

const VueModuleCssLoader=({cssOptions={importLoaders:2,sourceMap:false}})=>[
  {loader:"vue-style-loader",options:{sourceMap:false,shadowMode:false}},
  {loader:"css-loader",options:cssOptions},
  {loader:"postcss-loader"},
]

const tsLoaderConfig={
  transpileOnly: true,
  happyPackMode: false,
  appendTsxSuffixTo: [
    '\\.vue$'
  ]
};

const BabelOptions= {};

const BaseConfig=({
  vueModuleSassLoader=VueModuleSassLoader,
  vueModuleCssLoader=VueModuleCssLoader,
  sassOptions={},
  babelOptions=BabelOptions
})=>{
  return {
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      alias: {
        "@": join("src"),
      },
    },
    module: {
      rules: [
        {
          test:/\.js$/,
          use:[
            {loader: "cache-loader"},
            {loader: "babel-loader",options: babelOptions}
          ]
        },
        //ts
        {
          test: /\.ts$/,
          use: [
            {loader: "cache-loader"},
            {loader: "babel-loader",options: babelOptions},
            {loader: "ts-loader",options:tsLoaderConfig}
          ]
        },
        //tsc
        {
          test: /\.tsx$/,
          use: [
            {loader: "cache-loader"},
            {loader: "babel-loader",options: babelOptions},
            {loader: "ts-loader",options: tsLoaderConfig}
          ]
        },
        // vue
        {
          test: /.vue$/,
          use:[
            {loader:"cache-loader"},
            {loader:"vue-loader"}
          ]
        },
        // scss
        {
          test: /\.scss$/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: vueModuleSassLoader({sassOptions,cssOptions:{
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }})
            },
            {
              resourceQuery: /\?vue/,
              use: vueModuleSassLoader({sassOptions})
            },
            {
              use: vueModuleSassLoader({sassOptions})
            }
          ]
        },
        // css
        {
          test: /\.css$/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: vueModuleCssLoader({cssOptions:{
                  importLoaders:2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                  }
                }})
            },
            {
              resourceQuery: /\?vue/,
              use: vueModuleCssLoader({})
            },
            {
              use: vueModuleCssLoader({})
            }
          ]
        },
        // font
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'fonts/[name].[hash:8].[ext]'
                  }
                }
              }
            }
          ]
        },
      ]
    },
    plugins:[
      new VueLoaderPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new CleanWebpackPlugin()
    ]
  }
}

exports.BaseConfig = BaseConfig;