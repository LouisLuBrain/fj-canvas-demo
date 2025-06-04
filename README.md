# Demo Plan

## Description

A sample demo to implant a canvas demo.
一个简单的 canvas 画布应用示例

## Target:

1. 基本UI还原
2. 绘制和擦除功能，stroke width 画笔粗细设置
3. 上传image
4. 画布缩放
5. history 展示

## Code:

1. UI
    1. page _(FJAIObjectRemovePage.tsx)_
    2. canvas 画布 _(FJCanvasDesk.tsx)_， canvas 工具 _(FJCanvasToolBar.tsx)_
    3. history 展示 _(FJHistoryImagesList.tsx)_
2. Canvas API class _(FJCanvasUtils.ts)_
    1. 初始化
    2. 放置image
    3. 绘制路径
    4. 设置stroke属性
    5. destroy 与销毁
    6. 缩放画布
3. 画布功能
    1. 绘制
    2. 擦除
    3. 缩放
    4. 画笔指针
4. image 上传与展示 _(FJImageUploader.tsx)_
5. history 读取（使用mock data）

## Schedule:

- UI 交互（image, toolbar, range input）**0.5**
- 画布 utils class 和 交互 **1**
- history **0.5**
- 自测 **0.5**

_单位天_

2.5 \* 1.5 = 4

## NOTE:

1. Start component files with `FJ-` prefix
2. Use the module CSS files
