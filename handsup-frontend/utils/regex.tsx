export const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_\-]{3,30}$/.test(username);
}

export const isValidFirstName = (firstName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,50}$/.test(firstName);
}

export const isValidLastName = (lastName: string) => {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{1,50}$/.test(lastName);
}

export const checkValidity = (firstName: string, lastName: string, username: string) => {
    try {
        if (!isValidFirstName(firstName)) {
            throw new Error("First name must be at least 1 characters long and contain only letters.")
        }
        if (!isValidLastName(lastName)) {
            throw new Error("Last name must be at least 1 characters long and contain only letters.")
        }
        if (!isValidUsername(username)) {
            throw new Error("Username must be at least 3 characters long and contain only letters, numbers, dashes, and underscores.");
        }
        return true;
    } catch (error) {
        throw error;
    }

}
