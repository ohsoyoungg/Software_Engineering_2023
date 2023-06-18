export const dateFormatter = (inputDate) => {
  const year = inputDate.getFullYear()
  const month = inputDate.getMonth() + 1
  const date = inputDate.getDate()

  return [year, month.toString().padStart(2, '0'), date.toString().padStart(2, '0')].join('-')
}
