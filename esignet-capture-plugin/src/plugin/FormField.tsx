import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, Label } from '@dhis2/ui'
import { customAlphabet } from 'nanoid'
import postRobot from 'post-robot'
import React, { FC, useCallback, useEffect } from 'react'
import clientDetails from '../clientDetails'
import { IDataEntryPluginProps } from '../Plugin.types'
import classes from './FormField.module.css'
// import { LoginButton } from '../LoginButton'

const esignetRouteMutation = {
    resource: 'routes/relying-party-service/run',
    type: 'create',
    data: ({ data }) => ({ ...data }),
}

const url =
    'http://localhost:4000/authorize?nonce=v29pwszftvx4pwso&state=eree2311&client_id=IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArLeYj&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fplugin.html%23userInfo&scope=openid%20profile%20resident-service&response_type=code&acr_values=mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code&claims=%7B%22userinfo%22:%7B%22name%22:%7B%22essential%22:true%7D,%22email%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:true%7D,%22birthdate%22:%7B%22essential%22:true%7D,%22address%22:%7B%22essential%22:true%7D%7D,%22id_token%22:%7B%7D%7D&claims_locales=en&display=page&prompt=consent&max_age=21'

const handleClick = (/* event */) => {
    // todo: Position window
    window.open(url, 'esignetLogin', 'popup=true,height=850,width=800')
}

type PersonAddress = {
    country: string
    locality: string
    postal_code: string
    region: string
    street_address: string
}

/** This type should match essential and optional claims from eSignet config */
type PersonInfo = {
    address: PersonAddress
    aud: string
    /** Format: YYYY/MM/DD */
    birthdate: string
    email: string
    gender: string // todo: not really necessary
    iss: string
    /** Full name */
    name: string
    phone_number: string
    /** base64-encoded image */
    picture: string
    sub: string
}

const formatAddress = (address: PersonAddress) => {
    const { street_address, postal_code, locality, region, country } = address
    return [
        street_address,
        `${postal_code}, ${locality}`,
        region,
        country,
    ].join('\n')
}

/**
 * Values correspond to the enrollment values mapped to the plugin,
 * e.g. in the Tracker Plugin Configurator app
 */
const FIELD_IDS = Object.freeze({
    ADDRESS: 'address',
    DATE_OF_BIRTH: 'dateOfBirth',
    GIVEN_NAME: 'givenName',
    FAMILY_NAME: 'familyName',
    PHONE: 'phone',
    UNIQUE_ID: 'uniqueId',
})

const dumbMappingToDHIS2 = (personInfo: PersonInfo) => {
    // Reformat from 'YYYY/MM/DD' to 'YYYY-MM-DD'
    const dateOfBirth = personInfo.birthdate
        ? personInfo.birthdate.replace(/\//g, '-')
        : undefined

    const address = personInfo.address
        ? formatAddress(personInfo.address)
        : undefined

    const splitName = personInfo.name.split(' ')
    const givenName = splitName[0]
    const familyName = splitName[splitName.length - 1]

    const phone = personInfo.phone_number

    return {
        [FIELD_IDS.ADDRESS]: address,
        [FIELD_IDS.DATE_OF_BIRTH]: dateOfBirth,
        [FIELD_IDS.GIVEN_NAME]: givenName,
        [FIELD_IDS.FAMILY_NAME]: familyName,
        [FIELD_IDS.PHONE]: phone,
    }
}

// Omit 0 and O from possible ID values for readability
const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 10)
/** Generate a 10-character ID for patient to keep */
const generateUniqueId = () => nanoid(10)

export const FormField: FC = (pluginProps: IDataEntryPluginProps) => {
    // todo: Handle mutation error in UI
    const [mutate, { loading }] = useDataMutation(esignetRouteMutation as any)

    const { fieldsMetadata, setFieldValue } = pluginProps

    const setFormFields = useCallback(
        (personInfo) => {
            const mappedPersonInfo = dumbMappingToDHIS2(personInfo)

            Object.keys(fieldsMetadata).forEach((fieldId) => {
                if (mappedPersonInfo[fieldId]) {
                    setFieldValue({ fieldId, value: mappedPersonInfo[fieldId] })
                } else if (fieldId === FIELD_IDS.UNIQUE_ID) {
                    // Also generate a unique ID (PHN for Sri Lanka) for patient
                    setFieldValue({
                        fieldId: FIELD_IDS.UNIQUE_ID,
                        value: generateUniqueId(),
                    })
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

            <Button onClick={handleClick} loading={loading}>
                {i18n.t('Log in')}
            </Button>
            {/* <LoginButton /> */}
            {loading && <CircularLoader />}
        </div>
    )
}
