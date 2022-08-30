import React, { PropsWithChildren, HTMLProps } from 'react'
import styled from 'styled-components'
import { Container as ContainerBase } from 'reactstrap'

import { NavigationBar } from './NavigationBar'
import { Footer } from './Footer'

export const Container = styled(ContainerBase)`
  margin: 0;
  padding: 0;
`

const Header = styled.header``

const MainContent = styled.main`
  margin: 0;
`

export function Layout({ children }: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <Container fluid>
      <Header>
        <NavigationBar />
      </Header>

      <MainContent>{children}</MainContent>

      <Footer />
    </Container>
  )
}
