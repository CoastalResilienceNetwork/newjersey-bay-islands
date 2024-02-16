function setControlVals() {
  // Update range slider min and max values
  var slen = document.querySelectorAll('#mng-act-wrap .slider').length;
  app.ord = '';
  document.querySelectorAll('h4').forEach((h4) => {
    h4.style.display = 'block';
  });
  document.querySelectorAll('#mng-act-wrap .slider').forEach((v, i) => {
    if (slen == i + 1) {
      app.ord = 'last';
    }
    var ben = v.id.split('-').pop();
    var okeys = Object.keys(app.sliderObj);
    Object.entries(okeys).forEach(([k1, v1]) => {
      if (ben == v1) {
        if (app.sliderObj[v1].vis) {
          $('#' + v.id)
            .parent()
            .parent()
            .parent()
            .parent()
            .show();
          var min = app.sliderObj[v1].min;
          var max = app.sliderObj[v1].max;
          $('#' + v.id).slider('option', 'min', min);
          $('#' + v.id).slider('option', 'max', max);
          if (app.sliderObj[v1].step) {
            var step = app.sliderObj[v1].step;
            $('#' + v.id).slider('option', 'step', step);
          }
          var options = $('#' + v.id).slider('option');
          var val1 = options.min;
          var val2 = options.max;
          if (app.sliderObj[v1].values.length > 0) {
            val1 = app.sliderObj[v1].values[0];
            val2 = app.sliderObj[v1].values[1];
          }
          $('#' + v.id).slider('option', 'values', [val1, val2]);
        } else {
          $('#' + v.id)
            .parent()
            .parent()
            .parent()
            .parent()
            .hide();
          var options = $('#' + v.id).slider('option');
          $('#' + v.id).slider('option', 'values', [options.min, options.max]);
          // hide the header above if the filter group is not visible and has no siblings
          $.each(app.filterObj, function (k, v3) {
            $.each(v3.controls, function (k1, v4) {
              if (v4.field == v1 && v4.single) {
                $(`h4:contains('${v3.header}')`).hide();
                return false;
              }
            });
          });
        }
      }
    });
  });
  // Set definition expressions for visible and enabled radion buttons
  $.each($('.umr-radio-indent input'), function (i, v) {
    var ben = v.name;
    var val = v.name.value;
    var dis = v.disabled;
    if (app.radioObj[ben].vis === true) {
      $(v).parent().parent().parent().parent().show();
    } else {
      $(v).parent().parent().parent().parent().hide();
      $(v).prop('disabled', true);
      if ($('#' + app.radioObj[ben].cbid).prop('checked')) {
        $('#' + app.radioObj[ben].cbid).trigger('click');
      }
    }
  });
  // Update info text
  $.each($('.cntrlWrap'), function (i, v) {
    var obkey = v.id.split('-').pop();
    if (app.sliderObj[obkey]) {
      if (app.sliderObj[obkey].info) {
        if ($(v).find('.feInfoTextWrap').is(':visible')) {
          $(v).find('.feInfoWrap').hide();
        } else {
          $(v).find('.feInfoWrap').show();
        }
        $(v).find('.feInfoText').html(app.sliderObj[obkey].info);
      } else {
        $(v).find('.feInfoWrap').hide();
      }
    }
    if (app.radioObj[obkey]) {
      if (app.radioObj[obkey].info) {
        $(v).find('.feInfoWrap').show();
        $(v).find('.feInfoText').html(app.radioObj[obkey].info);
      } else {
        $(v).find('.feInfoWrap').hide();
      }
    }
    if (app.checkboxesObj[obkey]) {
      if (app.checkboxesObj[obkey].info) {
        $(v).find('.feInfoWrap').show();
        $(v).find('.feInfoText').html(app.checkboxesObj[obkey].info);
      } else {
        $(v).find('.feInfoWrap').hide();
      }
    }
  });
}

function eventListeners() {
  // Checkboxes for sliders
  $('#innerContent .-slCb').on('click', function (c) {
    if (c.target.checked == true) {
      $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.umr-slider-label')
        .removeClass('label-off');
      $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.rnum')
        .removeClass('label-off');
      var sl = $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.slider')[0].id;
      $('#' + sl).slider('option', 'disabled', false);
      var values = $('#' + sl).slider('option', 'values');
      $('#' + sl).slider('values', values);
    }
    if (c.target.checked == false) {
      $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.umr-slider-label')
        .addClass('label-off');
      $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.rnum')
        .addClass('label-off');
      var sl = $('#' + c.target.id)
        .parent()
        .parent()
        .parent()
        .find('.slider')[0].id;
      $('#' + sl).slider('option', 'disabled', true);
      var ben = sl.split('-').pop();
      app[ben] = '';
      layerDefs();
    }
    cbChecker();
  });
  // Checkboxes for radio buttons
  $('#innerContent .rb_cb').on('click', function (c) {
    if (c.target.checked == true) {
      $.each(
        $('#' + c.target.id)
          .parent()
          .parent()
          .next()
          .find('input'),
        function (i, v) {
          $(v).attr('disabled', false);
          if (v.checked == true) {
            $(v).trigger('click');
          }
        }
      );
    }
    if (c.target.checked == false) {
      var ben = $('#' + c.target.id)
        .parent()
        .parent()
        .next()
        .find('input')[0].name;
      app[ben] = '';
      layerDefs();
      $.each(
        $('#' + c.target.id)
          .parent()
          .parent()
          .next()
          .find('input'),
        function (i, v) {
          $(v).attr('disabled', true);
        }
      );
    }
    cbChecker();
  });
  // Checkboxes for checkbox group
  $('#innerContent .checkboxes').on('click', function (c) {
    if (c.target.checked) {
      $.each(
        $('#' + c.target.id)
          .parent()
          .parent()
          .next()
          .find('input'),
        function (i, v) {
          $(v).attr('disabled', false);
          if (v.checked == true) {
            $(v).trigger('click');
            $(v).trigger('click');
          }
        }
      );
    } else {
      let ben = $(`#${c.target.id}`)
        .parent()
        .parent()
        .parent()
        .find('.checkboxes-wrap')[0]
        .id.split('-')
        .pop();
      app[ben] = '';
      layerDefs();
      $.each(
        $('#' + c.target.id)
          .parent()
          .parent()
          .next()
          .find('input'),
        function (i, v) {
          $(v).attr('disabled', true);
        }
      );
    }
  });
  // Checkbox group clicks
  $('.checkboxes-wrap input').on('click', function (c) {
    let ben = c.target.name;
    let field = ben;
    let query = '';
    $.each($('.checkboxes-wrap input'), function (i, v) {
      if (v.checked) {
        if (query.length == 0) {
          query = field + " LIKE '%" + v.value + "%'";
        } else {
          query += ' OR ' + field + " LIKE '%" + v.value + "%'";
        }
      }
    });
    if (query.length == 0) {
      app[ben] = '';
    } else {
      app[ben] = '( ' + query + ' )';
    }
    layerDefs();
  });
  // Radio button clicks
  $('.umr-radio-indent input').on('click', function (c) {
    var ben = c.target.name;
    var field = c.target.name;
    if (app.radioObj[ben].shfld) {
      field = ben;
    }
    var val = c.target.value;
    app[ben] = '( ' + field + " = '" + val + "' )";
    if (val == 1 && ben == 'TNC') {
      app[ben] = '( ' + field + ' > 0 )';
    }
    layerDefs();
  });
  // Info icon clicks
  $('#mng-act-wrap .feInfo').click(function (c) {
    var e = c.currentTarget;
    $('.feInfoTextWrap').hide();
    $('.feInfoWrap').show();
    if ($(e).hasClass('feInfoOpen')) {
      $(e).parent().parent().find('.feInfoTextWrap').show();
    }
    if ($(e).hasClass('feInfoClose')) {
      $(e).parent().parent().find('.feInfoWrap').show();
    }
    $(e).parent().hide();
  });
  $('#sup-layers-wrap .feInfo').click(function (c) {
    var e = c.currentTarget;
    $('.feInfoTextWrap').hide();
    $('.feInfoWrapSub').show();
    if ($(e).hasClass('feInfoOpen')) {
      console.log($(e).parent().parent().find('.feInfoTextWrap'));
      $(e).parent().parent().find('.feInfoTextWrap').show();
    }
    if ($(e).hasClass('feInfoClose')) {
      $(e).parent().parent().find('.feInfoWrapSub').show();
    }
    $(e).parent().hide();
  });
  // filter section chevron clicks
  $('#mng-act-wrap .chev-oc').click(function (c) {
    if ($(c.currentTarget).hasClass('chev-o')) {
      $(c.currentTarget).parent().find('.chev-o').hide();
      $(c.currentTarget)
        .parent()
        .find('.chev-c')
        .css('display', 'inline-block');
      $(c.currentTarget).parent().next().slideUp();
    }
    if ($(c.currentTarget).hasClass('chev-c')) {
      $(c.currentTarget).parent().find('.chev-c').hide();
      $(c.currentTarget)
        .parent()
        .find('.chev-o')
        .css('display', 'inline-block');
      $(c.currentTarget).parent().next().slideDown();
    }
  });
  // reset filters click
  $(`#resetFilters`).click(function (c) {
    // reset all slider values in app.sliderObj to empty arrays
    $.each(app.sliderObj, function (i, v) {
      $.each(v, function (i1, v1) {
        if (v1.values) {
          v1.values = [];
        }
      });
    });
    // uncheck slider checkboxes
    $('#innerContent .-slCb').each(function (i, v) {
      if (v.checked) {
        $(v).trigger('click');
      }
    });
    // set radio buttons to first input
    $('.umr-radio-indent').each(function (i, v) {
      var ipt = $(v).find('input')[0];
      $(ipt).prop('checked', true);
    });
    // uncheck radio checkboxes
    $(`#innerContent .rb_cb`).each(function (i, v) {
      if (v.checked) {
        $(v).trigger('click');
      }
    });
    // uncheck checkboxes-wrap group
    $(`#innerContent .checkboxes`).each(function (i, v) {
      if (v.checked) {
        $(v).trigger('click');
      }
    });
  });

  // show more or less of intro text
  document.querySelectorAll('.intro-click').forEach((ai) =>
    ai.addEventListener('click', () => {
      document.querySelectorAll('.app-intro-text span').forEach((span) => {
        span.style.display = span.style.display == 'none' ? 'inline' : 'none';
      });
    })
  );

  // close selected island div
  document
    .querySelector('#close-selected-island')
    .addEventListener('click', () => {
      closeSelectedIsland();
    });

  //download data button
  // document.querySelector("#downloadData").addEventListener('click', (() => {
  // 	require(["esri/tasks/Geoprocessor"], function(Geoprocessor) {
  // 		$(`.dlssre`).prop("disabled",true)
  // 		$(document.body).css({ 'cursor': 'wait' })
  // 		var gp = new Geoprocessor({url:"https://cirrus.tnc.org/arcgis/rest/services/FN_AGR/extractByAttributes/GPServer/extractByAttributes"});
  // 		let layerName = ""
  // 		if (app.obj.hucLayer == "0"){
  // 		 layerName = "huc8"
  // 		}
  // 		if (app.obj.hucLayer == "1"){
  // 		 layerName = "huc12"
  // 		}
  // 		if (app.obj.hucLayer == "2"){
  // 		 layerName = "catchments"
  // 		}
  // 		var params = { layerName: layerName, where: app.definitionExpression };
  // 		gp.submitJob(params).then(function(jobInfo) {
  // 			var jobid = jobInfo.jobId;
  // 			var options = {
  // 				interval: 1500,
  // 				statusCallback: function(j) {
  // 					console.log("Job Status: ", j.jobStatus);
  // 				}
  // 			};
  // 			gp.waitForJobCompletion(jobid, options).then(function() {
  // 				gp.getResultData(jobid,"output").then(function(output){
  // 					let uri = output.value.url;
  // 					let url = uri.replace('scratch/','')
  // 					var link = document.createElement("a");
  // 					let name = 'output';
  // 					link.setAttribute('download', name);
  // 					link.href = url;
  // 					document.body.appendChild(link);
  // 					link.click();
  // 					link.remove();
  // 					$(document.body).css({ 'cursor': 'default' })
  // 					$(`.dlssre`).prop("disabled",false)
  // 				});
  // 			})
  // 		})
  // 	})
  // }))
}
function sliderChange(e, ui) {
  var ben = e.target.id.split('-').pop();
  var us = '_';
  if (app.sliderObj[ben].nounsc) {
    us = '';
  }
  var field = ben;
  // slider change was mouse-driven
  if (e.originalEvent) {
    var v0 = ui.values[0];
    var v1 = ui.values[1];
    app.sliderObj[ben].values = [v0, v1];
    if (app.sliderObj[ben].div) {
      v0 = v0 / app.sliderObj[ben].div;
      v1 = v1 / app.sliderObj[ben].div;
    }
    if (v1 == app.sliderObj[ben].max && app.sliderObj[ben].gtmax) {
      app[ben] = '(' + field + ' >= ' + v0 + ')';
    } else {
      app[ben] =
        '(' + field + ' >= ' + v0 + ' AND ' + field + ' <= ' + v1 + ')';
    }
    layerDefs();
  }
  //slider change was programmatic
  else {
    var dis = $('#' + e.target.id).slider('option', 'disabled');
    var vis = $('#' + e.target.id).is(':visible');
    if (dis === true) {
      app[ben] = '';
    } else {
      if (vis) {
        var v0 = ui.values[0];
        var v1 = ui.values[1];
        app.sliderObj[ben].values = [v0, v1];
        if (app.sliderObj[ben].div) {
          v0 = v0 / app.sliderObj[ben].div;
          v1 = v1 / app.sliderObj[ben].div;
        }
        if (v1 == app.sliderObj[ben].max && app.sliderObj[ben].gtmax) {
          app[ben] = '(' + field + ' >= ' + v0 + ')';
        } else {
          app[ben] =
            '(' + field + ' >= ' + v0 + ' AND ' + field + ' <= ' + v1 + ')';
        }
      } else {
        app[ben] = '';
      }
    }
    sliderSlide(e, ui);
    if (app.ord == 'last') {
      layerDefs();
    }
  }
}
function sliderSlide(e, ui) {
  var ben = e.target.id.split('-').pop();
  $('#' + e.target.id)
    .parent()
    .prev()
    .find('.rnum')
    .each(function (i, v) {
      var sval = ui.values[i];
      if (app.sliderObj[ben].div) {
        sval = ui.values[i] / app.sliderObj[ben].div;
      }
      if (ui.values[i] > 100000) {
        var val = abbreviateNumber(sval);
      } else {
        var val = commaSeparateNumber(sval);
      }
      if (ui.values[i] == app.sliderObj[ben].max && app.sliderObj[ben].gtmax) {
        $(v).html('<b>></b> ' + val);
      } else {
        $(v).html(val);
      }
    });
}
function cbChecker(t) {
  let n = 0;
  $('#innerContent .rb_cb').each(function (i, v) {
    if (v.checked) {
      n = n + 1;
    }
  });
  $(`#innerContent .-slCb`).each(function (i, v) {
    if (v.checked) {
      n = n + 1;
    }
  });
  if (n == 0) {
    $(`.dlssre`).prop('disabled', true);
  } else {
    $(`.dlssre`).prop('disabled', false);
  }
}
function layerDefs() {
  app.obj.exp = [
    app.cdf,
    app.prcnt_mhw,
    app.Erosn_Acre,
    app.Erosn_prct,
    app.brng_cap,
    app.Ditch_feet,
    app.Ditch_prct,
    app.mid_tram,
    app.bird_util,
    app.Ownership,
    app.ww_dist_mi,
    app.sav_summry,
    app.tmc_hm_pct,
    app.tmc_lm_pct,
    app.tmc_mf_pct,
    app.tmc_ow_pct,
    app.tmc_ph_pct,
    app.tmc_pp_pct,
    app.tmc_up_pct,
    app.t_range_ft,
    app.sc_avg_ft,
    app.omwm_acres,
  ];
  var exp = '';
  var cnt = 0;
  $.each(app.obj.exp, function (i, v) {
    if (v.length > 0) {
      cnt = cnt + 1;
    }
  });
  if (cnt > 0) {
    exp = '';
    app.obj.exp.unshift(app.obj.ffDef);
    $.each(app.obj.exp, function (i, v) {
      if (v.length > 0) {
        if (exp.length == 0) {
          exp = v;
        } else {
          exp = exp + ' AND ' + v;
        }
      }
    });
  }
  //set definition expression
  app.definitionExpression = exp;
  var layer = app.islandsLayer.findSublayerById(parseInt(app.obj.hucLayer));
  layer.definitionExpression = exp;
}

function closeSelectedIsland() {
  document.querySelector('#selected-island').innerHTML = '';
  document.querySelector('#selected-island-wrap').style.display = 'none';
  var oneMileBuff = app.supportingLayers.findSublayerById(1);
  oneMileBuff.visible = false;
  var threeMileBuff = app.supportingLayers.findSublayerById(2);
  threeMileBuff.visible = false;
  app.resultsLayer.removeAll();
  app.obj.response = 'none';
}

function commaSeparateNumber(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
  }
  return val;
}
function abbreviateNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}
