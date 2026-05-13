<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { Plus, Edit, Trash2, Coins, LogOut, UserCircle, X } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const showPointsModal = ref(false);

const newUser = ref({ name: '', phone: '', points: 0 });
const editingUser = ref<typeof store.users[0] | null>(null);
const pointsForm = ref({ userId: '', amount: 0, reason: '' });

const users = computed(() => store.users);

function addUser() {
  if (!newUser.value.name || !newUser.value.phone) {
    alert('请填写完整信息');
    return;
  }
  store.addUser({
    name: newUser.value.name,
    phone: newUser.value.phone,
    points: newUser.value.points || 0,
  });
  showAddModal.value = false;
  newUser.value = { name: '', phone: '', points: 0 };
}

function openEditModal(user: typeof store.users[0]) {
  editingUser.value = { ...user };
  showEditModal.value = true;
}

function updateUser() {
  if (!editingUser.value) return;
  store.updateUser(editingUser.value.id, editingUser.value);
  showEditModal.value = false;
  editingUser.value = null;
}

function deleteUser(userId: string) {
  if (confirm('确定要删除这个用户吗？')) {
    store.deleteUser(userId);
  }
}

function openPointsModal(userId: string) {
  pointsForm.value = { userId, amount: 0, reason: '' };
  showPointsModal.value = true;
}

function updatePoints() {
  if (!pointsForm.value.amount || !pointsForm.value.reason) {
    alert('请填写完整信息');
    return;
  }
  store.updateUserPoints(pointsForm.value.userId, pointsForm.value.amount, pointsForm.value.reason);
  showPointsModal.value = false;
  pointsForm.value = { userId: '', amount: 0, reason: '' };
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
          <p class="text-sm text-gray-500">用户管理</p>
        </div>
        <button @click="logout" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>

    <nav class="bg-white border-b">
      <div class="flex">
        <button 
          class="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600"
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
      </div>
    </nav>

    <div class="p-4">
      <button
        @click="showAddModal = true"
        class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors mb-4"
      >
        <Plus class="w-5 h-5" />
        添加用户
      </button>

      <div class="space-y-3">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white rounded-xl p-4 flex items-center gap-4"
        >
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCircle class="w-7 h-7 text-primary-600" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ user.name }}</h3>
            <p class="text-sm text-gray-500">{{ user.phone }}</p>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1 text-primary-600 font-bold">
              <Coins class="w-4 h-4" />
              {{ user.points }}
            </div>
            <p class="text-xs text-gray-400">积分</p>
          </div>
          <div class="flex flex-col gap-2">
            <button
              @click="openEditModal(user)"
              class="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <Edit class="w-4 h-4" />
            </button>
            <button
              @click="openPointsModal(user.id)"
              class="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Coins class="w-4 h-4" />
            </button>
            <button
              @click="deleteUser(user.id)"
              class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="users.length === 0" class="bg-white rounded-xl p-8 text-center">
          <UserCircle class="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无用户</p>
        </div>
      </div>
    </div>

    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">添加用户</h3>
          <button @click="showAddModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              v-model="newUser.name"
              type="text"
              placeholder="请输入姓名"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input
              v-model="newUser.phone"
              type="tel"
              placeholder="请输入手机号"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">初始积分</label>
            <input
              v-model.number="newUser.points"
              type="number"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div class="p-4 border-t flex gap-3">
          <button
            @click="showAddModal = false"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="addUser"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="showEditModal && editingUser" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">编辑用户</h3>
          <button @click="showEditModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              v-model="editingUser.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input
              v-model="editingUser.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div class="p-4 border-t flex gap-3">
          <button
            @click="showEditModal = false"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="updateUser"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="showPointsModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">调整积分</h3>
          <button @click="showPointsModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">调整金额</label>
            <div class="flex gap-2">
              <button
                @click="pointsForm.amount = Math.abs(pointsForm.amount)"
                :class="['px-4 py-2 rounded-lg font-semibold transition-colors', pointsForm.amount > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600']"
              >
                +
              </button>
              <button
                @click="pointsForm.amount = -Math.abs(pointsForm.amount)"
                :class="['px-4 py-2 rounded-lg font-semibold transition-colors', pointsForm.amount < 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600']"
              >
                -
              </button>
              <input
                v-model.number="pointsForm.amount"
                type="number"
                placeholder="输入积分数量"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">变动原因</label>
            <input
              v-model="pointsForm.reason"
              type="text"
              placeholder="请输入变动原因"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div class="p-4 border-t flex gap-3">
          <button
            @click="showPointsModal = false"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="updatePoints"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
