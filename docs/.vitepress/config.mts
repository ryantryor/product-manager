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
      { text: 'AI 工具链', link: '/ai-tools/overview' },
      { text: '产品方法论', link: '/methodology/overview' },
      { text: '实战案例', link: '/cases/overview' },
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
      '/cases/': [
        {
          text: '实战案例',
          items: [
            { text: '概览', link: '/cases/overview' },
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
