# mmPlayer
## FORK
`https://github.com/maomao1996/Vue-mmPlayer`
修改版本

## 免责声明

本站音频文件来自各网站接口，本站不会修改任何音频文件

音频版权来自各网站，本站只提供数据查询服务，不提供任何音频存储和贩卖服务

本项目仅为前端练手项目，请勿用作商业用途，请勿通过本项目下载盗版歌曲资源，否则后果自负！

## 安装与使用

### 检查 node 版本

```sh
# 查看 node 版本，确保 node 版本高于 12 版本
node -v
```

[Node.js 中文网](http://nodejs.cn/)

### mmPlayer

```sh
# 下载 mmPlayer
git clone https://github.com/maomao1996/Vue-mmPlayer.git

# 进入 mmPlayer 播放器目录
cd Vue-mmPlayer

# 安装依赖 推荐使用 yarn
npm install

# 本地运行 mmPlayer
npm run serve

# 编译打包
npm run build
```

### 后台 api 服务（本地开发）
[网易云音乐 GO 版 API](https://github.com/aifece/NeteaseCloudMusicGoApi)

### 注意点

**运行 mmPlayer 后无法获取音乐请检查后台 `api` 服务是否启动(即控制台请求报 404)**

**线上部署不是直接将整个项目丢到服务器，再去运行 `npm run serve` 命令**

**项目打包前 `VUE_APP_BASE_API_URL` 必须改后台 `api` 服务地址为线上地址，不能是本地地址**

### 关于项目线上部署

最近有不少小伙伴部署出了问题，我在这说明下

- 后台 `api` 服务线上部署

  - 你需要将 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi) 下载
  - 然后将下载的文件上传至服务器
  - 再通过 `pm2` 去启动服务(`pm2` 安装和相关命令网上有很多，这里不再赘述)
  - 最后通过服务器 `ip` + 端口号访问验证 `api` 服务是否启动成功

- `mmPlayer` 线上部署

  - 首先要注意的是
  - 先将 `.env` 文件的 `VUE_APP_BASE_API_URL` 修改成上一步启动的后台 `api` 服务地址(服务器 `ip` + 端口号或者你绑定的域名)
  - 然后先在本地运行 `npm run build` 命令，会打包在生成一个 `dist` 文件
  - 最后将打包的 `dist` 文件上传到你的网站服务器目录即可

- 其他：[在宝塔面板部署 mmPlayer](https://github.com/maomao1996/Blog/issues/1)（不喜欢写文，可能有点烂不要介意哈）
- 最后：本人已和谷歌、百度达成合作了，如果还有啥不懂的，以后可以直接谷歌、百度

## 技术栈

- [Vue Cli（Vue 脚手架工具）](https://cli.vuejs.org/zh/)
- [Vue（核心框架）](https://cn.vuejs.org/)
- [Vue Router（页面路由）](https://router.vuejs.org/zh/)
- [Vuex（状态管理）](https://vuex.vuejs.org/zh/)
- ES 6 / 7 （JavaScript 语言的下一代标准）
- Less（CSS 预处理器）
- Axios（网络请求）
- FastClick（解决移动端 300ms 点击延迟）

## 功能

- 播放器
- 快捷键操作
- 歌词滚动
- 正在播放
- Ta在听的
- Ta最近一周播放
- 歌单详情
- 搜索
- 播放历史
- 查看评论
