---
title: 审批与授权
description: tea 如何评估工具调用、呈现审批与界定授权。
---

策略评估的是已校验的调用——而非仅工具名——依据执行者、配置、工作区、工具规格、已校验参数、
声明效应、已解析资源、先前授权、执行环境与时间。评估是同步的，不执行副作用、不读取时钟。

## 决策

```text
Allow
Deny(reason)
Ask(approval request)
Redirect(execution target, such as a sandbox)
```

组合优先级为 `Platform -> Organization -> Product -> Workspace -> User grant`。下层可收紧权限，
但不能放宽既有结果。收紧顺序为 `Allow < Redirect < Ask < Deny < HardDeny`；硬拒绝立即终止评估。
为空或完全弃权的策略集失败关闭。

## 审批选择

审批请求是持久化且已脱敏的。选择有：

- **allow once** —— 只授权本次调用；
- **allow for session** —— 为当前会话中匹配的资源签发有界 Grant；
- **deny** —— 拒绝本次调用。

仅在核对精确工具、效应、资源、访问模式与目标后做出选择。审批意为“在已记录策略上下文下授权此
操作”——并不代表该操作安全。

## 授权

匹配的有效授权仅可满足 `Ask`，绝不覆盖拒绝。授权受执行者、配置、精确工具与版本、效应子集、
资源 scheme/prefix/access、范围、签发、到期与撤销约束。会话级授权不是工作区旁路。

## 恢复

审批决策在工具执行恢复前提交。审批挂起时关闭进程，重开后同一请求仍可用。副作用开始后被中断的
工具记录为不确定，且绝不自动回放。见 [会话与恢复](/tea-docs/zh/sessions/sessions/)。
