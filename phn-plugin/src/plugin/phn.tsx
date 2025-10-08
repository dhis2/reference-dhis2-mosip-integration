import { Luhn } from '@evanion/luhn'

const POI = 4054
const CHARSET = "234567890BCDFGHJKMPQRTVWXY"

class MyLuhn extends Luhn {
    static dictionary = CHARSET
    static sensitive = true
}

const generateRandomString = (length: number) =>
    Array.from({ length }, () => CHARSET[Math.floor(Math.random() * CHARSET.length)]).join("")

export const generatePhn = (): string => {
    let validated
    let attempts = 0

    do {
        const randomString = generateRandomString(6)
        const initialPhn = POI + randomString
        const checksum = MyLuhn.generate(initialPhn)
        validated = MyLuhn.validate((checksum.phrase + checksum.checksum).toUpperCase())
        attempts++
    } while (!validated.isValid && attempts < 10)

    return validated?.isValid ? validated.phrase : ''
}
