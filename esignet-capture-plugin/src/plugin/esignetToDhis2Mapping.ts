/**
 * Values correspond to the enrollment values mapped to the plugin,
 * e.g. in the Tracker Plugin Configurator app
 */
const FIELD_IDS = Object.freeze({
    ADDRESS: 'address',
    DATE_OF_BIRTH: 'dateOfBirth',
    FULL_NAME: 'fullName',
    PHONE: 'phone',
    SUBJECT_ID: 'subjectId',
    GENDER: 'gender',
    AGE: 'age',
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

    // Rough age calculation
    const yrInMs = 1000 * 60 * 60 * 24 * 365.24
    // This needs to be a string to work with Capture
    // (otherwise it causes an error)
    const age = String(
        Math.floor((Date.now() - Number(new Date(dateOfBirth))) / yrInMs)
    )

    return {
        [FIELD_IDS.ADDRESS]: address,
        [FIELD_IDS.DATE_OF_BIRTH]: dateOfBirth,
        [FIELD_IDS.AGE]: age,
        [FIELD_IDS.FULL_NAME]: personInfo.name,
        [FIELD_IDS.PHONE]: personInfo.phone_number,
        [FIELD_IDS.GENDER]: personInfo.gender,
        [FIELD_IDS.SUBJECT_ID]: personInfo.sub,
    }
}
