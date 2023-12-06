function calculateNextGameDate(dayOfWeek: number, occurrence: number) {
    if (occurrence < 1) {
        throw new Error("Occurrence should be greater than or equal to 1.");
    }

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    let nextGameDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Move to the desired day of the week and occurrence within the month
    const dayDifference = (dayOfWeek - nextGameDate.getDay() + 7) % 7;
    nextGameDate.setDate(1 + dayDifference + (occurrence - 1) * 7);

    // If the calculated date is in the past, move to the first day of the next month
    if (nextGameDate < yesterday) {
        nextGameDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Move to the desired day of the week and occurrence within the month
        const dayDifferenceAfterMonthChange = (dayOfWeek - nextGameDate.getDay() + 7) % 7;
        nextGameDate.setDate(1 + dayDifferenceAfterMonthChange + (occurrence - 1) * 7);
    }

    return nextGameDate;
}

export default calculateNextGameDate;