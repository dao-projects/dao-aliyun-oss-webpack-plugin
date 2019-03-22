var fs = require('fs');
var path = require('path');
const AliOSS = require('ali-oss')
const pluginName = "daoAliyunOssWebpackPlugin"
const defaultConfig = {
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    bucket: '',
    buildPath: 'dist',
    ossPath: 'test'
}
class daoAliyunOssWebpackPlugin {
    constructor(config) {
        const cfg = Object.assign(defaultConfig, config || {});
        const auth = {
            accessKeyId: cfg['accessKeyId'],
            accessKeySecret: cfg['accessKeySecret'],
            bucket: cfg['bucket'],
            region: cfg['region'],
        };
        this.config = cfg;
        this.client = AliOSS(auth)
    }
    apply(compiler) {
        // https://webpack.js.org/api/compiler-hooks
        compiler.hooks.done.tap(pluginName, (compilation) => {
            const _ = this;
            const { buildPath } = _.config;
            console.log("buildPath=>", buildPath)
            _.travelSync(buildPath, function(e, file, next) {
                if (e !== null) {
                    console.log(e);
                }
                _.putFile(file)
                //获取下一个文件 next 里面调用了 next(i) 记录了当前遍历位置
                next();
            });
            console.log("编译完成后执行...")
        });
    }
    //文件上传至OSS
    putFile(file) {
        const { ossPath, buildPath } = this.config;
        try {
            var replacePath = buildPath;
            if (replacePath.lastIndexOf('/') === replacePath.length - 1) {
                replacePath = replacePath.slice(0, replacePath.length - 1);
            }
            if (replacePath.indexOf('./') > -1) {
                replacePath = replacePath.split('./')[1];
            }
            var ossfile = `${ossPath}${file.split(replacePath)[1]}`;
            // console.log(`本地文件[${file}]上传至OSS=>[${ossfile}]完成！`)
            let result = this.client.put(ossfile, file);
            const { name, url, res } = result;
            console.log(url || ossfile || file)
        } catch (e) {
            console.log(e);
        }
    }
    // 异步文件上传
    travelSync(dir, callback, finish) {
    	const _=this;
        fs.readdir(dir, function(e, files) {
            if (e === null) {
                // i 用于定位当前遍历位置
                (function next(i) {
                    // 当i >= files 表示已经遍历完成，进行遍历下一个文件夹
                    if (i < files.length) {
                        var pathname = path.join(dir, files[i]);
                        if (fs.stat(pathname, function(e, stats) {
                                if (stats.isDirectory()) {
                                    _.travelSync(pathname, callback, function() {
                                        next(i + 1);
                                    });
                                } else {
                                    pathname = pathname.replace(/\\/img, "/");
                                    callback(e, pathname, function() {
                                        next(i + 1);
                                    });
                                }
                            }));
                    } else {
                        /**
                         * 当 i >= files.length 时，即表示当前目录已经遍历完了， 需遍历下一个文件夹
                         * 这里执行的时递归调用 传入的 方法 ， 方法里调用了 next(i) 记录了当前遍历位置
                         */
                        finish && finish();
                    }
                })(0);
            } else {
                callback(e);
            }
        });
    }
}
module.exports = daoAliyunOssWebpackPlugin;