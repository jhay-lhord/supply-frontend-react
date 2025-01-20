import { z } from "zod";

export const campusdirectorSchema = z.object({
  cd_id: z.string().min(1),
  first_name: z.string().min(1, { message: "name is required" }),
  last_name: z.string().min(1, { message: "name is required" }),
  middle_name: z.string().optional(),
  name: z.string().optional(), //i will be concatenate the first_name, last_name, middle_name into name later in saving
  designation: z.string().min(1, { message: "designation is required" }),
});

export type CampusDirectorType = z.infer<typeof campusdirectorSchema>;

export const editCampusdirectorSchema = z.object({
  cd_id: z.string().min(1),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  name: z.string().optional(), //i will be concatenate the first_name, last_name, middle_name into name later in saving
  designation: z.string().min(1, { message: "designation is required" }),
});

export type EditCampusDirectorType = z.infer<typeof campusdirectorSchema>;