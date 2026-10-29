/** Junta classes condicionais, ignorando valores falsos. */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')
