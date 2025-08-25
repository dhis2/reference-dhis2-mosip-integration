const _env_ = {
    CLIENT_ID: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAihRRW',
    ESIGNET_UI_BASE_URL: 'http://localhost:4000',
    REDIRECT_URI: 'http://localhost:3000/#userInfo',
    // todo
    REDIRECT_URI_USER_PROFILE: 'http://localhost:5000/userData',
    REDIRECT_URI_REGISTRATION: 'http://localhost:5000/registration',
    MOCK_RELYING_PARTY_SERVER_URL: 'http://localhost:5000/api/getUserInfo',
    ACRS: 'mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code',
    SCOPE_USER_PROFILE: 'openid%20profile%20resident-service',
    SCOPE_REGISTRATION: 'openid%20profile',
    CLAIMS_USER_PROFILE: undefined,
        // '%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D',
    CLAIMS_REGISTRATION:
        '%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D',
    SIGN_IN_BUTTON_PLUGIN_URL:
        'http://localhost:4000/plugins/sign-in-button-plugin.js',
    DISPLAY: 'page',
    PROMPT: 'consent',
    GRANT_TYPE: 'authorization_code',
    MAX_AGE: 21,
    CLAIMS_LOCALES: 'en',
    DEFAULT_LANG: 'en',
    FALLBACK_LANG: '%7B%22label%22%3A%22English%22%2C%22value%22%3A%22en%22%7D',
}

// method to check non-empty and non-null
// values, if present then give default value
const checkEmptyNullValue = (initialValue, defaultValue) =>
    initialValue && initialValue !== '' ? initialValue : defaultValue

const generateRandomString = (strLength = 16) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < strLength; i++) {
        const randomInd = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomInd)
    }
    return result
}

const state = 'eree2311'
const nonce = generateRandomString()
const responseType = 'code'
const scopeUserProfile = checkEmptyNullValue(
    _env_.SCOPE_USER_PROFILE,
    'openid profile'
)
const scopeRegistration = checkEmptyNullValue(
    _env_.SCOPE_REGISTRATION,
    'openid profile'
)
const display = checkEmptyNullValue(_env_.DISPLAY, 'page')
const prompt = checkEmptyNullValue(_env_.PROMPT, 'consent')
const grantType = checkEmptyNullValue(_env_.GRANT_TYPE, 'authorization_code')
const maxAge = _env_.MAX_AGE
const claimsLocales = checkEmptyNullValue(_env_.CLAIMS_LOCALES, 'en')
const authorizeEndpoint = '/authorize'
const clientId = _env_.CLIENT_ID
const uibaseUrl = _env_.ESIGNET_UI_BASE_URL
const redirect_uri = _env_.REDIRECT_URI
const redirect_uri_userprofile = checkEmptyNullValue(
    _env_.REDIRECT_URI_USER_PROFILE,
    _env_.REDIRECT_URI
)
const redirect_uri_registration = checkEmptyNullValue(
    _env_.REDIRECT_URI_REGISTRATION,
    _env_.REDIRECT_URI
)
const acr_values = _env_.ACRS
// const userProfileClaims = checkEmptyNullValue(_env_.CLAIMS_USER_PROFILE, '{}')
const registrationClaims = checkEmptyNullValue(_env_.CLAIMS_REGISTRATION, '{}')

const claims = {
    userinfo: {
        name: {
            essential: true,
        },
        email: {
            essential: true,
        },
        individual_id: {
            essential: true,
        },
        phone_number: {
            essential: false,
        },
        picture: {
            essential: false,
        },
        gender: {
            essential: false,
        },
        birthdate: {
            essential: false,
        },
        address: {
            essential: false,
        },
    },
    id_token: {},
}

const clientDetails = {
    ..._env_,
    nonce: nonce,
    state: state,
    clientId: clientId,
    scopeUserProfile: scopeUserProfile,
    scopeRegistration: scopeRegistration,
    response_type: responseType,
    redirect_uri: redirect_uri,
    redirect_uri_userprofile: redirect_uri_userprofile,
    redirect_uri_registration: redirect_uri_registration,
    display: display,
    prompt: prompt,
    acr_values: acr_values,
    claims_locales: claimsLocales,
    max_age: maxAge,
    grant_type: grantType,
    uibaseUrl: uibaseUrl,
    authorizeEndpoint: authorizeEndpoint,
    userProfileClaims: /* userProfileClaims ?? */ encodeURI(JSON.stringify(claims)),
    registrationClaims: registrationClaims ?? encodeURI(JSON.stringify(claims)),
}

export default clientDetails
