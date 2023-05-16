export const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_\-]{3,15}$/.test(username);
}

export const isValidFirstName = (firstName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,20}$/.test(firstName);
}

export const isValidLastName = (lastName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,20}$/.test(lastName);
}

export const checkValidity = (firstName: string, lastName: string, username: string) => {
    if (!isValidFirstName(firstName)) {
        throw new Error("First name must be between 1 and 20 characters long and contain only letters.")
    } else if (!isValidLastName(lastName)) {
        throw new Error("Last name must be between 1 and 20 characters long and contain only letters.")
    } else if (!isValidUsername(username)) {
        throw new Error("Username must be between 3 and 15 characters long and contain only letters, numbers, dashes, and underscores.");
    } else {
        return true; 
    }
}
