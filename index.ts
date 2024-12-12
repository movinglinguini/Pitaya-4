import { copyFile, readFileSync, writeFileSync } from 'fs';
import yargs, { hide } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { repBuilder } from './rep-builder';
import { generatePulp } from './pulp-plotter';

const argv = (yargs(hideBin(process.argv)))
  .usage('Usage: $0 -f [file] -i [interpreter] -o [output-dir]')
  .demand(['f', 'i'])
  .option('f', {
    type : 'string',
    description : 'Input file.',
  })
  .option('i', {
    type : 'string',
    description : 'File defining an interpreter.',
  })
  .option('o', {
    type : 'string',
    description : 'Output directory. Defaults to "./output".',
  })
  .parseSync();

const file = readFileSync((argv.f as string) || './examples/circle.pta').toString();

repBuilder.start(file);

const pulp = generatePulp(repBuilder.getPaths());

const interpreter = readFileSync((argv.i as string) || './interpreters/dots.js').toString();

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

writeFileSync(`${(argv.o as string) || './output'}/index.html`, output);
copyFile('./deps/p5.min.js', `${(argv.o as string) || './output'}/p5.min.js`, (err) => {
  if (err) {
    throw err;
  }
});



