(function() {
  'use strict';
  var url = "https://cmx.weightwatchers.co.uk/api/v2/cmx/operations/composed/members/~/lists/memberrecipes?isActive=true&limit=50&offset=";
  var receivedCount = 0;
  var totalHits = 0;
  var allData = {};
  var output = document.querySelectorAll('#output')[0];

  var getJSON = function(url, successHandler, errorHandler, notAuthedHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
      var status;
      var data;
      if (xhr.readyState == 4) {
        status = xhr.status;
        if (status == 200) {
          successHandler && successHandler(xhr.response);
        } else if ( status == 401 ) {
          notAuthedHandler && notAuthedHandler()
        } else {
          errorHandler && errorHandler(status);
        }
      }
    };
    xhr.send();
  };
  var jsonConcat = function(o1, o2) {
    var out = [];
    for (var key in o1) {
      out.push(o1[key]);
    }
    for (var key in o2) {
      out.push(o2[key]);
    }
    return JSON.parse(JSON.stringify(out));
  }


  var renderList = function(data) {
    var hits = data;
    console.log(hits[0].name);
    var recipeTpl = '<input class="fuzzy-search" placeholder="Search"/><ul class="list">{{#each .}}<li><h3 class="name">{{name}} (<a href="http://cmx.weightwatchers.co.uk/#/nui/explore/member-food/details/v3:{{_id}}:{{sourceType}}:{{versionId}}" target="_blank">View</a>) ({{smartPoints}} SP)</h3></li>{{/each}}</ul>';

    var template = Handlebars.compile(recipeTpl);
    var html = template(hits);
    output.innerHTML = html;
    console.log(document.querySelectorAll('.list li').length);
  };
  var initSearch = function() {
    var recipeList = new List('output', {
      valueNames: ['name'],
      plugins: [ListFuzzySearch()]
    });

    document.querySelectorAll('input')[0].focus();
  };

  var updateProgressBar = function (count, total) {
    var progressAmount = parseInt((100/total)*count);
    output.innerHTML = '<div class="progress"><div class="inner" style="width:' + progressAmount + '%"></div><div class="count">'+progressAmount+'%</div></div>';
  };

  var successHandler = function(data) {
    allData = jsonConcat(allData, data.hits);

    if (data.totalHits) {
      totalHits = data.totalHits;
    }

    updateProgressBar(receivedCount, totalHits);

    if (receivedCount < totalHits) {
      receivedCount = Object.keys(allData).length;
      getJSON(url + receivedCount, successHandler, errorHandler, notAuthedHandler);
    } else {
      renderList(allData);
      initSearch();
    }
  };

  var errorHandler = function(status) {
    console.log(status);
  };

  var notAuthedHandler = function () {
    output.innerHTML = '<h4 style="color:#d00">Error, please log in to your account first!</h4>';
  };

  getJSON(url + receivedCount, successHandler, errorHandler, notAuthedHandler);

}());
