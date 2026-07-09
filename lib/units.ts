// Single source of truth for product units — used by the product form
// (dropdown), the products table/view (labels), and product.actions
// (server-side validation). Kept a plain module so both client and server
// can import it.

export const PRODUCT_UNITS = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'box', label: 'Box' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gm', label: 'Gram (gm)' },
  { value: 'ltr', label: 'Liter (ltr)' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pack', label: 'Pack' },
  { value: 'set', label: 'Set' },
  { value: 'mtr', label: 'Meter (mtr)' },
  { value: 'ton', label: 'Ton' },
] as const

export const PRODUCT_UNIT_VALUES: string[] = PRODUCT_UNITS.map((u) => u.value)

export function unitLabel(value: string): string {
  return PRODUCT_UNITS.find((u) => u.value === value)?.label ?? value
}
