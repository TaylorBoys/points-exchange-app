<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { Coins, Gift, History, UserCircle, ChevronRight, ListTodo } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const user = computed(() => store.currentUser);
const gifts = computed(() => store.gifts);

const navItems = [
  { name: '礼物兑换', icon: Gift, path: '/gifts' },
  { name: '任务中心', icon: ListTodo, path: '/tasks' },
  { name: '历史记录', icon: History, path: '/history' },
];

function goToAdmin() {
  router.push('/admin');
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-primary-600 text-white p-4">
      <div class="flex items-center justify-between">
        <div class="text-xl font-bold">积分兑换</div>
        <button 
          @click="goToAdmin"
          class="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
        >
          管理后台
        </button>
      </div>
    </header>

    <div v-if="user" class="p-4">
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircle class="w-10 h-10 text-primary-600" />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-800">{{ user.name }}</h2>
            <p class="text-gray-500 text-sm">{{ user.phone }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary-600">{{ user.points }}</p>
            <p class="text-sm text-gray-500">积分</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-4">
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="router.push(item.path)"
          class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <component :is="item.icon" class="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <span class="text-sm text-gray-700">{{ item.name }}</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">热门礼物</h3>
          <button @click="router.push('/gifts')" class="text-primary-600 text-sm flex items-center gap-1">
            查看全部 <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4 grid grid-cols-2 gap-4">
          <div 
            v-for="gift in gifts.slice(0, 2)" 
            :key="gift.id"
            class="bg-gray-50 rounded-xl overflow-hidden"
          >
            <img :src="gift.image" :alt="gift.name" class="w-full h-24 object-cover" />
            <div class="p-3">
              <h4 class="font-medium text-gray-800">{{ gift.name }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <Coins class="w-4 h-4 text-yellow-500" />
                <span class="text-primary-600 font-semibold">{{ gift.points }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-4">
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <UserCircle class="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-800 mb-2">请选择用户登录</h2>
        <button 
          @click="router.push('/users')"
          class="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          选择用户
        </button>
      </div>
    </div>
  </div>
</template>
