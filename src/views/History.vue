<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Gift, CheckCircle, XCircle } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const activeTab = ref<'points' | 'gifts'>('points');

const user = computed(() => store.currentUser);

const histories = computed(() => {
  if (!user.value) return [];
  return store.pointHistories.filter(h => h.userId === user.value!.id);
});

const userExchanges = computed(() => {
  if (!user.value) return [];
  return store.userExchanges(user.value.id);
});

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
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="flex items-center gap-3 p-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-6 h-6 text-gray-700" />
        </button>
        <h1 class="text-lg font-semibold text-gray-800">历史记录</h1>
      </div>
      
      <div class="flex border-t">
        <button
          @click="activeTab = 'points'"
          :class="[
            'flex-1 py-3 text-center font-medium transition-colors',
            activeTab === 'points'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          积分变动
        </button>
        <button
          @click="activeTab = 'gifts'"
          :class="[
            'flex-1 py-3 text-center font-medium transition-colors',
            activeTab === 'gifts'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          兑换记录
        </button>
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

      <div v-else-if="activeTab === 'points'" class="space-y-3">
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

      <div v-else class="space-y-3">
        <div
          v-for="exchange in userExchanges"
          :key="exchange.id"
          class="bg-white rounded-xl p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div 
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  exchange.status === 'approved' ? 'bg-green-100' :
                  exchange.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                ]"
              >
                <CheckCircle v-if="exchange.status === 'approved'" class="w-5 h-5 text-green-600" />
                <XCircle v-else-if="exchange.status === 'rejected'" class="w-5 h-5 text-red-600" />
                <Gift v-else class="w-5 h-5 text-yellow-600" />
              </div>
              <span 
                :class="[
                  'inline-block px-2 py-1 text-xs rounded-full',
                  exchange.status === 'approved' ? 'bg-green-100 text-green-700' :
                  exchange.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                ]"
              >
                {{ getStatusText(exchange.status) }}
              </span>
            </div>
            <span class="text-xs text-gray-400">{{ exchange.createdAt }}</span>
          </div>
          
          <div class="flex gap-4" v-if="getGiftById(exchange.giftId)">
            <img 
              :src="getGiftById(exchange.giftId)!.image" 
              :alt="getGiftById(exchange.giftId)!.name"
              class="w-16 h-16 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">{{ getGiftById(exchange.giftId)!.name }}</h4>
              <p class="text-sm text-gray-500">{{ getGiftById(exchange.giftId)!.description }}</p>
              <p class="text-sm text-primary-600 font-medium">
                消耗 {{ getGiftById(exchange.giftId)!.points }} 积分
              </p>
            </div>
          </div>
          
          <div v-if="exchange.approvedAt" class="mt-3 pt-3 border-t">
            <p class="text-xs text-gray-400">处理时间: {{ exchange.approvedAt }}</p>
          </div>
        </div>

        <div v-if="userExchanges.length === 0" class="bg-white rounded-xl p-8 text-center">
          <Gift class="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无兑换记录</p>
        </div>
      </div>
    </div>
  </div>
</template>
