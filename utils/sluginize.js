import removeAccents from 'remove-accents'

export const sluginize = str =>
  removeAccents(
    str
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/\s/g, '_')
      .replace(/[^\w\d-_]/g, '-'),
  )
