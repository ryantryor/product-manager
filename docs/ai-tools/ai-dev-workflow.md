# AI 辅助研发工作流：从理论到实践

::: tip 本文定位
AI 编程工具正在重塑软件工程的每个环节。作为 AI Native 产品经理，理解这些工具的能力边界和最佳实践，是做出正确产品决策的前提。
:::

## 一、AI 辅助研发的三个层次

### Level 1：AI 代码补全（Copilot 模式）

最基础的 AI 辅助——在编辑器中实时补全代码。

```
开发者输入 → AI 预测 → 补全建议 → 接受/拒绝
```

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| GitHub Copilot | 编辑器内联补全，支持多语言 | 日常编码提效 |
| Cursor Tab | 上下文感知补全 + 多行预测 | 复杂代码编写 |
| Codeium | 免费个人版，企业部署灵活 | 预算敏感团队 |

**PM 关注点**：代码补全提升开发速度约 30-50%，但对产品质量和架构几乎没有影响。

### Level 2：AI 编程助手（Agent 模式）

AI 理解整个代码库，可以自主完成多文件修改。

```
需求描述 → AI 分析代码库 → 规划修改方案 → 多文件编辑 → 验证
```

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| Claude Code | 终端 Agent，理解完整代码库 | 复杂功能开发 |
| Cursor Agent | IDE 内置 Agent，可视化操作 | 快速原型和迭代 |
| Devin | 自主工作的 AI 工程师 | 独立任务执行 |
| Windsurf | 上下文丰富的 IDE Agent | 全栈开发 |

**PM 关注点**：Agent 模式将开发效率提升 3-10 倍。但缺乏质量保证机制，容易产生"看起来能用但实际有问题"的代码。

### Level 3：AI 虚拟团队（Structured Agent 模式）

多个 AI 角色协作，模拟完整工程团队的工作流。

```
需求 → 产品审查 → 设计审计 → 架构规划 → 开发 → 代码审查 → QA → 发布
```

| 框架 | 特点 | 适用场景 |
|------|------|---------|
| **gstack** | 13 专家角色，结构化工作流，真实浏览器 QA | 全流程 AI 研发 |
| Conductor | 并行 Agent 编排 | 多任务并行开发 |
| 自定义 CLAUDE.md | 项目级 AI 行为配置 | 团队标准化 |

**PM 关注点**：这是最接近"AI 取代工程团队"的模式。质量有结构性保障，但需要技术型创始人/开发者驾驭。

## 二、结构化 AI 研发工作流设计

### 2.1 核心原则

**治理优于混乱**（Governance Over Chaos）

给 AI 完全自由 ≠ 最高效。就像管理真实团队一样，AI 需要：

1. **角色分工** — 每个 AI 会话专注一个角色
2. **流程门禁** — 阶段性检查点防止错误累积
3. **质量标准** — 明确的 Definition of Done
4. **文档同步** — 变更自动反映到文档

### 2.2 设计优先架构（Design-First Architecture）

```
┌────────────────────────────┐
│  1. 产品需求 + 设计规范      │ ← PM 输入
├────────────────────────────┤
│  2. 设计审计（80 项检查）     │ ← AI 设计师
│     ↓ 设计决策向下传导        │
├────────────────────────────┤
│  3. 架构规划                 │ ← AI 架构师
│     必须遵循设计约束          │
├────────────────────────────┤
│  4. 代码实现                 │ ← AI 开发者
│     设计系统约束代码风格       │
├────────────────────────────┤
│  5. 视觉验证                 │ ← AI 审查
│     前后截图对比确认          │
└────────────────────────────┘
```

**为什么重要**：在 AI 加速开发的时代，设计质量是最容易被牺牲的环节。设计优先确保"快"不以"好"为代价。

### 2.3 自动化质量保证

AI 辅助 QA 的最佳实践：

| 层级 | 方法 | 成本 | 速度 | 覆盖 |
|------|------|------|------|------|
| L1 静态验证 | 语法检查、类型检查、Lint | 免费 | <5s | 基础 |
| L2 单元测试 | AI 生成测试用例 + 执行 | 低 | <1min | 函数级 |
| L3 端到端测试 | 真实浏览器自动化测试 | 中 | <20min | 流程级 |
| L4 LLM 评审 | AI 评判代码质量和文档 | 低 | <30s | 主观质量 |

## 三、CLAUDE.md 编写指南

CLAUDE.md 是 Claude Code 的项目级配置文件，相当于给 AI 工程师的"入职手册"。

### 3.1 基本结构

```markdown
# 项目名称

## 项目概述
[简要描述项目是什么、做什么]

## 技术栈
- 前端：React / Vue / ...
- 后端：Node.js / Python / ...
- 数据库：PostgreSQL / MongoDB / ...

## 开发规范
- 代码风格：[ESLint 配置说明]
- 提交规范：[Conventional Commits]
- 分支策略：[Git Flow / Trunk Based]

## 常用命令
- `npm run dev` — 启动开发服务器
- `npm run test` — 运行测试
- `npm run build` — 构建生产版本

## 重要约束
- [安全要求]
- [性能要求]
- [兼容性要求]
```

### 3.2 进阶技巧

**角色定义**：在 CLAUDE.md 中定义 AI 的行为模式：

```markdown
## AI 行为指引

### 代码审查模式
当被要求审查代码时：
1. 检查安全漏洞（SQL 注入、XSS、CSRF）
2. 评估性能影响
3. 验证错误处理完整性
4. 确认测试覆盖

### 需求分析模式
当收到新需求时：
1. 确认影响范围
2. 识别依赖关系
3. 评估技术风险
4. 提出实现方案（至少 2 个）
```

**gstack 风格的技能定义**：

```markdown
## 可用技能

### /plan — 需求规划
分析需求 → 拆解为可执行任务 → 评估工时 → 生成开发计划

### /qa — 质量检查
运行测试 → 检查覆盖率 → 扫描安全漏洞 → 生成报告

### /ship — 发布准备
同步主分支 → 运行所有测试 → 更新版本号 → 创建 PR
```

## 四、PM 如何与 AI 工程团队协作

### 4.1 需求文档的新写法

传统 PRD 面向人类工程师，AI 时代的 PRD 需要调整：

| 维度 | 传统 PRD | AI 友好 PRD |
|------|---------|------------|
| 描述方式 | 叙述性文字 | 结构化规格 + 验收标准 |
| 设计交付 | Figma 链接 | 设计规范 Token + 组件说明 |
| 技术约束 | 口头沟通 | CLAUDE.md 配置 |
| 测试要求 | 测试用例表格 | 可执行的验收场景 |
| 完成标准 | "功能可用" | 覆盖率 > 80% + QA 通过 + 文档同步 |

### 4.2 评估 AI 工程产出的清单

<script setup>
import { ref, computed } from 'vue'

const checkItems = ref([
  { category: '功能完整性', items: [
    { name: '核心用户流程可走通', checked: false },
    { name: '边界情况有处理', checked: false },
    { name: '错误状态有反馈', checked: false },
    { name: '空状态有设计', checked: false },
  ]},
  { category: '代码质量', items: [
    { name: '测试覆盖率 > 80%', checked: false },
    { name: '无明显安全漏洞', checked: false },
    { name: '性能在可接受范围', checked: false },
    { name: '代码风格一致', checked: false },
  ]},
  { category: '用户体验', items: [
    { name: '响应速度可接受（<200ms 交互，<2s 加载）', checked: false },
    { name: '移动端适配正常', checked: false },
    { name: '无障碍性基本满足', checked: false },
    { name: '与现有设计系统一致', checked: false },
  ]},
  { category: '文档与运维', items: [
    { name: 'README 已更新', checked: false },
    { name: 'API 文档已同步', checked: false },
    { name: '部署文档准确', checked: false },
    { name: '监控和告警已配置', checked: false },
  ]},
])

const totalItems = computed(() => checkItems.value.reduce((sum, cat) => sum + cat.items.length, 0))
const checkedItems = computed(() => checkItems.value.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0))
const progress = computed(() => totalItems.value > 0 ? Math.round((checkedItems.value / totalItems.value) * 100) : 0)
const readiness = computed(() => {
  if (progress.value >= 90) return { text: '✅ 可以发布', color: '#10b981' }
  if (progress.value >= 70) return { text: '⚠️ 基本就绪，建议补齐', color: '#f59e0b' }
  if (progress.value >= 50) return { text: '🟠 尚需完善', color: '#f97316' }
  return { text: '🔴 未就绪', color: '#ef4444' }
})
</script>

<div class="pm-tool">
<h4>AI 工程产出审查清单</h4>
<p style="color: #666; margin-bottom: 16px;">检查 AI 生成代码的发布就绪度</p>

<div v-for="category in checkItems" :key="category.category" style="margin-bottom: 20px;">
  <h5 style="color: #6366f1; margin-bottom: 8px;">{{ category.category }}</h5>
  <div v-for="item in category.items" :key="item.name" style="display: flex; align-items: center; gap: 8px; padding: 6px 0;">
    <input type="checkbox" v-model="item.checked" style="cursor: pointer; width: 18px; height: 18px;" />
    <span :style="{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#94a3b8' : '#334155' }">{{ item.name }}</span>
  </div>
</div>

<div class="pm-result">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <span style="font-weight: bold;">完成度：{{ checkedItems }} / {{ totalItems }}（{{ progress }}%）</span>
    <span :style="{ color: readiness.color, fontWeight: 'bold' }">{{ readiness.text }}</span>
  </div>
  <div style="background: #f1f5f9; border-radius: 12px; height: 12px; overflow: hidden;">
    <div :style="{ width: progress + '%', height: '100%', background: readiness.color, borderRadius: '12px', transition: 'all 0.3s' }"></div>
  </div>
</div>
</div>

## 五、AI 研发工具选型决策框架

| 考量因素 | Copilot 模式 | Agent 模式 | 虚拟团队模式 |
|---------|------------|-----------|------------|
| 团队规模 | 任意 | 1-10 人 | 1-3 人 |
| 技术门槛 | 低 | 中 | 高 |
| 效率提升 | 30-50% | 3-10x | 10-50x |
| 质量风险 | 低 | 中-高 | 低（结构化保障） |
| 月成本/人 | $10-20 | $20-200 | $200+ |
| 适合阶段 | 所有阶段 | 快速验证 | 规模化开发 |
| 代表工具 | Copilot, Codeium | Claude Code, Cursor | gstack |

### 选型建议

- **大型团队（50+ 人）**：Copilot 模式为主，Agent 模式辅助，标准化 CLAUDE.md
- **中型团队（10-50 人）**：Agent 模式为主力，建立团队级 AI 使用规范
- **小型团队（3-10 人）**：Agent + 虚拟团队混合模式
- **Solo 开发者 / 技术型 PM**：gstack 虚拟团队模式最大化个人产出

## 六、未来展望

AI 辅助研发正在从"工具"进化为"基础设施"：

1. **Prompt 即需求**：未来的 PRD 可能就是精心设计的 Prompt 集合
2. **AI 审查 AI**：质量保证将由多个 AI 角色交叉验证
3. **持续集成 AI**：CI/CD 管道中集成 AI 代码审查和安全扫描
4. **产品经理直接"编程"**：通过结构化提示直接生成产品，无需中间翻译

---

::: info 延伸阅读
- [gstack 实战：用 AI 构建虚拟工程团队](/cases/gstack-virtual-team) — 深度拆解 gstack 框架
- [高级 Prompt Engineering](/ai-tools/advanced-prompt-engineering) — 掌握与 AI 协作的核心技能
- [RAG 深度实战指南](/ai-tools/rag-deep-dive) — 构建企业级知识增强系统
:::
