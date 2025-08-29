// import i18n from '@dhis2/d2-i18n'
import { useDataMutation } from '@dhis2/app-runtime'
import postRobot from 'post-robot'
import React, { FC, useCallback, useEffect } from 'react'
import clientDetails from '../clientDetails'
// import { LoginButton } from '../LoginButton'

const esignetRouteMutation = {
    resource: 'routes/relying-party-service/run',
    type: 'create',
    data: ({ data }) => ({ ...data }),
}

const url =
    'http://localhost:4000/authorize?nonce=zxy4c9ubagcwi8uf&state=eree2311&client_id=IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArLeYj&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fplugin.html%23userInfo&scope=openid%20profile%20resident-service&response_type=code&acr_values=mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code&claims=%7B%22userinfo%22:%7B%22name%22:%7B%22essential%22:true%7D,%22email%22:%7B%22essential%22:true%7D,%22individual_id%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D&claims_locales=en&display=page&prompt=consent&max_age=21'

const handleClick = (/* event */) => {
    window.open(url, 'esignetLogin', 'popup=true,height=850,width=800')
}

export const HomePage: FC = () => {
    const [mutate, { data, loading, error }] = useDataMutation(
        esignetRouteMutation as any
    )

    const getUserInfo = useCallback(
        ({ code /* state */ }) => {
            // todo: validate state
            const mutationData = {
                code,
                client_id: clientDetails.clientId,
                grant_type: clientDetails.grant_type,
                redirect_uri: clientDetails.redirect_uri,
            }
            
            mutate({ data: mutationData })
                .then((data) => {
                    console.log('mutation data', data)
                    // todo: update form fields
                })
                .catch((error) => console.error('mutation error', error))
        },
        [mutate]
    )

    const handleMessage = useCallback((event) => {
        // todo: validate event.source and event.origin
        const { code, state, error, error_description } = event.data
        if (error || error_description) {
            return 'to do'
        }
        if (code && state) {
            getUserInfo({ code, state })
        }
    }, [])

    useEffect(() => {
        // todo: specific to origin
        const listener = postRobot.on('authInfo', handleMessage)
        return () => listener.cancel()
    }, [])

    // todo: unlog
    console.log({ data, loading, error })

    return (
        <>
            <button onClick={handleClick}>Log in</button>
            {/* <LoginButton /> */}

            {loading && 'Loading...'}
            {data && (
                <ul>
                    <li>Name: {data.name}</li>
                    <li>Email: {data.email}</li>
                    <li>Gender: {data.gender}</li>
                    <li>Birthdate: {data.birthdate}</li>
                    <li>Phone: {data.phone_number}</li>
                </ul>
            )}
        </>
    )
}
