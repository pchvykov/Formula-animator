QUnit.test( "data.formula.copy", function( assert ) {
  var form1 = parser.parse('5+3');
  var tform1 = form1.copy();
  var e = tform1.find('type:number');
  for(var i in e){
    var el = e[i];
    el.set('value',4);
    el.set('code', '4');
  }
  assert.notEqual( form1.print(), tform1.print(), "test copy." );

  var form1 = parser.parse('100+200+300*100=500');
  var e= form1.find('type:number');
  for(var i in e){
  	var tform1 = form1.copy();
  	var tmp = tform1.find('type:number')[i];
  	tmp.set('value',4);
  	tmp.set('code', '4');
  	assert.notEqual( form1.print(), tform1.print(), "test deep copy "+i );

  }
});

