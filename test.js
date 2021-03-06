'use strict'

const test = require('tape')

test('child combinators, sass', t => {
  runLint(t, [fixture('child.scss')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].rule,
      'rscss/no-descendant-combinator')
    t.equal(warnings[0].text,
      "Descendant combinator not allowed: '.component-name .badelement' (rscss/no-descendant-combinator)")
  })
})

test('child combinators', t => {
  runLint(t, [fixture('child.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].text,
      "Descendant combinator not allowed: 'a.bad-component .xyz' (rscss/no-descendant-combinator)")
  })
})

test('class format', t => {
  runLint(t, [fixture('class_format.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 10)
    t.equal(warnings[0].text,
      "Invalid component name: '.badcomponent' (rscss/class-format)")
    t.equal(warnings[1].text,
      "Invalid component name: '.badcomponent.-xyz' (rscss/class-format)")
    t.equal(warnings[2].text,
      "Invalid component name: '.badcomponent.-abc' (rscss/class-format)")
    t.equal(warnings[3].text,
      "Only one component name is allowed: '.too-many.component-names' (rscss/class-format)")
    t.equal(warnings[4].text,
      "Invalid helper name: '._badhelper.-variant' (rscss/class-format)")
    t.equal(warnings[5].text,
      'Invalid helper name: \'._badhelper.element\' (rscss/class-format)')
    t.equal(warnings[6].text,
      'Invalid element name: \'.bad_element\' (rscss/class-format)')
    t.equal(warnings[7].text,
      'Invalid variant name: \'.badvariant\' (rscss/class-format)')
    t.equal(warnings[8].text,
      'Invalid element name: \'.bad_nesting\' (rscss/class-format)')
    t.equal(warnings[9].text,
      'Variant has no element: \'.-badvariant\' (rscss/class-format)')
  })
})

test('class format - depth', t => {
  runLint(t, [fixture('class_format-depth.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].text,
      'Component too deep: \'.my-component > .ok > .ok > .ok > .bad\' (rscss/class-format)')
  })
})

test('class format - whitelist', t => {
  runLint(t, [fixture('class_format-whitelist.css')], res => {
    const warnings = res.results[0].warnings
    t.equal(warnings.length, 1)
    t.equal(warnings[0].text,
      'Invalid variant name: \'.bad\' (rscss/class-format)')
  })
})

/*
 * Helpers
 */

function fixture (path) {
  return require('path').join(__dirname, 'fixtures', path)
}

function runLint (t, files, fn) {
  require('stylelint').lint({ files })
    .then(result => fn(result))
    .then(() => t.end())
    .catch(err => t.end(err))
}
