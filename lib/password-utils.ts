// Password strength validation utility

export interface PasswordStrength {
    score: number // 0-4
    label: string
    color: string
    suggestions: string[]
}

export function calculatePasswordStrength(password: string): PasswordStrength {
    let score = 0
    const suggestions: string[] = []

    if (!password) {
        return {
            score: 0,
            label: "Too weak",
            color: "bg-red-500",
            suggestions: ["Enter a password"],
        }
    }

    // Length check
    if (password.length >= 8) score++
    else suggestions.push("Use at least 8 characters")

    if (password.length >= 12) score++

    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score++
    } else {
        suggestions.push("Include both uppercase and lowercase letters")
    }

    if (/\d/.test(password)) {
        score++
    } else {
        suggestions.push("Include at least one number")
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        score++
    } else {
        suggestions.push("Include at least one special character (!@#$%^&*)")
    }

    // Determine label and color based on score
    let label: string
    let color: string

    if (score === 0 || score === 1) {
        label = "Too weak"
        color = "bg-red-500"
    } else if (score === 2) {
        label = "Weak"
        color = "bg-orange-500"
    } else if (score === 3) {
        label = "Fair"
        color = "bg-yellow-500"
    } else if (score === 4) {
        label = "Good"
        color = "bg-lime-500"
    } else {
        label = "Strong"
        color = "bg-green-500"
    }

    return { score, label, color, suggestions }
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
        return { valid: false, message: "Password is required" }
    }

    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" }
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must include lowercase letters" }
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must include uppercase letters" }
    }

    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must include at least one number" }
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return { valid: false, message: "Password must include at least one special character" }
    }

    return { valid: true }
}
