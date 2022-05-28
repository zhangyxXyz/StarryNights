const initCount = (root) => {
  const query1 = new root.v.Query('Comment')
  query1.doesNotExist('rid')
  const query2 = new root.v.Query('Comment')
  query2.equalTo('rid', '')

  const query = AV.Query.or(query1, query2)
  query.notEqualTo('isSpam', true)
  query.equalTo('url', root.C.url)
  
  query.count().then((count) => {
    root.el.querySelector('.count').innerHTML = count
    root.parentCount = count
    root.parentQuery(1)
  }).catch((ex) => {
    console.log(ex)
    root.el.querySelector('.count').innerHTML = 0
  })
}
module.exports = initCount
