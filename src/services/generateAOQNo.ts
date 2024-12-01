import { abstractType_ } from "@/types/response/abstract-of-quotation";

export const generateAOQNo = (data: abstractType_[], pr_no: string): string => {
  const abstractHasSamePr = data.filter(abstract => abstract.pr_details.pr_no === pr_no);

  // If no existing abstracts for this pr_no, start with 'A'
  if (abstractHasSamePr.length === 0) {
    return `${pr_no}A`;
  }

  // Sort by created_at in descending order (latest first)
  abstractHasSamePr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const latestAOQNo = abstractHasSamePr[0].aoq_no ?? "";
  const lastChar = latestAOQNo.slice(-1);

  // Increment the letter
  const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);

  return `${pr_no}${nextChar}`;
};
