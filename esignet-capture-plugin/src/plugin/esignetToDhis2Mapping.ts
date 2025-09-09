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
    gender?: string
    iss: string
    /** Full name */
    name: string
    phone_number: string
    /** base64-encoded image */
    picture?: string
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

// TODO: Use datastore mapping
export const dumbMappingToDHIS2 = (personInfo: PersonInfo) => {
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

    const uniqueId = personInfo.sub

    return {
        [FIELD_IDS.ADDRESS]: address,
        [FIELD_IDS.DATE_OF_BIRTH]: dateOfBirth,
        [FIELD_IDS.GIVEN_NAME]: givenName,
        [FIELD_IDS.FAMILY_NAME]: familyName,
        [FIELD_IDS.PHONE]: phone,
        [FIELD_IDS.UNIQUE_ID]: uniqueId,
    }
}
