# dao-aliyun-oss-webpack-plugin
基于webpack 的aliyun OSS上传工具

## 如何使用


```
webpack.config.js文件中添加
.....
plugins: [
    new aliyunOssUpWebpackPlugin({
        buildPath: 'dist', //本地需要上传路径
        ossPath:'test',//上传存放目录（存储空间内部）
        region: 'oss-cn-beijing',//区域
        accessKeyId: 'xxxxxxxx',
        accessKeySecret: 'xxxxxxxxxxxxxxxxx',
        bucket: 'cdn'//存储空间
    })
]
```
