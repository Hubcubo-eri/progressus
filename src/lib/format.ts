export const brl = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const toCentavos = (v: string) => Math.round(parseFloat(v.replace(/\./g, '').replace(',', '.') || '0') * 100)

export const dataBr = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '')
