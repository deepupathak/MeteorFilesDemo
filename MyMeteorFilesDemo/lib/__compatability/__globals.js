this._app = {
  NOOP: function() {}
};

if (Meteor.isClient) {
  window.IS_RENDERED = false;
  if (window.requestAnimFrame == null) {
	  window.requestAnimFrame = (function() {
	    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
	      return window.setTimeout(callback, 1000 / 60);
	    };
	  })();
	}

	_app.subs = new SubsManager();
	_app.currentUrl = function() {
	  return Meteor.absoluteUrl((FlowRouter.current().path || document.location.pathname).replace(/^\//g, '')).split('?')[0].split('#')[0].replace('!', '');
	};

	var _el;

	_el = null;

	$(window).on('dragenter dragover', function(e) {
	  var uf;
	  e.preventDefault();
	  e.stopPropagation();
	  _el = e.target;
	  uf = document.getElementById('uploadFile');
	  if (!~uf.className.indexOf('file-over')) {
	    uf.className += ' file-over';
	  }
	  return false;
	});

	$(window).on('dragleave', function(e) {
	  var uf;
	  e.preventDefault();
	  e.stopPropagation();
	  if (_el === e.target) {
	    uf = document.getElementById('uploadFile');
	    if (!!~uf.className.indexOf('file-over')) {
	      uf.className = uf.className.replace(' file-over', '');
	    }
	  }
	  return false;
	});

	$(window).on('drop', function(e) {
	  var uf;
	  e.preventDefault();
	  e.stopPropagation();
	  uf = document.getElementById('uploadFile');
	  if (!!~uf.className.indexOf('file-over')) {
	    uf.className = uf.className.replace(' file-over', '');
	  }
	  return false;
	});

	Template.registerHelper('urlCurrent', function() {
	  return _app.currentUrl();
	});

  Template.registerHelper('url', function(string) {
	  if (string == null) {
	    string = null;
	  }
	  return Meteor.absoluteUrl(string);
	});

  Template.registerHelper('filesize', function(size) {
	  if (size == null) {
	    size = 0;
	  }
	  return filesize(size);
	});

  Template.registerHelper('extless', function(filename) {
	  var parts;
	  if (filename == null) {
	    filename = '';
	  }
	  parts = filename.split('.');
	  if (parts.length > 1) {
	    parts.pop();
	  }
	  // console.log(parts.join('.').length,"------")
	  // console.log(parts.join('.').substring(0,8)+'...',"------");
	  if(parts.join('.').length > 10) {
	  	return parts.join('.').substring(0,10)+'...';
	  }else{
	  	return parts.join('.');
	  }
	});

  Template.registerHelper('DateToISO', function(time) {
	  if (!time) {
	    return 0;
	  }
	  if (_.isString(time) || _.isNumber(time)) {
	    time = new Date(time);
	  }
	  return time.toISOString();
	});

	Template.registerHelper('bytesToKb', function(size) {
		return size * 0.001;
	});

	Meteor.startup(function() {
	  $('html').attr('itemscope', '');
	  $('html').attr('itemtype', 'http://schema.org/WebPage');
	  $('html').attr('xmlns:og', 'http://ogp.me/ns#');
	  $('html').attr('xml:lang', 'en');
	  return $('html').attr('lang', 'en');
	});
}