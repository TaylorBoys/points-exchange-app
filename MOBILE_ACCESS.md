# 积分兑换 App - 手机端访问解决方案

## 问题说明

当前开发环境运行在**云端服务器**上，因此局域网IP（如 http://10.x.x.x）无法访问。

## 推荐方案：使用内网穿透工具

让我为您启动内网穿透工具，创建公共访问地址：

### 方案一：LocalTunnel（推荐，简单快速）

运行以下命令：
```bash
npx localtunnel --port 4173
```

成功后会显示类似这样的地址：
```
your tunnel is at https://xxxxx.loca.lt
```

然后在手机浏览器中访问这个地址即可。

### 方案二：Cloudflare Tunnel（更稳定）

运行以下命令：
```bash
npx cloudflared tunnel --url http://localhost:4173
```

成功后会显示类似这样的地址：
```
your tunnel URL is: https://xxxx.trycloudflare.com
```

## 临时解决方案：部署到免费平台

### 步骤1：使用 GitHub + Vercel（推荐）

1. **创建 GitHub 仓库**
   - 访问 https://github.com
   - 创建新仓库，命名为 `points-exchange-app`

2. **上传代码**
   - 将项目代码上传到仓库

3. **部署到 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录
   - 点击 "Add New Project"
   - 选择您的仓库
   - 点击 "Deploy"
   - 等待几秒钟，会获得一个永久访问地址（如：`https://your-app.vercel.app`）

4. **在手机访问**
   - 直接访问 Vercel 提供的地址即可

### 步骤2：使用 Netlify（备选方案）

1. 访问 https://netlify.com
2. 使用 GitHub 登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择您的 GitHub 仓库
5. 部署后获得永久地址

## 立即测试

让我现在为您启动 localtunnel：

```bash
cd /workspace
npx localtunnel --port 4173
```

启动后，我会为您提供可以访问的公共地址。
