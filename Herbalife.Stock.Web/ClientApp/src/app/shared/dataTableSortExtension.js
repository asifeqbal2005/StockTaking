jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "date-uk-pre": function ( a ) {
        if (a == null || a == "") {
            return 0;
        }
        var ukDatea = a.split('/');
        return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
    },
 
    "date-uk-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "date-uk-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );


jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "datetime-uk-pre": function (a) {
    if (a == null || a == "") {
      return 0;
    }
    var ukDatetime = a.split(' ');
    var ukDatea = ukDatetime[0].split('/');
    var ukDatetime = ukDatetime[1].split(':');
    //new Date(ukDatea[2], ukDatea[1], ukDatea[0], ukDatetime[0], ukDatetime[1], ukDatetime[2])
    return (ukDatea[2] + ukDatea[1] + ukDatea[0] + ukDatetime[0] + ukDatetime[1] + ukDatetime[2]);
  },

  "datetime-uk-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },

  "datetime-uk-desc": function (a, b) {
    return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});
