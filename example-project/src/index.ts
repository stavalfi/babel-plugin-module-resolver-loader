import isNumber from 'lodash/isNumber'
export { r1 } from 'bobo'
export default (x: number | undefined = undefined) =>
  // @ts-ignore
  console.log('yohoho!!!', isNumber, x + 1)
