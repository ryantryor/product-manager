import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI Native 产品经理',
  description: '成为 AI Native 产品经理的知识沉淀',
  lang: 'zh-CN',
  base: '/product-manager/',

  head: [
    ['link', { rel: 'icon', href: '/product-manager/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '入门指南', link: '/guide/what-is-ai-native-pm' },
      {
        text: '知识体系',
        items: [
          { text: 'AI 技术基础', link: '/ai-foundations/overview' },
          { text: 'AI 工具链', link: '/ai-tools/overview' },
          { text: 'AI 产品设计', link: '/product-design/overview' },
          { text: '产品方法论', link: '/methodology/overview' },
        ],
      },
      {
        text: '进阶',
        items: [
          { text: 'AI 产品战略', link: '/strategy/overview' },
          { text: 'AI 伦理与治理', link: '/ethics/overview' },
        ],
      },
      { text: '实战案例', link: '/cases/overview' },
      { text: '学习资源', link: '/resources/overview' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '什么是 AI Native 产品经理', link: '/guide/what-is-ai-native-pm' },
            { text: '传统 PM vs AI Native PM', link: '/guide/traditional-vs-ai-native' },
            { text: '学习路径', link: '/guide/learning-path' },
          ],
        },
      ],
      '/ai-foundations/': [
        {
          text: 'AI 技术基础',
          items: [
            { text: '概览', link: '/ai-foundations/overview' },
            { text: '机器学习核心概念', link: '/ai-foundations/ml-basics' },
            { text: 'LLM 深度理解', link: '/ai-foundations/llm-deep-dive' },
            { text: 'AI 应用架构模式', link: '/ai-foundations/architecture-patterns' },
            { text: '数据策略', link: '/ai-foundations/data-strategy' },
          ],
        },
      ],
      '/ai-tools/': [
        {
          text: 'AI 工具链',
          items: [
            { text: '概览', link: '/ai-tools/overview' },
            { text: 'LLM 基础认知', link: '/ai-tools/llm-basics' },
            { text: 'Prompt Engineering', link: '/ai-tools/prompt-engineering' },
            { text: 'AI 产品设计工具', link: '/ai-tools/design-tools' },
          ],
        },
      ],
      '/product-design/': [
        {
          text: 'AI 产品设计与体验',
          items: [
            { text: '概览', link: '/product-design/overview' },
            { text: '人机交互准则', link: '/product-design/human-ai-interaction' },
            { text: 'AI UX 设计原则', link: '/product-design/ai-ux-principles' },
            { text: 'AI 设计模式', link: '/product-design/ai-design-patterns' },
            { text: '信任与安全设计', link: '/product-design/trust-and-safety' },
          ],
        },
      ],
      '/methodology/': [
        {
          text: '产品方法论',
          items: [
            { text: '概览', link: '/methodology/overview' },
            { text: 'AI 产品需求分析', link: '/methodology/requirements' },
            { text: 'AI 功能设计模式', link: '/methodology/design-patterns' },
            { text: '数据驱动决策', link: '/methodology/data-driven' },
          ],
        },
      ],
      '/strategy/': [
        {
          text: 'AI 产品战略',
          items: [
            { text: '概览', link: '/strategy/overview' },
            { text: '产品战略框架', link: '/strategy/product-strategy' },
            { text: '商业化与定价', link: '/strategy/monetization' },
            { text: '路线图规划', link: '/strategy/roadmap' },
            { text: '跨职能协作', link: '/strategy/cross-functional' },
          ],
        },
      ],
      '/ethics/': [
        {
          text: 'AI 伦理与治理',
          items: [
            { text: '概览', link: '/ethics/overview' },
            { text: '负责任 AI 原则', link: '/ethics/responsible-ai' },
            { text: '合规与监管', link: '/ethics/compliance' },
            { text: 'AI 评估体系', link: '/ethics/evaluation' },
          ],
        },
      ],
      '/cases/': [
        {
          text: '实战案例',
          items: [
            { text: '概览', link: '/cases/overview' },
          ],
        },
      ],
      '/resources/': [
        {
          text: '学习资源',
          items: [
            { text: '资源汇总', link: '/resources/overview' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryantryor/product-manager' },
    ],

    footer: {
      message: '用 AI 思维做产品',
      copyright: '© 2026 AI Native 产品经理知识库',
    },

    search: {
      provider: 'local',
    },

    outline: {
      label: '目录',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
