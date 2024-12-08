import { readFileSync, writeFileSync } from 'fs';
import { repBuilder } from './rep-builder';
import { generatePulp } from './pulp-plotter';

const file = readFileSync('./examples/circle.pta').toString();

repBuilder.start(file);

const pulp = generatePulp(repBuilder.getPaths());

const interpreter = readFileSync('./interpreters/dots.js').toString();

const output = `
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="p5.min.js"></script>
  </head>
  <body>
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <script>
      const paths = ${JSON.stringify(repBuilder.getPaths())}
    </script>
    <script>
      const pulp = ${JSON.stringify(pulp)};
    </script>
    <script>${interpreter}</script>
  </body>
</html>
`;

writeFileSync('./output/index.html', output);



