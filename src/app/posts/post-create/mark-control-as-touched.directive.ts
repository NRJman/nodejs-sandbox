import { Directive, AfterViewInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { take, tap, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appMarkControlAsTouched]'
})
export class MarkControlAsTouchedDirective implements AfterViewInit {
    @Output() touchImageControl: EventEmitter<boolean> = new EventEmitter();

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit(): void {
        fromEvent(this.elementRef.nativeElement, 'click')
            .pipe(
                take(1)
            )
            .subscribe(() => {
                this.touchImageControl.emit(true);
            });
    }
}
