import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Label } from '@dhis2/ui'
import postRobot from 'post-robot'
import React, { useCallback, useEffect } from 'react'
import clientDetails from '../clientDetails'
import { IDataEntryPluginProps } from '../Plugin.types'
import { dumbMappingToDHIS2 } from './esignetToDhis2Mapping'
import classes from './FormField.module.css'
import { LoginButton } from './PluginLoginButton'

const esignetRouteMutation = {
    resource: 'routes/relying-party-service/run',
    type: 'create',
    data: ({ data }) => ({ ...data }),
}

export const FormField = (pluginProps: IDataEntryPluginProps) => {
    // todo: Handle mutation error in UI
    const [mutate, { loading }] = useDataMutation(esignetRouteMutation as any)

    const { fieldsMetadata, setFieldValue } = pluginProps

    const setFormFields = useCallback(
        (personInfo) => {
            const mappedPersonInfo = dumbMappingToDHIS2(personInfo)

            Object.keys(fieldsMetadata).forEach((fieldId) => {
                if (mappedPersonInfo[fieldId]) {
                    setFieldValue({ fieldId, value: mappedPersonInfo[fieldId] })
                }
            })
        },
        [fieldsMetadata, setFieldValue]
    )

    const getUserInfo = useCallback(
        ({ code /* state */ }) => {
            // todo: Validate auth `state` value
            const mutationData = {
                code,
                client_id: clientDetails.clientId,
                grant_type: clientDetails.grant_type,
                redirect_uri: clientDetails.redirect_uri,
            }

            mutate({ data: mutationData })
                .then((data) => {
                    console.log('mutation data received', data)
                    setFormFields(data)
                })
                .catch((error) => console.error('mutation error', error))
        },
        [mutate]
    )

    const handleMessage = useCallback((event) => {
        // todo: Validate event.source and event.origin (once established for dev/prod)
        const { code, state, error, error_description } = event.data
        if (error || error_description) {
            return 'to do'
        }
        if (code && state) {
            getUserInfo({ code, state })
        }
    }, [])

    useEffect(() => {
        // todo: Make specific to origin
        const listener = postRobot.on('authInfo', handleMessage)
        return () => listener.cancel()
    }, [])

    return (
        <div className={classes.fieldContainer}>
            <div className={classes.labelContainer}>
                <Label className={classes.label}>
                    {i18n.t('Verify patient')}
                </Label>
            </div>

            <LoginButton loading={loading} />
        </div>
    )
}
