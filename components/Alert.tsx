//apps/client/src/components/Alert.tsx

import { Alert, Stack } from "@chakra-ui/react"

interface AlertNotifyProps {
  success: boolean
  message?: string | null
  messages?: { message: string; field?: string }[] | null
}

const AlertNotify = ({ success, message, messages }: AlertNotifyProps) => {
  const status = success ? "success" : "error"
  const hasMessages = messages && messages.length > 0

  if (!hasMessages && !message) return null

  return (
    <Alert.Root status={status} maxH="150px" overflowY="auto" mb={4}>
      <Alert.Indicator />
      <Alert.Content wordBreak="break-word">
        <Alert.Description>
          {hasMessages ? (
            <Stack gap="1">
              {messages!.map((msg, index) => (
                <div key={index}>{msg.message}</div>
              ))}
            </Stack>
          ) : (
            message
          )}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}

export default AlertNotify