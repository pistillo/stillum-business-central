import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  mode: 'development',
  entry: './src/index.tsx',
  devServer: {
    port: {{port}},
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.webpack.json',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: '{{snakeName}}',
      filename: 'remoteEntry.js',
      exposes: {
        '.': './src/components',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        '@emotion/react': {
          singleton: true,
        },
        '@emotion/styled': {
          singleton: true,
        },
        'framer-motion': {
          singleton: true,
        },
        '@tecnosys/stillum-forms-core': {
          singleton: true,
          requiredVersion: '^1.0.11',
        },
        '@tecnosys/stillum-forms-react': {
          singleton: true,
          requiredVersion: '^1.0.11',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    publicPath: 'auto',
    clean: true,
  },
};
