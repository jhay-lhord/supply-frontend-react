export function digitsToWords(amount: number): string {
  const ones: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens: string[] = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens: string[] = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertLessThanOneThousand = (n: number): string => {
    if (n >= 100) {
      return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100);
    }
    if (n >= 20) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    }
    if (n >= 10) {
      return teens[n - 10];
    }
    return ones[n];
  };

  const convert = (n: number): string => {
    if (n === 0) return 'Zero';
    const billion = Math.floor(n / 1000000000);
    const million = Math.floor((n % 1000000000) / 1000000);
    const thousand = Math.floor((n % 1000000) / 1000);
    const remainder = n % 1000;

    let result = '';
    if (billion) result += convertLessThanOneThousand(billion) + ' Billion ';
    if (million) result += convertLessThanOneThousand(million) + ' Million ';
    if (thousand) result += convertLessThanOneThousand(thousand) + ' Thousand ';
    if (remainder) result += convertLessThanOneThousand(remainder);
    return result.trim();
  };

  const [integerPart, decimalPart] = amount.toFixed(2).split('.');
  const integerWords = convert(parseInt(integerPart));
  const decimalWords = convert(parseInt(decimalPart));

  return `${integerWords} Pesos${decimalPart !== '00' ? ` and ${decimalWords} Centavos` : ''} Only`;
}

