QUnit.test( "parser.generic", function( assert ) {
  var check_ok = function(expr, res){ 
    assert.equal(res, parser.parse(expr).print(), "parse(\""+expr+"\") = \""+res+"\"");
  }
  check_ok('a','a');
  check_ok('a+b','a+b');
  check_ok('\\alpha',"@945");
  check_ok('a+b+c','a+b+c')
  check_ok('a+(b+c)+d','a+(b+c)+d')
  check_ok('a*(b+c)+d','a*(b+c)+d')
  check_ok('a+(b*c)+d','a+(b*c)+d')
});