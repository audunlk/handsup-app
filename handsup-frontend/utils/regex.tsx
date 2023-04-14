export const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_\-]{3,30}$/.test(username);
}

export const isValidFirstName = (firstName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,50}$/.test(firstName);
}

export const isValidLastName = (lastName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,50}$/.test(lastName);
}
