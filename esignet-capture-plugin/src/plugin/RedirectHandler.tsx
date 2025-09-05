// import i18n from '@dhis2/d2-i18n'
import postRobot from 'post-robot'
import { /* React, */ FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

export const RedirectHandler: FC = () => {
    const [searchParams] = useSearchParams()
    const [messageError, setMessageError] = useState(false)

    useEffect(() => {
        const authParams = {
            state: searchParams.get('state'),
            code: searchParams.get('code'),
            error: searchParams.get('error'),
            errorDescription: searchParams.get('error_description'),
        }

        postRobot
            .send(window.opener, 'authInfo', authParams)
            .then((event) => {
                console.log('postRobotEvent', event)
                window.close()
            })
            .catch((err) => {
                console.error(
                    'Failed to send authorization code to complete flow',
                    err
                )
                setMessageError(true)
                return
            })
    }, [searchParams])

    // todo: Circular loader UI
    return messageError
        ? 'Failed to send authorization grant to parent app. Please close and try again'
        : 'Loading...'
}
