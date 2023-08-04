export const getNumberBelow = (array: any, num: number) => {
    for (let i = 1; i < array.length; i++) {
      if (num < array[i]) {
        return array[i-1];
      }
    }
    return array[array.length-1];
  };