/**
 * Logo AssiGame — version SVG vectorielle (toujours nette, fond transparent).
 * `variant="full"` affiche icône + texte, `variant="icon"` affiche seulement le pictogramme.
 */
export default function Logo({ variant = "full", height = 36 }) {
    if (variant === "icon") {
        return (
            <svg height={height} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="AssiGame">
                <defs>
                    <linearGradient id="agIconGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3DB7F2" />
                        <stop offset="100%" stopColor="#FF9A3C" />
                    </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#agIconGrad)" />
                <path
                    d="M20 26 L23 18 H41 L44 26"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect x="17" y="26" width="30" height="22" rx="4" fill="#ffffff" />
                <circle cx="32" cy="37" r="6.5" fill="#3DB7F2" />
                <path
                    d="M29.6 33.6 L35.6 37 L29.6 40.4 Z"
                    fill="#ffffff"
                />
            </svg>
        );
    }

    return (
        <svg height={height} viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" aria-label="AssiGame">
            <defs>
                <linearGradient id="agGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3DB7F2" />
                    <stop offset="100%" stopColor="#FF9A3C" />
                </linearGradient>
            </defs>

            {/* Pictogramme : sac + bouton play (vente + gaming) */}
            <g transform="translate(0,8)">
                <circle cx="32" cy="32" r="30" fill="url(#agGrad)" />
                <path
                    d="M20 26 L23 18 H41 L44 26"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect x="17" y="26" width="30" height="22" rx="4" fill="#ffffff" />
                <circle cx="32" cy="37" r="6.5" fill="#3DB7F2" />
                <path d="M29.6 33.6 L35.6 37 L29.6 40.4 Z" fill="#ffffff" />
            </g>

            {/* Wordmark */}
            <text
                x="76"
                y="50"
                fontFamily="'Segoe UI', system-ui, sans-serif"
                fontWeight="800"
                fontSize="34"
                letterSpacing="-0.5"
            >
                <tspan fill="#15202B">assi</tspan>
                <tspan fill="#3DB7F2">g</tspan>
                <tspan fill="#FF9A3C">a</tspan>
                <tspan fill="#3DB7F2">me</tspan>
            </text>
        </svg>
    );
}
