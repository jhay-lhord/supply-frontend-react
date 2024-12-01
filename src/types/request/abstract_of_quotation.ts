import { z } from "zod";

export type itemSelectedQuoteType = {
  item_selected_no: string;
  aoq: string;
  purchase_request: string;
  rfq: string;
  item_qoutation: string;
  is_item_selected: boolean;
  total_amount: string;
};

export const abstractSchema = z.object({
  aoq_no: z.string(),
  rfq: z.string(),
  purchase_request: z.string(),
  item_quotation: z.string(),
});

export type abstractType = z.infer<typeof abstractSchema>;
