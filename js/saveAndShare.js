// add save and share button
if (showSaveAndShare){
	document.querySelector("#viewDiv").insertAdjacentHTML("beforeend",`
		<div id="saveshare-wrap">
			<div class="esri-expand__panel">
				<div id="saveAndShare" title="Save and Share" role="button" tabindex="0" class="esri-widget--button">
					<span aria-hidden="true" class="esri-collapse__icon esri-expand__icon--expanded esri-icon-share"></span>
					<span class="esri-icon-font-fallback-text">Save and Share</span>
				</div>
			</div>					
		</div>
	`)
}
// save and share click
document.querySelector(`#saveAndShare`).addEventListener('click', (() => {
	createURL();
}))
function createURL(){
	$(`.dlssre`).prop("disabled",true);

	updateObject()
	// convert app.obj to json
	let myjson = JSON.stringify(app.obj);
	// encode JSON as URI
	let uri = encodeURIComponent(JSON.stringify(myjson))

	var apiKey = "48598fa6dd3e4237b18dd6344b77a049";
	var requestHeaders = {
		"Content-Type": "application/json",
		"apikey": apiKey
	};
	
	var linkRequest = {
		destination: "https://maps.coastalresilience.org/nj-bay-islands/?search=" + uri
	};
	shortUrl = "";
	$.ajax({
		url: 'https://api.rebrandly.com/v1/links',
		type: "post",
		data: JSON.stringify(linkRequest),
		headers: requestHeaders,
		dataType: "json",
		success: function(result){
			shortUrl = (result.shortUrl.indexOf('http') == -1) ? 'https://' + result.shortUrl : result.shortUrl;
            console.log(shortUrl)
            openSaveAndSharePopup(shortUrl);
		},
		error: function(error) {
            shortUrl = linkRequest.destination;
            console.log(shortUrl)
            openSaveAndSharePopup(shortUrl);
		}
	});
}
function openSaveAndSharePopup(shortUrl){
	app.view.popup.close();
	let div = document.createElement("div");
	div.setAttribute("id", "saveAndSharePopup");
	div.className = "saveAndSharePopup";
	div.classList.add("esri-popup--shadow");
	div.innerHTML = `
		<div class="saveAndShareHeaderWrap">
			<h2 class="saveAndShareHeader">Save and Share</h2>
			<div class="esri-popup__header-buttons">
				<div role="button" tabindex="0" class="esri-popup__button" aria-label="Close" title="Close">
					<span onclick="closeSaveAndSharePopup()" aria-hidden="true" class="esri-popup__icon esri-icon-close">
					</span>
				</div>
			</div>
		</div>
		<div style="margin: 0 10px;">
			<div style="margin-left:4px;">Permalink <span id="copiedText">copied!</span></div>
			<input type="text" id="saveAndShareLink" value="${shortUrl}">
			<button id="saveAndShareButton" class="button button-default" onclick="copySaveAndShareLink()">Copy to Clipboard</button>
		</div>
	`
	let mapDiv = document.getElementById("map-div");
	mapDiv.appendChild(div);
}
function copySaveAndShareLink(){
	var copyText = document.getElementById("saveAndShareLink");
	copyText.select();
	copyText.setSelectionRange(0, 99999)
	document.execCommand("copy");
	document.getElementById("copiedText").style.display = "inline-block";
}
function closeSaveAndSharePopup(){
	document.getElementById("saveAndSharePopup").remove();
	$(`.dlssre`).prop("disabled",false)
}
//this will vary for each app
function updateObject(){
	// Get slider ids and values when values do not equal min or max
	app.obj.slIdsVals = [];
	document.querySelectorAll("#mng-act-wrap .slider").forEach(((v) => {
		var idArray = v.id.split('-');
		var id = "-" + idArray[1];
		var min = $('#' + v.id).slider("option", "min");
		var max = $('#' + v.id).slider("option", "max");
		var values = $('#' + v.id).slider("option", "values");
		if (min != values[0] || max != values[1]){
			app.obj.slIdsVals.push([ id, [values[0], values[1]] ])
		}
	}));
	// Git ids of checked checkboxes above sliders
	app.obj.slCbIds = [];
	document.querySelectorAll("#mng-act-wrap .-slCb").forEach(((v) => {
		if (v.checked == true){
			var id = "-" + v.id.split('-').pop();
			app.obj.slCbIds.push(id)
		}
		Array.from(new Set(app.obj.slCbIds));
	}))
	// Get ids of checked radio buttons
	app.obj.rbIds = [];
	document.querySelectorAll(".umr-radio-indent input").forEach(((v) => {
		if (v.checked == true){
			var id = "-" + v.id.split('-').pop();
			app.obj.rbIds.push(id)
		}
	}));	
	// Get ids of checked checkboxes above radio buttons
	app.obj.rbCbIds = [];
	document.querySelectorAll("#mng-act-wrap .rb_cb").forEach(((v) => {
		if (v.checked == true){
			var id = "-" + v.id.split('-').pop();
			app.obj.rbCbIds.push(id)
		}
	}));	
	// Get ids of checked supporting layers
	app.obj.supLyrIds = [];
	document.querySelectorAll("#layer-viewer-wrap .sup_cb").forEach(((v) => {
		if (v.checked == true){
			app.obj.supLyrIds.push(v.id);
		}
	}))
	// center and zoom level
	app.obj.extent = app.view.extent;
	// get current basemap, lookup for basemap id
	var basemaps =[{title: "Oceans",id:"oceans"},
	{title: "oceans", id:"oceans"},
	{title: "Topographic", id: "topo-vector"},
	{title: "topo-vector", id: "topo-vector"},
	{title: "Imagery Hybrid", id: "hybrid"},
	{title: "hybrid", id: "hybrid"},
	{title: "Streets", id: "streets-vector"},
   {title: "streets", id: "streets-vector"}]
	var currentBasemap = basemaps.find( ({ title }) => title === app.map.basemap.title );
	app.obj.basemap = currentBasemap.id;
	// trigger build from state
	app.obj.stateSet = "yes";
}

// Save and Share Handler					
function buildFromState(){
	if (app.obj.stateSet == "yes"){
		// set slider values
		app.obj.slIdsVals.forEach((v) => {
			$('#id' + v[0]).slider('values', v[1]);
		})	
		// // checkboxes for sliders
		app.obj.slCbIds.forEach((v) => {
		 	$('#id' + v).trigger('click');
		})
		// set radio buttons to checked state
		app.obj.rbIds.forEach((v) => {
		 	$('#id' + v).attr('checked', true);
		})
		// // checkboxes for radio buttons
		app.obj.rbCbIds.forEach((v) => {
			$('#id' + v).trigger('click');	
		})
		app.supportingLayers.when(function() {
			app.obj.supLyrIds.forEach((v) => {
				document.querySelector(`#${v}`).click();
			})
		});
		//extent and basemap
		require(["esri/geometry/Extent", "esri/geometry/SpatialReference"], function(Extent,SpatialReference) { 
			app.view.when(function(){
				app.view.extent = new Extent(app.obj.extent)
				app.map.basemap = app.obj.basemap
			})
		});
		app.obj.stateSet = "no";
	}else{
		//zoom to layer
		// app.supportingLayers.when(function() {
		// 	app.view.goTo(app.supportingLayers.fullExtent).catch(function(error){
		// 		if (error.name != "AbortError"){
		// 			console.error(error);
		// 		}
		// 	});
		// 	// add layerviewer to app
   			
		// });
	}
}