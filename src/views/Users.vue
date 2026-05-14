<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, UserCircle, Check } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

function selectUser(user: typeof store.users[0]) {
  store.login(user);
  router.push('/');
}

function getGenderText(gender: string) {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '';
}

function getGenderClass(gender: string) {
  if (gender === 'male') return 'bg-blue-100 text-blue-700';
  if (gender === 'female') return 'bg-pink-100 text-pink-700';
  return '';
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="flex items-center gap-3 p-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-6 h-6 text-gray-700" />
        </button>
        <h1 class="text-lg font-semibold text-gray-800">选择用户</h1>
      </div>
    </header>

    <div class="p-4">
      <div class="space-y-3">
        <div
          v-for="user in store.users"
          :key="user.id"
          @click="selectUser(user)"
          class="bg-white rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div v-if="user.avatar" class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCircle class="w-8 h-8 text-primary-600" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-gray-800">{{ user.name }}</h3>
              <span v-if="user.gender" :class="['px-2 py-0.5 text-xs rounded-full', getGenderClass(user.gender)]">
                {{ getGenderText(user.gender) }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ user.phone }}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span v-if="user.className">{{ user.className }}</span>
              <span v-if="user.age">{{ user.age }}岁</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-primary-600">{{ user.points }}</p>
            <p class="text-xs text-gray-500">积分</p>
          </div>
          <Check v-if="store.currentUser?.id === user.id" class="w-5 h-5 text-green-500" />
        </div>
      </div>

      <div v-if="store.users.length === 0" class="bg-white rounded-xl p-8 text-center">
        <UserCircle class="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">暂无用户，请联系管理员添加</p>
      </div>
    </div>
  </div>
</template>
