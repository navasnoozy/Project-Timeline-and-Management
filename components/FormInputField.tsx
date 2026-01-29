import {
  Field,
  Input,
  type InputProps,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

interface FormInputFieldProps extends InputProps {
  name: string
  label: string
}

const FormInputField = ({ name, label, ...props }: FormInputFieldProps) => {
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

      <Input
        {...register(name)}
        {...props}
      />

      <Field.ErrorText>
        {error?.message?.toString()}
      </Field.ErrorText>
    </Field.Root>
  )
}

export default FormInputField