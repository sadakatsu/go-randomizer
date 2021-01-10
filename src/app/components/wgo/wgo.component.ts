import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Position } from '../../domain/position';
import { MoveService } from '../../services/move.service';
import { PositionService } from '../../services/position.service';

@Component({
    selector: 'gr-wgo',
    templateUrl: './wgo.component.html',
    styleUrls: [ './wgo.component.scss' ],
})
export class WgoComponent implements AfterViewInit, OnDestroy {
    @ViewChild('board')
    boardReference: ElementRef;

    board: any;
    subscription: Subscription | null = null;
    WGo: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private elementReference: ElementRef,
        private moveService: MoveService,
        private positionService: PositionService,
    ) {
        this.WGo = document.defaultView.window['WGo'];
    }

    ngAfterViewInit() {
        const el = this.boardReference.nativeElement;
        let smaller = Math.min(
            el.clientHeight,
            el.clientWidth,
        );
        this.board = new this.WGo.Board(
            el,
            {
                background: 'assets/images/board-final.svg',
                height: smaller,
                width: smaller,
                section: {
                    bottom: -0.5,
                    left: -0.5,
                    right: -0.5,
                    top: -0.5,
                }
            },
        );

        var coordinates = {
            // draw on grid layer
            grid: {
                draw: function (args, board) {
                    var ch, t, xright, xleft, ytop, ybottom;

                    this.fillStyle = 'rgba(0,0,0,0.7)';
                    this.textBaseline = 'middle';
                    this.textAlign = 'center';
                    this.font =
                        board.stoneRadius +
                        'px ' +
                        (
                            board.font || ''
                        );

                    xright = board.getX(-0.75);
                    xleft = board.getX(board.size - 0.25);
                    ytop = board.getY(-0.75);
                    ybottom = board.getY(board.size - 0.25);

                    for (var i = 0; i < board.size; i++) {
                        ch = i + 'A'.charCodeAt(0);
                        if (ch >= 'I'.charCodeAt(0)) {
                            ch++;
                        }

                        t = board.getY(i);
                        this.fillText(board.size - i, xright, t);
                        this.fillText(board.size - i, xleft, t);

                        t = board.getX(i);
                        this.fillText(String.fromCharCode(ch), t, ytop);
                        this.fillText(String.fromCharCode(ch), t, ybottom);
                    }

                    this.fillStyle = 'black';
                },
            },
        };
        this.board.addCustomObject(coordinates);

        this.document.defaultView.window.addEventListener(
            'resize',
            (event) => {
                smaller = Math.min(
                    el.clientHeight,
                    el.clientWidth,
                );
                this.board.setDimensions(smaller, smaller);
            }
        );

        this.board.addEventListener(
            'click',
            (x, y) => this.moveService.publish({ x, y })
        );

        this.subscription = this.positionService.positions$.subscribe(
            position => this.handlePosition(position)
        );
    }

    private handlePosition(position: Position) {
        this.board.removeAllObjects();

        console.log(position);
        for (let i = 0; i < position.position.schema.length; ++i) {
            const code = position.position.schema[i];
            if (!code) {
                continue;
            }
            const x = Math.floor(i / 19);
            const y = i % 19;
            this.board.addObject({ x, y, c: code === 1 ? this.WGo.B : this.WGo.W });
        }

        if (position.lastMove) {
            this.board.addObject({ x: position.lastMove.x, y: position.lastMove.y, type: 'CR'});
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
