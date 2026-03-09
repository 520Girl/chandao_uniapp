# uni-app 基础模板

基于 `Vue3 + TypeScript + uni-app + Pinia + TailwindCSS` 的多端模板项目，已内置：

- 统一请求封装（`uni.request`）
- Token 注入与 401 处理
- 接口加密/解密（可开关）
- 环境配置分层（`.env.development` / `.env.production`）
- API 域名白名单校验
- 主题切换（`light` / `dark` / `auto`）

## 1. 项目结构

```text
src/
	assets/js/
		api/user.ts        # 用户接口与 token 管理
		request.ts         # 统一请求层（拦截器、加解密、错误处理）
		config.ts          # 环境配置与白名单校验
		crypto.ts          # 加密/解密与签名逻辑
	composables/
		useTheme.ts        # 主题能力
	stores/
		user.ts            # 用户状态
```

## 2. 安装与运行

```bash
pnpm install
pnpm dev:h5
```

小程序调试：

```bash
pnpm dev:mp-weixin
```

生产构建：

```bash
pnpm build:mp-weixin
```

类型检查：

```bash
pnpm type-check
```

## 3. 环境配置分层

已提供：

- `.env.development`
- `.env.production`

关键环境变量：

- `VITE_APP_TITLE`：应用标题
- `VITE_API_BASE_URL`：API 基础地址
- `VITE_UPLOAD_BASE_URL`：上传地址
- `VITE_API_VERSION`：接口前缀（如 `/api`）
- `VITE_API_TIMEOUT`：超时时间（毫秒）
- `VITE_API_DOMAIN_WHITELIST`：域名白名单，逗号分隔

加密相关变量：

- `VITE_SECURITY_ENABLE`：是否启用接口加密（`true/false`）
- `VITE_SECURITY_SECRET_KEY`：加解密密钥
- `VITE_SECURITY_ENCRYPT_METHODS`：启用加密的 HTTP 方法，逗号分隔

示例：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_VERSION=/api
VITE_API_DOMAIN_WHITELIST=api.example.com,backup.example.com
VITE_SECURITY_ENABLE=true
VITE_SECURITY_SECRET_KEY=CHANGE_ME_PROD_SECRET_KEY
VITE_SECURITY_ENCRYPT_METHODS=POST,PUT,PATCH,DELETE
```

## 4. 域名白名单机制

白名单配置读取自 `VITE_API_DOMAIN_WHITELIST`，在请求发起前执行校验：

- 通过：正常请求
- 不通过：直接抛错并中断请求

实现位置：

- `src/assets/js/config.ts`：`isApiDomainAllowed(url)`
- `src/assets/js/request.ts`：请求前调用白名单校验

## 5. 接口加密/解密使用

### 5.1 全局开关

在 `src/assets/js/config.ts` 中通过环境变量控制：

- `VITE_SECURITY_ENABLE=true`：开启加密
- `VITE_SECURITY_ENABLE=false`：关闭加密（默认模板推荐）

### 5.2 请求加密规则

在 `request.ts` 中根据方法判断是否加密，默认加密：

- `POST`
- `PUT`
- `PATCH`
- `DELETE`

加密后会自动附加请求头：

- `X-Encrypted: 1`
- `X-Encrypt-Alg: XOR-BASE64`

### 5.3 单接口覆盖

可在调用时覆盖默认策略：

```ts
import { post } from "@/assets/js/request";

// 强制加密
post("/order/create", { amount: 100 }, { encrypt: true });

// 强制不加密
post("/order/create", { amount: 100 }, { encrypt: false });
```

### 5.4 响应解密

响应拦截器会自动尝试解密加密包，并做签名校验。非加密响应会保持原样返回。

## 6. 请求层约定

统一入口：`src/assets/js/request.ts`

- `get(url, params?, options?)`
- `post(url, data?, options?)`
- `put(url, data?, options?)`
- `del(url, options?)`
- `patch(url, data?, options?)`

默认行为：

- 自动拼接：`baseURL + apiVersion + url`
- 自动注入 token（`Authorization: Bearer xxx`）
- HTTP 状态码统一处理
- 401 自动触发刷新 token 流程（当前为基础实现）

## 7. 主题能力

主题相关位于 `src/composables/useTheme.ts`：

- 模式：`light` / `dark` / `auto`
- 方法：`getTheme`、`setTheme`、`toggleTheme`、`initTheme`
- 小程序与 App 端支持主题变更事件同步

## 8. 模板落地建议

建议在正式业务接入前完成以下事项：

- 将示例密钥替换为后端协商密钥
- 对接后端真实加密协议（建议 `AES-GCM` 或国密 `SM4`）
- 增加并发 401 刷新队列（避免重复刷新）
- 补齐业务状态码规范和错误码映射
- 给 `request` 增加泛型返回（`request<T>()`）

## 9. 常见问题

1. 为什么请求被拦截提示域名不在白名单？
   请检查 `.env.*` 中 `VITE_API_DOMAIN_WHITELIST` 是否包含目标 API 域名。
2. 为什么开启加密后后端收不到明文？
   当前模板会把请求体封装为加密包，后端需同步解密协议。
3. 如何快速关闭加密排查问题？
   将 `VITE_SECURITY_ENABLE` 改为 `false`，重启项目即可。
