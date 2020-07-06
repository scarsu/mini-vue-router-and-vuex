// 创建Router类
- 转存options
- 提前处理路由表，缓存path和route的映射map，避免每次都循环遍历
- 定义响应式current属性，代表当前hash路由
- 添加hashChange事件和load事件监听
- 事件处理函数职责：变更响应式属性current

// 实现插件install方法
- 保存Vue根实例传入的router选项