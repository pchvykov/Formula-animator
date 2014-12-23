QUnit.test( "simpl.distribute", function( assert ) {
  function test_trans(expr, search, idx, key){
    if(expr.constructor.name == "Formula"){
      var form = expr;
    }
    else{
  	   var form = parser.parse(expr);	
    }
    var inp_rep = form.print();
  	var rule = new Transforms.Distribute();
  	var res = rule.find(search,form);
  	rule.apply(res.get(idx),form);
    var outp_rep = form.print();

    console.log(form.print())
  	assert.equal(outp_rep, key, "dist  with "+search+" on result "+idx+" : "+inp_rep +
  		 "=>"+outp_rep + " (expected: \""+key+"\")");
    return form;
  }
  test_trans('a*(b+c)', '', 0, '(a*b+a*c)');
  test_trans('(b+c)*a', '', 0, '(a*b+a*c)');
  test_trans('a*(b+c+d)', '', 0, '(a*b+a*c+a*d)');
  test_trans('(a+q)*(b+c)', '', 0, '((a+q)*b+(a+q)*c)');
  test_trans('3*r+s+a+a*(b+c)', '', 0, '3*r+s+a+(a*b+a*c)');
  test_trans('5*(4+3) = v','', 0, '(5*4+5*3)=v')
  test_trans('(a+2*(d+c)) = e-l','', 0, '(a+(2*d+2*c))=e-l');
  var res1 = test_trans('2*(a+(d+c)) = e-l','', 0, '(2*a+2*(d+c))=e-l');
  test_trans(res1, '', 0, "(2*a+(2*d+2*c))=e-l");

});

QUnit.test( "simpl.const_eval", function( assert ) {
  function test_trans(expr, search, idx, key){
  	var form = parser.parse(expr);	
  	var rule = new Transforms.SimplifyConstants();
  	var res = rule.find(search,form);
    res.print();
  	rule.apply(res.get(idx),form);
  	assert.equal(form.print(), key, "ceval  with "+search+" on result "+idx+" : "+expr +
  		 "=>"+form.print() + " (expected: \""+key+"\")");
  }
  
  test_trans('4+5', '', 0, '9');
  test_trans('4-5', '', 0, '-1');
  test_trans('4*5', '', 0, '20');
  test_trans('4/5', '', 0, '0.8');
  test_trans('2^5', '', 0, '32');
  
  test_trans('x*2*5', '', 0, '10*x');
  test_trans('2*5*x', '', 0, '10*x');
  
});