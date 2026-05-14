#!/bin/bash
# 积分兑换 APP - macOS/Linux 一键构建脚本
# 请确保已安装：Node.js, JDK 17+, Android Studio

echo "===================================="
echo "积分兑换 APP - 构建脚本"
echo "===================================="
echo

# 检查 Node.js
echo "[1/5] 检查 Node.js..."
if ! command -v node &> /dev/null
then
    echo "错误：未找到 Node.js，请先安装 Node.js"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi
echo "Node.js 已安装: $(node --version)"

# 检查 Java
echo
echo "[2/5] 检查 Java..."
if ! command -v java &> /dev/null
then
    echo "错误：未找到 Java，请先安装 JDK 17+"
    echo "下载地址：https://adoptium.net/"
    exit 1
fi
echo "Java 已安装"

# 安装依赖
echo
echo "[3/5] 安装项目依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误：依赖安装失败"
    exit 1
fi

# 构建 Web 应用
echo
echo "[4/5] 构建 Web 应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "错误：Web 应用构建失败"
    exit 1
fi

# 同步到 Android
echo
echo "[5/5] 同步到 Android 项目..."
npx cap sync android

echo
echo "===================================="
echo "构建准备完成！"
echo "===================================="
echo
echo "下一步："
echo "1. 使用 Android Studio 打开项目中的 android 文件夹"
echo "2. 等待 Gradle 同步完成"
echo "3. 点击菜单：Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo
echo "APK 将生成在：android/app/build/outputs/apk/debug/app-debug.apk"
echo
