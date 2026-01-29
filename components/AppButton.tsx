//apps/client/src/components/AppButton.tsx
import { Button, type ButtonProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router"

// Combine Chakra's ButtonProps with the optional 'to' prop from React Router
// We omit 'as' from ButtonProps to prevent conflicts if strict typing is enabled
interface AppButtonProps extends Omit<ButtonProps, "as"> {
  to?: RouterLinkProps["to"]
  isLoading?: boolean
  // Note: startIcon and endIcon are removed in favor of direct children composition
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ to, children, isLoading, ...props }, ref) => {
    
    // Pattern 1: If it's a link, use asChild for composition
    if (to) {
      return (
        <Button
          asChild
          ref={ref}
          rounded="full"
          loading={isLoading}
          {...props}
        >
          <RouterLink to={to}>
            {children}
          </RouterLink>
        </Button>
      )
    }

    // Pattern 2: Standard Button behavior
    return (
      <Button
        ref={ref}
        rounded="full"
        loading={isLoading}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

AppButton.displayName = "AppButton"