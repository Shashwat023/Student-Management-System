"use client"

import { calculatePasswordStrength, type PasswordStrength } from "@/lib/password-utils"
import { useEffect, useState } from "react"

interface PasswordStrengthIndicatorProps {
    password: string
    showSuggestions?: boolean
}

export function PasswordStrengthIndicator({ password, showSuggestions = true }: PasswordStrengthIndicatorProps) {
    const [strength, setStrength] = useState<PasswordStrength>({
        score: 0,
        label: "Too weak",
        color: "bg-red-500",
        suggestions: [],
    })

    useEffect(() => {
        const result = calculatePasswordStrength(password)
        setStrength(result)
    }, [password])

    if (!password) return null

    return (
        <div className="space-y-2">
            {/* Strength bars */}
            <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${index < strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
                            }`}
                    />
                ))}
            </div>

            {/* Strength label */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                <span className={`font-medium ${strength.score >= 4 ? "text-green-600" : strength.score >= 3 ? "text-yellow-600" : "text-red-600"}`}>
                    {strength.label}
                </span>
            </div>

            {/* Suggestions */}
            {showSuggestions && strength.suggestions.length > 0 && strength.score < 4 && (
                <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Suggestions:</p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        {strength.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
