$( document ).ready(function(){
	listHistory();
	
	$('#button_submit').click(function(){
		var news_url = $('#input_URL').val()
		
		$.ajax({
			url: "/queryNews/"+news_url,
			context: document.body,
			success: function(msg){
				var resultObj = JSON.parse(msg);
				var title = resultObj['title'];
				var time = resultObj['time']
				
				$('#title').text("Title:"+title);
				$('#time').text("Time:"+time);
				$('p.info').show();
			
				setCookie(JSON.stringify({TITLE:title,URL:news_url,TIME:time}),1);
				insertHistory(title,news_url,time);
			}
		}).done(function() {
			console.log('done');
		});
	})
})


function setCookie(cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    
	var timestamp = new Date();
	timestamp.setTime(timestamp.getTime());
	var expires = "expires=" + d.toGMTString();
    document.cookie = timestamp+"="+cvalue+"; "+expires;
	//alert(document.cookie);
}

function deleteCookie(cname,cvalue) {
    var d = new Date();
    d.setTime(d.getTime() - 1);
  
	var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
	//alert(document.cookie);
}

function insertHistory(title, url, time) {
	var row = document.getElementById("table_hist").insertRow(1);
	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);

	// Add some text to the new cells:
	cell1.innerHTML = "<a href="+url+" target=\"_blank\">"+title+"</a>";
	cell2.innerHTML = time;
}

function listHistory() {
	console.log("list histories");
	var cookieArray = document.cookie.split(";");

	for (var i = 0; i < cookieArray.length; i++) {
		if(cookieArray[i]!="")
		{
			try {
				var cElement = cookieArray[i].split("=");
				var cValue = JSON.parse(cElement[1]);
				insertHistory(cValue.TITLE, cValue.URL, cValue.TIME);	
			}catch(e) {
				console.log(e);
			}
		}
	}
}

function clearCookies() {
	
	var cookieArray = document.cookie.split(";");

	for (var i = 0; i < cookieArray.length; i++) {
		if(cookieArray[i]!=[])
		{
			try{
				var cElement = cookieArray[i].split("=");
				deleteCookie(cElement[0],cElement[1]);
			}catch(e){
				console.log(e);
			}
		}
	}
	$("#table_hist tr").remove(); 
	console.log("cookie cleared");
}