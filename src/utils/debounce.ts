export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = undefined
      func(...args)
    }

    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    
    timeout = window.setTimeout(later, wait)
  }
}