import isNumber from 'lodash/isNumber'

export default (x: number | undefined = undefined) =>
  // @ts-ignore
  console.log('yohoho!!!', isNumber, x + 1)
