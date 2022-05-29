import format from 'string-format'
const ele = (root) => {
  const HTML = '<div id="input">' +
                  '<div class="form">' +
                            `<div class="btn cancel-reply" style="display:none" title="${root.i18n.cancelReply}" >` +
                                  '<i class="ic i-times"></i>' +
                            '</div>' +
                            '<div class="inner">' +
  						'<section class="auth-section">' +
                  `<div class="input"><input type="text" name="author" class="vnick" placeholder="${root.i18n.nick}" value=""></div>` +
                  `<div class="input"><input type="email" name="email" class="vmail" placeholder="${root.i18n.mail}" value=""></div>` +
                  `<div class="input"><input type="text" name="website" class="vlink" placeholder="${root.i18n.link}" value=""></div>` +
              '</section>' +
  						'<div class="textarea">' +
                  `<textarea placeholder="${root.placeholder}" class="veditor"></textarea>` +
                                        
  							'<div class="btn-group"><div class="left"><a alt="Markdown is supported" href="https://guides.github.com/features/mastering-markdown/" class="btn" target="_blank">' +
  							`<i class="ic i-markdown"></i></a></div><div class="right"><div class="emojis btn" title="${root.i18n.emoji}">`+
                '<i class="ic i-smile"></i></div>' +
                                           `<div class="preview btn" title="${root.i18n.preview}">` +
                    '<i class="ic i-preview"></i></div>' +
                  `<button type="button" title="Cmd|Ctrl+Enter" class="vsubmit button">${root.i18n.submit}</button>`+ 
                `</div></div>` +
                                    '<div class="vextra-area">' +

                                        '<div class="smile-body" style="display:none">' +
  									'<div class="smile-icons"><ul></ul></div>' +
  									'<div class="smile-bar"><ul></ul></div></div>' +
                                        '</div>' +

                                        '<div class="preview-box md" style="display:none"></div>' +
                                    '</div>' +
                                '<div style="display:none;" class="msg"></div>' +
                            '</div>' +
                            '<div class="submitting" style="display:none;"></div>' +
                        '</div>' +
                       '</div>' +
                       '<div class="info">' +
                            `<div class="col"> ${format(root.i18n.commentCount, '<span class="count">0</span>')}</div>` +
                       '</div>' +
                       '<ul class="list"><li class="empty"></li></ul>' +
                       '<div class="loading"></div>' +
                       '<div class="next text-center"></div>'
  return HTML
}
module.exports = ele
