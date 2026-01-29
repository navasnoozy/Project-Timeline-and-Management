import { chakra, type HTMLChakraProps } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { FormProvider, useForm, type FieldValues, type SubmitHandler, type UseFormProps } from "react-hook-form";
import type { ZodType } from "zod";

// Merge Chakra's styling props with React Hook Form's logical props
interface FormProps<T extends FieldValues> extends Omit<HTMLChakraProps<"form">, "onSubmit" | "children">, Omit<UseFormProps<T>, "resolver"> {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  schema: ZodType<T, any, any>;
}

export const Form = <T extends FieldValues>(props: FormProps<T>) => {
  const {
    children,
    onSubmit,
    schema,
    // Destructure specific generic UseFormProps to prevent passing them to the DOM
    mode = "onBlur",
    reValidateMode,
    defaultValues,
    values,
    resetOptions,
    criteriaMode,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    delayError,
    context,
    ...formProps // Collect remaining Chakra style props (e.g., width, display, gap)
  } = props;

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode,
    reValidateMode,
    defaultValues,
    values,
    resetOptions,
    criteriaMode,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    delayError,
    context,
  });

  return (
    <FormProvider {...methods}>
      <chakra.form
        // Handle submit via react-hook-form
        onSubmit={methods.handleSubmit(onSubmit)}
        // Disable native HTML validation to let Zod handle it
        noValidate
        // Spread Chakra style props onto the form element
        {...formProps}
      >
        {children}
      </chakra.form>
    </FormProvider>
  );
};
