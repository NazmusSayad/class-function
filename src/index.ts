function forEach(obj: any, fn: Function, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  let i
  let l

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (Array.isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj)
    const len = keys.length
    let key

    for (i = 0; i < len; i++) {
      key = keys[i]
      fn.call(null, obj[key], key, obj)
    }
  }
}

const extend = (
  a: any,
  b: any,
  thisArg: any,
  { allOwnKeys }: { allOwnKeys: boolean }
) => {
  forEach(
    b,
    (val: any, key: string) => {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg)
      } else {
        a[key] = val
      }
    },
    { allOwnKeys }
  )
  return a
}

function bind(fn: Function, thisArg: any) {
  return function wrap() {
    return fn.apply(thisArg, arguments)
  }
}

function createClassFunction<T>(ClassConstructor: Function, ...args: any[]): T {
  const context = new (ClassConstructor as any)(...args)
  const instance = bind(ClassConstructor.prototype.default, context)

  // Copy prototype to instance
  extend(instance, ClassConstructor.prototype, context, { allOwnKeys: true })

  // Copy context to instance
  extend(instance, context, null, { allOwnKeys: true })

  return instance as T
}

export default createClassFunction
export { createClassFunction as classFunction, createClassFunction }
