<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const password = ref('');
const showPassword = ref(false);
const error = ref('');

function login() {
  if (store.loginAsAdmin(password.value)) {
    router.push('/admin/stats');
  } else {
    error.value = '密码错误，请重试';
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <button 
        @click="router.push('/')"
        class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft class="w-5 h-5" />
        <span>返回首页</span>
      </button>

      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock class="w-8 h-8 text-primary-600" />
        </div>
        <h1 class="text-xl font-bold text-gray-800">管理员登录</h1>
        <p class="text-gray-500 text-sm mt-1">请输入管理员密码</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @keyup.enter="login"
          />
          <button
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Eye v-if="showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>

      <button
        @click="login"
        class="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
      >
        登录
      </button>

      <p class="text-center text-gray-400 text-xs mt-4">
        默认密码: admin123
      </p>
    </div>
  </div>
</template>
