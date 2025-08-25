// import i18n from '@dhis2/d2-i18n'
import { useDataMutation } from '@dhis2/app-runtime'
import React, { FC, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import clientDetails from './clientDetails'

const esignetRouteMutation = {
    resource: 'routes/relying-party-service/run',
    type: 'create',
    data: ({ data }) => ({ ...data }),
}

export const UserInfo: FC = () => {
    const [searchParams] = useSearchParams()
    const [mutate, { data, loading, error }] = useDataMutation(
        esignetRouteMutation as any
    )

    // todo: handle error_description and error search params

    useEffect(() => {
        // const authState = searchParams.get('state')
        const authCode = searchParams.get('code')
        const mutationData = {
            code: authCode,
            client_id: clientDetails.clientId,
            grant_type: clientDetails.grant_type,
            redirect_uri: clientDetails.redirect_uri,
        }
        mutate({ data: mutationData })
            .then((data) => console.log('mutation data', data))
            .catch((error) => console.error('mutation error', error))
    }, [searchParams, mutate])

    console.log({ data, loading, error })

    return (
        <>
            <p>{'User info'}</p>
            <Link to="/">{'Home'}</Link>
            {loading && "Loading..."}
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
