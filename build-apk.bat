@echo off
echo ========================================
echo   积分兑换App - Android构建脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 正在安装依赖...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)

echo.
echo [2/4] 正在构建Web应用...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Web应用构建失败！
    pause
    exit /b 1
)

echo.
echo [3/4] 正在同步到Android项目...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Android同步失败！
    pause
    exit /b 1
)

echo.
echo [4/4] 正在构建APK...
cd android
call gradlew assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo ❌ APK构建失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 构建成功！
echo ========================================
echo.
echo APK文件位置：
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 您可以将APK文件：
echo 1. 复制到手机直接安装
echo 2. 上传到蒲公英/fir.im等平台分发
echo 3. 提交到应用商店
echo.
pause
