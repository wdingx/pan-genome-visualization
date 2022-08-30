import React, { useMemo } from 'react'

import { ErrorContainer, ErrorMessage } from 'src/components/Error/ErrorStyles'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'

export function ErrorGeneric({ error }: { error: Error }) {
  const { t } = useTranslationSafe()

  const { errorTitle, message } = useMemo(() => {
    const { name, message } = error

    let errorTitle = t('An error has occurred: {{errorName}}', { errorName: name })
    if (name.toLowerCase().trim() === 'error') {
      errorTitle = t('An error has occurred.')
    }

    return { errorTitle, message }
  }, [error, t])

  return (
    <ErrorContainer>
      <h5>{errorTitle}</h5>
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorContainer>
  )
}
