import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Gift, PointHistory, Exchange, Task, TaskCompletion } from '@/types'
import { memfireClient } from '@/memfire';

const STORAGE_KEY = 'points-exchange-data';

const defaultUsers: User[] = [
  { 
    id: '1', 
    name: '张三', 
    phone: '13800138001', 
    points: 1500, 
    createdAt: '2024-01-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    gender: 'male',
    className: '三年级一班',
    age: 9
  },
  { 
    id: '2', 
    name: '李四', 
    phone: '13800138002', 
    points: 2300, 
    createdAt: '2024-01-05',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    gender: 'female',
    className: '三年级二班',
    age: 8
  },
  { 
    id: '3', 
    name: '王五', 
    phone: '13800138003', 
    points: 800, 
    createdAt: '2024-02-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    gender: 'male',
    className: '三年级一班',
    age: 10
  },
];

const defaultGifts: Gift[] = [
  { 
    id: '1', 
    name: '蓝牙耳机', 
    description: '高品质无线蓝牙耳机', 
    points: 1000, 
    stock: 10, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    createdAt: '2024-01-01'
  },
  { 
    id: '2', 
    name: '保温杯', 
    description: '不锈钢真空保温杯', 
    points: 500, 
    stock: 20, 
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    createdAt: '2024-01-02'
  },
  { 
    id: '3', 
    name: '智能手环', 
    description: '健康运动监测手环', 
    points: 800, 
    stock: 15, 
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
    createdAt: '2024-01-03'
  },
];

const defaultTasks: Task[] = [
  { id: '1', name: '按时完成作业', description: '在截止时间前提交作业', points: 100, createdAt: '2024-01-01' },
  { id: '2', name: '获得满分', description: '某次测验或考试获得满分', points: 200, createdAt: '2024-01-01' },
  { id: '3', name: '主动帮助同学', description: '协助其他同学解决问题', points: 50, createdAt: '2024-01-01' },
  { id: '4', name: '参与课堂讨论', description: '积极回答问题或提出建设性意见', points: 30, createdAt: '2024-01-01' },
];

const defaultHistories: PointHistory[] = [
  { id: '1', userId: '1', type: 'earn', amount: 500, reason: '签到奖励', createdAt: '2024-01-01 10:00' },
  { id: '2', userId: '1', type: 'earn', amount: 1000, reason: '活动奖励', createdAt: '2024-01-05 14:30' },
];

const defaultExchanges: Exchange[] = [
  { id: '1', userId: '1', giftId: '1', status: 'approved', createdAt: '2024-01-10', approvedAt: '2024-01-10' },
];

const defaultTaskCompletions: TaskCompletion[] = [];

function loadDataFromLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Data loaded from localStorage:', parsed);
      return {
        users: parsed.users || defaultUsers,
        gifts: parsed.gifts || defaultGifts,
        pointHistories: parsed.pointHistories || defaultHistories,
        exchanges: parsed.exchanges || defaultExchanges,
        tasks: parsed.tasks || defaultTasks,
        taskCompletions: parsed.taskCompletions || defaultTaskCompletions,
      };
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
  console.log('Using default data');
  return {
    users: defaultUsers,
    gifts: defaultGifts,
    pointHistories: defaultHistories,
    exchanges: defaultExchanges,
    tasks: defaultTasks,
    taskCompletions: defaultTaskCompletions,
  };
}

function saveDataToLocal(data: { 
  users: User[]; 
  gifts: Gift[]; 
  pointHistories: PointHistory[]; 
  exchanges: Exchange[];
  tasks: Task[];
  taskCompletions: TaskCompletion[];
}) {
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, jsonString);
    console.log('Data saved to localStorage successfully');
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

export const useAppStore = defineStore('app', () => {
  let data = loadDataFromLocal();

  const users = ref<User[]>(data.users);
  const gifts = ref<Gift[]>(data.gifts);
  const pointHistories = ref<PointHistory[]>(data.pointHistories);
  const exchanges = ref<Exchange[]>(data.exchanges);
  const tasks = ref<Task[]>(data.tasks);
  const taskCompletions = ref<TaskCompletion[]>(data.taskCompletions);
  const currentUser = ref<User | null>(null);
  const isAdmin = ref(false);

  const pendingExchanges = computed(() => 
    exchanges.value.filter(e => e.status === 'pending')
  );

  const pendingTaskCompletions = computed(() => 
    taskCompletions.value.filter(tc => tc.status === 'pending')
  );

  const userExchanges = computed(() => (userId: string) => 
    exchanges.value.filter(e => e.userId === userId)
  );

  const userTaskCompletions = computed(() => (userId: string) => 
    taskCompletions.value.filter(tc => tc.userId === userId)
  );

  async function save() {
    const dataToSave = {
      users: users.value,
      gifts: gifts.value,
      pointHistories: pointHistories.value,
      exchanges: exchanges.value,
      tasks: tasks.value,
      taskCompletions: taskCompletions.value
    }
    saveDataToLocal(dataToSave)
    
    if (memfireClient) {
      try {
        const { error } = await memfireClient
          .from('app_data')
          .upsert({
            id: 'default',
            data: dataToSave,
            updated_at: new Date().toISOString()
          })
        if (!error) {
          console.log('数据已同步到 MemFire Cloud')
        }
      } catch (error) {
        console.warn('同步到 MemFire Cloud 失败:', error)
      }
    }
  }

  async function loadFromCloud() {
    if (!memfireClient) return false
    
    try {
      const { data, error } = await memfireClient
        .from('app_data')
        .select('data')
        .eq('id', 'default')
        .single()
      
      if (!error && data?.data) {
        console.log('从 MemFire Cloud 加载数据')
        const cloudData = data.data
        if (cloudData.users) users.value = cloudData.users
        if (cloudData.gifts) gifts.value = cloudData.gifts
        if (cloudData.pointHistories) pointHistories.value = cloudData.pointHistories
        if (cloudData.exchanges) exchanges.value = cloudData.exchanges
        if (cloudData.tasks) tasks.value = cloudData.tasks
        if (cloudData.taskCompletions) taskCompletions.value = cloudData.taskCompletions
        saveDataToLocal(cloudData)
        return true
      }
    } catch (error) {
      console.warn('从 MemFire Cloud 加载失败:', error)
    }
    return false
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
    console.log('Adding user:', newUser);
    users.value.push(newUser);
    save();
  }

  function deleteUser(userId: string) {
    users.value = users.value.filter(u => u.id !== userId);
    pointHistories.value = pointHistories.value.filter(h => h.userId !== userId);
    exchanges.value = exchanges.value.filter(e => e.userId !== userId);
    taskCompletions.value = taskCompletions.value.filter(tc => tc.userId !== userId);
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

  function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    tasks.value.push(newTask);
    save();
  }

  function updateTask(taskId: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates };
      save();
    }
  }

  function deleteTask(taskId: string) {
    tasks.value = tasks.value.filter(t => t.id !== taskId);
    taskCompletions.value = taskCompletions.value.filter(tc => tc.taskId !== taskId);
    save();
  }

  function completeTask(userId: string, taskId: string): boolean {
    const existing = taskCompletions.value.find(
      tc => tc.userId === userId && tc.taskId === taskId && tc.status === 'pending'
    );
    if (existing) {
      return false;
    }

    const task = tasks.value.find(t => t.id === taskId);
    if (!task) {
      return false;
    }

    const completion: TaskCompletion = {
      id: Date.now().toString(),
      taskId,
      userId,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    taskCompletions.value.unshift(completion);
    save();
    return true;
  }

  function approveTaskCompletion(completionId: string, approve: boolean) {
    const completion = taskCompletions.value.find(tc => tc.id === completionId);
    if (completion && completion.status === 'pending') {
      completion.status = approve ? 'approved' : 'rejected';
      completion.approvedAt = new Date().toLocaleString();
      
      if (approve) {
        const task = tasks.value.find(t => t.id === completion.taskId);
        if (task) {
          updateUserPoints(completion.userId, task.points, `完成任务: ${task.name}`);
        }
      }
      save();
    }
  }

  function updateUser(userId: string, updates: Partial<User>) {
    const index = users.value.findIndex(u => u.id === userId);
    if (index !== -1) {
      console.log('Updating user:', userId, updates);
      users.value[index] = { ...users.value[index], ...updates };
      if (currentUser.value?.id === userId) {
        currentUser.value = users.value[index];
      }
      save();
    }
  }

  // 初始化时尝试从云端加载数据
  (async () => {
    if (memfireClient) {
      await loadFromCloud();
    }
  })();

  return {
    users,
    gifts,
    pointHistories,
    exchanges,
    tasks,
    taskCompletions,
    currentUser,
    isAdmin,
    pendingExchanges,
    pendingTaskCompletions,
    userExchanges,
    userTaskCompletions,
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
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    approveTaskCompletion,
    loadFromCloud,
  };
});
