(function() {
  'use strict';
  var url = "https://cmx.weightwatchers.co.uk/api/v2/cmx/operations/composed/members/~/lists/memberrecipes?isActive=true&limit=2000&offset=0";

  var getJSON = function(url, successHandler, errorHandler) {
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
        } else {
          errorHandler && errorHandler(status);
        }
      }
    };
    xhr.send();
  };


  var renderList = function(data) {
    console.log('rendered');
    var count = data.totalHits;
    var hits = data.hits;
    var recipeTpl = '<input class="fuzzy-search" placeholder="Search"/><ul class="list">{{#each hits}}<li><h3 class="name">{{name}} (<a href="http://cmx.weightwatchers.co.uk/#/nui/explore/member-food/details/v3:{{_id}}:{{sourceType}}:{{versionId}}" target="_blank">View</a>) ({{smartPoints}} SP)</h3></li>{{/each}}</ul>';

    var template = Handlebars.compile(recipeTpl);
    var html = template(data);
    document.querySelectorAll('#output')[0].innerHTML = html;
  };

  getJSON(url, function(data) {
    renderList(data);
    initSearch();
  }, function(status) {
    console.log(status);
  });
  var initSearch = function() {
    console.log('Search ready');
    var recipeList = new List('output', {
      valueNames: ['name'],
      plugins: [ListFuzzySearch()],
      indexAsync: true
    });

    document.querySelectorAll('input')[0].focus();
  };



}());
