# 面试题练习器

> 随机抽取 AI 产品经理面试题，限时练习，模拟真实面试。

<script setup>
import { ref, onUnmounted } from 'vue'

const questions = [
  { category: 'AI 技术理解', q: '请用通俗语言解释大语言模型（LLM）的工作原理' },
  { category: 'AI 技术理解', q: 'RAG 和微调（Fine-tuning）有什么区别？什么场景用哪个？' },
  { category: 'AI 技术理解', q: '什么是模型幻觉（Hallucination）？作为产品经理你会如何处理？' },
  { category: 'AI 技术理解', q: 'Transformer 架构和 MoE 架构有什么区别？对产品有什么影响？' },
  { category: 'AI 技术理解', q: '什么是 Token？它如何影响 AI 产品的成本和体验？' },
  { category: 'AI 技术理解', q: '解释 Prompt Engineering、RAG、Fine-tuning 的区别和选择逻辑' },
  { category: 'AI 技术理解', q: 'RLHF 是什么？它如何影响模型的行为和产品体验？' },
  { category: 'AI 技术理解', q: '什么是向量数据库？它在 AI 产品中的作用是什么？' },
  { category: '产品设计', q: '如果让你设计一个 AI 客服产品，你会怎么规划？' },
  { category: '产品设计', q: '如何评估一个 AI 功能是否值得做？' },
  { category: '产品设计', q: '设计一个 AI 写作助手的核心功能和交互流程' },
  { category: '产品设计', q: 'AI 产品中如何设计"人机协作"机制？' },
  { category: '产品设计', q: '如何处理 AI 产品中的用户信任问题？' },
  { category: '产品设计', q: '设计一个 AI 数据分析助手，说说你的思路' },
  { category: '数据与指标', q: 'AI 产品应该关注哪些核心指标？如何搭建指标体系？' },
  { category: '数据与指标', q: '怎么做 AI 产品的 A/B 测试？和传统 A/B 测试有什么不同？' },
  { category: '数据与指标', q: '如何衡量 AI 功能的 ROI？' },
  { category: '数据与指标', q: '什么是数据飞轮？如何在 AI 产品中构建？' },
  { category: '战略思考', q: 'AI 产品的护城河是什么？如何构建？' },
  { category: '战略思考', q: 'Build vs Buy：什么时候自研模型，什么时候用第三方 API？' },
  { category: '战略思考', q: 'AI 产品如何定价？Token 计费模式的挑战是什么？' },
  { category: '战略思考', q: '如何管理 AI 产品路线图的不确定性？' },
  { category: '战略思考', q: 'AI 产品的伦理风险有哪些？作为 PM 你怎么应对？' },
  { category: '案例分析', q: '分析一个你认为做得好的 AI 产品，说说它好在哪里' },
  { category: '案例分析', q: '如果让你做一个基于 LLM 的搜索引擎，你觉得最大的挑战是什么？' },
  { category: '案例分析', q: 'Cursor/Copilot 这类 AI 编程工具的产品策略是什么？' },
  { category: '案例分析', q: '为什么很多 AI 产品留存率低？你觉得核心原因是什么？' },
]

const currentQuestion = ref(null)
const showAnswer = ref(false)
const timerRunning = ref(false)
const timerSeconds = ref(0)
const selectedCategory = ref('all')
let timerInterval = null

const categories = ['all', 'AI 技术理解', '产品设计', '数据与指标', '战略思考', '案例分析']

function getRandomQuestion() {
  const pool = selectedCategory.value === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory.value)

  const idx = Math.floor(Math.random() * pool.length)
  currentQuestion.value = pool[idx]
  showAnswer.value = false
  timerSeconds.value = 0
  startTimer()
}

function startTimer() {
  stopTimer()
  timerRunning.value = true
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
}

function stopTimer() {
  timerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onUnmounted(() => stopTimer())
</script>

<div class="pm-tool">

### 选择题目类别

<div class="pm-radio-group" style="margin-bottom:1rem;">
  <div v-for="c in categories" :key="c" class="pm-radio-btn" :class="{ active: selectedCategory === c }" @click="selectedCategory = c">
    {{ c === 'all' ? '全部题目' : c }}
  </div>
</div>

<button class="pm-btn pm-btn-primary" @click="getRandomQuestion" style="width:100%;font-size:1rem;padding:0.8rem;">
  {{ currentQuestion ? '下一题' : '开始练习' }}
</button>

</div>

<div v-if="currentQuestion" class="pm-interview-card">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
    <div class="pm-interview-category">{{ currentQuestion.category }}</div>
    <div class="pm-timer" :style="{ color: timerSeconds > 180 ? '#dc3545' : timerSeconds > 120 ? '#fd7e14' : 'var(--vp-c-text-2)' }">
      {{ formatTime(timerSeconds) }}
    </div>
  </div>

  <div class="pm-interview-question">{{ currentQuestion.q }}</div>

  <div style="display:flex;gap:0.5rem;">
    <button class="pm-btn pm-btn-secondary" @click="timerRunning ? stopTimer() : startTimer()">
      {{ timerRunning ? '暂停计时' : '继续计时' }}
    </button>
  </div>
</div>

<div v-if="currentQuestion" style="margin-top:1rem;padding:1rem;background:var(--vp-c-bg-soft);border-radius:8px;">

### 回答建议

- **控制时间**：每道题 2-3 分钟，超过 3 分钟建议收尾
- **结构化表达**：先说结论，再展开论述
- **数据支撑**：尽量用具体数字和案例
- **产品视角**：技术问题也要落到产品影响上
- **诚实为上**：不懂就说不懂，但可以说"我会这样去了解"

</div>

## 面试准备资料

更详细的参考答案和面试技巧，请阅读 [AI 产品经理面试攻略](/guide/interview-guide)。
