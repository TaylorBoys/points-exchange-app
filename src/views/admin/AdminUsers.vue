<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { Plus, Edit, Trash2, Coins, LogOut, UserCircle, X, Upload, Camera } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const showPointsModal = ref(false);

const newUser = ref({
  name: '',
  phone: '',
  points: 0,
  avatar: '',
  gender: '' as 'male' | 'female' | '',
  className: '',
  age: 0
});

const editingUser = ref<typeof store.users[0] | null>(null);
const pointsForm = ref({ userId: '', amount: 0, reason: '' });

const users = computed(() => store.users);

function handleAvatarUpload(event: Event, isNew: boolean = true) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (isNew) {
        newUser.value.avatar = base64;
      } else if (editingUser.value) {
        editingUser.value.avatar = base64;
      }
    };
    reader.readAsDataURL(file);
  }
}

function addUser() {
  if (!newUser.value.name || !newUser.value.phone) {
    alert('请填写完整信息');
    return;
  }
  store.addUser({
    name: newUser.value.name,
    phone: newUser.value.phone,
    points: newUser.value.points || 0,
    avatar: newUser.value.avatar,
    gender: newUser.value.gender,
    className: newUser.value.className,
    age: newUser.value.age || undefined,
  });
  showAddModal.value = false;
  newUser.value = {
    name: '',
    phone: '',
    points: 0,
    avatar: '',
    gender: '',
    className: '',
    age: 0
  };
}

function openEditModal(user: typeof store.users[0]) {
  editingUser.value = { ...user };
  showEditModal.value = true;
}

function updateUser() {
  if (!editingUser.value) return;
  store.updateUser(editingUser.value.id, {
    name: editingUser.value.name,
    phone: editingUser.value.phone,
    avatar: editingUser.value.avatar,
    gender: editingUser.value.gender,
    className: editingUser.value.className,
    age: editingUser.value.age,
  });
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
  if (!pointsForm.value.reason || pointsForm.value.amount === 0) {
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

function getGenderText(gender: string) {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未设置';
}

function getGenderClass(gender: string) {
  if (gender === 'male') return 'bg-blue-100 text-blue-700';
  if (gender === 'female') return 'bg-pink-100 text-pink-700';
  return 'bg-gray-100 text-gray-600';
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
          <div v-if="user.avatar" class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCircle class="w-10 h-10 text-primary-600" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-gray-800 truncate">{{ user.name }}</h3>
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
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden my-auto">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">添加用户</h3>
          <button @click="showAddModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div class="flex flex-col items-center">
            <div class="relative">
              <div v-if="newUser.avatar" class="w-24 h-24 rounded-full overflow-hidden">
                <img :src="newUser.avatar" alt="头像" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle class="w-12 h-12 text-gray-400" />
              </div>
              <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera class="w-4 h-4 text-white" />
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload($event, true)" />
              </label>
            </div>
            <p class="text-sm text-gray-500 mt-2">点击添加头像</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
              v-model="newUser.name"
              type="text"
              placeholder="请输入姓名"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="newUser.gender" value="male" class="w-4 h-4 text-primary-600" />
                <span class="text-gray-700">男</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="newUser.gender" value="female" class="w-4 h-4 text-primary-600" />
                <span class="text-gray-700">女</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">班级</label>
            <input
              v-model="newUser.className"
              type="text"
              placeholder="例如：三年级一班"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">年龄</label>
            <input
              v-model.number="newUser.age"
              type="number"
              min="1"
              max="100"
              placeholder="请输入年龄"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
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
              min="0"
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
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden my-auto">
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">编辑用户</h3>
          <button @click="showEditModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div class="flex flex-col items-center">
            <div class="relative">
              <div v-if="editingUser.avatar" class="w-24 h-24 rounded-full overflow-hidden">
                <img :src="editingUser.avatar" alt="头像" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle class="w-12 h-12 text-gray-400" />
              </div>
              <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera class="w-4 h-4 text-white" />
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload($event, false)" />
              </label>
            </div>
            <p class="text-sm text-gray-500 mt-2">点击修改头像</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
              v-model="editingUser.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="editingUser.gender" value="male" class="w-4 h-4 text-primary-600" />
                <span class="text-gray-700">男</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="editingUser.gender" value="female" class="w-4 h-4 text-primary-600" />
                <span class="text-gray-700">女</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="editingUser.gender" value="" class="w-4 h-4 text-primary-600" />
                <span class="text-gray-700">未设置</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">班级</label>
            <input
              v-model="editingUser.className"
              type="text"
              placeholder="例如：三年级一班"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">年龄</label>
            <input
              v-model.number="editingUser.age"
              type="number"
              min="1"
              max="100"
              placeholder="请输入年龄"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
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
                @click="pointsForm.amount = Math.max(0, pointsForm.amount) + 10"
                :class="['px-4 py-2 rounded-lg font-semibold transition-colors', pointsForm.amount > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600']"
              >
                +
              </button>
              <button
                @click="pointsForm.amount = Math.min(0, pointsForm.amount) - 10"
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
