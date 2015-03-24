function search(){
	var keyword = $("#search-text").val();
	keyword=keyword.replace(/ /g,"+");
	var site = "http://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term="+encodeURIComponent(keyword)+"&retmax=30";
	$("#busy-holder").show()
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
	$.getJSON(yql, callback);
}

function callback(res){
	$("#busy-holder").hide()
	var respData = res['results'][0];
	var conData = $.parseXML(respData);
	$test = $(conData);
  	var $data = $(conData).find("document");
  	var resStr="";
  	$data.each(function(){
  		resStr+="<li><h5><div class='open_box' tabindex='-1'></div>";
		resStr+="<a href='"+$(this).attr('url')+"' target='_blank'>"+$(this).find("content[name=title]").text()+"("+$(this).find("content[name=organizationName]").text()+")</a>";
		resStr+="</h5><div class='contentBlog' style='display:none'>";
		resStr+=$(this).find("content[name=FullSummary]").text();
		resStr+="</div></li>"
  	})
  	if($data.length==0){
		resStr="<li><p> No Matching Result(s) </p></li>";
	}
	$("#main-result").html(resStr);

	$('#results').pajinate({
		items_per_page : 10,
		nav_label_first : '<<',
		nav_label_last : '>>',
		nav_label_prev : '<',
		nav_label_next : '>'	
	});

	$("#results").show().find(".ellipse").hide();
	$("#search-text").focus();

}

var $test;

$( document ).ready(function() {
	$("#find").on("click",function(){
		search();
	});

	$("#results").on("click",".open_box",function(){
		var thisObj = $(this);
        var contentBlog = thisObj.parent().next(".contentBlog");
        if(contentBlog.is(":visible")){
          thisObj.parent().removeClass('opened');
        	contentBlog.slideUp('slow');
        }else{
          thisObj.parent().addClass('opened')
          contentBlog.slideDown('slow');
        }
	})

	$("#search-text").on("keyup",function(e){
		var keycode = e.keyCode;
		if(keycode==13)
			search();
	})

});