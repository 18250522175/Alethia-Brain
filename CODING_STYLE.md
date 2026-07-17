# Alethia AI 代码写作规范

> 可读性优先。注释解释"为什么（Why）"，不解释"是什么（What）"。
> **这份代码是写给一年后的自己看的。**
> 完整 HTML 版本：[alethia-coding-style.html](https://alethia-docs/alethia-coding-style/alethia-coding-style.html)

---

## 1. 命名规范

### 文件

| 类型 | 命名 | 示例 |
|------|------|------|
| React 组件 | PascalCase | `UserOrderPanel.tsx` |
| 工具函数 | camelCase | `formatDate.ts` |
| 类型定义 | PascalCase | `AgentTypes.ts` |
| 测试文件 | `*.test.ts` | `formatDate.test.ts` |

### 变量

| 类型 | 规则 | 示例 |
|------|------|------|
| 类/接口/类型 | PascalCase | `BrainAPI`, `AgentConfig` |
| 函数/方法/变量 | camelCase | `getUserById`, `extractFacts` |
| 布尔变量 | `is/has/can/should` 开头 | `isValid`, `hasPermission` |
| 常量 | 全大写 + 下划线 | `MAX_RETRY_COUNT`, `DEFAULT_DAILY_BUDGET` |
| React 组件 | PascalCase 函数组件 | `UserProfileCard` |
| React Props 类型 | `组件名Props` | `UserProfileCardProps` |

---

## 2. TypeScript 规范

### 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 类型 vs 接口

```typescript
// 对象形状 → interface
interface AgentConfig {
  name: string;
  tools: Tool[];
}

// 联合/交叉/工具类型 → type
type SearchResult = VectorResult | FullTextResult | GraphResult;
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
```

### 禁止 any，优先 unknown

```typescript
// BAD
function parse(data: any): any { ... }

// GOOD
function parse(data: unknown): ParsedData {
  if (!isValidData(data)) throw new Error('...');
  return data as ParsedData;
}
```

### 类型守卫

```typescript
function isAgentConfig(obj: unknown): obj is AgentConfig {
  return typeof obj === 'object' && obj !== null && 'name' in obj && 'tools' in obj;
}
```

---

## 3. React 规范

### 组件定义

```typescript
// 函数组件 + Hooks，禁止 class 组件
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const user = useUser(userId);
  const handleSave = () => { onUpdate?.(user); };

  return <Card>{/* ... */}</Card>;
}
```

### Hooks 规则

- 自定义 Hook 以 `use` 开头
- `useEffect` 必须有依赖数组和清理函数
- Zustand store 命名 `useXxxStore`

### 事件处理

- Handler 命名 `handleXxx`
- Props 回调命名 `onXxx`

---

## 4. 注释规范（核心）

### 黄金法则

> **注释解释"为什么（Why）"，不解释"是什么（What）"。**
> 代码说明"做什么"，注释说明"为什么这样做"。

### 文件头

```typescript
/**
 * BrainAPI - 统一服务层入口
 * 将 KnowledgeService、AgentService、OrchestrationService、SystemService
 * 聚合为单一 Facade，对外暴露简洁的接口。
 *
 * 所有外部调用（Web/CLI/MCP）都通过此模块，不直接访问各子服务。
 */
```

### 函数 JSDoc（所有公共函数必须）

```typescript
/**
 * 提取文档中的事实三元组（主体-关系-客体）。
 *
 * 使用 LLM 进行语义理解，支持中文为主、英文为辅的双语场景。
 * 提取结果会写入 Markdown 文件的 Hyper Relations 区块。
 *
 * @param docPath - 文档路径（相对于知识库根目录）
 * @param options.language - 文档主要语言，默认 'zh'
 * @param options.maxTriples - 最大提取三元组数量，默认 50
 * @returns 提取的三元组数组，提取失败时返回空数组
 * @throws {FileNotFoundError} 文档不存在时抛出
 * @throws {LLMTimeoutError} LLM 调用超时（> 30s）时抛出
 *
 * @example
 * ```typescript
 * const triples = await extractFacts('/notes/research.md', { maxTriples: 20 });
 * console.log(triples[0]); // { subject: 'Alethia', relation: 'uses', object: 'pgvector' }
 * ```
 */
async function extractFacts(
  docPath: string,
  options?: ExtractOptions
): Promise<Triple[]>
```

### 行内注释

```typescript
// BAD — 废话注释
const user = createUser(name, email); // 创建用户

// GOOD — 解释"为什么"
const user = createUser(name, email); // 新用户注册后自动创建个人知识库，必须在写入前完成

// GOOD — 引用算法来源
// 使用 RRF 算法（Reciprocal Rank Fusion），k=60 是经验最优值
// 参考: Cormack et al., "Reciprocal Rank Fusion outperforms Condorcet", SIGIR 2009
const merged = rrf([vecResults, fullTextResults, graphResults], 60);

// FIXME 和 TODO 必须带姓名和日期
// FIXME(张三 2026-07-18): 临时绕过 pgvector HNSW 在 PGLite 下的索引构建 bug
// 等待 PGLite 0.3.0 修复后移除此 workaround，见 Issue #234
```

### 注释反模式

| 绝对不要做 | 为什么 |
|-----------|--------|
| 写废话注释 | `// 循环遍历数组` 在 `for (const item of items)` 上面 |
| 注释掉的代码 | 删掉它，Git 历史可以找回 |
| 误导性注释 | 代码改了但注释没改，比没注释更恶劣 |
| `// TODO` 不带姓名和日期 | 等于没写，没人知道谁该做什么 |

---

## 5. 异常处理

### 原则

- **绝不吞掉异常**：catch 后必须打日志或重新抛出
- **不捕获通用 Exception**：捕获具体子类
- **业务异常用自定义 Error 类**

### 自定义异常

```typescript
// 统一基类
class BaseError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly httpStatus: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

class BrainAPIError extends BaseError {
  constructor(message: string) {
    super(message, 'BRAIN_API_ERROR', 500);
  }
}

class AgentExecutionError extends BaseError {
  constructor(message: string, public readonly agentName: string) {
    super(message, 'AGENT_EXECUTION_ERROR', 500);
  }
}
```

---

## 6. 日志规范

### 级别定义

| 级别 | 说明 | 生产环境 |
|------|------|----------|
| `ERROR` | 系统错误，需人工立即介入 | 开启 |
| `WARN` | 异常但可自动恢复 | 开启 |
| `INFO` | 核心业务节点 | 开启 |
| `DEBUG` | 调试信息 | **关闭** |

### 格式

```typescript
// 结构化 JSON 日志
logger.info('知识摄入完成', {
  module: 'ingestion',
  traceId: 'req-abc123',
  context: { docId: 'doc-456', format: 'pdf', durationMs: 2300 }
});
```

---

## 7. 数据库规范

### 表与字段

```sql
-- 表名：小写 + 下划线 + 复数
CREATE TABLE user_knowledge (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 必须建索引
CREATE INDEX idx_user_knowledge_user_id ON user_knowledge(user_id);
```

### 安全红线

- 参数化查询（Drizzle ORM 默认安全）
- 严禁字符串拼接 SQL
- 严禁 `SELECT *`
- 外键必须建索引

---

## 8. 工具链

### 配置文件清单

| 文件 | 用途 |
|------|------|
| `.editorconfig` | 编辑器统一缩进/编码 |
| `.prettierrc` | 代码格式化 |
| `.eslintrc.cjs` | 代码质量检查 |
| `commitlint.config.cjs` | 提交信息校验 |
| `.husky/pre-commit` | 提交前自动 lint |
| `.husky/commit-msg` | 提交信息格式校验 |
| `lint-staged.config.js` | 暂存区文件检查 |

### 安装

```bash
bun add -D prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-import @commitlint/cli @commitlint/config-conventional \
  husky lint-staged

# 初始化 husky
bun husky init
```

---

## 9. 目录结构

```
alethia/
├── packages/
│   ├── brain/          # 后端核心服务（BrainAPI）
│   │   └── src/
│   │       ├── api/        # 路由与中间件
│   │       ├── services/   # 业务逻辑
│   │       ├── models/     # 数据模型
│   │       ├── utils/      # 工具函数
│   │       └── __tests__/  # 测试
│   ├── web/            # 前端 React 应用
│   │   └── src/
│   │       ├── components/ # 通用组件
│   │       ├── pages/      # 页面组件
│   │       ├── hooks/      # 自定义 Hooks
│   │       ├── stores/     # Zustand stores
│   │       └── utils/      # 工具函数
│   └── cli/            # CLI 工具
├── docs/               # 文档
├── scripts/            # 脚本
├── .editorconfig
├── .prettierrc
├── .eslintrc.cjs
├── commitlint.config.cjs
├── CONTRIBUTING.md
└── CODING_STYLE.md
```