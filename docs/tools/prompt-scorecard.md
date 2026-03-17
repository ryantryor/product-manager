# Prompt 质量评分卡

> 按 4 个维度评估你的 Prompt 质量，获取改进建议。

<script setup>
import { ref, computed } from 'vue'

const prompt = ref('你是一个专业的数据分析师。请分析以下销售数据，找出趋势和异常，并给出建议。')

const dimensions = ref([
  {
    name: '明确性',
    desc: '任务目标、输出格式、约束条件是否清晰',
    items: [
      { text: '任务目标明确（做什么）', score: 0 },
      { text: '输出格式有要求（JSON/表格/列表等）', score: 0 },
      { text: '限制条件清楚（长度/语气/风格）', score: 0 },
      { text: '角色设定合理', score: 0 },
    ],
    weight: 30,
  },
  {
    name: '鲁棒性',
    desc: '不同输入下能否稳定产出高质量结果',
    items: [
      { text: '包含 Few-shot 示例', score: 0 },
      { text: '处理了边界情况', score: 0 },
      { text: '有兜底/错误处理指令', score: 0 },
      { text: '不依赖特定措辞', score: 0 },
    ],
    weight: 25,
  },
  {
    name: '一致性',
    desc: '多次运行结果是否稳定一致',
    items: [
      { text: '结构化输出指令', score: 0 },
      { text: '明确的分步逻辑（CoT）', score: 0 },
      { text: '使用分隔符区分不同部分', score: 0 },
      { text: 'temperature/参数有考量', score: 0 },
    ],
    weight: 25,
  },
  {
    name: '效率',
    desc: 'Token 使用是否精简高效',
    items: [
      { text: '没有冗余/重复指令', score: 0 },
      { text: 'System Prompt 精简', score: 0 },
      { text: '必要信息无遗漏', score: 0 },
      { text: '利用模型能力（不多余解释常识）', score: 0 },
    ],
    weight: 20,
  },
])

const totalScore = computed(() => {
  let total = 0
  dimensions.value.forEach(d => {
    const dimMax = d.items.length * 2
    const dimScore = d.items.reduce((sum, item) => sum + Number(item.score), 0)
    total += (dimScore / dimMax) * d.weight
  })
  return Math.round(total)
})

const grade = computed(() => {
  if (totalScore.value >= 85) return { label: '优秀', color: '#28a745', advice: '已是高质量 Prompt，可以微调优化细节' }
  if (totalScore.value >= 70) return { label: '良好', color: '#007bff', advice: '整体不错，关注薄弱维度做针对性优化' }
  if (totalScore.value >= 50) return { label: '及格', color: '#ffc107', advice: '有改进空间，建议补充示例和结构化指令' }
  return { label: '需改进', color: '#dc3545', advice: '建议参考 Prompt 模板重新设计' }
})

const weakest = computed(() => {
  let min = Infinity, weak = null
  dimensions.value.forEach(d => {
    const dimMax = d.items.length * 2
    const dimScore = d.items.reduce((sum, item) => sum + Number(item.score), 0)
    const pct = dimScore / dimMax * 100
    if (pct < min) { min = pct; weak = d }
  })
  return weak
})
</script>

<div class="pm-tool">

### 你的 Prompt

<textarea class="pm-input" v-model="prompt" rows="4" style="resize:vertical;font-family:inherit;margin-bottom:1rem;" placeholder="粘贴你的 Prompt..."></textarea>

### 逐项评分

<div class="desc" style="margin-bottom:1rem;">对每项打分：0=未做 1=部分满足 2=完全满足</div>

<div v-for="(d, di) in dimensions" :key="di" style="margin-bottom:1.5rem;">
  <div style="font-weight:700;font-size:1rem;margin-bottom:0.3rem;">{{ d.name }} <span style="font-size:0.8rem;font-weight:400;color:var(--vp-c-text-3);">（权重 {{ d.weight }}%）</span></div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-bottom:0.5rem;">{{ d.desc }}</div>

  <div v-for="(item, ii) in d.items" :key="ii" style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0;">
    <span style="flex:1;font-size:0.9rem;">{{ item.text }}</span>
    <div class="pm-radio-group" style="gap:0.3rem;">
      <div class="pm-radio-btn" :class="{ active: item.score === 0 }" @click="item.score = 0" style="padding:0.2rem 0.5rem;font-size:0.8rem;">0</div>
      <div class="pm-radio-btn" :class="{ active: item.score === 1 }" @click="item.score = 1" style="padding:0.2rem 0.5rem;font-size:0.8rem;">1</div>
      <div class="pm-radio-btn" :class="{ active: item.score === 2 }" @click="item.score = 2" style="padding:0.2rem 0.5rem;font-size:0.8rem;">2</div>
    </div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">评分结果</div>

<div style="text-align:center;margin:1rem 0;">
  <div class="pm-score-badge" :style="{ background: grade.color, width: '80px', height: '80px', fontSize: '1.5rem', display: 'inline-flex' }">
    {{ totalScore }}
  </div>
  <div style="font-size:1.2rem;font-weight:700;margin-top:0.5rem;" :style="{ color: grade.color }">{{ grade.label }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">{{ grade.advice }}</div>
</div>

<div class="pm-divider"></div>

<div v-for="d in dimensions" :key="d.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:0.2rem;">
    <span style="font-weight:600;">{{ d.name }}</span>
    <span>{{ d.items.reduce((s, i) => s + Number(i.score), 0) }} / {{ d.items.length * 2 }}</span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill pm-bar-blue" :style="{ width: (d.items.reduce((s, i) => s + Number(i.score), 0) / (d.items.length * 2) * 100) + '%' }"></div>
  </div>
</div>

<div v-if="weakest" style="margin-top:1rem;padding:0.8rem;background:#fff3cd;border-radius:8px;">
  <strong>最薄弱维度：</strong>{{ weakest.name }} — {{ weakest.desc }}
</div>
</div>
