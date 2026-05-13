import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Gift, PointHistory, Exchange } from '@/types';

const STORAGE_KEY = 'points-exchange-data';

const defaultUsers: User[] = [
  { id: '1', name: '张三', phone: '13800138001', points: 1500, createdAt: '2024-01-01' },
  { id: '2', name: '李四', phone: '13800138002', points: 2300, createdAt: '2024-01-05' },
  { id: '3', name: '王五', phone: '13800138003', points: 800, createdAt: '2024-02-01' },
];

const defaultGifts: Gift[] = [
  { 
    id: '1', 
    name: '蓝牙耳机', 
    description: '高品质无线蓝牙耳机', 
    points: 1000, 
    stock: 10, 
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=wireless%20bluetooth%20headphones%20product%20photo%20white%20background&image_size=square',
    createdAt: '2024-01-01'
  },
  { 
    id: '2', 
    name: '保温杯', 
    description: '不锈钢真空保温杯', 
    points: 500, 
    stock: 20, 
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=stainless%20steel%20thermos%20cup%20product%20photo%20white%20background&image_size=square',
    createdAt: '2024-01-02'
  },
];

const defaultHistories: PointHistory[] = [
  { id: '1', userId: '1', type: 'earn', amount: 500, reason: '签到奖励', createdAt: '2024-01-01 10:00' },
  { id: '2', userId: '1', type: 'earn', amount: 1000, reason: '活动奖励', createdAt: '2024-01-05 14:30' },
];

const defaultExchanges: Exchange[] = [
  { id: '1', userId: '1', giftId: '1', status: 'approved', createdAt: '2024-01-10', approvedAt: '2024-01-10' },
];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    console.warn('Failed to load data from localStorage');
  }
  return {
    users: defaultUsers,
    gifts: defaultGifts,
    pointHistories: defaultHistories,
    exchanges: defaultExchanges,
  };
}

function saveData(data: { users: User[]; gifts: Gift[]; pointHistories: PointHistory[]; exchanges: Exchange[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save data to localStorage');
  }
}

export const useAppStore = defineStore('app', () => {
  const data = loadData();
  
  const users = ref<User[]>(data.users);
  const gifts = ref<Gift[]>(data.gifts);
  const pointHistories = ref<PointHistory[]>(data.pointHistories);
  const exchanges = ref<Exchange[]>(data.exchanges);
  const currentUser = ref<User | null>(null);
  const isAdmin = ref(false);

  const pendingExchanges = computed(() => 
    exchanges.value.filter(e => e.status === 'pending')
  );

  const userExchanges = computed(() => (userId: string) => 
    exchanges.value.filter(e => e.userId === userId)
  );

  function save() {
    saveData({
      users: users.value,
      gifts: gifts.value,
      pointHistories: pointHistories.value,
      exchanges: exchanges.value,
    });
  }

  function login(user: User) {
    currentUser.value = user;
    isAdmin.value = false;
  }

  function loginAsAdmin(password: string): boolean {
    if (password === 'admin123') {
      isAdmin.value = true;
      currentUser.value = null;
      return true;
    }
    return false;
  }

  function logout() {
    currentUser.value = null;
    isAdmin.value = false;
  }

  function addUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    users.value.push(newUser);
    save();
  }

  function deleteUser(userId: string) {
    users.value = users.value.filter(u => u.id !== userId);
    pointHistories.value = pointHistories.value.filter(h => h.userId !== userId);
    exchanges.value = exchanges.value.filter(e => e.userId !== userId);
    if (currentUser.value?.id === userId) {
      currentUser.value = null;
    }
    save();
  }

  function updateUserPoints(userId: string, amount: number, reason: string) {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.points += amount;
      const history: PointHistory = {
        id: Date.now().toString(),
        userId,
        type: amount > 0 ? 'earn' : 'spend',
        amount: Math.abs(amount),
        reason,
        createdAt: new Date().toLocaleString(),
      };
      pointHistories.value.unshift(history);
      if (currentUser.value?.id === userId) {
        currentUser.value = { ...user };
      }
      save();
    }
  }

  function addGift(gift: Omit<Gift, 'id' | 'createdAt'>) {
    const newGift: Gift = {
      ...gift,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    gifts.value.push(newGift);
    save();
  }

  function updateGift(giftId: string, updates: Partial<Gift>) {
    const index = gifts.value.findIndex(g => g.id === giftId);
    if (index !== -1) {
      gifts.value[index] = { ...gifts.value[index], ...updates };
      save();
    }
  }

  function deleteGift(giftId: string) {
    gifts.value = gifts.value.filter(g => g.id !== giftId);
    exchanges.value = exchanges.value.filter(e => e.giftId !== giftId);
    save();
  }

  function createExchange(userId: string, giftId: string): boolean {
    const user = users.value.find(u => u.id === userId);
    const gift = gifts.value.find(g => g.id === giftId);
    
    if (!user || !gift || user.points < gift.points || gift.stock <= 0) {
      return false;
    }

    const exchange: Exchange = {
      id: Date.now().toString(),
      userId,
      giftId,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    exchanges.value.unshift(exchange);
    save();
    return true;
  }

  function approveExchange(exchangeId: string, approve: boolean) {
    const exchange = exchanges.value.find(e => e.id === exchangeId);
    if (exchange && exchange.status === 'pending') {
      exchange.status = approve ? 'approved' : 'rejected';
      exchange.approvedAt = new Date().toLocaleString();
      
      if (approve) {
        const gift = gifts.value.find(g => g.id === exchange.giftId);
        if (gift) {
          gift.stock -= 1;
          updateUserPoints(exchange.userId, -gift.points, `兑换礼物: ${gift.name}`);
        }
      }
      save();
    }
  }

  function updateUser(userId: string, updates: Partial<User>) {
    const index = users.value.findIndex(u => u.id === userId);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };
      save();
    }
  }

  return {
    users,
    gifts,
    pointHistories,
    exchanges,
    currentUser,
    isAdmin,
    pendingExchanges,
    userExchanges,
    login,
    loginAsAdmin,
    logout,
    addUser,
    deleteUser,
    updateUser,
    updateUserPoints,
    addGift,
    updateGift,
    deleteGift,
    createExchange,
    approveExchange,
  };
});
