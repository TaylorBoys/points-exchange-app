<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { LogOut, CheckCircle, XCircle, Clock } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const exchanges = computed(() => store.exchanges);
const pendingExchanges = computed(() => store.pendingExchanges);

function getUserById(userId: string) {
  return store.users.find(u => u.id === userId);
}

function getGiftById(giftId: string) {
  return store.gifts.find(g => g.id === giftId);
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return '待审核';
    case 'approved': return '已批准';
    case 'rejected': return '已拒绝';
    default: return status;
  }
}

function approveExchange(exchangeId: string, approve: boolean) {
  store.approveExchange(exchangeId, approve);
}

function logout() {
  store.logout();
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="flex items-center justify-between p-4">
        <div>
          <h1 class="text-lg font-semibold text-gray-800">管理后台</h1>
          <p class="text-sm text-gray-500">兑换管理</p>
        </div>
        <button @click="logout" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>

    <nav class="bg-white border-b">
      <div class="flex">
        <button 
          @click="router.push('/admin/users')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          用户管理
        </button>
        <button 
          @click="router.push('/admin/gifts')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          礼物管理
        </button>
        <button 
          class="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600"
        >
          兑换管理
        </button>
        <button 
          @click="router.push('/admin/tasks')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          任务管理
        </button>
        <button 
          @click="router.push('/admin/stats')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          数据统计
        </button>
      </div>
    </nav>

    <div class="p-4">
      <div v-if="pendingExchanges.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock class="w-5 h-5 text-yellow-500" />
          待处理申请 ({{ pendingExchanges.length }})
        </h2>
        <div class="space-y-3">
          <div
            v-for="exchange in pendingExchanges"
            :key="exchange.id"
            class="bg-white rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  待审核
                </span>
              </div>
              <span class="text-xs text-gray-400">{{ exchange.createdAt }}</span>
            </div>
            <div class="flex gap-4">
              <img 
                :src="getGiftById(exchange.giftId)?.image" 
                :alt="getGiftById(exchange.giftId)?.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800">{{ getGiftById(exchange.giftId)?.name }}</h4>
                <p class="text-sm text-gray-500">{{ getUserById(exchange.userId)?.name }}</p>
                <p class="text-sm text-primary-600 font-medium">
                  消耗 {{ getGiftById(exchange.giftId)?.points }} 积分
                </p>
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button
                @click="approveExchange(exchange.id, true)"
                class="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle class="w-4 h-4" />
                批准
              </button>
              <button
                @click="approveExchange(exchange.id, false)"
                class="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle class="w-4 h-4" />
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-3">兑换历史</h2>
        <div class="space-y-3">
          <div
            v-for="exchange in exchanges.filter(e => e.status !== 'pending')"
            :key="exchange.id"
            class="bg-white rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <span 
                  :class="[
                    'inline-block px-2 py-1 text-xs rounded-full',
                    exchange.status === 'approved' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ getStatusText(exchange.status) }}
                </span>
              </div>
              <span class="text-xs text-gray-400">{{ exchange.createdAt }}</span>
            </div>
            <div class="flex gap-4">
              <img 
                :src="getGiftById(exchange.giftId)?.image" 
                :alt="getGiftById(exchange.giftId)?.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800">{{ getGiftById(exchange.giftId)?.name }}</h4>
                <p class="text-sm text-gray-500">{{ getUserById(exchange.userId)?.name }}</p>
                <p class="text-sm text-primary-600 font-medium">
                  消耗 {{ getGiftById(exchange.giftId)?.points }} 积分
                </p>
              </div>
            </div>
            <div v-if="exchange.approvedAt" class="mt-3 pt-3 border-t">
              <p class="text-xs text-gray-400">处理时间: {{ exchange.approvedAt }}</p>
            </div>
          </div>

          <div v-if="exchanges.length === 0" class="bg-white rounded-xl p-8 text-center">
            <CheckCircle class="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">暂无兑换记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
