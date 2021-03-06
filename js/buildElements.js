function buildElements(){
	// create filter controls from object
	let num = 0;
    let num1 = 0;
    Object.entries(app.filterObj).forEach(([k, v]) => {
    	num = num + 1;
		document.querySelector(`#mng-act-wrap`).insertAdjacentHTML("beforeend", `
			<h4><span class="fa fa-chevron-down chev-oc chev-o"></span><span class="fa fa-chevron-right chev-oc chev-c"></span>${v.header}</h4>
			<div class="oc-wrap" id="oc-wrap${num}"></div>
		`);
		Object.entries(v.controls).forEach(([k1, v1]) => {
			num1 = num1 + 1;
			if (v1.type == "slider"){
				document.querySelector(`#oc-wrap${num}`).insertAdjacentHTML("beforeend", `
					<div class="cntrlWrap" id="wrap-${v1.field}">
						<div class="flexSlideWrap">
							<div class="flex1">
								<label class="form-component" for="id-slCb${num1}">
									<input type="checkbox" class="-slCb" id="id-slCb${num1}" name="-slCb${num1}"><span class="check"></span>
									<span class="form-text under">${v1.label}</span>
								</label>
							</div>
							<div class="flex1a">
								<span class="umr-slider-label label-off"><span class="rnum label-off">x</span> to <span class="rnum label-off">y</span> ${v1.unit}</span>
								<div class="slider-container range-slider" style="width:170px;">
									<canvas id="hist-id-${v1.field}" width="170" height="30" style="margin-bottom:2px;"></canvas>
									<div id="id-${v1.field}" class="slider"></div>
								</div>
							</div>
							<div class="feInfoWrap"><i class="fal fa-info-circle feInfo feInfoOpen"></i></div>
							<div class="feInfoTextWrap"><span class="feInfoText"></span><i class="fas fa-times feInfo feInfoClose"></i></div>						
						</div>	
					</div>
				`);
				getHistogram(v1.field)
			}
			if (v1.type == "radio"){
				document.querySelector(`#oc-wrap${num}`).insertAdjacentHTML("beforeend", `
					<div class="cntrlWrap" id="wrap-${v1.field}">
						<div class="mng-act-toggle flexSlideWrap">
							<div class="flex1">
								<label class="form-component" for="id-rb_cb${num1}">
									<input type="checkbox" class="rb_cb" id="id-rb_cb${num1}" name="rb_cb${num1}"><span class="check"></span>
									<span class="form-text under">${v1.label}</span>
								</label>
							</div>	
							<div class="umr-radio-indent flex1">
								<label class="form-component" for="id-rb${num1}a">
									<input checked type="radio" id="id-rb${num1}a" name="${v1.field}" value="${v1.trueVal}" disabled>
									<span class="check"></span><span class="form-text">${v1.trueLabel}</span>
								</label>
								<label class="form-component" for="id-rb${num1}b">
									<input type="radio" id="id-rb${num1}b" name="${v1.field}" value="${v1.falseVal}" disabled>
									<span class="check"></span><span class="form-text">${v1.falseLabel}</span>
								</label>
							</div>	
							<div class="feInfoWrap"><i class="fal fa-info-circle feInfo feInfoOpen"></i></div>
							<div class="feInfoTextWrap"><span class="feInfoText"></span><i class="fas fa-times feInfo feInfoClose"></i></div>
						</div>
					</div>
				`);	
			}
			if (v1.type == "checkboxes"){
				document.querySelector(`#oc-wrap${num}`).insertAdjacentHTML("beforeend",`
					<div class="cntrlWrap" id="wrap-${v1.field}">
						<div class="mng-act-toggle flexSlideWrap">
							<div class="flex1">
								<label class="form-component" for="id-rb_cb${num1}">
									<input type="checkbox" class="checkboxes" id="id-rb_cb${num1}" name="rb_cb${num1}"><span class="check"></span>
									<span class="form-text under">${v1.label}</span>
								</label>
							</div>
							<div class="flex1 checkboxes-wrap" id="checkboxes-${v1.field}"></div>	
							<div class="feInfoWrap"><i class="fal fa-info-circle feInfo feInfoOpen"></i></div>
							<div class="feInfoTextWrap"><span class="feInfoText"></span><i class="fas fa-times feInfo feInfoClose"></i></div>
						</div>
					</div>
				`)
				v1.options.forEach((opt,i) =>{
					document.querySelector(`#checkboxes-${v1.field}`).insertAdjacentHTML("beforeend",`
						<label class="form-component" for="id-cbs${i}">
							<input type="checkbox" class="cbs" id="id-cbs${i}" value="${opt}" name="${v1.field}" disabled><span class="check"></span>
							<span class="form-text under">${opt}</span>
						</label>
					`)
				})
			}
		})
    });
    // create supporting layers section
    if (app.hasSupportingLayers){
    	document.querySelector("#sup-layers-wrap").insertAdjacentHTML("beforeend",`<h3>Supporting Layers</h3>`)
    	app.mapImageLayers.forEach((v) => {
			if (v.supporting){    
				let info = "";
				if (v.info){
					info = `<div class="feInfoWrapSub"><i class="fa fa-info-circle feInfo feInfoOpen"></i></div>
							<div class="feInfoTextWrap"><span class="feInfoText">${v.info}</span><i class="fas fa-times feInfo feInfoClose"></i></div>`
				}		
	    		document.querySelector("#sup-layers-wrap").insertAdjacentHTML("beforeend",`
	    			<div class="flex1" style="position:relative;">
						<label class="form-component" for="sup_cb${v.id}">
							<input type="checkbox" class="sup_cb" id="sup_cb${v.id}" name="sup_cb${v.id}" value="${v.id}"><span class="check"></span>
							<span class="form-text under">${v.title}</span>
						</label>
						${info}
					</div>
	    		`)
    		}
    	})
    }
    // Set up range slider
	$('#mng-act-wrap .slider').slider({range:true, min:0, max:2400, values:[0,2400], disabled:true, 
		change:function(event,ui){sliderChange(event,ui)},
		slide:function(event,ui){sliderSlide(event,ui)}
	})
    eventListeners()
}
