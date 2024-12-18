export const generatePONo = (isManySupplier: boolean, pr_no: string, existingPONos: string[] = []) => {
  if (!isManySupplier) return pr_no;

  let suffix = 'A';
  let newPONo = `${pr_no}${suffix}`;

  while (existingPONos.includes(newPONo)) {
    suffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
    newPONo = `${pr_no}${suffix}`;

    // If all letter is being used, start adding double letters
    if (suffix > 'Z') {
      suffix = 'AA';
      newPONo = `${pr_no}${suffix}`;
    }
  }

  return newPONo;
};
