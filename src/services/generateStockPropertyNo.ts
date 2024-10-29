import { ItemType } from "@/types/request/item"

export const generateStockPropertyNo = (items: ItemType[]) => {
  const last_stock_no: number  = items && parseInt(items![items!.length - 1]?.stock_property_no)
  const next_stock_no = last_stock_no ? last_stock_no + 1 : 1

  return next_stock_no
}
