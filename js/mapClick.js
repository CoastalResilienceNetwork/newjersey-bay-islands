function mapClick() {
  require(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], function (
    QueryTask,
    Query
  ) {
    app.view.on('click', function (event) {
      app.view.popup.close();
      // create query
      var queryTask = new QueryTask({
        url: app.url + '/3',
      });
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.geometry = app.view.toMap(event);
      queryTask.execute(query).then(function (response) {
        app.resultsLayer.removeAll();
        if (response.features[0]) {
          app.obj.response = response;
          createClickInfo(response);
        } else {
          closeSelectedIsland();
        }
      });
    });
  });
}
function createClickInfo(response) {
  // add selected feature to map
  var features = response.features.map(function (graphic) {
    graphic.symbol = {
      type: 'simple-fill',
      color: [0, 0, 0, 0],
      style: 'solid',
      outline: {
        color: 'blue',
        width: 1,
      },
    };
    return graphic;
  });
  app.resultsLayer.addMany(features);

  // get attributes
  let a = response.features[0].attributes;

  // turn on one and three mile buffers with definition query
  var oneMileBuff = app.supportingLayers.findSublayerById(1);
  oneMileBuff.definitionExpression = 'Island_ID = ' + a.Island_ID;
  oneMileBuff.visible = true;

  var threeMileBuff = app.supportingLayers.findSublayerById(2);
  threeMileBuff.definitionExpression = 'Island_ID = ' + a.Island_ID;
  threeMileBuff.visible = true;

  // define and format attribute for popup
  let cdf = a.cdf;
  let cdfName = a.cdf_name;
  let acres = a.ACRES.toFixed(2);
  let eroAcres = a.Erosn_Acre.toFixed(2);
  let eroPrct = a.Erosn_prct.toFixed(1);
  let ditchFeet = commaSeparateNumber(a.Ditch_feet);
  let ditchPrct = a.Ditch_prct.toFixed(1);
  let brng_cap = a.brng_cap.toFixed(0);
  let mid_tram = a.mid_tram.toFixed(0);
  if (mid_tram == 0) {
    mid_tram = 'Not Visited';
  }
  let t_range_ft = a.t_range_ft.toFixed(2);
  let ww_dist_mi = a.ww_dist_mi.toFixed(2);
  let mhw_above = a.mhw_above.toFixed(2);
  let prcnt_mhw = a.prcnt_mhw.toFixed(1);

  let tmc_hm_acr = a.tmc_hm_acr.toFixed(2);
  let tmc_hm_pct = a.tmc_hm_pct.toFixed(1);
  let tmc_lm_acr = a.tmc_lm_acr.toFixed(2);
  let tmc_lm_pct = a.tmc_lm_pct.toFixed(1);
  let tmc_mf_acr = a.tmc_mf_acr.toFixed(2);
  let tmc_mf_pct = a.tmc_mf_pct.toFixed(1);
  let tmc_pp_acr = a.tmc_pp_acr.toFixed(2);
  let tmc_pp_pct = a.tmc_pp_pct.toFixed(1);
  let tmc_ph_acr = a.tmc_ph_acr.toFixed(2);
  let tmc_ph_pct = a.tmc_ph_pct.toFixed(1);
  let tmc_tb_acr = a.tmc_tb_acr.toFixed(2);
  let tmc_tb_pct = a.tmc_tb_pct.toFixed(1);
  let tmc_up_acr = a.tmc_up_acr.toFixed(2);
  let tmc_up_pct = a.tmc_up_pct.toFixed(1);
  let tmc_ow_acr = a.tmc_ow_acr.toFixed(2);
  let tmc_ow_pct = a.tmc_ow_pct.toFixed(1);
  let sav_summry = commaSeparateNumber(a.sav_summry);
  let sav_68 = commaSeparateNumber(a.sav_68);
  let sav_79 = commaSeparateNumber(a.sav_79);
  let sav_85_87 = commaSeparateNumber(a.sav_85_87);
  let sav_96_99 = commaSeparateNumber(a.sav_96_99);
  let sav_2003 = commaSeparateNumber(a.sav_2003);
  let sav_2009 = commaSeparateNumber(a.sav_2009);
  let sc_avg_ft = a.sc_avg_ft.toFixed(2);
  let omwm_acres = a.omwm_acres.toFixed(2);

  document.getElementById('selected-island').innerHTML = `
   		<h3>Selected Island</h3>
   		<span style="font-size: 14px; text-decoration: underline;">${a.GoogleName}</span><br>
   		Island Size (acres): <b>${acres}</b><br>
	
		Edge Erosion 1977-2015 (acres): <b>${eroAcres}</b><br>
    Average shoreline change 1977 - 2015 (ft): <b>${sc_avg_ft}</b><br>
		Mosquito Ditching (feet): <b>${ditchFeet}</b><br>
    Open marsh water management (acres): <b>${omwm_acres}</b><br>
		Island Delineation Source: <b>${a.Source}</b><br>
		Soil Penetration Depth: <b>${brng_cap}</b><br>
		MIDTRAM-Score: <b>${mid_tram}</b><br>
		Island Ownership Combine: <b>${a.Ownership}</b><br>
		Tidal Range (feet): <b>${t_range_ft}</b><br>
		Closest Channel Type: <b>${a.ww_type}</b><br>
		Closest Channel (miles): <b>${ww_dist_mi}</b><br>
		Area above MHW (acres): <b>${mhw_above}</b><br>
		Area Above MHW (%): <b>${prcnt_mhw}%</b><br>
		High Marsh (acres): <b>${tmc_hm_acr}</b><br>
		High Marsh (percent): <b>${tmc_hm_pct}%</b><br>
		Low Marsh (acres): <b>${tmc_lm_acr}</b><br>
		Low Marsh (percent): <b>${tmc_lm_pct}%</b><br>
		Mud Flat (acres): <b>${tmc_mf_acr}</b><br>
		Mud Flat (percent): <b>${tmc_mf_pct}%</b><br>
		Pools and Pannes (acres): <b>${tmc_pp_acr}</b><br>
		Pools and Pannes (percent): <b>${tmc_pp_pct}%</b><br>
		Phragmites (acres): <b>${tmc_ph_acr}</b><br>
		Phragmites (percent): <b>${tmc_ph_pct}%</b><br>
		Terrestrial Border (acres): <b>${tmc_tb_acr}</b><br>
		Terrestrial Border (percent): <b>${tmc_tb_pct}%</b><br>
		Upland (acres): <b>${tmc_up_acr}</b><br>
		Upland (percent): <b>${tmc_up_pct}%</b><br>
		Open Water (acres): <b>${tmc_ow_acr}</b><br>
		Open Water (percent): <b>${tmc_ow_pct}%</b><br>
		SAV Distance (feet): <b>${sav_summry}</b><br>
		SAV - Closest Years: <b>${a.sav_sum_yr}</b><br>
		SAV 1968 - Distance (feet): <b>${sav_68}</b><br>
		SAV 1979 - Distance (feet): <b>${sav_79}</b><br> 
		SAV 1985-87 - Distance (feet): <b>${sav_85_87}</b><br>
		SAV 1996-99 - Distance (feet): <b>${sav_96_99}</b><br> 
		SAV 2003 - Distance (feet): <b>${sav_2003}</b><br>
		SAV 2009 - Distance (feet): <b>${sav_2009}</b><br>
		Bird Utilization: <b>${a.bird_util}</b><br>
	
	
		Confined Disposal Facility (CDF): <b> ${cdf}</b><br>
		CDF Name: <b> ${cdfName}</b><br>
   	`;
  document.getElementById('selected-island-wrap').style.display = 'block';
}
