import getScript from './getScript'
const init = () => {
  const script = document.createElement('script')
  script.text = `
      window.MathJax = {
          tex: {
            inlineMath: [['$','$']],
            autoload: {
                verb: ['verb'],
				color: [],
                colorV2: ['color'],
                require:['require']
            },
            packages: {'[+]': ['braket']}
          },
          loader: {load: ['[tex]/braket']},
          svg: {
            fontCache: 'global'
          }
      }
  `
  try { document.getElementsByTagName('body')[0].appendChild(script) } catch (e) {}
}
export function initMathJax () {
  if (typeof window.MathFinish === 'undefined') {
    init()
    window.MathFinish = true
  }
}
