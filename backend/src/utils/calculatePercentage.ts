export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    return Number((((thisMonth - lastMonth) / (lastMonth == 0 ? 1 : lastMonth)) * 100).toFixed(0))
}