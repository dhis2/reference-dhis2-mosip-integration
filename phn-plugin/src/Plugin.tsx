import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ButtonStrip } from '@dhis2/ui'
import { IFormFieldPluginProps } from './Plugin.types'
import { generatePhn } from './plugin/phn'
import { popupHtml } from './plugin/popup'
import { StatusButton } from './plugin/statusButton'
// import classes from './Plugin.module.css'

const Plugin = ({ setFieldValue, values }: IFormFieldPluginProps) => {

    const [generatedPHN, setGeneratedPHN] = useState<string>('')
    const [phnStatus, setPhnStatus] = useState<'idle' | 'loading' | 'done'>('idle')
    const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'done'>('idle')


    const getFieldValue = (fv: any, id: string) => {
        const v = fv?.[id]
        if (v == null) return ''
        if (typeof v === 'object' && 'value' in v) return v.value ?? ''
        return String(v)
    }

    //Included to automatically change verified btn status back to idle
    const isPluginUpdatingPhnRef = useRef(false)

    const existingPhn = getFieldValue(values, 'phn') || ''

    useEffect(() => {
        if (!isPluginUpdatingPhnRef.current) {
            // User manually changed PHN -> reset Verify if it was Done
            setVerifyStatus(prev => prev === 'done' ? 'idle' : prev)
        }
        // Always reset the flag after handling
        isPluginUpdatingPhnRef.current = false
    }, [existingPhn])

    // Global listener to accept PHN_SELECTED and populate fields
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { phn, dob, firstName, lastName, name, address, phone, gender, age, type } = event.data || {}

            if (type === 'PHN_SELECTED' || phn) {
                if (phn) setFieldValue({ fieldId: 'phn', value: phn })
                if (phn) setFieldValue({ fieldId: 'isPhnVerified', value: 'true' })
                // if (dob) setFieldValue({ fieldId: 'dateOfBirth', value: dob })
                // if (firstName) setFieldValue({ fieldId: 'firstName', value: firstName })
                // if (lastName) setFieldValue({ fieldId: 'lastName', value: lastName })
                // if (name) setFieldValue({ fieldId: 'fullName', value: name })
                // if (address) setFieldValue({ fieldId: 'address', value: address })
                // if (phone) setFieldValue({ fieldId: 'phone', value: phone })
                // if (gender) setFieldValue({ fieldId: 'gender', value: gender })
                // if (age) setFieldValue({ fieldId: 'age', value: age })
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [setFieldValue])

    const handleVerifyPhn = () => {
        setVerifyStatus('loading')

        const existingPhn = getFieldValue(values, 'phn') || ''

        const popup = window.open(
            '',
            'phnPopup',
            'width=500,height=600,resizable,scrollbars=yes'
        )

        if (!popup) {
            setVerifyStatus('idle')
            return
        }

        // write popup html and close document so script runs
        popup.document.write(popupHtml)
        popup.document.close()

        let retryInterval: number | null = null
        let closedCheckInterval: number | null = null

        const handleParentMessage = (event: MessageEvent) => {
            // accept messages only from this popup window (best-effort)
            if (event.source !== popup) return
            const data = event.data || {}
            if (data.type === 'POPUP_READY') {
                // send INIT_PHN once immediately and start retries until we receive INIT_ACK
                try {
                    popup.postMessage({ type: 'INIT_PHN', phn: existingPhn }, '*')
                } catch (e) { /* ignore */ }

                // Start retries (stop on INIT_ACK)
                let attempts = 0
                retryInterval = window.setInterval(() => {
                    attempts++
                    if (attempts > 25) { // ~7.5s timeout
                        if (retryInterval) { clearInterval(retryInterval); retryInterval = null }
                        return
                    }
                    try {
                        popup.postMessage({ type: 'INIT_PHN', phn: existingPhn }, '*')
                    } catch (e) {}
                }, 300)
            }

            if (data.type === 'INIT_ACK') {
                // popup acknowledged receiving INIT_PHN -> stop retries
                if (retryInterval) { clearInterval(retryInterval); retryInterval = null }
            }

            if (data.type === 'PHN_SELECTED') {
                setVerifyStatus('done')
                isPluginUpdatingPhnRef.current = true   // mark as plugin update
                setFieldValue({ fieldId: 'phn', value: data.phn })
                setFieldValue({ fieldId: 'isPhnVerified', value: 'true' })

                // cleanup
                if (retryInterval) { clearInterval(retryInterval); retryInterval = null }
                if (closedCheckInterval) { clearInterval(closedCheckInterval); closedCheckInterval = null }
                window.removeEventListener('message', handleParentMessage)
                try { popup.close() } catch (e) {}
            }
        }

        window.addEventListener('message', handleParentMessage)

        // monitor popup closed by user
        closedCheckInterval = window.setInterval(() => {
            if (!popup || popup.closed) {
                if (retryInterval) { clearInterval(retryInterval); retryInterval = null }
                if (closedCheckInterval) { clearInterval(closedCheckInterval); closedCheckInterval = null }
                window.removeEventListener('message', handleParentMessage)
                setVerifyStatus(prev => prev === 'loading' ? 'idle' : prev)
            }
        }, 500)
    }

    const handleGeneratePhn = useCallback(async () => {
        setPhnStatus('loading')

        const phn = generatePhn()
        if (phn) {
            setGeneratedPHN(phn)
            setFieldValue({ fieldId: 'phn', value: phn })
        }

        setPhnStatus('done')
    }, [setFieldValue])

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                width: '100% !important',
                height: '100% !important',
                paddingLeft: '16px',
                backgroundColor: '#FBFCFD',
                borderBottom: '1px solid #e8edf2',
                borderTop: '1px solid #e8edf2',
            }}
        >
            <span 
                style={{ 
                    minWidth: '40%', 
                    fontSize: '14px', 
                    color: 'rgba(0, 0, 0, 0.87) !important', 
                    left: 0
                }}
            >
                Manage PHN
            </span>
            <span 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    width: '100%',
                    left: '0',
                    // border: '1px solid'
                }}>
                <ButtonStrip>
                    <StatusButton
                        status={verifyStatus}
                        idleText="Verify existing PHN"
                        loadingText="Verifying ..."
                        doneText="Verified"
                        onClick={handleVerifyPhn}
                    />
                    <StatusButton
                        status={phnStatus}
                        idleText="Generate new PHN"
                        loadingText="Generating a PHN ..."
                        doneText="Done"
                        onClick={handleGeneratePhn}
                    />
                </ButtonStrip>
            </span>
        </div>
    )
}

export default Plugin
