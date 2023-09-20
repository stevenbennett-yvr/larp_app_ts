export const intersection = (arr1: any[], arr2: any[]) => {
    const set1 = (arr1);
    const set2 = (arr2);
    return [...set1].filter(value => set2.includes(value));
};