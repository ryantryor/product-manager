# SUS 可用性评分

> 标准 SUS（System Usability Scale）问卷，10 道题自动算分。

<script setup>
import { ref, computed } from 'vue'

const questions = ref([
  { text: '我觉得我会经常使用这个系统', score: 3 },
  { text: '我觉得这个系统过于复杂', score: 3 },
  { text: '我觉得这个系统很容易使用', score: 3 },
  { text: '我觉得我需要技术人员的帮助才能使用这个系统', score: 3 },
  { text: '我觉得这个系统中的各种功能整合得很好', score: 3 },
  { text: '我觉得这个系统中有太多不一致的地方', score: 3 },
  { text: '我觉得大多数人能很快学会使用这个系统', score: 3 },
  { text: '我觉得这个系统使用起来很麻烦', score: 3 },
  { text: '我觉得使用这个系统时很有信心', score: 3 },
  { text: '我需要学习很多东西才能使用这个系统', score: 3 },
])

const labels = ['非常不同意', '不同意', '中立', '同意', '非常同意']

const susScore = computed(() => {
  let total = 0
  questions.value.forEach((q, i) => {
    const s = Number(q.score)
    if (i % 2 === 0) {
      total += (s - 1)
    } else {
      total += (5 - s)
    }
  })
  return total * 2.5
})

const grade = computed(() => {
  const s = susScore.value
  if (s >= 85) return { letter: 'A+', label: '卓越', color: '#28a745', desc: '用户体验极好，超越绝大多数产品' }
  if (s >= 72) return { letter: 'A', label: '优秀', color: '#20c997', desc: '高于平均水平，用户满意度高' }
  if (s >= 68) return { letter: 'B', label: '良好', color: '#007bff', desc: '接近平均水平（行业平均 68 分）' }
  if (s >= 52) return { letter: 'C', label: '一般', color: '#ffc107', desc: '低于平均，存在明显可用性问题' }
  if (s >= 38) return { letter: 'D', label: '较差', color: '#fd7e14', desc: '可用性问题严重，需要大幅改进' }
  return { letter: 'F', label: '很差', color: '#dc3545', desc: '几乎不可用，需要重新设计' }
})

const percentile = computed(() => {
  const s = susScore.value
  if (s >= 85) return '96%'
  if (s >= 80) return '90%'
  if (s >= 72) return '75%'
  if (s >= 68) return '50%'
  if (s >= 60) return '25%'
  if (s >= 50) return '12%'
  return '5%'
})
</script>

<div class="pm-tool">

### SUS 标准问卷

<div class="desc" style="margin-bottom:1rem;">请对以下 10 个陈述打分（1=非常不同意，5=非常同意）</div>

<div v-for="(q, i) in questions" :key="i" style="padding:0.8rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:8px;margin-bottom:0.5rem;">
  <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.5rem;">{{ i + 1 }}. {{ q.text }}</div>
  <div style="display:flex;align-items:center;gap:0.3rem;">
    <span style="font-size:0.75rem;color:var(--vp-c-text-3);white-space:nowrap;">非常不同意</span>
    <div v-for="n in 5" :key="n" class="pm-radio-btn" :class="{ active: q.score === n }" @click="q.score = n" style="width:40px;text-align:center;padding:0.3rem;">
      {{ n }}
    </div>
    <span style="font-size:0.75rem;color:var(--vp-c-text-3);white-space:nowrap;">非常同意</span>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">可用性评分结果</div>

<div style="text-align:center;margin:1.5rem 0;">
  <div class="pm-score-badge" :style="{ background: grade.color, width: '80px', height: '80px', fontSize: '2rem', display: 'inline-flex' }">
    {{ grade.letter }}
  </div>
  <div style="font-size:2.5rem;font-weight:800;margin:0.5rem 0;" :style="{ color: grade.color }">{{ susScore }}</div>
  <div style="font-size:1rem;font-weight:600;">{{ grade.label }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">{{ grade.desc }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-top:0.3rem;">超越 {{ percentile }} 的产品</div>
</div>

<div class="pm-bar" style="height:32px;">
  <div class="pm-bar-fill" :class="susScore >= 68 ? 'pm-bar-green' : susScore >= 52 ? 'pm-bar-yellow' : 'pm-bar-red'" :style="{ width: susScore + '%' }">
    {{ susScore }} / 100
  </div>
</div>
<div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--vp-c-text-3);margin-top:0.3rem;">
  <span>0 - 很差</span>
  <span>68 - 行业平均</span>
  <span>100 - 卓越</span>
</div>

</div>

## SUS 评分等级

| 分数 | 等级 | 百分位 | 含义 |
|------|------|--------|------|
| 85+ | A+ | Top 4% | 卓越体验 |
| 72-84 | A | Top 25% | 优秀 |
| 68-71 | B | 平均线 | 良好 |
| 52-67 | C | 下 50% | 需改进 |
| 38-51 | D | 下 15% | 较差 |
| <38 | F | 下 5% | 重新设计 |
