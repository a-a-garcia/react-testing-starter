import * as z from "zod";

export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(255).refine((val) => val.trim().length > 0, { message: "Name cannot be blank" }),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .min(1)
    .max(1000),
  categoryId: z.number({
    required_error: "Category is required",
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
