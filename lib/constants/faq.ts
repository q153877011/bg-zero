export const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const
export const AUTO_FAQ_KEYS = ['auto_q1', 'auto_q2', 'auto_q3', 'auto_q4'] as const
export const MANUAL_FAQ_KEYS = ['manual_q1', 'manual_q2', 'manual_q3', 'manual_q4'] as const
export const ID_PHOTO_FAQ_KEYS = ['idphoto_q1', 'idphoto_q2', 'idphoto_q3', 'idphoto_q4'] as const
export const ECOMMERCE_FAQ_KEYS = ['ecom_q1', 'ecom_q2', 'ecom_q3', 'ecom_q4'] as const
export const COMPARE_FAQ_KEYS = ['compare_q1', 'compare_q2', 'compare_q3', 'compare_q4'] as const
export const VIDEO_FAQ_KEYS = ['video_q1', 'video_q2', 'video_q3', 'video_q4'] as const
export const WEBP_FAQ_KEYS = ['webp_q1', 'webp_q2', 'webp_q3', 'webp_q4'] as const
export const PRIVACY_FAQ_KEYS = ['privacy_q1', 'privacy_q2', 'privacy_q3', 'privacy_q4'] as const

export type FAQKey = (typeof FAQ_KEYS)[number]
export type AutoFAQKey = (typeof AUTO_FAQ_KEYS)[number]
export type ManualFAQKey = (typeof MANUAL_FAQ_KEYS)[number]
