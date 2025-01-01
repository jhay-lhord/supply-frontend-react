export function generatePONo(prNo: string, supplierIndex: number, hasMultipleSuppliers: boolean): string {
  if (!hasMultipleSuppliers) {
    return prNo;
  }
  
  const letterCode = String.fromCharCode(65 + supplierIndex); // 65 is ASCII for 'A'
  return `${prNo}${letterCode}`;
}

export function hasMultipleSuppliers(suppliers: any[]): boolean {
  return suppliers.length > 1;
}

