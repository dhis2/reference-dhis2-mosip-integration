// import i18n from '@dhis2/d2-i18n'
import React, { FC, useEffect } from 'react'
import classes from './App.module.css'
import clientDetails from './clientDetails'
import { useExternalScript } from './useExternalScript'

const renderSignInButton = () => {
    const oidcConfig = {
        authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
        redirect_uri: clientDetails.redirect_uri_userprofile,
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

const MyApp: FC = () => {
    const scriptState = useExternalScript(
        clientDetails.SIGN_IN_BUTTON_PLUGIN_URL
    )

    useEffect(() => {
        // todo: handle loading & error states
        if (scriptState === 'ready') {
            renderSignInButton()
        }
    }, [renderSignInButton, scriptState])

    console.log({ script: window.SignInWithEsignetButton })

    return (
        <div className={classes.container}>
            <div id="sign-in-with-esignet" />
        </div>
    )
}

export default MyApp
