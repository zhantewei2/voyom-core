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

const TsLoaderConfig={
  transpileOnly: true,
  happyPackMode: false,
  appendTsxSuffixTo: [
    '\\.vue$'
  ]
};

const BabelOptions= {};

const BaseConfig=({
  baseUrl= "/",
  vueModuleSassLoader=VueModuleSassLoader,
  vueModuleCssLoader=VueModuleCssLoader,
  sassOptions={},
  babelOptions=BabelOptions,
  tsLoaderConfig=TsLoaderConfig
})=>{
  // implementation dart-sass
  Object.assign(sassOptions,{implementation:require("sass")});
  
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
          exclude: /node_modules\/(core-js|css-loader|@babel)/,
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
            {loader: "ts-loader",options: tsLoaderConfig}
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
        // font
        {
          test: /\.(woff2?|eot|ttf|otf|png|jpg|svg|jpe?g|webp|gif)(\?.*)?$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 4*1024,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    esModule:false,
                    name: 'resource/[name].[hash:8].[ext]',
                    publicPath: baseUrl
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
      new ForkTsCheckerWebpackPlugin({
        typescript:{
          extensions:{
            vue:true
          }
        }
      }),
      new CleanWebpackPlugin()
    ]
  }
}

exports.BaseConfig = BaseConfig;