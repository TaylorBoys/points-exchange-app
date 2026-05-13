# 积分兑换 APP - 构建说明

## 前置要求

### 1. 安装 Node.js (v18+)
- 官网: https://nodejs.org/
- 推荐使用 v20 LTS 版本

### 2. 安装 Java JDK (JDK 17+)
- 官网: https://adoptium.net/
- 或通过 Homebrew: `brew install openjdk@17`

### 3. 安装 Android Studio
- 官网: https://developer.android.com/studio
- 安装后会自动配置 Android SDK

## 构建步骤

### 第一步：安装依赖
```bash
cd /path/to/project
npm install
```

### 第二步：构建 Web 应用
```bash
npm run build
```

### 第三步：添加 Android 平台（如尚未添加）
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
```

### 第四步：同步到 Android 项目
```bash
npx cap sync android
```

### 第五步：使用 Android Studio 构建 APK
1. 打开 Android Studio
2. 选择 "Open an existing project"
3. 选择项目中的 `android` 文件夹
4. 等待 Gradle 同步完成
5. 点击菜单: Build > Build Bundle(s) / APK(s) > Build APK(s)
6. APK 文件将生成在: `android/app/build/outputs/apk/debug/app-debug.apk`

### 或者使用命令行构建
```bash
cd android
./gradlew assembleDebug  # Linux/Mac
gradlew.bat assembleDebug  # Windows
```

APK 输出位置: `android/app/build/outputs/apk/debug/app-debug.apk`

## 安装 APK 到手机

### 方法一：通过 USB 安装
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 方法二：直接传输
1. 将 APK 文件复制到手机
2. 在手机上打开 APK 文件
3. 允许安装未知来源应用
4. 安装完成

## 应用功能

### 用户端
- 用户登录/切换
- 查看积分余额
- 浏览礼物列表
- 申请兑换礼物
- 查看积分历史

### 管理端
- 管理员登录（密码: admin123）
- 用户管理（增删改、调整积分）
- 礼物管理（增删改、上传图片）
- 兑换管理（审批/拒绝）

## 注意事项

1. **首次安装**：手机需要允许"安装未知来源应用"
2. **数据存储**：应用数据存储在本地 LocalStorage
3. **图片上传**：支持 JPG/PNG 格式
4. **管理员密码**：默认密码是 `admin123`
