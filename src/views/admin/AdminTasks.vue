<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { LogOut, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, ListTodo, Star } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const showModal = ref(false);
const editingTask = ref<typeof store.tasks[0] | null>(null);
const taskForm = ref({
  name: '',
  description: '',
  points: 0,
});

const tasks = computed(() => store.tasks);
const pendingCompletions = computed(() => store.pendingTaskCompletions);

function getTaskById(taskId: string) {
  return store.tasks.find(t => t.id === taskId);
}

function getUserById(userId: string) {
  return store.users.find(u => u.id === userId);
}

function openAddModal() {
  editingTask.value = null;
  taskForm.value = { name: '', description: '', points: 0 };
  showModal.value = true;
}

function openEditModal(task: typeof store.tasks[0]) {
  editingTask.value = task;
  taskForm.value = {
    name: task.name,
    description: task.description,
    points: task.points,
  };
  showModal.value = true;
}

function saveTask() {
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, taskForm.value);
  } else {
    store.addTask(taskForm.value);
  }
  showModal.value = false;
}

function deleteTask(taskId: string) {
  if (confirm('确定要删除这个任务吗？')) {
    store.deleteTask(taskId);
  }
}

function approveCompletion(completionId: string, approve: boolean) {
  store.approveTaskCompletion(completionId, approve);
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
          <p class="text-sm text-gray-500">任务管理</p>
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
          @click="router.push('/admin/exchanges')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          兑换管理
        </button>
        <button 
          class="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600"
        >
          任务管理
        </button>
      </div>
    </nav>

    <div class="p-4">
      <div v-if="pendingCompletions.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock class="w-5 h-5 text-yellow-500" />
          待审核任务完成 ({{ pendingCompletions.length }})
        </h2>
        <div class="space-y-3">
          <div
            v-for="completion in pendingCompletions"
            :key="completion.id"
            class="bg-white rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <ListTodo class="w-5 h-5 text-yellow-500" />
                <span class="font-medium text-gray-800">{{ getTaskById(completion.taskId)?.name }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ completion.createdAt }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ getUserById(completion.userId)?.name }}</p>
                <p class="text-sm text-primary-600 font-medium flex items-center gap-1">
                  <Star class="w-4 h-4" />
                  +{{ getTaskById(completion.taskId)?.points }} 积分
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="approveCompletion(completion.id, true)"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <CheckCircle class="w-4 h-4" />
                  批准
                </button>
                <button
                  @click="approveCompletion(completion.id, false)"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <XCircle class="w-4 h-4" />
                  拒绝
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">任务列表</h2>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus class="w-4 h-4" />
          添加任务
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="bg-white rounded-xl p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ task.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  <Star class="w-3 h-3" />
                  {{ task.points }} 积分
                </span>
                <span class="text-xs text-gray-400">创建于 {{ task.createdAt }}</span>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="openEditModal(task)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="deleteTask(task.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="tasks.length === 0" class="bg-white rounded-xl p-8 text-center">
          <ListTodo class="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无任务</p>
          <button
            @click="openAddModal"
            class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            添加第一个任务
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ editingTask ? '编辑任务' : '添加任务' }}
          </h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务名称</label>
            <input
              v-model="taskForm.name"
              placeholder="例如：按时完成作业"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">任务描述</label>
            <textarea
              v-model="taskForm.description"
              placeholder="描述任务的完成条件"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">奖励积分</label>
            <input
              v-model.number="taskForm.points"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
            @click="saveTask"
            :disabled="!taskForm.name || taskForm.points <= 0"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
