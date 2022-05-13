var search = window.location.search;
// check for save and share data in URL
if (search){
	let searchslice = search.slice(8);
	let so = JSON.parse(decodeURIComponent(searchslice))
	app.obj = JSON.parse(so)
	buildVariables();
	console.log(app.obj)
}else{
	// if no save and share, use obj.json file
	fetch("obj.json")
		.then(response => {
   			return response.json();
		})
		.then(data => {
			app.obj = data;
			buildVariables();
		})
}

// map service URL
app.url = "https://services2.coastalresilience.org/arcgis/rest/services/New_Jersey/NJ_Bay_Islands/MapServer"

// Layer Viewer Variables
const layerViewer = {
	// show layer viewer - boolean
	show: true,
	// map service for layer viewer
	url: app.url,
	// url: "https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/ENCOnline/MapServer/exts/MaritimeChartService/MapServer",
	// location of layer view - sidebar or overmap
	location: "overmap",
	// boolean for expand or collapse - only used in overmap 
	expand: true,
	// layer ids to skip in layer viewer
	skipLayers: [3,4,5],
	// layer viewer title
	title: "Supporting Layers"	
}

// Whether to add save and share as widget over map
showSaveAndShare = true;

function buildVariables(){
	// object to build filter controls
	app.filterObj = {
		group0:{
			header: "Island Condition",
			controls:{
				con0:{
					type:"slider",
					field:"prcnt_mhw",
					label:"Island above MHW",
					unit:"%"
				},
				con1:{
					type:"slider",
					field:"Erosn_Acre",
					label:"Island Edge Erosion 1977-2015",
					unit:"acres"
				},
				con2:{
					type:"slider",
					field:"brng_cap",
					label:"Soil Penetration Depth",
					unit:""
				},
				con3:{
					type:"slider",
					field:"Ditch_feet",
					label:"Tidal marsh ditching",
					unit:"linear feet"
				},
				con4:{
					type:"slider",
					field:"mid_tram",
					label:"Mid-Atlantic Tidal Wetlands Rapid Assessment Method Score (Mid-TRAM)",
					unit:""
				},
				con5:{
					type:"slider",
					field:"sc_avg_ft",
					label:"Shoreline change 1977 - 2015",
					unit:"feet"
				},
				con6:{
					type:"slider",
					field:"omwm_acres",
					label:"Open marsh water management",
					unit:"acres"
				}
			}
		},
		group1:{
			header:"Project Planning",
			controls:{
				con0:{
					type:"radio",
					field:"bird_util",
					label:"Bird utilization",
					unit:"",
					trueLabel: "Present",
					trueVal: "present",
					falseLabel: "Absent",
					falseVal: "absent",
				},
				con1:{
					type: "checkboxes",
					field: "Ownership",
					label: "Island Ownership",
					options: ["Municipal Government","NGO","Private","State of New Jersey","USFWS","Unknown"]
				},
				con2:{
					type:"slider",
					field:"ww_dist_mi",
					label:"Proximity to New Jersey waterways",
					unit:"miles"
				},
				con3:{
					type:"slider",
					field:"sav_summry",
					label:"Proximity to submerged aquatic vegetation",
					unit:"feet"
				},
				con4:{
					type:"slider",
					field:"tmc_hm_pct",
					label:"Tidal marsh class - high marsh",
					unit:"%"
				},
				con5:{
					type:"slider",
					field:"tmc_lm_pct",
					label:"Tidal marsh class - low marsh",
					unit:"%"
				},
				con6:{
					type:"slider",
					field:"tmc_mf_pct",
					label:"Tidal marsh class - mud flat",
					unit:"%"
				},
				con7:{
					type:"slider",
					field:"tmc_ow_pct",
					label:"Tidal marsh class - open water",
					unit:"%"
				},
				con8:{
					type:"slider",
					field:"tmc_ph_pct",
					label:"Tidal marsh class - phragmites",
					unit:"%"
				},
				con9:{
					type:"slider",
					field:"tmc_pp_pct",
					label:"Tidal marsh class - pools/pannes",
					unit:"%"
				},
				con10:{
					type:"slider",
					field:"tmc_up_pct",
					label:"Tidal marsh class - upland",
					unit:"%"
				},
				con11:{
					type:"slider",
					field:"t_range_ft",
					label:"Tidal range",
					unit:"feet"
				}
			}
		}	
	}
	// define if app has supporting layers
	app.hasSupportingLayers = false;

	// definition expression root field names
	app.prcnt_mhw = "";
	app.Erosn_Acre = "";
	app.brng_cap = "";
	app.Ditch_feet = "";
	app.mid_tram = "";
	app.bird_util = "";
	app.Ownership = "";
	app.ww_dist_mi = "";
	app.sav_summry = "";
	app.tmc_hm_pct = "";
	app.tmc_lm_pct = "";
	app.tmc_mf_pct = "";
	app.tmc_ow_pct = "";
	app.tmc_ph_pct = "";
	app.tmc_pp_pct = "";
	app.tmc_up_pct = "";
	app.t_range_ft = "";
	app.sc_avg_ft = "";
	app.omwm_acres = "";

	// object for range slider
	app.sliderObj = {
		prcnt_mhw:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Island above MHW</b><br>Acreage above mean high water (MHW) was calculated for each island  using the  USGS's New Jersey and Delaware  Coastal National Elevation Database DEM (2015 data and below) and MHW values calculated using NOAA's Vdatum. The DEM was post processed to remove positive elevation bias due to salt marsh vegetation by using raster resampling methods described  in the journal article 'Removal of Positive Elevation Bias of Digital Elevation Models for Sea-Level Rise Planning'. These methods remove positive elevation bias by resampling the raster from a 1-meter cell size to a 4-meter cell size and apply the minimum elevation value within the search window. <a href='https://www.usgs.gov/core-science-systems/eros/coned' target='_blank'>USGS CoNED</a> <a href='https://www.mdpi.com/2306-5729/4/1/46' target='_blank'>Journal Link</a>"
		}, 
		Erosn_Acre:{
			values:[],vis:true,min:0,max:20,
			info:"<b>Island Edge Erosion 1977-2015</b><br>This dataset was created to visually show and quantify in acres how bay islands footprints have changed over time. This dataset was created by comparing island footprints delineated in the 1977 NJ Tidelands Claim Line and the 2015 Land Use/Land Cover datasets. For each island the total acreage of salt marsh lost since the 1977 mapping was calculated. In general losses  in bay island foot prints can be attributed to erosion and inundation. It is important to note that changes in marsh footprint in the 2015 LC/LU remained mostly unchanged since the NJDEP's 2012 iteration. <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/tidelands-claim-line-of-new-jersey-download' target='_blank'>NJ Tidelands Claim Line</a> <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/land-use-land-cover-of-new-jersey-2015-download' target='_blank'>2015 NJ Land Use/ Land Cover</a>"
		}, 
		brng_cap:{
			values:[],vis:true,min:0,max:10,
			info:"<b>Tidal marsh Soil Penetration Depth</b><br>Soil Penetration Depthis one of the five parameters used in the Habitat Score section of the Mid-TRAM assessment. It is a measure of the softness (or sponginess) of the surface of the marsh soil: higher numbers are softer (deeper penetration) and lower numbers are firmer (shallower penetration). Zero indicates the island is either too small to be assessed using the Mid-TRAM methodologyor that it has yet to be assessed. <a href='https://www.barnegatbaypartnership.org/' target='_blank'>More Info</a>"
		}, 
		Ditch_feet:{
			values:[],vis:true,min:0,max:5000,gtmax:true,
			info:"<b>Tidal marsh ditching</b><br>The Marsh Ditching dataset was compiled from state and academic sources. This layer visually shows locations where bay islands have been ditched and provides linear feet of ditching per island.  Note: this data layer does not fully delineate man-made ditching and should be used as a reference only. For more detail, a desktop analysis or an on the ground survey should be conducted. <a href='https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution' target='_blank'>USGS NHD</a> <a href='https://scholarworks.umass.edu/data/30/' target='_blank'>University of Mass. Amherst</a>"
		}, 
		mid_tram:{
			values:[],vis:true,min:1,max:100,
			info:"<b>Mid-Atlantic Tidal Wetlands Rapid Assessment Method Score (Mid-TRAM)</b><br>Mid-TRAM uses on-the-ground techniques to infer the condition of multiple sample point, each consisting of a 50 m2 assessment area, using hydrological, habitat, landscape, and shoreline attributes. The goal of Mid-TRAM is to ground truth remote sensed data analyses of coastal wetland condition in this region. The BBP led  field visits in 2020 to assess the health of 54 islands. Scores were calculated for each island and range between 0 to 100, with 100 being a healthy marsh.  Zero Value indicates the island is to small in size or has yet to be assessed. <a href='https://www.barnegatbaypartnership.org/' target='_blank'>More Info</a>"
		}, 
		ww_dist_mi:{
			values:[],vis:true,min:0,max:1,gtmax:true,step:0.1,
			info:"<b>Proximity to New Jersey waterways</b><br>Straight line distance in miles to the closest state or federal navigational channel. <a href='https://www.state.nj.us/transportation/refdata/gis/map.shtm' target='_blank'>More Info</a>"
		}, 
		sav_summry:{
			values:[],vis:true,min:0,max:100,gtmax:true,
			info:"<b>Proximity to submerged aquatic vegetation</b><br>Distance to the closest submerged aquatic vegetation mapped by Rutgers's CRSSA. Mapped data includes the following years: 1968, 1979, 1985-87, 1996-99, 2003, 2009. Please refer to the metadata associated with each layer for use restrictions and limitations.  A value of zero indicates that mapped SAV touches the current island boundary. <a href='https://crssa.rutgers.edu/projects/sav/downloads.html' target='_blank'>More Info</a>"
		}, 
		tmc_hm_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - high marsh)</b><br>Percent of island covered in high marsh. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d195' target='_blank'>More Info</a>"
		}, 
		tmc_lm_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - low marsh</b><br>Percent of island covered in low marsh. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d196' target='_blank'>More Info</a>"
		}, 
		tmc_mf_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - mud flat</b><br>Percent of Island covered in mud flat. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d201' target='_blank'>More Info</a>"
		}, 
		tmc_ow_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - open water</b><br>Percent of Island covered in open water, represents mostly island boundaries. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d199' target='_blank'>More Info</a>"
		}, 
		tmc_ph_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - phragmites</b><br>Percent of island covered in phragmites. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d198' target='_blank'>More Info</a>"
		}, 
		tmc_pp_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - pools/pannes</b><br>Percent of island covered in pools and pannes. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d200' target='_blank'>More Info</a>"
		}, 
		tmc_up_pct:{
			values:[],vis:true,min:0,max:100,
			info:"<b>Tidal marsh class - upland</b><br>Percent of island covered in uplands. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d197' target='_blank'>More Info</a>"
		}, 
		t_range_ft:{
			values:[],vis:true,min:0,max:4,
			info:"<b>Tidal range</b><br>Tidal ranges were calculated at the center of each bay island using  NOAA's Vertical Datum (Vdatum) software. For each island the following datums were determined; mean lower low water (MLLW),  mean low water (MLW),  local mean sea level (LMSL), mean high water (MHW), mean higher high water (MHHW). The tidal range was calculated from MLLW and MHHW.   All tidal elevations are referenced to NAVD88 Feet.  <a href='https://vdatum.noaa.gov/' target='_blank'>More Info</a>"
		}, 
		sc_avg_ft:{
			values:[],vis:true,min:-82,max:100,gtmax:true,
			info:"<b>Shoreline change 1977 - 2015</b><br>Average shoreline change was calculated for 67 islands that were within Forsythe Wildlife National Refuge or  proximal to Long Beach Island. Shoreline statistics were computed every  ≈  20 meters and compared the 1977  NJ Tidelands Claim line to the 2015 NJ Land Use/Land Cover.  Islands were shoreline change were not computed received a value of -9,999 <a href='https://www.usgs.gov/centers/whcmsc/science/digital-shoreline-analysis-system-dsas?qt-science_center_objects=0#' target='_blank'>More Info</a>"
		}, 
		omwm_acres:{
			values:[],vis:true,min:0,max:6.4,gtmax:true,step:0.1,
			info:"<b>Open marsh water management (acres)</b><br>Acreage of mapped open marsh water management (OMWM). This data layer does not fully delineate OMWM features and should be used as a reference only. Therefore a value of 0 indicates an island has not been mapped or has no features present.  A combination of field visits and imagery should be used to verify the presence of OMWM features. <a href='https://datadryad.org/stash/dataset/doi:10.5061/dryad.3j9kd51d2' target='_blank'>More Info</a>"
		} 
	}
	// object for radio groups
	app.radioObj = {
		bird_util:{
			vis:true,
			info:"<b>Bird utilization</b><br>Indicates the presence or absence of common tern, forsters tern, egrets, herons, and laughing gull. Presences indicates individuals or nests have been documented on the island."
		}
	}
	app.checkboxesObj = {
		Ownership: {
			values: [], vis:true, 
			info:"<b>Island Ownership</b><br>Ownership type of island. Check multiple ownership types to view islands with more than one owner. <a href='https://njgin.nj.gov/njgin/edata/parcels/#!/' target='_blank'>More Info</a>"
		}
	}
	buildElements();
}