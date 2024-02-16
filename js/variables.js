var search = window.location.search;
// check for save and share data in URL
if (search) {
  let searchslice = search.slice(8);
  let so = JSON.parse(decodeURIComponent(searchslice));
  app.obj = JSON.parse(so);
  buildVariables();
  console.log(app.obj);
} else {
  // if no save and share, use obj.json file
  fetch('obj.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      app.obj = data;
      buildVariables();
    });
}

// map service URL
app.url =
  'https://services2.coastalresilience.org/arcgis/rest/services/New_Jersey/NJ_Bay_Islands/MapServer';

// Layer Viewer Variables
const layerViewer = {
  // show layer viewer - boolean
  show: true,
  // map service for layer viewer
  url: app.url,
  // url: "https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/ENCOnline/MapServer/exts/MaritimeChartService/MapServer",
  // location of layer view - sidebar or overmap
  location: 'overmap',
  // boolean for expand or collapse - only used in overmap
  expand: true,
  // layer ids to skip in layer viewer
  skipLayers: [1, 2, 3, 8],
  // layer viewer title
  title: 'Supporting Layers',
};

// Whether to add save and share as widget over map
showSaveAndShare = true;

function buildVariables() {
  // object to build filter controls
  app.filterObj = {
    group0: {
      header: 'Island Condition',
      controls: {
        con0: {
          type: 'radio',
          field: 'cdf',
          label: 'Confined Disposal Facilities (CDFs)',
          unit: '',
          trueLabel: 'Present',
          trueVal: 'Present',
          falseLabel: 'Absent',
          falseVal: 'Absent',
        },
        con1: {
          type: 'slider',
          field: 'prcnt_mhw',
          label: 'Island above MHW',
          unit: '%',
        },
        con2: {
          type: 'slider',
          field: 'Erosn_Acre',
          label: 'Island Edge Erosion 1977-2015 (acres)',
          unit: 'acres',
        },
        con3: {
          type: 'slider',
          field: 'Erosn_prct',
          label: 'Island Edge Erosion 1977-2015 (%)',
          unit: '%',
        },
        con4: {
          type: 'slider',
          field: 'Ditch_feet',
          label: 'Tidal marsh ditching (linear feet)',
          unit: 'linear feet',
        },
        con5: {
          type: 'slider',
          field: 'Ditch_prct',
          label: 'Tidal marsh ditching (% area)',
          unit: '%',
        },
        con6: {
          type: 'slider',
          field: 'brng_cap',
          label: 'Soil Penetration Depth',
          unit: '',
        },
        con7: {
          type: 'slider',
          field: 'mid_tram',
          label:
            'Mid-Atlantic Tidal Wetlands Rapid Assessment Method Score (Mid-TRAM)',
          unit: '',
        },
      },
    },
    group1: {
      header: 'Project Planning',
      controls: {
        con0: {
          type: 'checkboxes',
          field: 'bird_util',
          label: 'Bird utilization',
          options: ['Egrets/Herons', 'Laughing gulls/Terns', 'absent'],
        },
        con1: {
          type: 'checkboxes',
          field: 'Ownership',
          label: 'Island Ownership',
          options: [
            'Municipal Government',
            'NGO',
            'Private',
            'State of New Jersey',
            'USFWS',
            'Unknown',
          ],
        },
        con2: {
          type: 'slider',
          field: 'ww_dist_mi',
          label: 'Proximity to navigation channels',
          unit: 'miles',
        },
        con3: {
          type: 'slider',
          field: 'sav_summry',
          label: 'Proximity to submerged aquatic vegetation',
          unit: 'feet',
        },
        con4: {
          type: 'slider',
          field: 'tmc_hm_pct',
          label: 'Tidal marsh class: high marsh (%)',
          unit: '%',
        },
        con5: {
          type: 'slider',
          field: 'tmc_lm_pct',
          label: 'Tidal marsh class: low marsh (%)',
          unit: '%',
        },
        con6: {
          type: 'slider',
          field: 'tmc_mf_pct',
          label: 'Tidal marsh class: mud flat (%)',
          unit: '%',
        },
        con7: {
          type: 'slider',
          field: 'tmc_ow_pct',
          label: 'Tidal marsh class: open water (%)',
          unit: '%',
        },
        con8: {
          type: 'slider',
          field: 'tmc_ph_pct',
          label: 'Tidal marsh class: phragmites (%)',
          unit: '%',
        },
        con9: {
          type: 'slider',
          field: 'tmc_pp_pct',
          label: 'Tidal marsh class: pools/pannes (%)',
          unit: '%',
        },
        con10: {
          type: 'slider',
          field: 'tmc_up_pct',
          label: 'Tidal marsh class: upland (%)',
          unit: '%',
        },
        con11: {
          type: 'slider',
          field: 't_range_ft',
          label: 'Tidal range',
          unit: 'feet',
        },
        con12: {
          type: 'slider',
          field: 'sc_avg_ft',
          label: 'Shoreline change 1977 - 2015',
          unit: 'feet',
        },
        con13: {
          type: 'slider',
          field: 'omwm_acres',
          label: 'Open Marsh Water Management (acres)',
          unit: 'acres',
        },
      },
    },
  };
  // define if app has supporting layers
  app.hasSupportingLayers = false;

  // definition expression root field names
  app.cdf = '';
  app.prcnt_mhw = '';
  app.Erosn_Acre = '';
  app.Erosn_prct = '';
  app.brng_cap = '';
  app.Ditch_feet = '';
  app.Ditch_prct = '';
  app.mid_tram = '';
  app.bird_util = '';
  app.Ownership = '';
  app.ww_dist_mi = '';
  app.sav_summry = '';
  app.tmc_hm_pct = '';
  app.tmc_lm_pct = '';
  app.tmc_mf_pct = '';
  app.tmc_ow_pct = '';
  app.tmc_ph_pct = '';
  app.tmc_pp_pct = '';
  app.tmc_up_pct = '';
  app.t_range_ft = '';
  app.sc_avg_ft = '';
  app.omwm_acres = '';

  // object for range slider
  app.sliderObj = {
    prcnt_mhw: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Island above MHW</b><br>Area above mean high water (MHW) was calculated for each island using the USGS's New Jersey and Delaware Coastal National Elevation Database DEM (2015 data and below). MHW values calculated using NOAA's VDatum. The DEM was post-processed to remove positive elevation bias due to salt marsh vegetation by using raster resampling methods described in the journal article “Removal of Positive Elevation Bias of Digital Elevation Models for Sea-Level Rise Planning.” These methods remove positive elevation bias by resampling the raster from a 1-meter cell size to a 4-meter cell size and apply the minimum elevation value within the search window. <a href='https://www.usgs.gov/core-science-systems/eros/coned' target='_blank'>USGS CoNED</a> <a href='https://www.mdpi.com/2306-5729/4/1/46' target='_blank'>Journal Link</a>",
    },
    Erosn_Acre: {
      values: [],
      vis: true,
      min: 0,
      max: 20,
      info: "<b>Island Edge Erosion 1977-2015 (acres)</b><br>This dataset was created to illustrate and quantify in acres how bay islands footprints have changed over time. This dataset was created by comparing island footprints delineated in the 1977 NJ Tidelands Claim Line and the 2015 Land Use/Land Cover datasets. For each island, the total acres of salt marsh lost since the 1977 mapping was calculated. In general, loss in bay island footprint can be attributed to erosion and inundation. Note that marsh footprints between 2015 and 2012 LU/LC remained mostly unchanged. <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/tidelands-claim-line-of-new-jersey-download' target='_blank'>NJ Tidelands Claim Line</a> <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/land-use-land-cover-of-new-jersey-2015-download' target='_blank'>2015 NJ Land Use/ Land Cover</a>",
    },
    Erosn_prct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Island Edge Erosion 1977-2015 (%) </b><br>This dataset was created to illustrate and quantify in acres how bay islands footprints have changed over time. This dataset was created by comparing island footprints delineated in the 1977 NJ Tidelands Claim Line and the 2015 Land Use/Land Cover datasets. For each island, the total acres of salt marsh lost since the 1977 mapping was calculated. In general, loss in bay island footprint can be attributed to erosion and inundation. Note that marsh footprints between 2015 and 2012 LU/LC remained mostly unchanged. <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/tidelands-claim-line-of-new-jersey-download' target='_blank'>NJ Tidelands Claim Line</a> <a href='https://gisdata-njdep.opendata.arcgis.com/datasets/land-use-land-cover-of-new-jersey-2015-download' target='_blank'>2015 NJ Land Use/ Land Cover</a>",
    },
    brng_cap: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      info: "<b>Tidal marsh Soil Penetration Depth</b><br>Soil Penetration Depth is one of the five parameters used in the Habitat Score section of the Mid-TRAM assessment. This parameter is a measure of soil resistance using a slide hammer. A lesser depth indicates that the substrate is firmer, suggesting good conditions for supporting loads (wetland plants).  Zero Value indicates the island is too small for the Mid-TRAM methods or it has yet to be assessed. <a href='https://wetlandinfo.des.qld.gov.au/wetlands/resources/tools/assessment-search-tool/mid-atlantic-tidal-wetland-rapid-assessment-method-midtram-v4-1/' target='_blank'>More Info</a>",
    },
    Ditch_feet: {
      values: [],
      vis: true,
      min: 0,
      max: 5000,
      gtmax: true,
      info: "<b>Tidal marsh ditching (linear feet)</b><br>The Marsh Ditching dataset was compiled from state and academic sources. This layer shows where bay islands have been ditched and provides length (in feet) of ditching per island. Note: this data layer should be used as a reference only as it does not fully delineate all man-made ditching. For more detail, a desktop analysis or an on-the-ground survey should be conducted. <a href='https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution' target='_blank'>USGS NHD</a> <a href='https://scholarworks.umass.edu/data/30/' target='_blank'>University of Mass. Amherst</a>",
    },
    Ditch_prct: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      gtmax: true,
      info: "<b>Tidal marsh ditching(% area)</b><br>The Marsh Ditching dataset was compiled from state and academic sources. It estimates the percent of each island that is ditched. To calculate areas, an average ditch width of 5.0 feet used. Note: this data layer should be used as a reference only as it does not fully delineate all man-made ditching. For more detail, a desktop analysis or an on-the-ground survey should be conducted. <a href='https://www.usgs.gov/core-science-systems/ngp/national-hydrography/nhdplus-high-resolution' target='_blank'>USGS NHD</a> <a href='https://scholarworks.umass.edu/data/30/' target='_blank'>University of Mass. Amherst</a>",
    },
    mid_tram: {
      values: [],
      vis: true,
      min: 1,
      max: 100,
      info: "<b>Mid-Atlantic Tidal Wetlands Rapid Assessment Method Score (Mid-TRAM)</b><br>In 2020 and 2021, Barnegat Bay Partnership and US Fish and Wildlife Service used Mid-TRAM to determine the condition of 69 of the islands. Mid-TRAM determines wetland condition on a watershed scale using a combination of on-the-ground and desktop (remote-sensing) analysis. Each wetland is assessed at a single randomly selected point. The assessment area (50m radius from the selected point) and buffer area (250m radius) are assessed with the attributes of hydrology, habitat, and landscape. Condition scores (1-100) are calculated for each wetland, with higher scores indicating better condition. A score of zero (0) means that the wetland could not be assessed using Mid-TRAM because of the assessment method’s limitations (i.e., marsh size and type). Because only a single point per wetland is assessed, it is not reasonable to extrapolate the condition score to the entire wetland, but instead view the condition scores of wetlands on a watershed basis.<a href='https://wetlandinfo.des.qld.gov.au/wetlands/resources/tools/assessment-search-tool/mid-atlantic-tidal-wetland-rapid-assessment-method-midtram-v4-1/' target='_blank'>More Info</a>",
    },
    ww_dist_mi: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      gtmax: true,
      step: 0.1,
      info: "<b>Proximity to New Jersey waterways</b><br>Straight line distance in miles to the closest state or federal navigational channel. <a href='https://www.state.nj.us/transportation/refdata/gis/map.shtm' target='_blank'>More Info</a>",
    },
    sav_summry: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      gtmax: true,
      info: "<b>Proximity to submerged aquatic vegetation</b><br>Distance to the closest submerged aquatic vegetation (SAV). A value of zero indicates that SAV was mapped at the island shoreline. Mapped data is from from Rutgers Univ. CRSSA and includes the years 1968, 1979, 1985-87, 1996-99, 2003, 2009. Original data sources include Rutgers, Army Corps of Engineers, NJDEP, Dr. Paul Bologna, Paul McLain, Robert T. Macomber, and Dick Allen. Please refer to each layer's metadata for use restrictions and limitations. <a href='https://crssa.rutgers.edu/projects/sav/downloads.html' target='_blank'>More Info</a>",
    },
    tmc_hm_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class: high marsh)</b><br>Percent of island covered in high marsh. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d195' target='_blank'>More Info</a>",
    },
    tmc_lm_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class: low marsh</b><br>Percent of island covered in low marsh. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d196' target='_blank'>More Info</a>",
    },
    tmc_mf_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class:  mud flat</b><br>Percent of Island covered in mud flat. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d201' target='_blank'>More Info</a>",
    },
    tmc_ow_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class: open water</b><br>Percent of Island covered in open water, represents mostly island boundaries. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d199' target='_blank'>More Info</a>",
    },
    tmc_ph_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class: phragmites</b><br>Percent of island covered in Phragmites. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d198' target='_blank'>More Info</a>",
    },
    tmc_pp_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class - pools/pannes</b><br>Percent of island covered in pools and pannes. Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d200' target='_blank'>More Info</a>",
    },
    tmc_up_pct: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Tidal marsh class - upland</b><br>Percent of island that is upland (non-wetland). Data represents 2015 conditions. <a href='https://www.sciencebase.gov/catalog/item/5a4d4db3e4b0d05ee8c4d197' target='_blank'>More Info</a>",
    },
    t_range_ft: {
      values: [],
      vis: true,
      min: 0,
      max: 4,
      info: "<b>Tidal range</b><br>Tidal range is the difference (in feet) between MLLW (mean lower low water) and MHHW (mean higher high water) at the center of each bay island using NOAA’s Vertical Datum (VDatum) software.  <a href='https://vdatum.noaa.gov/' target='_blank'>More Info</a>",
    },
    sc_avg_ft: {
      values: [],
      vis: true,
      min: -82,
      max: 100,
      gtmax: true,
      info: "<b>Average shoreline change 1977 - 2015 (feet)</b><br>Average shoreline change was calculated for just 67 of the islands, which are either within Forsythe Wildlife National Refuge or proximal to Long Beach Island. Change (in feet) is the difference between the 1977 NJ Tidelands Claim Line and the 2015 NJ Land Use/Land Cover, calculated every ≈20 meters. Islands that were not assessed were assigned a value of -9,999. <a href='https://www.usgs.gov/centers/whcmsc/science/digital-shoreline-analysis-system-dsas?qt-science_center_objects=0#' target='_blank'>More Info</a>",
    },
    omwm_acres: {
      values: [],
      vis: true,
      min: 0,
      max: 6.4,
      gtmax: true,
      step: 0.1,
      info: "<b>Open Marsh Water Management (acres)</b><br>Area (in acres) of mapped open marsh water management (OMWM) features. This data layer should be used as a reference only as it does not delineate all OMWM features. A value of 0 can indicate that either OMWM has not been mapped for an island or the island has no OMWM features. To verify the presence of OMWM feature, a combination of site visits and aerial imagery should be used. <a href='https://datadryad.org/stash/dataset/doi:10.5061/dryad.3j9kd51d2' target='_blank'>More Info</a>",
    },
  };
  // object for radio groups
  app.radioObj = {
    bird_util: {
      vis: true,
      info: '<b>Bird utilization</b><br> Indicates the presence or absence -- individual or nest -- of common tern, Forsters tern, egrets, herons, and laughing gull on the island using 2013 data.',
    },
    cdf: {
      vis: true,
      info: '<b>Confined Disposal Facilities (CDFs)</b><br>Indicates the presence of a Confined Disposal Facility on a selected island. This dataset was compiled in 2009. <a href="http://crcgis.stockton.edu/iboat/" target="_blank">More Info</a>',
    },
  };
  app.checkboxesObj = {
    Ownership: {
      values: [],
      vis: true,
      info: "<b>Island Ownership</b><br>Ownership type of island. Check multiple ownership types to view islands with more than one owner. <a href='https://njgin.nj.gov/njgin/edata/parcels/#!/' target='_blank'>More Info</a>",
    },
  };
  buildElements();
}
