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

const handleClick = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    // 'left' and 'top' positioning vars don't seem to work
    // todo: popup or new tab?
    window.open(authorizeUrl, 'esignetLogin', 'popup=true,height=850,width=800')
}

export const LoginButton = ({ loading }: { loading: boolean }) => {
    // In most cases, this should be a link button. But it's important to have
    // the window.opener property in the new window for post-robot, which can be
    // lost if the user right-clicks and opens the link in a new tab. So, keep
    // this a button
    return (
        <Button onClick={handleClick} loading={loading} icon={<IconLaunch16 />}>
            {i18n.t('Verify with National ID')}
        </Button>
    )
}
