<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { Plus, Edit, Trash2, Coins, LogOut, X, ImageIcon } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const showModal = ref(false);
const editingGift = ref<typeof store.gifts[0] | null>(null);
const giftForm = ref({ name: '', description: '', points: 0, stock: 0, image: '' });
const imagePreview = ref('');

const gifts = computed(() => store.gifts);

function openAddModal() {
  editingGift.value = null;
  giftForm.value = { name: '', description: '', points: 0, stock: 0, image: '' };
  imagePreview.value = '';
  showModal.value = true;
}

function openEditModal(gift: typeof store.gifts[0]) {
  editingGift.value = gift;
  giftForm.value = { 
    name: gift.name, 
    description: gift.description, 
    points: gift.points, 
    stock: gift.stock, 
    image: gift.image 
  };
  imagePreview.value = gift.image;
  showModal.value = true;
}

function handleSubmit() {
  if (!giftForm.value.name || !giftForm.value.description || giftForm.value.points <= 0 || giftForm.value.stock < 0) {
    alert('请填写完整信息');
    return;
  }

  if (editingGift.value) {
    store.updateGift(editingGift.value.id, giftForm.value);
  } else {
    store.addGift(giftForm.value);
  }
  
  showModal.value = false;
  giftForm.value = { name: '', description: '', points: 0, stock: 0, image: '' };
  imagePreview.value = '';
}

function deleteGift(giftId: string) {
  if (confirm('确定要删除这个礼物吗？')) {
    store.deleteGift(giftId);
  }
}

function handleImageUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) {
    return;
  }
  
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const result = event.target?.result as string;
    giftForm.value.image = result;
    imagePreview.value = result;
  };
  reader.onerror = () => {
    alert('图片读取失败，请重试');
  };
  reader.readAsDataURL(file);
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
          <p class="text-sm text-gray-500">礼物管理</p>
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
          class="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600"
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
        @click="openAddModal"
        class="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors mb-4"
      >
        <Plus class="w-5 h-5" />
        添加礼物
      </button>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          <img :src="gift.image" :alt="gift.name" class="w-full h-24 object-cover" />
          <div class="p-3">
            <h3 class="font-semibold text-gray-800">{{ gift.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-1">{{ gift.description }}</p>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-1">
                <Coins class="w-4 h-4 text-yellow-500" />
                <span class="text-primary-600 font-bold">{{ gift.points }}</span>
              </div>
              <span class="text-xs text-gray-400">库存 {{ gift.stock }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                @click="openEditModal(gift)"
                class="flex-1 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors text-sm"
              >
                <Edit class="w-4 h-4 inline mr-1" />
                编辑
              </button>
              <button
                @click="deleteGift(gift.id)"
                class="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 class="w-4 h-4 inline mr-1" />
                删除
              </button>
            </div>
          </div>
        </div>

        <div v-if="gifts.length === 0" class="col-span-2 bg-white rounded-xl p-8 text-center">
          <ImageIcon class="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">暂无礼物</p>
        </div>
      </div>
    </div>

    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden" @click.stop>
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">{{ editingGift ? '编辑礼物' : '添加礼物' }}</h3>
          <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">礼物图片</label>
            <div class="relative">
              <button
                type="button"
                @click="($refs.imageInput as HTMLInputElement).click()"
                class="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
              >
                <div v-if="imagePreview" class="mb-2">
                  <img :src="imagePreview" alt="预览" class="max-h-48 mx-auto rounded-lg" />
                  <p class="text-xs text-gray-500 mt-2">点击可更换图片</p>
                </div>
                <div v-else>
                  <ImageIcon class="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p class="text-base text-gray-600 font-medium">点击上传图片</p>
                  <p class="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式（最大2MB）</p>
                </div>
              </button>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">礼物名称</label>
            <input
              v-model="giftForm.name"
              type="text"
              placeholder="请输入礼物名称"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">礼物描述</label>
            <textarea
              v-model="giftForm.description"
              placeholder="请输入礼物描述"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">所需积分</label>
              <input
                v-model.number="giftForm.points"
                type="number"
                min="1"
                placeholder="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">库存数量</label>
              <input
                v-model.number="giftForm.stock"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
        <div class="p-4 border-t flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            取消
          </button>
          <button
            @click="handleSubmit"
            class="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            {{ editingGift ? '保存' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
