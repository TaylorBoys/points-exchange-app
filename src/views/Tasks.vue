<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { ArrowLeft, Coins, ListTodo, CheckCircle, AlertCircle, Star } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const user = computed(() => store.currentUser);
const tasks = computed(() => store.tasks);

const userTaskCompletions = computed(() => {
  if (!user.value) return [];
  return store.userTaskCompletions(user.value.id);
});

function getTaskById(taskId: string) {
  return store.tasks.find(t => t.id === taskId);
}

function isTaskCompleted(taskId: string) {
  return userTaskCompletions.value.some(
    tc => tc.taskId === taskId && tc.status !== 'rejected'
  );
}

function canCompleteTask(taskId: string) {
  return !userTaskCompletions.value.some(
    tc => tc.taskId === taskId && tc.status === 'pending'
  );
}

function completeTask(taskId: string) {
  if (user.value && canCompleteTask(taskId)) {
    const success = store.completeTask(user.value.id, taskId);
    if (success) {
      alert('任务完成申请已提交，等待管理员审核！');
    } else {
      alert('提交失败，请稍后重试');
    }
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return '待审核';
    case 'approved': return '已获得积分';
    case 'rejected': return '未通过';
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
        <h1 class="text-lg font-semibold text-gray-800">任务中心</h1>
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

      <div v-else class="space-y-4">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">我的积分</p>
              <p class="text-3xl font-bold">{{ user.points }}</p>
            </div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Coins class="w-8 h-8" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4">
          <h2 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ListTodo class="w-5 h-5 text-primary-600" />
            可完成任务
          </h2>
          <div class="space-y-3">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="border border-gray-200 rounded-xl p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-800">{{ task.name }}</h3>
                    <span v-if="isTaskCompleted(task.id)" class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      已完成
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      <Star class="w-3 h-3" />
                      {{ task.points }} 积分
                    </span>
                  </div>
                </div>
                <button
                  v-if="!isTaskCompleted(task.id)"
                  @click="completeTask(task.id)"
                  :disabled="!canCompleteTask(task.id)"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                    canCompleteTask(task.id)
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  {{ canCompleteTask(task.id) ? '提交完成' : '等待审核' }}
                </button>
                <div v-else class="text-green-600 flex items-center gap-1 text-sm">
                  <CheckCircle class="w-4 h-4" />
                  {{ getStatusText(userTaskCompletions.find(tc => tc.taskId === task.id)?.status || '') }}
                </div>
              </div>
            </div>

            <div v-if="tasks.length === 0" class="text-center py-8">
              <ListTodo class="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">暂无任务</p>
            </div>
          </div>
        </div>

        <div v-if="userTaskCompletions.length > 0" class="bg-white rounded-xl p-4">
          <h2 class="font-semibold text-gray-800 mb-3">我的任务记录</h2>
          <div class="space-y-2">
            <div
              v-for="completion in userTaskCompletions"
              :key="completion.id"
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p class="font-medium text-gray-800">{{ getTaskById(completion.taskId)?.name }}</p>
                <p class="text-xs text-gray-400">{{ completion.createdAt }}</p>
              </div>
              <span 
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  completion.status === 'approved' ? 'bg-green-100 text-green-700' :
                  completion.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                ]"
              >
                {{ getStatusText(completion.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
