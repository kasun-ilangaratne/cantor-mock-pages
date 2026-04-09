/**
 * Directive for handling column drag and reorder functionality using CDK DragDrop
 */

import {
  Directive,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ElementRef,
  Renderer2
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CantorColumn } from './state';

export interface ColumnReorderEvent<T = any> {
  previousIndex: number;
  currentIndex: number;
  columns: CantorColumn<T>[];
}

@Directive({
  selector: '[cantorDragReorder]',
  standalone: true
})
export class DragReorderDirective<T> implements OnInit {
  @Input() columns: CantorColumn<T>[] = [];
  @Output() columnsReordered = new EventEmitter<ColumnReorderEvent<T>>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Add drag preview styling
    this.setupDragPreview();
  }

  /**
   * Handle the drop event from CDK DragDrop
   */
  onColumnDropped(event: CdkDragDrop<CantorColumn<T>[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return; // No change needed
    }

    // Create a copy of the columns array
    const reorderedColumns = [...this.columns];
    
    // Move the column to its new position
    moveItemInArray(reorderedColumns, event.previousIndex, event.currentIndex);
    
    // Update the order property on each column
    reorderedColumns.forEach((col, index) => {
      col.order = index;
    });

    // Emit the reorder event
    this.columnsReordered.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      columns: reorderedColumns
    });
  }

  /**
   * Setup drag preview styling and behavior
   */
  private setupDragPreview(): void {
    const element = this.elementRef.nativeElement;
    
    // Add drag handle cursor
    this.renderer.setStyle(element, 'cursor', 'grab');
    
    // Add active drag styling
    element.addEventListener('dragstart', () => {
      this.renderer.setStyle(element, 'cursor', 'grabbing');
      this.renderer.addClass(element, 'ct-dragging');
    });
    
    element.addEventListener('dragend', () => {
      this.renderer.setStyle(element, 'cursor', 'grab');
      this.renderer.removeClass(element, 'ct-dragging');
    });
  }
}

/**
 * Directive for individual draggable column headers
 */
@Directive({
  selector: '[cantorDraggableColumn]',
  standalone: true
})
export class DraggableColumnDirective implements OnInit {
  @Input() columnField!: string;
  @Input() columnIndex!: number;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    
    // Add visual indicators for draggable columns
    this.renderer.setStyle(element, 'cursor', 'grab');
    this.renderer.setAttribute(element, 'title', 'Drag to reorder column');
    
    // Add hover effects
    element.addEventListener('mouseenter', () => {
      if (!element.classList.contains('cdk-drag-dragging')) {
        this.renderer.addClass(element, 'ct-column-hover');
      }
    });
    
    element.addEventListener('mouseleave', () => {
      this.renderer.removeClass(element, 'ct-column-hover');
    });
    
    // Handle drag start
    element.addEventListener('dragstart', (event) => {
      this.renderer.setStyle(element, 'cursor', 'grabbing');
      this.renderer.addClass(element, 'ct-column-dragging');
      
      // Store column information in drag data
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify({
          field: this.columnField,
          index: this.columnIndex
        }));
      }
    });
    
    // Handle drag end
    element.addEventListener('dragend', () => {
      this.renderer.setStyle(element, 'cursor', 'grab');
      this.renderer.removeClass(element, 'ct-column-dragging');
    });
  }
}

/**
 * Directive for drop zones between columns
 */
@Directive({
  selector: '[cantorDropZone]',
  standalone: true
})
export class DropZoneDirective implements OnInit {
  @Input() dropIndex!: number;
  @Output() columnDropped = new EventEmitter<{
    draggedIndex: number;
    dropIndex: number;
  }>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    
    // Setup drop zone styling
    this.renderer.setStyle(element, 'minWidth', '4px');
    this.renderer.setStyle(element, 'minHeight', '100%');
    this.renderer.setStyle(element, 'transition', 'background-color 0.2s ease');
    
    // Handle drag over
    element.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.renderer.addClass(element, 'ct-drop-zone-active');
    });
    
    // Handle drag leave
    element.addEventListener('dragleave', () => {
      this.renderer.removeClass(element, 'ct-drop-zone-active');
    });
    
    // Handle drop
    element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.renderer.removeClass(element, 'ct-drop-zone-active');
      
      if (event.dataTransfer) {
        try {
          const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));
          this.columnDropped.emit({
            draggedIndex: dragData.index,
            dropIndex: this.dropIndex
          });
        } catch (error) {
          console.warn('Failed to parse drag data:', error);
        }
      }
    });
  }
}

/**
 * Service for managing column reordering state
 */
export class ColumnReorderService<T> {
  
  /**
   * Reorder columns based on drag and drop event
   */
  static reorderColumns<T>(
    columns: CantorColumn<T>[],
    fromIndex: number,
    toIndex: number
  ): CantorColumn<T>[] {
    const reordered = [...columns];
    const [movedColumn] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedColumn);
    
    // Update order property
    reordered.forEach((col, index) => {
      col.order = index;
    });
    
    return reordered;
  }
  
  /**
   * Get the visual order of columns (considering pinned columns)
   */
  static getVisualOrder<T>(columns: CantorColumn<T>[]): CantorColumn<T>[] {
    const pinnedLeft = columns.filter(c => c.pinnedLeft && !c.hidden);
    const unpinned = columns.filter(c => !c.pinnedLeft && !c.hidden);
    
    // Sort each group by order
    pinnedLeft.sort((a, b) => (a.order || 0) - (b.order || 0));
    unpinned.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return [...pinnedLeft, ...unpinned];
  }
  
  /**
   * Calculate left offsets for pinned columns
   */
  static calculatePinnedOffsets<T>(columns: CantorColumn<T>[]): void {
    const visualOrder = this.getVisualOrder(columns);
    let currentOffset = 0;
    
    for (const column of visualOrder) {
      if (column.pinnedLeft) {
        column._left = currentOffset;
        currentOffset += column.width || 120;
      } else {
        column._left = undefined;
      }
    }
  }
}
