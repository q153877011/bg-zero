export const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const
export type FAQKey = (typeof FAQ_KEYS)[number]
