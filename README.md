# Pitaya 4.0

A tiny language for drawing particular drawings.

## Getting Started
To use Pitaya, you'll need to have the following installed:

* Node 22.12.0 or above
* NPM 10.9.0 or above

Then, at the root of this project, run `npm i` to install all dependencies.

## Minimal Example
Pitaya is a kind of L-System that plots points in space, and then draws linked circles around those points. If that seems vague, then read along! 

Here's one of the simplest non-trivial Pitaya programs. Write the following in a file called `circle.pta`.

```
node c = [rot=1; rad=50].
path = c.
```

We name a `node` `c`. Pitaya will aim to draw a circle around this node. `rot` tells Pitaya how many rotations around the center we want it to go for, and `rad` tells the intended radius of that circle. To draw the circle, we attach the node to a path by writing `path = c`.

Now, run the following command at the root of the project, run the command

```
node index -f <path-to-your-file> -i ./interpreters/dots.js
```

![A circle at the center of a gray screen.](./example-images/circle.png)

## Slightly More Advanced Example

```
node c = [rot=-1; rad=50].
path = c ->[len=75; theta=-90] c.
```

