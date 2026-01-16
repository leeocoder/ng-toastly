/**
 * Tests for ToastContainerComponent
 *
 * Verifies:
 * - Component creation and positioning
 * - Toast filtering by position
 * - Host classes and styles computation
 * - ARIA accessibility attributes
 * - Mouse event delegation
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '../../services/toast.service';
import { Toast, ToastPosition } from '../../types/toast.type';

// Mock ToastService
class MockToastService {
  private _visibleToasts = signal<readonly Toast[]>([]);
  private _position = signal<ToastPosition>('bottom-right');
  private _pauseOnHover = signal(true);

  visibleToasts = this._visibleToasts.asReadonly();
  position = this._position.asReadonly();
  pauseOnHover = this._pauseOnHover.asReadonly();

  pauseTimer = vi.fn();
  resumeTimer = vi.fn();

  setVisibleToasts(toasts: Toast[]): void {
    this._visibleToasts.set(toasts);
  }

  setPosition(position: ToastPosition): void {
    this._position.set(position);
  }
}

function createMockToast(id: string, position: ToastPosition = 'bottom-right'): Toast {
  return {
    id,
    message: `Message for ${id}`,
    title: `Title ${id}`,
    type: 'info',
    theme: 'light',
    durationMs: 5000,
    dismissible: true,
    position,
    actions: [],
    createdAt: Date.now(),
  };
}

// Test host component
@Component({
  template: `<toastly-container [position]="position()" [styleClass]="styleClass()" />`,
  imports: [ToastContainerComponent],
})
class TestHostComponent {
  position = signal<ToastPosition | undefined>(undefined);
  styleClass = signal('');
}

describe('ToastContainerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let mockToastService: MockToastService;

  beforeEach(async () => {
    mockToastService = new MockToastService();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================================
  // Component Creation Tests
  // ==========================================================================

  describe('component creation', () => {
    it('should create the component', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container).toBeDefined();
    });
  });

  // ==========================================================================
  // Position Classes Tests
  // ==========================================================================

  describe('position classes', () => {
    it('should apply bottom-right class by default', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--bottom-right')).toBe(true);
    });

    it('should apply top-left class when position is top-left', () => {
      hostComponent.position.set('top-left');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--top-left')).toBe(true);
    });

    it('should apply top-right class when position is top-right', () => {
      hostComponent.position.set('top-right');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--top-right')).toBe(true);
    });

    it('should apply top-center class when position is top-center', () => {
      hostComponent.position.set('top-center');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--top-center')).toBe(true);
    });

    it('should apply bottom-left class when position is bottom-left', () => {
      hostComponent.position.set('bottom-left');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--bottom-left')).toBe(true);
    });

    it('should apply bottom-center class when position is bottom-center', () => {
      hostComponent.position.set('bottom-center');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--bottom-center')).toBe(true);
    });

    it('should use global config position when input position is undefined', () => {
      mockToastService.setPosition('top-right');
      hostComponent.position.set(undefined);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--top-right')).toBe(true);
    });

    it('should override global config with input position', () => {
      mockToastService.setPosition('top-right');
      hostComponent.position.set('bottom-left');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container--bottom-left')).toBe(true);
    });
  });

  // ==========================================================================
  // Custom Style Class Tests
  // ==========================================================================

  describe('custom style class', () => {
    it('should apply custom styleClass when provided', () => {
      hostComponent.styleClass.set('my-custom-container');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('my-custom-container')).toBe(true);
    });

    it('should have base toastly-container class always', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.classList.contains('toastly-container')).toBe(true);
    });
  });

  // ==========================================================================
  // Toast Filtering Tests
  // ==========================================================================

  describe('toast filtering by position', () => {
    it('should render only toasts matching container position', () => {
      const matchingToast = createMockToast('toast-1', 'bottom-right');
      const nonMatchingToast = createMockToast('toast-2', 'top-left');
      mockToastService.setVisibleToasts([matchingToast, nonMatchingToast]);
      fixture.detectChanges();

      const toastItems = fixture.nativeElement.querySelectorAll('toastly-item');
      expect(toastItems.length).toBe(1);
    });

    it('should render multiple toasts for same position', () => {
      const toast1 = createMockToast('toast-1', 'bottom-right');
      const toast2 = createMockToast('toast-2', 'bottom-right');
      const toast3 = createMockToast('toast-3', 'bottom-right');
      mockToastService.setVisibleToasts([toast1, toast2, toast3]);
      fixture.detectChanges();

      const toastItems = fixture.nativeElement.querySelectorAll('toastly-item');
      expect(toastItems.length).toBe(3);
    });

    it('should render no toasts when all are for different position', () => {
      const toast1 = createMockToast('toast-1', 'top-left');
      const toast2 = createMockToast('toast-2', 'top-right');
      mockToastService.setVisibleToasts([toast1, toast2]);
      fixture.detectChanges();

      const toastItems = fixture.nativeElement.querySelectorAll('toastly-item');
      expect(toastItems.length).toBe(0);
    });

    it('should update filter when position input changes', () => {
      const toast = createMockToast('toast-1', 'top-left');
      mockToastService.setVisibleToasts([toast]);

      hostComponent.position.set('bottom-right');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('toastly-item').length).toBe(0);

      hostComponent.position.set('top-left');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('toastly-item').length).toBe(1);
    });
  });

  // ==========================================================================
  // ARIA Accessibility Tests
  // ==========================================================================

  describe('accessibility', () => {
    it('should have role=region', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.getAttribute('role')).toBe('region');
    });

    it('should have aria-live=polite', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-label for identification', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.getAttribute('aria-label')).toBe('Notifications');
    });
  });

  // ==========================================================================
  // Host Styles Tests
  // ==========================================================================

  describe('host styles', () => {
    it('should have z-index in inline styles', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.style.zIndex).toBeTruthy();
    });

    it('should have padding in inline styles', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.style.padding).toBeTruthy();
    });

    it('should have gap in inline styles', () => {
      const container = fixture.nativeElement.querySelector('toastly-container');
      expect(container.style.gap).toBeTruthy();
    });
  });

  // ==========================================================================
  // Mouse Event Delegation Tests
  // ==========================================================================

  describe('mouse event delegation', () => {
    it('should call pauseTimer when mouse enters a toast item', () => {
      const toast = createMockToast('toast-1', 'bottom-right');
      mockToastService.setVisibleToasts([toast]);
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(mockToastService.pauseTimer).toHaveBeenCalledWith('toast-1');
    });

    it('should call resumeTimer when mouse leaves a toast item', () => {
      const toast = createMockToast('toast-1', 'bottom-right');
      mockToastService.setVisibleToasts([toast]);
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      expect(mockToastService.resumeTimer).toHaveBeenCalledWith('toast-1');
    });
  });
});
