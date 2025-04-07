export function parsePageParam(param: string | string[] | undefined): number {
  const str = Array.isArray(param) ? param[0] : param
  const num = Number(str)
  return isNaN(num) ? 1 : num
}
