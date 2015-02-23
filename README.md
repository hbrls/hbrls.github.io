# http://lisite.de

### 给 GitHub Pages 自定义域名

1. 在 [NameCheap](https://www.namecheap.com/) 注册域名 `lisite.de`；在 [DigitalOcean](https://www.digitalocean.com/) 购买 `VPS`；使用 DigitalOcean 的 `name server`，因为德国域名有相应的限制（略）
2. 在 DigitalOcean 的 `DNS` 将 `A Record` 指向 `GitHub` 提供的 `IP`：`192.30.252.153`。参考 [Tips for configuring an A record with your DNS provider](https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider/)
3. 在 DigitalOcean 的 `DNS` 为 `www` 子域名设置 `CNAME`，最终结果类似这样：

        A        @      192.30.252.153
        CNAME    www    lisite.de.

4. 在 GitHub 建立名为 `hbrls.github.io` 的静态网站项目，添加一个名为 `CNAME` 的文件，里面只有一行，`lisite.de`，参考 [Adding a CNAME file to your repository](https://help.github.com/articles/adding-a-cname-file-to-your-repository/)
5. 等待一切生效

### 最终效果（仅推理，无技术参考意义）

1. 在浏览器输入 `hbrls.github.io`，`GitHub` 的`服务器`发现该项目有一个名为 `CNAME` 的文件，于是按照文件内容跳转至 `lisite.de`
2. 由于 `lisite.de` 的 `A Record` 被定位到了 `GitHub` 提供的 `IP`，该 `IP` 对应的`服务器`，由于是从 `A Record` 定向过来的，所以不会再去重复步骤 1，直接按 `GitHub Pages` 的原生规则返回 `hbrls.github.io` 项目提供的静态网站
3. 在浏览器输入 `lisite.de` 直接走步骤 2
4. 在浏览器输入 `www.lisite.de`，由于设置了 `CNAME`，走得是类似步骤 2 的流程
5. 参考 [How GitHub Pages sites use custom domains](https://help.github.com/articles/about-custom-domains-for-github-pages-sites/#how-github-pages-sites-use-custom-domains)
