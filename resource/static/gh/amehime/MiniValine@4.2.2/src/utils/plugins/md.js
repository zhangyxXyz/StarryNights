import highligher from './highlight'

export function markdown (o) {
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    highlight (code) {
      return highligher.highlightAuto(code).value
    }
  })
  var m = marked(o)
  return m
}
