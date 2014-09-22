QUnit.test( "parser.generic", function( assert ) {
  var check_ok = function(expr, res){ 
    assert.equal(res, parser.parse(expr).print(), "parse(\""+expr+"\") = \""+res+"\"");
  }
  check_ok('a','a');
  check_ok('a+b','a+b');
  check_ok('\\alpha',"@945");
});