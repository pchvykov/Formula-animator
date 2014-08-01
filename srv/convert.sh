#!/bin/bash

INPUT=$1
OUTPUT:$2

cat header.tex > eqn.tex
cat $INPUT >> eqn.tex
cat footer.tex >> eqn.tex

latex eqn.tex
dvips -q -f -e 0 -E -D 10000 -x 10000 -o eqn.ps eqn.dvi
pstoedit -f plot-svg -dt -ssp eqn.ps $OUTPUT
rm eqn.*
