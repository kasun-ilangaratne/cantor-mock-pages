/**
 * Directive for handling column resize functionality
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';

export interface ResizeEvent {
  field: string;
  width: number;
}

@Directive({
  selector: '[cantorResizeHandle]',
  standalone: true
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
  @Input() field!: string;
  @Input() minWidth: number = 50;
  @Input() maxWidth: number = 500;
  @Input() currentWidth: number = 120;

  @Output() resizing = new EventEmitter<ResizeEvent>();
  @Output() resizeStart = new EventEmitter<ResizeEvent>();
  @Output() resizeEnd = new EventEmitter<ResizeEvent>();
  @Output() autoSize = new EventEmitter<string>();

  private isResizing = false;
  private startX = 0;
  private startWidth = 0;
  private mouseMoveListener?: (e: MouseEvent) => void;
  private mouseUpListener?: (e: MouseEvent) => void;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Add resize handle styling
    const element = this.elementRef.nativeElement;
    element.style.cursor = 'col-resize';
    element.style.userSelect = 'none';
    
    // Ensure the handle is visible and positioned correctly
    if (!element.style.position) {
      element.style.position = 'absolute';
    }
    if (!element.style.right) {
      element.style.right = '0';
    }
    if (!element.style.top) {
      element.style.top = '0';
    }
    if (!element.style.width) {
      element.style.width = '6px';
    }
    if (!element.style.height) {
      element.style.height = '100%';
    }
    
    // Add hover effect
    element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.currentWidth;
    
    // Add global event listeners
    this.mouseMoveListener = this.onMouseMove.bind(this);
    this.mouseUpListener = this.onMouseUp.bind(this);
    
    document.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
    
    // Add visual feedback
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    this.resizeStart.emit({ field: this.field, width: this.startWidth });
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.autoSize.emit(this.field);
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isResizing) return;
    
    const deltaX = event.clientX - this.startX;
    const newWidth = Math.max(
      this.minWidth,
      Math.min(this.maxWidth, this.startWidth + deltaX)
    );
    
    this.resizing.emit({ field: this.field, width: newWidth });
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.isResizing) return;
    
    this.isResizing = false;
    
    const deltaX = event.clientX - this.startX;
    const finalWidth = Math.max(
      this.minWidth,
      Math.min(this.maxWidth, this.startWidth + deltaX)
    );
    
    this.resizeEnd.emit({ field: this.field, width: finalWidth });
    
    this.removeEventListeners();
    
    // Remove visual feedback
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  private onMouseEnter(): void {
    if (!this.isResizing) {
      const element = this.elementRef.nativeElement;
      element.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'; // Blue highlight
    }
  }

  private onMouseLeave(): void {
    if (!this.isResizing) {
      const element = this.elementRef.nativeElement;
      element.style.backgroundColor = 'transparent';
    }
  }

  private removeEventListeners(): void {
    if (this.mouseMoveListener) {
      document.removeEventListener('mousemove', this.mouseMoveListener);
      this.mouseMoveListener = undefined;
    }
    
    if (this.mouseUpListener) {
      document.removeEventListener('mouseup', this.mouseUpListener);
      this.mouseUpListener = undefined;
    }
  }
}

/**
 * Helper directive for the column header that contains the resize handle
 */
@Directive({
  selector: '[cantorResizableColumn]',
  standalone: true
})
export class ResizableColumnDirective implements OnInit {
  @Input() width: number = 120;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    
    // Ensure the column is positioned relatively so the resize handle can be positioned absolutely
    if (!element.style.position || element.style.position === 'static') {
      element.style.position = 'relative';
    }
    
    // Set the initial width
    element.style.width = `${this.width}px`;
    element.style.minWidth = `${this.width}px`;
    element.style.maxWidth = `${this.width}px`;
  }

  updateWidth(width: number): void {
    const element = this.elementRef.nativeElement;
    element.style.width = `${width}px`;
    element.style.minWidth = `${width}px`;
    element.style.maxWidth = `${width}px`;
  }
}
