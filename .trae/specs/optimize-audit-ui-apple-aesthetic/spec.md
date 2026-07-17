# 审计 UI 优化 —— Apple 高级感 Spec

## Why
当前 Alethia 的审计界面（Diff 审核面板、计划审核器、人在回路节点、Dashboard 待审核变更）功能齐全但视觉风格偏工具化，缺乏精致感和品牌辨识度。需要注入 Apple 设计风格的高级感，让用户在审核 AI 产出时获得愉悦、信任、专注的体验。

## What Changes
- 审计相关 UI 组件全面升级为 Apple 风格（毛玻璃、圆角、柔和阴影、SF 风格字体、微动效）
- Diff 审核面板视觉重构：卡片式布局、渐进式风险提示、弹性动画
- 计划审核器视觉重构：信息层级优化、呼吸感间距
- Dashboard 待审核变更卡片重构
- 所有审计交互增加微动效反馈（spring 动画、hover 状态、过渡）
- 统一审计色彩体系（低/中/高风险用 Apple 风格语义色）

## Impact
- Affected specs: UI 设计规范、代码写作规范
- Affected code: Diff 审核面板组件、计划审核器组件、人在回路节点组件、Dashboard 审计卡片、全局 CSS 变量/主题

---

## ADDED Requirements

### Requirement: Apple 风格审计色彩体系
系统 SHALL 提供一套 Apple 风格的审计语义色彩变量，替代现有纯色标记。

#### Scenario: 三级风险色值
- **WHEN** 审计界面展示风险等级
- **THEN** 低风险使用柔和翠绿色（`#34C759`），中风险使用暖琥珀色（`#FF9F0A`），高风险使用柔和红色（`#FF453A`），均搭配半透明背景

#### Scenario: 暗色模式适配
- **WHEN** 系统处于暗色模式
- **THEN** 风险色彩自动切换为高对比度暗色变体，保持可读性

---

### Requirement: 毛玻璃审计面板
系统 SHALL 为审计面板提供毛玻璃（frosted glass）视觉风格。

#### Scenario: 审计面板背景
- **WHEN** 审计面板渲染
- **THEN** 面板背景使用 `backdrop-filter: blur(20px)` 配合半透明背景色，呈现毛玻璃效果

#### Scenario: 面板层级
- **WHEN** 多个审计面板叠加（如弹窗确认）
- **THEN** 每层面板有递增的模糊度和阴影，形成清晰的视觉层级

---

### Requirement: Diff 审核面板卡片式重构
系统 SHALL 将 Diff 审核面板重构为卡片式布局，每条变更独立成卡。

#### Scenario: 变更卡片展示
- **WHEN** 用户查看 Diff 审核面板
- **THEN** 每条变更渲染为独立圆角卡片（`border-radius: 16px`），包含风险等级指示条、变更摘要、diff 对比视图、操作按钮

#### Scenario: 风险等级渐进提示
- **WHEN** 变更卡片存在风险等级
- **THEN** 卡片左侧显示 4px 宽彩色指示条，高风险卡片有微弱红色呼吸光晕动画吸引注意

#### Scenario: 批量操作
- **WHEN** 存在多条待审核变更
- **THEN** 顶部固定悬浮操作栏（毛玻璃效果），显示"全部接受"/"全部拒绝"按钮和变更计数

---

### Requirement: 审计微动效
系统 SHALL 为审计操作提供 Apple 风格的微动效反馈。

#### Scenario: 接受变更
- **WHEN** 用户点击"接受"按钮
- **THEN** 卡片以 spring 动画（`cubic-bezier(0.34, 1.56, 0.64, 1)`）缩小并淡出，相邻卡片平滑上移填补空位

#### Scenario: 拒绝变更
- **WHEN** 用户点击"拒绝"按钮
- **THEN** 卡片以轻微抖动 + 淡出动画退出，表示否定操作

#### Scenario: 悬停反馈
- **WHEN** 用户鼠标悬停在变更卡片上
- **THEN** 卡片以 `transform: scale(1.01)` 和阴影加深响应，过渡时间 200ms

---

### Requirement: 计划审核器视觉重构
系统 SHALL 重构计划审核器为 Apple 风格的信息层级布局。

#### Scenario: 工作流步骤展示
- **WHEN** 计划审核器展示待审核工作流
- **THEN** 步骤以圆角连接线 + 节点形式展示，已完成步骤为实心，待审核步骤为描边样式，高风险步骤有警告标识

#### Scenario: 人在回路审核节点
- **WHEN** 工作流中存在人工审核节点
- **THEN** 审核节点以突出但非侵略性的样式展示（柔和边框 + 图标 + 说明文字），点击展开审核操作区

---

### Requirement: Dashboard 审计卡片
系统 SHALL 重构 Dashboard 中的"待审核变更"卡片为 Apple 风格。

#### Scenario: 审计概览卡片
- **WHEN** Dashboard 渲染审计概览
- **THEN** 卡片使用毛玻璃背景，显示变更数量、风险分布（小圆点颜色指示）、最近变更摘要，点击跳转审计面板

---

### Requirement: 字体与排版升级
系统 SHALL 使用 SF 风格字体栈替代现有字体。

#### Scenario: 审计界面字体
- **WHEN** 审计界面渲染
- **THEN** 标题使用 `-apple-system, 'SF Pro Display'` 字体栈，正文使用 `-apple-system, 'SF Pro Text'` 字体栈，代码使用 `'SF Mono', 'JetBrains Mono'` 字体栈

#### Scenario: 排版呼吸感
- **WHEN** 审计界面渲染
- **THEN** 卡片内边距 ≥ 20px，卡片间距 ≥ 16px，段落行高 ≥ 1.6，标题与正文间距 ≥ 12px

---

## MODIFIED Requirements

### Requirement: 现有 Diff 审核面板
**Before**: 使用 diff2html 风格对比视图，绿色/黄色/红色标记，基础操作按钮。
**After**: 升级为 Apple 风格卡片式布局，毛玻璃背景，spring 动画，SF 字体，渐进式风险提示。

### Requirement: 现有 Dashboard 待审核变更
**Before**: 简单数字指标卡片，深色背景。
**After**: 升级为毛玻璃卡片，风险分布可视化，点击跳转。

## REMOVED Requirements
无。