<template>
  <div class="container">
    <!-- 如果今天有人过生日，显示生日庆祝组件 -->
    <div v-if="isBirthdayToday">
      <BirthdayCelebration :person="birthdayPerson" :isMusicLoaded="isMusicLoaded" @openGift="openGift" />
       <!-- 礼物弹窗，显示用户拆开的礼物 -->
      <GiftModal :show="showGiftModal" :gifts="currentGifts" @close="closeGiftModal" />
    </div>
    <!-- 如果今天没有人过生日，显示人员列表按钮和倒计时组件 -->
    <div v-else>
       <!-- 人员列表弹窗 -->
      <el-button type="success" size="large" :icon="Search" @click="showPeopleList" round>展示人员列表</el-button>
      <PeopleListModal :show="showPeopleModal" :people="people" @close="showPeopleModal = false" />
       <!-- 显示下一个过生日的人员的倒计时 -->
      <CountdownTimer v-if="nextBirthdayPerson" :person="nextBirthdayPerson" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { solarToLunar, lunarToSolar } from 'lunar-calendar';
import { Howl } from 'howler';
import BirthdayCelebration from './components/BirthdayCelebration.vue';
import CountdownTimer from './components/CountdownTimer.vue';
import GiftModal from './components/GiftModal.vue';
import PeopleListModal from './components/PeopleListModal.vue';
import { Search } from '@element-plus/icons-vue'

// 定义人员类型，包含姓名、生日和是否使用农历
type Person = {
  name: string;
  birthday: string;
  isLunar: boolean;
};

// 控制礼物弹窗的显示与隐藏
const showGiftModal = ref(false);

// 礼物列表
const allGifts = [
  // 美食类
  '🎁 生日蛋糕一个',
  '🍫 进口巧克力礼盒一份',
  '🍭 网红糖果大礼包一袋',
  '🍷 顶级红酒礼盒一套',
  '🍵 珍稀茶叶礼盒一份',
  '🍔 知名餐厅全年免费餐券一张',
  '🍱 高级寿司料理套餐一份',
  '🍰 法式甜品套装一盒',
  '🍿 豪华爆米花机一台',
  '🥩 和牛牛排套餐一份',

  // 交通工具类
  '🚗 小米SU7一辆',
  '🏍️ 高性能摩托车一辆',
  '🚲 高端碳纤维公路自行车一辆',
  '🛵 时尚电动滑板车一辆',
  '🚀 私人太空旅行体验一次',
  '🛳️ 豪华游艇一艘',
  '✈️ 私人飞机一架',
  '🚂 复古蒸汽火车之旅车票一套',

  // 房产类
  '🏠 汤臣一品套房',
  '🏡 海边度假别墅一栋',
  '🏕️ 山林木屋一套',
  '🏰 欧洲古堡短期使用权一周',

  // 珠宝配饰类
  '💎 钻石项链一条',
  '💍 祖母绿戒指一枚',
  '👑 黄金皇冠一顶',
  '🪐 陨石项链一条',
  '🎗️ 珍珠耳环一对',
  '💫 水晶手链一条',
  '💄 限量版口红套装一套',
  '👜 名牌包包一个',

  // 数码科技类
  '📱 最新款手机一部',
  '💻 高性能游戏笔记本电脑一台',
  '🖥️ 4K超高清曲面显示器一台',
  '🎮 游戏主机一台',
  '🎧 顶级降噪耳机一副',
  '📷 专业单反相机及镜头套装一套',
  '📹 4K运动摄像机一台',
  '💡 智能家居套装一套',
  '🤖 智能机器人伴侣一个',

  // 文化娱乐类
  '📚 经典书籍套装一套',
  '🎨 专业绘画工具套装一套',
  '🎸 专业电吉他一把',
  '🥁 爵士鼓一套',
  '🎻 小提琴一把',
  '🎭 热门演出门票两张',
  '🎬 私人影院观影年卡一张',
  '🎮 VR虚拟现实游戏设备一套',
  '🃏 限量版桌游套装一套',
  '🎫 主题公园年卡一张',

  // 运动健身类
  '🏋️ 健身器材一套',
  '🏊 全年健身游泳卡一张',
  '🧘 瑜伽课程年卡一张',
  '🚴 自行车骑行俱乐部会员年卡一张',
  '⛷️ 滑雪装备套装一套',
  '🏌️ 高尔夫球俱乐部会员年卡一张',
  '🥊 拳击训练课程套餐一份',
  '🏓 乒乓球专业球拍及球具一套',

  // 旅游出行类
  '✈️ 环球旅行机票套餐一份',
  '🚢 豪华邮轮环球旅行船票一张',
  '🚂 跨洲际火车旅行车票一套',
  '🏝️ 马尔代夫豪华度假套餐一份',
  '🗼 日本京都深度游旅行套餐一份',
  '🗽 美国纽约自由行旅行套餐一份',
  '🏰 欧洲城堡游旅行套餐一份',
  '🌅 非洲野生动物观赏之旅套餐一份',

  // 生活用品类
  '🛋️ 舒适沙发一套',
  '🛏️ 顶级床垫一张',
  '🧺 高品质床上四件套一套',
  '🚿 智能马桶盖一个',
  '💆‍♀️ 全身按摩椅一台',
  '🧴 高级护肤品套装一套',
  '🧽 家用清洁机器人一台',
  '🥘 多功能厨房电器套装一套',
  '🪥 电动牙刷及牙具套装一套',

  // 学习成长类
  '📖 线上学习课程年卡一张',
  '🎓 知名商学院短期培训课程一次',
  '🖋️ 书法名家一对一指导课程十节',
  '🖌️ 绘画大师工作室实习机会一个月',
  '💼 职场精英人脉拓展活动入场券一张'
];

// 存储用户当前拆礼包获得的礼物
const currentGifts = ref<string[]>([]);

// 控制人员列表弹框的显示与隐藏
const showPeopleModal = ref(false);

// 定义存储图片路径的数组
const backgroundImages = [
  '/backgrounds/1.jpg',
 
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
  '/backgrounds/7.jpg',
  // '/backgrounds/17.jpg',
  // '/backgrounds/10.jpg',
  // '/backgrounds/11.jpg',
  // '/backgrounds/12.jpg',
  // '/backgrounds/13.jpg',
  // '/backgrounds/14.jpg',
  // '/backgrounds/15.jpg',
  // '/backgrounds/16.jpg',
  // '/backgrounds/17.jpg',
  // '/backgrounds/18.jpg',
  // '/backgrounds/19.jpg',
];

// 当前显示的图片索引
const currentImageIndex = ref(0);

// 定义定时器变量
let intervalId: number | null = null;
const isMusicLoaded = ref(false);
const isMusicPlaying = ref(false);

// 预加载图片的函数
const preloadImages = () => {
  backgroundImages.forEach((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
  });
};

// 切换背景图片的函数
const changeBackgroundImage = () => {
  const container = document.querySelector('.container');
  if (container) {
    const currentImage = backgroundImages[currentImageIndex.value];
    container.style.backgroundImage = `url(${currentImage})`;
    currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.length;
  }
};

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// 测试数据
const people: Person[] = [
  { name: '张三', birthday: '1996-01-29', isLunar: true },
  { name: '李四', birthday: '1999-01-22', isLunar: true },
  { name: '王五', birthday: '2000-05-07', isLunar: true },
  { name: '老六', birthday: '2000-08-19', isLunar: false },
  { name: '小七', birthday: '2000-12-17', isLunar: true },
];

// 获取当前日期
const today = new Date();
const lunarToday = solarToLunar(today.getFullYear(), today.getMonth() + 1, today.getDate());

// 创建全局的Howl实例
let sound: Howl | null = null;

const showPeopleList = () => {
  showPeopleModal.value = true;
  if (sound && !isMusicPlaying.value) {
    if (sound.playing()) {
      sound.stop();
    }
    sound.play();
  }
};

// 拆礼包函数
const openGift = () => {
  showGiftModal.value = true;
  if (sound) {
    if (!isMusicPlaying.value) {
      if (sound.playing()) {
        sound.stop();
      }
      sound.play();
    }
  }
  // 随机选取礼物
  const giftCount = Math.floor(Math.random() * 3) + 2; // 随机获得 1 - 3 个礼物
  const selectedGifts: string[] = [];
  const allGiftsCopy = [...allGifts];
  for (let i = 0; i < giftCount; i++) {
    const randomIndex = Math.floor(Math.random() * allGiftsCopy.length);
    selectedGifts.push(allGiftsCopy[randomIndex]);
    allGiftsCopy.splice(randomIndex, 1); // 避免重复选取
  }
  currentGifts.value = selectedGifts;
};

// 关闭礼物弹窗
const closeGiftModal = () => {
  showGiftModal.value = false;
};

// 判断是否为今天生日的函数
const isTodayBirthday = (person: Person) => {
  if (person.isLunar) {
    const [, lunarMonth, lunarDay] = person.birthday.split('-').map(Number);
    return lunarMonth === lunarToday.lunarMonth && lunarDay === lunarToday.lunarDay;
  } else {
    const [, month, day] = person.birthday.split('-').map(Number);
    return month === today.getMonth() + 1 && day === today.getDate();
  }
};

// 检查是否有今天过生日的人员
const isBirthdayToday = computed(() => {
  return people.some(isTodayBirthday);
});

// 找到今天过生日的人员
const birthdayPerson = computed(() => {
  return people.find(isTodayBirthday);
});

// 获取下一个农历生日
const getNextLunarBirthday = (person: Person) => {
  if (!person.isLunar) return null;
  const [, lunarMonth, lunarDay] = person.birthday.split('-').map(Number);
  const currentYear = today.getFullYear();
  let solarDate = lunarToSolar(currentYear, lunarMonth, lunarDay);
  let nextBirthday = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
  if (nextBirthday < today) {
    solarDate = lunarToSolar(currentYear + 1, lunarMonth, lunarDay);
    nextBirthday = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
  }
  return nextBirthday;
};

// 获取下一个公历生日
const getNextSolarBirthday = (person: Person) => {
  if (person.isLunar) return null;
  const [, month, day] = person.birthday.split('-').map(Number);
  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  return nextBirthday;
};

// 找到下一位过生日的人员
const nextBirthdayPerson = computed(() => {
  const upcoming = people
    .map(person => ({
      ...person,
      nextBirthday: person.isLunar ? getNextLunarBirthday(person) : getNextSolarBirthday(person)
    }))
    .filter(person => person.nextBirthday)
    .sort((a, b) => (a.nextBirthday as Date).getTime() - (b.nextBirthday as Date).getTime())[0];
  return upcoming;
});

const goToCountdownPage = () => {
  // 这里可以根据你的路由配置进行跳转
  // 例如：使用 Vue Router 进行跳转
  // router.push({ name: 'CountdownPage' });
  // 由于没有具体的路由配置，这里简单打印一下
  console.log('跳转到倒计时页面');
};

onMounted(() => {
  // 预加载所有图片
  preloadImages();
  // 页面加载时先显示第一张图片
  changeBackgroundImage();
  // 每 10 秒切换一次图片
  intervalId = setInterval(changeBackgroundImage, 10000);

  // 预加载音频
  sound = new Howl({
    src: ['/music/10000.mp3'],
    volume: 1
  });
  sound.on('loaderror', () => {
    console.error('音频加载错误:');
  });
  sound.on('load', () => {
    isMusicLoaded.value = true;
  });
  sound.on('play', () => {
    isMusicPlaying.value = true;
  });
  sound.on('end', () => {
    isMusicPlaying.value = false;
  });
});

onUnmounted(() => {
  if (sound) {
    sound.unload();
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
}

/* button {
  margin: 10px 0;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
} */

.back-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 36px; /* 调大图标尺寸 */
  color: red; /* 换成更显眼的颜色，例如红色 */
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>