
const purchaseRequestNumberFormat = (
  currentYear: number,
  currentMonthFormatted: string | number,
  nextPurchaseNumber: number
) => {
  return nextPurchaseNumber < 1000
    ? `${currentYear}-${currentMonthFormatted}-${nextPurchaseNumber
        .toString()
        .padStart(4, "0")}`
    : `${currentYear}-${currentMonthFormatted}-${nextPurchaseNumber.toString()}`;
};

export const generatePrNo = (currentPurchaseNumber: string | undefined) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentMonthFormatted =
    currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  const currentYear = currentDate.getFullYear();

  const last4DigitPRNumber =
    currentPurchaseNumber?.split("-").pop() ?? "0000";

  const nextPurchaseNumber = parseInt(last4DigitPRNumber) + 1;

  if (!currentPurchaseNumber) {
    return purchaseRequestNumberFormat(
      currentYear,
      currentMonthFormatted,
      nextPurchaseNumber
    );
  } else {
    return purchaseRequestNumberFormat(
      currentYear,
      currentMonthFormatted,
      nextPurchaseNumber
    );
  }
};
