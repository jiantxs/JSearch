type DeadlineCallback = Function

class Interval<T> {
  private defaultValues = new Map<string, T>();
  private currentValues = new Map<string, T>();
  private callbacks: DeadlineCallback[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(resetHours: number) {
    if(resetHours == 0){
      return
    }
    const interval = resetHours * 60 * 60 * 1000;
    this.timer = setInterval(() => {
      this.triggerCallbacks();
      this.resetValues();
    }, interval);
  }

  // 设置/更新键值
  set(key: string, value: T): void {
    if (!this.defaultValues.has(key)) {
      this.defaultValues.set(key, value);
    }
    this.currentValues.set(key, value);
  }

  // 获取当前值
  get(key: string): T | undefined {
    return this.currentValues.get(key);
  }

  // 获取所有键
  listKeys(): string[] {
    return Array.from(this.defaultValues.keys());
  }

  // 删除键值对
  remove(key: string): boolean {
    const hasKey = this.defaultValues.has(key);
    if (hasKey) {
      this.defaultValues.delete(key);
      this.currentValues.delete(key);
    }
    return hasKey;
  }

  // 注册回调
  registerCallback(callback: DeadlineCallback): void {
    this.callbacks.push(callback);
  }

  // 触发回调
  private triggerCallbacks(): void {
    this.callbacks.forEach(cb => cb(this));
  }

  // 重置操作
  private resetValues(): void {
    this.currentValues = new Map(this.defaultValues);
  }

  // 清理定时器
  dispose(): void {
    if(this.timer != null){
      clearInterval(this.timer);
    }
  }
}


export default Interval;
