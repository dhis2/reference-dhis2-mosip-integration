import { Button, IconCheckmark24, CircularLoader } from '@dhis2/ui'

interface StatusButtonProps {
  status: 'idle' | 'loading' | 'done'
  idleText: string
  loadingText: string
  doneText: string
  onClick?: () => void
}

export const StatusButton = ({ status, idleText, loadingText, doneText, onClick }: StatusButtonProps) => {
  if (status === 'loading') {
    return (
      <Button icon={<CircularLoader />} loading secondary>
        {loadingText}
      </Button>
    )
  }
  if (status === 'done') {
    return (
      <Button icon={<IconCheckmark24 />} disabled secondary>
        {doneText}
      </Button>
    )
  }
  return (
    <Button secondary onClick={onClick}>
      {idleText}
    </Button>
  )
}
