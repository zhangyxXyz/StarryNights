import timeAgo from '../body/timeago'

const recentComment = function (root) {
	var el = document.querySelector('.leancloud-recent-comment')
	if(!el || el.classList.contains('loaded')) return
	
	AV.Query.doCloudQuery(
      "select nick, mail, comment, url from Comment where (rid='' or rid is not exists) order by -createdAt limit 0,10"
    ).then(function(rets){
      rets = (rets && rets.results) || []
      const len = rets.length

      if (len) {
        var html = ''
        for (var i = 0; i < len; i++) {
          html += '<li class="item">'
          +'<a href="/' + rets[i].get('url') +'#'+rets[i].id+'">'
          + '<span class="breadcrumb">'+rets[i].get('nick') + ' @ '+ timeAgo(rets[i].get('createdAt'), root.i18n)+'</span>'
          + '<span>'+rets[i].get('comment').replace(/<[^>]+>/gi, '').substr(0, 100)+'</span></a>'
          +'</li>'
        }

      	el.innerHTML = html
        el.classList.add('loaded')

        root.config.pjax && root.config.pjax.refresh(el);
      }
	})
}

const widgets = (root) => {
  recentComment(root)
}
module.exports = widgets