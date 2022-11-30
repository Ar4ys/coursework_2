export function formDataToObject(formTarget: FormData | HTMLFormElement) {
  const formData = formTarget instanceof FormData ? formTarget : new FormData(formTarget)
  return Object.fromEntries(formData.entries())
}
