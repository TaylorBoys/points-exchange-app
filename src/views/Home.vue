<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { Coins, Gift, History, UserCircle, ChevronRight, ListTodo, Zap, Star, Trophy, Sparkles, Rocket, TrendingUp, Smile, Award, PartyPopper } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const user = computed(() => store.currentUser);
const gifts = computed(() => store.gifts);
const users = computed(() => store.users);

const navItems = [
  { name: '礼物兑换', icon: Gift, path: '/gifts', color: 'from-pink-500 to-purple-500' },
  { name: '任务中心', icon: ListTodo, path: '/tasks', color: 'from-blue-500 to-cyan-500' },
  { name: '历史记录', icon: History, path: '/history', color: 'from-green-500 to-emerald-500' },
];

function goToAdmin() {
  router.push('/admin');
}

function getGenderText(gender: string) {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '';
}

function getPointsLevel(points: number) {
  if (points >= 2000) return { level: '钻石会员', icon: Trophy, color: 'text-yellow-500' };
  if (points >= 1000) return { level: '黄金会员', icon: Star, color: 'text-yellow-400' };
  if (points >= 500) return { level: '白银会员', icon: Award, color: 'text-gray-400' };
  return { level: '新用户', icon: Smile, color: 'text-blue-400' };
}

function getWelcomeEmoji() {
  const emojis = ['🎈', '🎉', '🎊', '✨', '🌟', '🎁', '🎯', '🏆'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

const appVersion = 'v1.4.0';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <header class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Sparkles class="w-6 h-6" />
          <div class="text-xl font-bold">积分兑换</div>
        </div>
        <button 
          @click="goToAdmin"
          class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-all shadow-md"
        >
          管理后台
        </button>
      </div>
    </header>

    <div v-if="user" class="p-4">
      <div class="bg-white rounded-3xl shadow-xl p-6 mb-4 overflow-hidden relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-pink-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div class="relative z-10">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div v-if="user.avatar" class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-white">
                <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <UserCircle class="w-12 h-12 text-white" />
              </div>
              <div class="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
                <component :is="getPointsLevel(user.points).icon" class="w-4 h-4 text-yellow-800" />
              </div>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="text-xl font-bold text-gray-800">{{ user.name }}</h2>
                <span v-if="user.gender" class="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-medium">
                  {{ getGenderText(user.gender) }}
                </span>
              </div>
              <p class="text-gray-500 text-sm mb-1">{{ user.phone }}</p>
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <span v-if="user.className" class="bg-gray-100 px-2 py-0.5 rounded-full">{{ user.className }}</span>
                <span v-if="user.age" class="bg-gray-100 px-2 py-0.5 rounded-full">{{ user.age }}岁</span>
              </div>
              <div class="mt-2 flex items-center gap-1">
                <Trophy class="w-4 h-4" :class="getPointsLevel(user.points).color" />
                <span class="text-xs font-medium" :class="getPointsLevel(user.points).color">
                  {{ getPointsLevel(user.points).level }}
                </span>
              </div>
            </div>
            
            <div class="text-center">
              <div class="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-4 min-w-[100px]">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <Coins class="w-5 h-5 text-yellow-500" />
                  <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    {{ user.points }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-4">
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="router.push(item.path)"
          class="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group"
        >
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform" :class="item.color">
            <component :is="item.icon" class="w-6 h-6 text-white" />
          </div>
          <span class="text-sm font-semibold text-gray-700">{{ item.name }}</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">{{ gifts.length }}</p>
              <p class="text-sm opacity-90">礼物总数</p>
            </div>
            <Rocket class="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">{{ users.length }}</p>
              <p class="text-sm opacity-90">会员人数</p>
            </div>
            <TrendingUp class="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div class="p-5 border-b flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-2">
            <PartyPopper class="w-5 h-5 text-pink-500" />
            <h3 class="font-bold text-gray-800">热门礼物</h3>
          </div>
          <button @click="router.push('/gifts')" class="text-primary-600 text-sm flex items-center gap-1 font-medium hover:text-primary-700">
            查看全部 <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4 grid grid-cols-2 gap-4">
          <div 
            v-for="gift in gifts.slice(0, 2)" 
            :key="gift.id"
            class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
            @click="router.push('/gifts')"
          >
            <div class="relative">
              <img :src="gift.image" :alt="gift.name" class="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <Coins class="w-3 h-3 text-yellow-500" />
                <span class="text-xs font-bold text-gray-700">{{ gift.points }}</span>
              </div>
            </div>
            <div class="p-4 bg-white">
              <h4 class="font-bold text-gray-800">{{ gift.name }}</h4>
              <p class="text-xs text-gray-400 mt-1">{{ gift.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-4">
      <div class="text-center mb-6 pt-4">
        <div class="text-6xl mb-4">{{ getWelcomeEmoji() }}</div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          欢迎来到积分兑换！
        </h1>
        <p class="text-gray-500">选择你的身份开始攒积分吧</p>
      </div>

      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-8 text-center">
          <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserCircle class="w-14 h-14 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-1">选择用户</h2>
          <p class="text-white/80 text-sm">开始你的积分之旅</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 text-center border border-yellow-100">
              <Zap class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p class="text-xs text-yellow-600 font-medium">攒积分</p>
              <p class="text-2xl font-bold text-yellow-700">超简单</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
              <Gift class="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p class="text-xs text-purple-600 font-medium">换礼物</p>
              <p class="text-2xl font-bold text-purple-700">超开心</p>
            </div>
          </div>

          <button 
            @click="router.push('/users')"
            class="w-full py-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
          >
            <div class="flex items-center justify-center gap-2">
              <Sparkles class="w-5 h-5" />
              立即开始
              <Sparkles class="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      <div class="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
        <p class="text-gray-400 text-xs">积分多多，礼物多多！</p>
        <div class="flex justify-center gap-2 mt-2">
          <Star class="w-4 h-4 text-yellow-400" />
          <Star class="w-4 h-4 text-yellow-400" />
          <Star class="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    </div>

    <div class="p-4 text-center">
      <span class="text-xs text-gray-400">{{ appVersion }}</span>
    </div>
  </div>
</template>
