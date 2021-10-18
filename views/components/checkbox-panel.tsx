import React, { useCallback } from 'react'
import { Checkbox, Collapse, HTMLSelect } from '@blueprintjs/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Divider from '../divider'
import { getTabs, DataType } from '../reducers/tab'
import { logContentSelectorFactory } from '../selectors'
import { useSelector, useDispatch } from 'react-redux'
import {
  showCheckboxPanel,
  hiddenCheckboxPanel,
  setTabVisibility,
  setShowAmount,
} from '../actions'

const { config } = window

export interface AkashicRecordsCheckboxPanelT {
  contentType: DataType;
}

const Container = styled.div`
  padding: 15px;
`

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CheckboxItem = styled.div`
  flex: 0 0 calc(100% / 6);
  vertical-align: middle;
`

const AkashicRecordsCheckboxPanel: React.FC<AkashicRecordsCheckboxPanelT> = ({ contentType }) => {
  const selector = logContentSelectorFactory(contentType)
  const state = useSelector(selector)
  const show = state.checkboxVisible
  const tabVisibility = state.tabVisibility
  const showAmount = state.showAmount

  const dispatch = useDispatch()
  const onCheckboxClick = useCallback(
    (index: number, val: boolean) => dispatch(setTabVisibility(index, val, contentType)),
    [dispatch, contentType]
  )
  const onShowAmountSet = useCallback(
    (val: number) => dispatch(setShowAmount(val, contentType)),
    [dispatch, contentType]
  )
  const setPanelVisibilitiy = useCallback(
    (show) =>
      dispatch((show)
        ? showCheckboxPanel(contentType)
        : hiddenCheckboxPanel(contentType)),
    [dispatch, contentType]
  )

  const { t } = useTranslation('poi-plugin-akashic-records')

  const tableTab = getTabs(contentType)

  const handleClickCheckbox = useCallback((index: number) => {
    const tmp = [
      ...tabVisibility.slice(0, index),
      !tabVisibility[index],
      ...tabVisibility.slice(index + 1),
    ]
    config.set(`plugin.Akashic.${contentType}.checkbox`, JSON.stringify(tmp))
    onCheckboxClick(index, tmp[index])
  }, [tabVisibility])

  const handleShowAmountSelect = useCallback((value: number) => {
    config.set(`plugin.Akashic.${contentType}.showAmount`, value)
    onShowAmountSet(value)
  }, [])

  const handlePanelShow = useCallback(() => {
    const val = !show
    config.set(`plugin.Akashic.${contentType}.checkboxPanelShow`, val)
    setPanelVisibilitiy(val)
  }, [show])

  return <Container>
    <div onClick={handlePanelShow}>
      <Divider text={t("Filter")} icon={true} hr={true} show={show}/>
    </div>
    <div>
      <Collapse isOpen={show}>
        <div>
          <CheckboxContainer>
            {tableTab.map((checkboxVal, index) => index > 0 && (
              <CheckboxItem>
                <Checkbox
                  checked={tabVisibility[index]}
                  onChange={() => handleClickCheckbox(index)}
                >
                  {t(checkboxVal)}
                </Checkbox>
              </CheckboxItem>
            ))}
          </CheckboxContainer>
          <div>
            <HTMLSelect
              value={showAmount}
              onChange={(event: React.FormEvent<HTMLSelectElement>) => handleShowAmountSelect(parseInt(event.currentTarget.value))}
            >
              <option value={10}>{t('Newer {{count}}', { count: 10 })}</option>
              <option value={20}>{t('Newer {{count}}', { count: 20 })}</option>
              <option value={50}>{t('Newer {{count}}', { count: 50 })}</option>
            </HTMLSelect>
          </div>
        </div>
      </Collapse>
    </div>
  </Container>
}

export default AkashicRecordsCheckboxPanel
