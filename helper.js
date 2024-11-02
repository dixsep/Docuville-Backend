
export const extractNameGeneral = (text) => {

    const match = text.match(/Name:\s*([^\n]+)/i); {/* Need to Modify based on Document*/}

    return match ? match[1] : " "; {/* Console log Response and return  */}
}

export const extractLicenseNumberGeneral = (text) => {

    const match = text.match(/(?:Passport|License) ?No\.?:?\s*([A-Z0-9]+)/i); {/* Need to Modify based on Document*/}

    return match ? match[1] : " "; {/* Console log Response and return  */}
}

export const extractExpiryDate1General = (text) => {

    const match = text.match(/(?:Expires?|Valid Until):\s*(\d{2}[-/]\d{2}[-/]\d{4})/i); {/* Need to Modify based on Document*/}

    return match ? match[1] : " "; {/* Console log Response and return  */}
}
