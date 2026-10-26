const formatter = new Intl.NumberFormat('fa-IR');
export const formatNumber = (value: number) => formatter.format(value);
export const formatPrice = (value: number) => formatter.format(value);
export const normalizeDigits = (value: string) => value.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
