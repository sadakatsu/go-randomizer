import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Coordinate } from './domain/coordinate';
import { MoveService } from './services/move.service';
import { PositionService } from './services/position.service';

@Component({
    selector: 'gr-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
    additional = 'probability';
    color = 'B';
    dialogActive = false;
    handicap = 0;
    initial = 0;
    injection = 5;

    game: any = null;
    moves: Array<Coordinate> = null;
    movesSinceLastInjection: number;
    subscription: Subscription | null = null;
    WGo: any;

    playerColor: any;

    menuOptions: Array<MenuItem> = [
        {
            label: "Start New Game...",
            icon: "pi pi-fw pi-play",
            command: () => this.dialogActive = true
        },
        {
            label: "Pass",
            icon: "pi pi-fw pi-moon",
            command: () => this.handlePass()
        },
        {
            label: 'Undo',
            icon: 'pi pi-fw pi-undo',
            command: () => this.handleUndo()
        }
    ];

    constructor(
        @Inject(DOCUMENT) document: Document,
        private positionsService: PositionService,
        moveService: MoveService,
    ) {
        this.subscription = moveService.moves$.subscribe(
            coordinate => this.handleMove(coordinate)
        );
        this.WGo = document.defaultView.window['WGo'];
    }

    private handleMove(coordinate: Coordinate) {
        if (!(this.game && this.game.isValid(coordinate.x, coordinate.y))) {
            return;
        }

        if (this.game.turn === this.playerColor) {
            ++this.movesSinceLastInjection;
        }

        this.game.play(coordinate.x, coordinate.y);
        this.moves.push(coordinate);

        const lastMove = this.handleInjection() || coordinate;

        const position = this.game.getPosition();
        this.positionsService.publish({ position, lastMove });
    }

    private handleInjection() {
        let result: Coordinate | null = null;

        if (
            this.game.turn === this.playerColor && (
                this.moves.length < this.initial * 2 ||
                this.injection > 0 && (
                    this.additional === 'probability' && Math.random() * 100 <= this.injection ||
                    this.additional === 'frequency' && this.movesSinceLastInjection >= this.injection
                )
            )
        ) {
            this.movesSinceLastInjection = 0;

            const candidates: Array<Coordinate> = [];
            for (let y = 0; y < 19; ++y) {
                for (let x = 0; x < 19; ++x) {
                    if (this.game.isValid(x, y)) {
                        candidates.push({ x, y });
                    }
                }
            }

            const index = Math.floor(Math.random() * candidates.length);
            result = candidates[index];
            this.moves.push(result);
            this.game.play(result.x, result.y);
        }

        return result;
    }

    startNewGame() {
        this.dialogActive = false;

        this.game = new this.WGo.Game(19, 'KO');
        this.playerColor = this.color === 'B' ? this.WGo.B : this.WGo.W;
        this.moves = [];
        this.movesSinceLastInjection = 0;

        if (this.handicap > 1) {
            this.game.turn = this.WGo.W;

            this.game.addStone(15, 3, this.WGo.B);
            this.game.addStone(3, 15, this.WGo.B);

            if (this.handicap > 2) {
                this.game.addStone(15, 15, this.WGo.B);
            }

            if (this.handicap > 3) {
                this.game.addStone(3, 3, this.WGo.B);
            }

            if (this.handicap === 5 || this.handicap === 7 || this.handicap === 9) {
                this.game.addStone(9, 9, this.WGo.B);
            }

            if (this.handicap > 5) {
                this.game.addStone(3, 9, this.WGo.B);
                this.game.addStone(15, 9, this.WGo.B);
            }

            if (this.handicap > 7) {
                this.game.addStone(9, 3, this.WGo.B);
                this.game.addStone(9, 15, this.WGo.B);
            }
        }

        const lastMove = this.handleInjection();

        this.positionsService.publish({
            position: this.game.getPosition(),
            lastMove,
        });
    }

    cancelDialog() {
        this.dialogActive = false;
    }

    private handlePass() {
        if (!this.game) {
            return;
        }

        if (this.game.turn === this.playerColor) {
            ++this.movesSinceLastInjection;
        }

        this.game.pass();
        this.moves.push(null);
        const lastMove = this.handleInjection();

        this.positionsService.publish({
            position: this.game.getPosition(),
            lastMove,
        });
    }

    private handleUndo() {
        if (!(this.game && this.moves)) {
            return;
        }

        this.moves.pop();
        this.game.popPosition();

        // TODO: I need to figure out a better way to handle potentially undoing random moves!  Ignoring the problem
        //  allows me to fix the board to match an actual board if I misclick or something, but it means that I lose the
        //  intended cadence.

        const position = this.game.getPosition();
        const lastMove = this.moves[this.moves.length - 1];
        this.positionsService.publish({ position, lastMove });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
