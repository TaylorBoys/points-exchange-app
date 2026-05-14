<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { LogOut, Users, Gift, Coins, TrendingUp, BarChart3, PieChart, Calendar, ArrowLeft } from 'lucide-vue-next';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart as EChartsPieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  EChartsPieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);

const router = useRouter();
const store = useAppStore();

const timeRange = ref<'week' | 'month' | 'all'>('month');

function logout() {
  store.logout();
  router.push('/');
}

function parseDate(dateStr: string): Date {
  if (dateStr.includes('/')) {
    const parts = dateStr.split(' ')[0].split('/');
    return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
  }
  return new Date(dateStr);
}

function isInRange(date: Date): boolean {
  const now = new Date();
  if (timeRange.value === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= now;
  } else if (timeRange.value === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return date >= monthAgo && date <= now;
  }
  return true;
}

const stats = computed(() => {
  const totalUsers = store.users.length;
  const totalPoints = store.users.reduce((sum, u) => sum + u.points, 0);
  const totalGifts = store.gifts.length;
  const totalExchanges = store.exchanges.filter(e => e.status === 'approved').length;

  const filteredHistories = store.pointHistories.filter(h => isInRange(parseDate(h.createdAt)));
  const earnedPoints = filteredHistories.filter(h => h.type === 'earn').reduce((sum, h) => sum + h.amount, 0);
  const spentPoints = filteredHistories.filter(h => h.type === 'spend').reduce((sum, h) => sum + h.amount, 0);

  const giftExchangeCounts: Record<string, number> = {};
  store.exchanges
    .filter(e => e.status === 'approved' && isInRange(parseDate(e.approvedAt || e.createdAt)))
    .forEach(e => {
      const gift = store.gifts.find(g => g.id === e.giftId);
      if (gift) {
        giftExchangeCounts[gift.name] = (giftExchangeCounts[gift.name] || 0) + 1;
      }
    });

  const userPointsCounts: Record<string, number> = {};
  store.users.forEach(u => {
    userPointsCounts[u.name] = u.points;
  });

  const dailyPoints: Record<string, { earn: number; spend: number }> = {};
  filteredHistories.forEach(h => {
    const dateKey = h.createdAt.split(' ')[0];
    if (!dailyPoints[dateKey]) {
      dailyPoints[dateKey] = { earn: 0, spend: 0 };
    }
    if (h.type === 'earn') {
      dailyPoints[dateKey].earn += h.amount;
    } else {
      dailyPoints[dateKey].spend += h.amount;
    }
  });

  const sortedDates = Object.keys(dailyPoints).sort();

  return {
    totalUsers,
    totalPoints,
    totalGifts,
    totalExchanges,
    earnedPoints,
    spentPoints,
    giftExchangeCounts,
    userPointsCounts,
    dailyPoints,
    sortedDates,
  };
});

const pointsTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['获得积分', '消耗积分'],
    bottom: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: stats.value.sortedDates,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '获得积分',
      type: 'line',
      data: stats.value.sortedDates.map(d => stats.value.dailyPoints[d].earn),
      smooth: true,
      itemStyle: { color: '#10b981' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
          ],
        },
      },
    },
    {
      name: '消耗积分',
      type: 'line',
      data: stats.value.sortedDates.map(d => stats.value.dailyPoints[d].spend),
      smooth: true,
      itemStyle: { color: '#ef4444' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
            { offset: 1, color: 'rgba(239, 68, 68, 0.05)' },
          ],
        },
      },
    },
  ],
}));

const giftExchangeOption = computed(() => {
  const giftNames = Object.keys(stats.value.giftExchangeCounts);
  const giftCounts = Object.values(stats.value.giftExchangeCounts);
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}次 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        name: '礼物兑换',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: giftNames.map((name, index) => ({
          value: giftCounts[index],
          name,
          itemStyle: { color: colors[index % colors.length] },
        })),
      },
    ],
  };
});

const userPointsOption = computed(() => {
  const userNames = Object.keys(stats.value.userPointsCounts).slice(0, 10);
  const userPoints = Object.values(stats.value.userPointsCounts).slice(0, 10);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: userNames,
    },
    series: [
      {
        name: '积分',
        type: 'bar',
        data: userPoints,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#6366f1' },
              { offset: 1, color: '#8b5cf6' },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  };
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <button @click="router.push('/admin/users')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft class="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 class="text-lg font-semibold text-gray-800">数据统计</h1>
            <p class="text-sm text-gray-500">积分与兑换分析</p>
          </div>
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
          @click="router.push('/admin/tasks')"
          class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
        >
          任务管理
        </button>
        <button 
          class="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600"
        >
          数据统计
        </button>
      </div>
    </nav>

    <div class="p-4">
      <div class="flex gap-2 mb-4">
        <button
          v-for="range in [
            { value: 'week', label: '本周', icon: Calendar },
            { value: 'month', label: '本月', icon: TrendingUp },
            { value: 'all', label: '全部', icon: BarChart3 },
          ]"
          :key="range.value"
          @click="timeRange = range.value as any"
          :class="[
            'flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors',
            timeRange === range.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          ]"
        >
          <component :is="range.icon" class="w-4 h-4" />
          {{ range.label }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalUsers }}</p>
              <p class="text-xs text-gray-500">总用户数</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Coins class="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalPoints }}</p>
              <p class="text-xs text-gray-500">总积分</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalGifts }}</p>
              <p class="text-xs text-gray-500">礼物种类</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalExchanges }}</p>
              <p class="text-xs text-gray-500">成功兑换</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-primary-600" />
            积分变动趋势
          </h3>
        </div>
        <v-chart :option="pointsTrendOption" class="h-64" autoresize />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart class="w-5 h-5 text-purple-600" />
              礼物兑换分布
            </h3>
          </div>
          <v-chart :option="giftExchangeOption" class="h-64" autoresize />
        </div>

        <div class="bg-white rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 class="w-5 h-5 text-indigo-600" />
              用户积分排行榜
            </h3>
          </div>
          <v-chart :option="userPointsOption" class="h-64" autoresize />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <div class="bg-green-50 rounded-xl p-4">
          <div class="text-sm text-green-600 mb-1">获得积分</div>
          <div class="text-2xl font-bold text-green-700">+{{ stats.earnedPoints }}</div>
        </div>
        <div class="bg-red-50 rounded-xl p-4">
          <div class="text-sm text-red-600 mb-1">消耗积分</div>
          <div class="text-2xl font-bold text-red-700">-{{ stats.spentPoints }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
