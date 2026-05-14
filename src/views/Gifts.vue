<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, Coins, ShoppingCart, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const showModal = ref(false);
const selectedGift = ref<typeof store.gifts[0] | null>(null);

const gifts = computed(() => store.gifts);
const user = computed(() => store.currentUser);

function canExchange(gift: typeof store.gifts[0]) {
  return user.value && user.value.points >= gift.points && gift.stock > 0;
}

function openExchangeModal(gift: typeof store.gifts[0]) {
  selectedGift.value = gift;
  showModal.value = true;
}

function confirmExchange() {
  if (selectedGift.value && user.value) {
    const success = store.createExchange(user.value.id, selectedGift.value.id);
    if (success) {
      alert('兑换申请已提交，等待管理员审核');
      showModal.value = false;
      selectedGift.value = null;
    } else {
      alert('兑换失败，请检查积分和库存');
    }
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
        <h1 class="text-lg font-semibold text-gray-800">礼物兑换</h1>
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

      <div v-if="user" class="bg-primary-50 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p class="text-sm text-primary-600">当前可用积分</p>
          <p class="text-2xl font-bold text-primary-700">{{ user.points }}</p>
        </div>
        <Coins class="w-12 h-12 text-primary-400" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          <img :src="gift.image" :alt="gift.name" class="w-full h-32 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold text-gray-800">{{ gift.name }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ gift.description }}</p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center gap-1">
                <Coins class="w-4 h-4 text-yellow-500" />
                <span class="text-primary-600 font-bold">{{ gift.points }}</span>
              </div>
              <span class="text-xs text-gray-400">库存 {{ gift.stock }}</span>
            </div>
            <button
              @click="openExchangeModal(gift)"
              :disabled="!canExchange(gift)"
              :class="[
                'w-full mt-3 py-2 rounded-lg font-medium transition-colors',
                canExchange(gift) 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              {{ canExchange(gift) ? '立即兑换' : (gift.stock <= 0 ? '已售罄' : '积分不足') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="gifts.length === 0" class="bg-white rounded-xl p-8 text-center">
        <ShoppingCart class="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">暂无礼物</p>
      </div>
    </div>

    <div 
      v-if="showModal && selectedGift" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-800">确认兑换</h3>
        </div>
        <div class="p-4">
          <div class="flex gap-4">
            <img :src="selectedGift.image" :alt="selectedGift.name" class="w-20 h-20 rounded-lg object-cover" />
            <div>
              <h4 class="font-semibold text-gray-800">{{ selectedGift.name }}</h4>
              <div class="flex items-center gap-1 mt-1">
                <Coins class="w-4 h-4 text-yellow-500" />
                <span class="text-primary-600 font-bold">{{ selectedGift.points }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-1">库存: {{ selectedGift.stock }}</p>
            </div>
          </div>
          <div v-if="user" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">当前积分</span>
              <span class="font-medium">{{ user.points }}</span>
            </div>
            <div class="flex justify-between text-sm mt-2">
              <span class="text-gray-600">兑换扣除</span>
              <span class="text-red-500 font-medium">-{{ selectedGift.points }}</span>
            </div>
            <div class="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>剩余积分</span>
              <span>{{ user.points - selectedGift.points }}</span>
            </div>
          </div>
        </div>
        <div class="p-4 border-t flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmExchange"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            确认兑换
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
