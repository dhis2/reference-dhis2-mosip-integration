// import i18n from '@dhis2/d2-i18n'
import React, { FC, useEffect } from 'react'
import clientDetails from '../clientDetails'
import { useExternalScript } from './useExternalScript'

const renderSignInButton = () => {
    const oidcConfig = {
        authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
        // Encode, since this includes a hash
        redirect_uri: encodeURIComponent(clientDetails.redirect_uri),
        client_id: clientDetails.clientId,
        scope: clientDetails.scopeUserProfile,
        nonce: clientDetails.nonce,
        state: clientDetails.state,
        acr_values: clientDetails.acr_values,
        claims_locales: clientDetails.claims_locales,
        display: clientDetails.display,
        prompt: clientDetails.prompt,
        max_age: clientDetails.max_age,
        // ui_locales: i18n.language,
        claims: JSON.parse(
            decodeURIComponent(clientDetails.userProfileClaims) || ''
        ),
    }

    window.SignInWithEsignetButton?.init({
        oidcConfig: oidcConfig,
        buttonConfig: {
            shape: 'soft_edges',
            labelText: 'Sign in with eSignet',
            width: '100%',
        },
        signInElement: document.getElementById('sign-in-with-esignet'),
    })
}

export const LoginButton: FC = () => {
    const scriptState = useExternalScript(
        clientDetails.SIGN_IN_BUTTON_PLUGIN_URL
    )

    useEffect(() => {
        // todo: handle loading & error states
        if (scriptState === 'ready') {
            renderSignInButton()
        }
    }, [renderSignInButton, scriptState])

    return <div id="sign-in-with-esignet" />
}
