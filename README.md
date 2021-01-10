# go-randomizer
This tool/toy is designed to help me (and perhaps others!) recapture the fun and wonder of
[Go](https://en.wikipedia.org/wiki/Go_(game)).  I have focused so much on getting better at the game that I have burned
out.  A stronger player recommended forgoing improvement for a while by adding ridiculous constraints upon my play for a
while.  This tool simplifies the idea I liked the most: injecting horrible, hilarious moves into the middle of my game
according to various restrictions.  Currently, the methods supported are:

* Initial _n_ moves of the game are forced random
* Subsequent moves are random with probability _p_
* A random move is injected after _n_ moves

This is intended to be used either next to your physical board or your Go program.  You have to record the moves as you
play, but I still expect to get some great fun out of it!

## How to use
You will need, at a minimum, Node.JS and the Angular CLI.  If you do not know how to install those, You can look at the
[Node.JS](https://nodejs.org/en/) and [Angular CLI](https://cli.angular.io/) websites for instructions.

1. Download the code; I recommend cloning it using `git clone https://github.com/sadakatsu/go-randomizer.git`.
2. Navigate into the directory into which you downloaded the code.
3. Run `npm install`.
4. Run `ng serve`.
5. Open [http://localhost:4200/](http://localhost:4200/).
6. Click "Start New Game..."
7. Enter your game and randomization configurations.
8. Click "Start!"
9. Enter your opponent's moves and the moves you pick in turn.  The app will inject random moves on your turns when it
   decides to do so.
10. When you want to play again, go back to Step 6.

## Potential Issues
Misclicking while recording moves can currently lead to an irreconcilable state.  Use carefully!  I have not figured out
an elegant solution to this problem yet.

## Credits
I use [Waltheri's WGo.js](http://wgo.waltheri.net/) to track the game state and render the board.  WGO.js is also
distributed under the MIT license.
