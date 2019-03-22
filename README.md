# dao-aliyun-oss-webpack-plugin
基于webpack 的aliyun OSS上传工具

## 如何使用

1. 安装daoAliyunOssWebpackPlugin

```
$ npm i dao-aliyun-oss-webpack-plugin -D
```

2. 配置webpack.config.js

```
<!-- 在头部引入插件 -->
var daoAliyunOssWebpackPlugin = require("dao-aliyun-oss-webpack-plugin");
<!-- 配置plugins -->
.....
plugins: [
    new daoAliyunOssWebpackPlugin({
        buildPath: 'dist', //本地需要上传路径
        ossPath:'test',//上传存放目录（存储空间内部）
        region: 'oss-cn-beijing',//区域
        accessKeyId: 'xxxxxxxx',
        accessKeySecret: 'xxxxxxxxxxxxxxxxx',
        bucket: 'cdn'//存储空间
    })
]
```

3. 如其他环境如vue.config.js

```

let env = process.env.NODE_ENV == "development" ? "development" : "production";

module.exports = {
   ......
   configureWebpack: config => {
          // 为生产环境修改配置...
          if (env) {
            config.plugins.push(
                new daoAliyunOssWebpackPlugin({
                    buildPath: 'dist', //本地需要上传路径
                    ossPath:'test',//上传存放目录（存储空间内部）
                    region: 'oss-cn-beijing',//区域
                    accessKeyId: 'xxxxxxxx',
                    accessKeySecret: 'xxxxxxxxxxxxxxxxx',
                    bucket: 'cdn'//存储空间
                })
            )
        }
   }
   ......
```
