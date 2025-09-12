import i18n from '@dhis2/d2-i18n'
import { Button, IconLaunch16 } from '@dhis2/ui'
import React from 'react'
import clientDetails from '../clientDetails'

// All values are currently URL-encoded here
// (URL.searchParams.append() will handle that)
const authorizeConfig = {
    nonce: clientDetails.nonce,
    state: clientDetails.state,
    // Note key difference here
    client_id: clientDetails.clientId,
    redirect_uri: encodeURIComponent(clientDetails.redirect_uri),
    scope: clientDetails.scopeUserProfile,
    response_type: clientDetails.response_type,
    acr_values: clientDetails.acr_values,
    claims: clientDetails.userProfileClaims || '',
    claims_locales: clientDetails.claims_locales,
    display: clientDetails.display,
    prompt: clientDetails.prompt,
    max_age: clientDetails.max_age,
}

const authorizeUrl = new URL(clientDetails.authorizeUrl)
// For now, decode values -- URL search params handles that
const searchParams = new URLSearchParams(
    Object.entries(authorizeConfig).map(([k, v]) => [k, decodeURIComponent(v)])
)
authorizeUrl.search = searchParams.toString()

const handleClick = (/* event */) => {
    // todo: Position window
    window.open(authorizeUrl, 'esignetLogin', 'popup=true,height=850,width=800')
}

export const LoginButton = ({ loading }: { loading: boolean }) => {
    // todo: make into a link button; see advice on https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    return (
        <Button onClick={handleClick} loading={loading} icon={<IconLaunch16 />}>
            {i18n.t('Verify with National ID')}
        </Button>
    )
}
