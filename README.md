# SuperContent × Clipo

16:9 内容服务演示，包含真实作品视频、案例口径和交互目录。网页与素材均从仓库本地加载，无需安装依赖。

## 修改与构建

- 文案：`source/content.json`
- 已公开的作品信息：`source/media.json`
- 页面与交互：`source/shell.html`、`source/app.js`、`source/deck.js`
- 样式：`source/style.css`、`source/deck.css`
- 视频与图片：`assets/`

修改后，在仓库根目录执行（Node.js 18 或更新版本）：

```sh
node scripts/build.mjs
```

构建会检查公开内容及本地素材，并更新 `index.html` 和 `SuperContent.html`。更新媒体信息时，同时放入同名 MP4 与 JPG；页面使用相对路径，可部署到 GitHub Pages 的项目子目录。

## 本地预览

```sh
python3 -m http.server 8000
```

浏览器打开本机 8000 端口。方向键翻页，目录跳转；视频使用浏览器原生控件。

## GitHub Pages

把本目录内容提交到仓库的 `main` 分支。进入仓库 Settings → Pages，选择 Deploy from a branch，分支选 `main`，目录选 `/(root)`，保存并等待部署完成。后续修改源码、重新构建并提交，即可更新同一访问地址。

此仓库只包含公开页面源码及运行所需素材，不包含内部研究、来源链接或账号配置。
