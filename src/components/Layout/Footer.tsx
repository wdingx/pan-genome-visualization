import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row } from 'reactstrap'
import styled from 'styled-components'

import { PROJECT_NAME, COMPANY_NAME } from 'src/constants'
import { getCopyrightYearRange } from 'src/helpers/getCopyrightYearRange'
import { getVersionString } from 'src/helpers/getVersionString'
import { LogoLink } from 'src/components/Common/LogoLink'

import LogoBiozentrum from 'src/assets/img/biozentrum_square.svg'
import LogoMaxPlanck from 'src/assets/img/max-planck.svg'
import LogoNeherlab from 'src/assets/img/neherlab.svg'
import LogoSib from 'src/assets/img/sib.logo.svg'
import LogoUnibas from 'src/assets/img/unibas.svg'
import LogoVercel from 'src/assets/img/powered-by-vercel.svg'

const FooterContainer = styled(Container)`
  position: fixed;
  height: 38px;
  bottom: 0;
  padding: 6px 10px;
  box-shadow: ${(props) => props.theme.shadows.medium};
`

const CopyrightText = styled.div`
  font-size: 0.75rem;
  flex-grow: 1;

  @media (max-width: 576px) {
    font-size: 0.5rem;
  }
`

const LogoContainer = styled.div`
  flex-grow: 1;
  text-align: right;
`

const VersionText = styled.div`
  flex-grow: 1;
  font-size: 0.75rem;
  text-align: right;

  @media (max-width: 992px) {
    display: none;
  }
`

export function Footer() {
  const { t } = useTranslation()
  const copyrightYearRange = getCopyrightYearRange()

  return (
    <FooterContainer fluid tag="footer">
      <Row noGutters>
        <Col className="d-flex">
          <CopyrightText className="mr-auto my-auto">
            {t('{{PROJECT_NAME}} (c) {{copyrightYearRange}} {{COMPANY_NAME}}', {
              PROJECT_NAME,
              copyrightYearRange,
              COMPANY_NAME,
            })}
          </CopyrightText>

          <LogoContainer className="mx-auto">
            <LogoLink url="https://neherlab.org">
              <LogoNeherlab />
            </LogoLink>

            <LogoLink url="https://www.biozentrum.unibas.ch">
              <LogoBiozentrum />
            </LogoLink>

            <LogoLink url="https://unibas.ch">
              <LogoUnibas />
            </LogoLink>

            <LogoLink url="https://www.sib.swiss">
              <LogoSib />
            </LogoLink>

            <LogoLink url="https://tuebingen.mpg.de">
              <LogoMaxPlanck />
            </LogoLink>

            <LogoLink className="my-auto" url="https://vercel.com/?utm_source=neherlab">
              <LogoVercel />
            </LogoLink>
          </LogoContainer>

          <VersionText className="ml-auto my-auto">{getVersionString()}</VersionText>
        </Col>
      </Row>
    </FooterContainer>
  )
}
