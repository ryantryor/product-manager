# Token 用量估算器

> 粘贴文本，实时估算各模型的 Token 数和对应费用。

<script setup>
import { ref, computed } from 'vue'

const text = ref('在这里粘贴或输入你的文本内容，工具会实时估算 Token 数量和费用。一个中文字大约 1.5-2 个 token，一个英文单词大约 1-1.5 个 token。')
const role = ref('user')

const estimateTokens = (str) => {
  if (!str) return 0
  const chinese = (str.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g) || []).length
  const english = str.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g, '').trim()
  const englishWords = english ? english.split(/\s+/).length : 0
  return Math.ceil(chinese * 1.8 + englishWords * 1.3)
}

const models = [
  { name: 'Claude Opus 4', input: 15, output: 75 },
  { name: 'Claude Sonnet 4', input: 3, output: 15 },
  { name: 'GPT-4o', input: 2.5, output: 10 },
  { name: 'GPT-4o-mini', input: 0.15, output: 0.6 },
  { name: 'Gemini Flash', input: 0.075, output: 0.3 },
  { name: 'DeepSeek-V3', input: 0.27, output: 1.1 },
  { name: 'Qwen-Max', input: 0.8, output: 2 },
]

const tokens = computed(() => estimateTokens(text.value))
const charCount = computed(() => text.value.length)
const wordCount = computed(() => {
  const chinese = (text.value.match(/[\u4e00-\u9fff]/g) || []).length
  const english = text.value.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g, '').trim()
  const englishWords = english ? english.split(/\s+/).length : 0
  return chinese + englishWords
})

const costs = computed(() => {
  return models.map(m => {
    const isInput = role.value === 'user'
    const pricePerM = isInput ? m.input : m.output
    const cost = tokens.value / 1_000_000 * pricePerM
    const per1000 = pricePerM / 1000
    return { name: m.name, cost: cost < 0.0001 ? cost.toExponential(2) : cost.toFixed(6), pricePerM }
  })
})
</script>

<div class="pm-tool">

### 输入文本

<div class="pm-input-group">
  <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
    <div class="pm-radio-btn" :class="{ active: role === 'user' }" @click="role = 'user'">作为输入（Input）</div>
    <div class="pm-radio-btn" :class="{ active: role === 'assistant' }" @click="role = 'assistant'">作为输出（Output）</div>
  </div>
  <textarea class="pm-input" v-model="text" rows="8" placeholder="粘贴或输入文本..." style="resize:vertical;font-family:inherit;"></textarea>
</div>

<div style="display:flex;gap:2rem;font-size:0.85rem;color:var(--vp-c-text-3);">
  <span>字符数：<strong style="color:var(--vp-c-text-1);">{{ charCount }}</strong></span>
  <span>字/词数：<strong style="color:var(--vp-c-text-1);">{{ wordCount }}</strong></span>
  <span>预估 Token：<strong style="color:var(--vp-c-brand-1);font-size:1.1rem;">{{ tokens }}</strong></span>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">各模型费用估算（{{ role === 'user' ? '输入' : '输出' }}价格）</div>

<table class="pm-table">
  <thead>
    <tr>
      <th>模型</th>
      <th>价格（$/1M tokens）</th>
      <th>本次费用</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="c in costs" :key="c.name">
      <td style="font-weight:600;">{{ c.name }}</td>
      <td>${{ c.pricePerM }}</td>
      <td style="font-weight:600;">${{ c.cost }}</td>
    </tr>
  </tbody>
</table>

</div>

## Token 估算规则

| 语言 | 估算比例 | 示例 |
|------|---------|------|
| **中文** | 1 字 ≈ 1.5-2 tokens | "人工智能" ≈ 7-8 tokens |
| **英文** | 1 词 ≈ 1-1.5 tokens | "artificial intelligence" ≈ 2-3 tokens |
| **代码** | 1 行 ≈ 3-10 tokens | 视代码复杂度而定 |

::: tip 精确计数
本工具为估算值。如需精确计数，建议使用 [tiktoken](https://github.com/openai/tiktoken)（OpenAI）或各模型官方 Tokenizer。
:::
