import { z } from 'zod'
 
/// DEFINITION S'INSCRIR
export const SignupFormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  adress: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(6, { message: 'Be at least 6 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
})
 
export type FormState =
  | {
      errors?: {
        first_name?: string[]
        last_name?: string[]
        adress?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined