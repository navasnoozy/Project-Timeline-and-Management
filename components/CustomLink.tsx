import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router"

// combine Chakra styling props with React Router's navigation props
interface AppLinkProps extends ChakraLinkProps {
  to: RouterLinkProps["to"]
}

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>((props, ref) => {
  const { to, children, ...chakraProps } = props

  return (
    <ChakraLink
      asChild
      ref={ref}
      // Replicating your original 'display: flex' using Chakra's native prop
      display="flex" 
      // 'alignItems' is usually required when making a link 'flex' to center text vertically
      alignItems="center" 
      {...chakraProps}
    >
      <RouterLink to={to}>
        {children}
      </RouterLink>
    </ChakraLink>
  )
})

AppLink.displayName = "AppLink"