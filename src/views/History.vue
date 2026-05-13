<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const user = computed(() => store.currentUser);

const histories = computed(() => {
  if (!user.value) return [];
  return store.pointHistories.filter(h => h.userId === user.value!.id);
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="flex items-center gap-3 p-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-6 h-6 text-gray-700" />
        </button>
        <h1 class="text-lg font-semibold text-gray-800">积分历史</h1>
      </div>
    </header>

    <div class="p-4">
      <div v-if="!user" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <div class="flex items-center gap-2 text-yellow-700">
          <AlertCircle class="w-5 h-5" />
          <span>请先选择用户登录</span>
        </div>
        <button 
          @click="router.push('/users')"
          class="mt-2 text-primary-600 text-sm font-medium"
        >
          立即登录
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="history in histories"
          :key="history.id"
          class="bg-white rounded-xl p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                history.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
              ]"
            >
              <TrendingUp v-if="history.type === 'earn'" class="w-5 h-5 text-green-600" />
              <TrendingDown v-else class="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ history.reason }}</p>
              <p class="text-sm text-gray-500">{{ history.createdAt }}</p>
            </div>
          </div>
          <div :class="['font-bold', history.type === 'earn' ? 'text-green-600' : 'text-red-600']">
            {{ history.type === 'earn' ? '+' : '-' }}{{ history.amount }}
          </div>
        </div>

        <div v-if="histories.length === 0" class="bg-white rounded-xl p-8 text-center">
          <TrendingUp class="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无积分记录</p>
        </div>
      </div>
    </div>
  </div>
</template>
