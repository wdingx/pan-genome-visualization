import 'reflect-metadata'

import 'src/styles/global.scss'

import { memoize } from 'lodash'
import React, { useEffect, Suspense, useMemo } from 'react'
import { RecoilRoot } from 'recoil'
import { AppProps } from 'next/app'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components'
import { Provider as ReactReduxProvider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { MDXProvider } from '@mdx-js/react'

import { configureStore } from 'src/state/store'
import { DOMAIN_STRIPPED } from 'src/constants'
import { ErrorPopup } from 'src/components/Error/ErrorPopup'
import Loading from 'src/components/Loading/Loading'
import { SEO } from 'src/components/Common/SEO'
import { Plausible } from 'src/components/Common/Plausible'
import i18n from 'src/i18n/i18n'
import { theme } from 'src/theme'
import { ErrorBoundary } from 'src/components/Error/ErrorBoundary'
import { PreviewWarning } from 'src/components/Common/PreviewWarning'
import { getMdxComponents } from 'src/components/Common/MdxComponents'

if (process.env.NODE_ENV === 'development') {
  // Ignore recoil warning messages in browser console
  // https://github.com/facebookexperimental/Recoil/issues/733
  const shouldFilter = (args: (string | undefined)[]) =>
    args[0] && typeof args[0].includes === 'function' && args[0].includes('Duplicate atom key')

  const mutedConsole = memoize((console: Console) => ({
    ...console,
    warn: (...args: (string | undefined)[]) => (shouldFilter(args) ? null : console.warn(...args)),
    error: (...args: (string | undefined)[]) => (shouldFilter(args) ? null : console.error(...args)),
  }))
  global.console = mutedConsole(global.console)
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(), [])
  const { store } = useMemo(() => configureStore(), [])
  const fallback = useMemo(() => <Loading />, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' && router.pathname !== '/') {
      void router.replace('/') // eslint-disable-line no-void
    }

    void router.prefetch('/') // eslint-disable-line no-void
    void router.prefetch('/results') // eslint-disable-line no-void
  }, [router])

  return (
    <Suspense fallback={fallback}>
      <ReactReduxProvider store={store}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <MDXProvider components={getMdxComponents}>
              <Plausible domain={DOMAIN_STRIPPED} />
              <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                  <ErrorBoundary>
                    <Suspense fallback={fallback}>
                      <SEO />
                      <PreviewWarning />
                      <Component {...pageProps} />
                      <ErrorPopup />
                      <ReactQueryDevtools initialIsOpen={false} />
                    </Suspense>
                  </ErrorBoundary>
                </I18nextProvider>
              </QueryClientProvider>
            </MDXProvider>
          </ThemeProvider>
        </RecoilRoot>
      </ReactReduxProvider>
    </Suspense>
  )
}
