import { Field, type InputProps } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { PasswordInput } from "@/components/ui/password-input"

interface FormPasswordFieldProps extends InputProps {
  name: string
  label: string
}

const FormPasswordField = ({ name, label, ...props }: FormPasswordFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <Field.Root invalid={!!error} width="full">
      <Field.Label fontWeight="medium">
        {label}
      </Field.Label>

      <PasswordInput
        {...register(name)}
        {...props}
      />

      <Field.ErrorText>
        {error?.message?.toString()}
      </Field.ErrorText>
    </Field.Root>
  )
}

export default FormPasswordField
