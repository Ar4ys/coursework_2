export function formDataToObject(formTarget: FormData | HTMLFormElement) {
  const formData = formTarget instanceof FormData ? formTarget : new FormData(formTarget)
  return Object.fromEntries(formData.entries() as IterableIterator<[string, string]>)
}

export function toSerializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
