import { z } from "zod";

export const campusdirectorSchema = z.object({
  cd_id: z.string().min(1),
  name: z.string().min(1, { message: "name is required" }),
  designation: z.string().min(1, { message: "designation is required" }),
});

export type CampusDirectorType = z.infer<typeof campusdirectorSchema>;