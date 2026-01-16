/**
 * Tests for ToastItemComponent
 *
 * Verifies:
 * - Component creation and rendering
 * - Icon rendering based on type
 * - Mouse event handling for pauseOnHover
 * - Dismiss button functionality
 * - ARIA accessibility attributes
 * - Action buttons behavior
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ToastItemComponent } from './toast-item.component';
import { ToastService } from '../../services/toast.service';
import { Toast, ToastAction } from '../../types/toast.type';

// Mock ToastService
class MockToastService {
  private _pauseOnHover = signal(true);
  pauseOnHover = this._pauseOnHover.asReadonly();

  dismiss = vi.fn();
  pauseTimer = vi.fn();
  resumeTimer = vi.fn();

  setPauseOnHover(value: boolean): void {
    this._pauseOnHover.set(value);
  }
}

// Test host component to provide required inputs
@Component({
  template: `<toastly-item [toast]="toast()" />`,
  imports: [ToastItemComponent],
})
class TestHostComponent {
  toast = signal<Toast>(createMockToast());
}

function createMockToast(overrides: Partial<Toast> = {}): Toast {
  return {
    id: 'test-toast-1',
    message: 'Test message',
    title: 'Test Title',
    type: 'info',
    theme: 'light',
    durationMs: 5000,
    dismissible: true,
    position: 'bottom-right',
    actions: [],
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('ToastItemComponent', () => {
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
      const toastItem = fixture.debugElement.children[0];
      expect(toastItem).toBeDefined();
    });

    it('should render the toast message', () => {
      const nativeElement = fixture.nativeElement as HTMLElement;
      const message = nativeElement.querySelector('.toastly-item__message');

      expect(message?.textContent).toBe('Test message');
    });

    it('should render the toast title when provided', () => {
      const nativeElement = fixture.nativeElement as HTMLElement;
      const title = nativeElement.querySelector('.toastly-item__title');

      expect(title?.textContent).toBe('Test Title');
    });

    it('should not render title when not provided', () => {
      hostComponent.toast.set(createMockToast({ title: undefined }));
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;
      const title = nativeElement.querySelector('.toastly-item__title');

      expect(title).toBeNull();
    });
  });

  // ==========================================================================
  // Theme Tests
  // ==========================================================================

  describe('theme classes', () => {
    it('should apply light theme class', () => {
      hostComponent.toast.set(createMockToast({ theme: 'light' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--light')).toBe(true);
    });

    it('should apply dark theme class', () => {
      hostComponent.toast.set(createMockToast({ theme: 'dark' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--dark')).toBe(true);
    });
  });

  // ==========================================================================
  // Type/Icon Tests
  // ==========================================================================

  describe('toast type classes', () => {
    it('should apply info type class', () => {
      hostComponent.toast.set(createMockToast({ type: 'info' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--info')).toBe(true);
    });

    it('should apply success type class', () => {
      hostComponent.toast.set(createMockToast({ type: 'success' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--success')).toBe(true);
    });

    it('should apply warning type class', () => {
      hostComponent.toast.set(createMockToast({ type: 'warning' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--warning')).toBe(true);
    });

    it('should apply danger type class', () => {
      hostComponent.toast.set(createMockToast({ type: 'danger' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('toastly-item--danger')).toBe(true);
    });

    it('should render icon for each type', () => {
      const nativeElement = fixture.nativeElement as HTMLElement;
      const icon = nativeElement.querySelector('.toastly-item__icon');

      expect(icon).toBeDefined();
    });
  });

  // ==========================================================================
  // Dismiss Button Tests
  // ==========================================================================

  describe('dismiss button', () => {
    it('should show dismiss button when dismissible is true', () => {
      hostComponent.toast.set(createMockToast({ dismissible: true }));
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.toastly-item__close');
      expect(closeButton).not.toBeNull();
    });

    it('should hide dismiss button when dismissible is false', () => {
      hostComponent.toast.set(createMockToast({ dismissible: false }));
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.toastly-item__close');
      expect(closeButton).toBeNull();
    });

    it('should call dismiss on ToastService when close button clicked', () => {
      const closeButton = fixture.nativeElement.querySelector('.toastly-item__close');
      closeButton?.click();

      expect(mockToastService.dismiss).toHaveBeenCalledWith('test-toast-1');
    });
  });

  // ==========================================================================
  // Mouse Events (pauseOnHover) Tests
  // ==========================================================================

  describe('mouse events for pauseOnHover', () => {
    it('should pause timer on mouseenter when pauseOnHover is true', () => {
      mockToastService.setPauseOnHover(true);

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseenter'));

      expect(mockToastService.pauseTimer).toHaveBeenCalledWith('test-toast-1');
    });

    it('should resume timer on mouseleave when pauseOnHover is true', () => {
      mockToastService.setPauseOnHover(true);

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseleave'));

      expect(mockToastService.resumeTimer).toHaveBeenCalledWith('test-toast-1');
    });

    it('should NOT pause timer on mouseenter when pauseOnHover is false', () => {
      mockToastService.setPauseOnHover(false);
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseenter'));

      expect(mockToastService.pauseTimer).not.toHaveBeenCalled();
    });

    it('should NOT resume timer on mouseleave when pauseOnHover is false', () => {
      mockToastService.setPauseOnHover(false);
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      toastItem.dispatchEvent(new MouseEvent('mouseleave'));

      expect(mockToastService.resumeTimer).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // ARIA Accessibility Tests
  // ==========================================================================

  describe('accessibility', () => {
    it('should have aria-live attribute', () => {
      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.getAttribute('aria-live')).toBe('polite');
    });

    it('should have role=status for info type', () => {
      hostComponent.toast.set(createMockToast({ type: 'info' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.getAttribute('role')).toBe('status');
    });

    it('should have role=status for success type', () => {
      hostComponent.toast.set(createMockToast({ type: 'success' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.getAttribute('role')).toBe('status');
    });

    it('should have role=alert for warning type', () => {
      hostComponent.toast.set(createMockToast({ type: 'warning' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.getAttribute('role')).toBe('alert');
    });

    it('should have role=alert for danger type', () => {
      hostComponent.toast.set(createMockToast({ type: 'danger' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.getAttribute('role')).toBe('alert');
    });

    it('should have accessible dismiss button with aria-label', () => {
      const closeButton = fixture.nativeElement.querySelector('.toastly-item__close');
      expect(closeButton.getAttribute('aria-label')).toBe('Dismiss notification');
    });
  });

  // ==========================================================================
  // Action Buttons Tests
  // ==========================================================================

  describe('action buttons', () => {
    it('should not render actions section when no actions provided', () => {
      hostComponent.toast.set(createMockToast({ actions: [] }));
      fixture.detectChanges();

      const actions = fixture.nativeElement.querySelector('.toastly-item__actions');
      expect(actions).toBeNull();
    });

    it('should render action buttons when actions provided', () => {
      const mockAction: ToastAction = {
        label: 'Confirm',
        variant: 'primary',
        onClick: vi.fn(),
      };
      hostComponent.toast.set(createMockToast({ actions: [mockAction] }));
      fixture.detectChanges();

      const actionButton = fixture.nativeElement.querySelector('.toastly-item__action');
      expect(actionButton?.textContent?.trim()).toBe('Confirm');
    });

    it('should call action onClick when action button clicked', () => {
      const mockOnClick = vi.fn();
      const mockAction: ToastAction = {
        label: 'Click Me',
        variant: 'primary',
        onClick: mockOnClick,
      };
      hostComponent.toast.set(createMockToast({ actions: [mockAction] }));
      fixture.detectChanges();

      const actionButton = fixture.nativeElement.querySelector('.toastly-item__action');
      actionButton?.click();

      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should apply correct variant class to action buttons', () => {
      const primaryAction: ToastAction = {
        label: 'Primary',
        variant: 'primary',
        onClick: vi.fn(),
      };
      const secondaryAction: ToastAction = {
        label: 'Secondary',
        variant: 'secondary',
        onClick: vi.fn(),
      };
      hostComponent.toast.set(createMockToast({ actions: [primaryAction, secondaryAction] }));
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('.toastly-item__action');
      expect(buttons[0].classList.contains('toastly-item__action--primary')).toBe(true);
      expect(buttons[1].classList.contains('toastly-item__action--secondary')).toBe(true);
    });
  });

  // ==========================================================================
  // Progress Bar Tests
  // ==========================================================================

  describe('progress bar', () => {
    it('should not render progress bar when progressPercent is undefined', () => {
      hostComponent.toast.set(createMockToast({ progressPercent: undefined }));
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('.toastly-item__progress-track');
      expect(progressBar).toBeNull();
    });

    it('should render progress bar when progressPercent is provided', () => {
      hostComponent.toast.set(createMockToast({ progressPercent: 50 }));
      fixture.detectChanges();

      const progressTrack = fixture.nativeElement.querySelector('.toastly-item__progress-track');
      expect(progressTrack).not.toBeNull();
    });

    it('should set correct width on progress bar', () => {
      hostComponent.toast.set(createMockToast({ progressPercent: 75 }));
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('.toastly-item__progress-bar');
      expect(progressBar.style.width).toBe('75%');
    });

    it('should have progressbar role for accessibility', () => {
      hostComponent.toast.set(createMockToast({ progressPercent: 50 }));
      fixture.detectChanges();

      const progressTrack = fixture.nativeElement.querySelector('.toastly-item__progress-track');
      expect(progressTrack.getAttribute('role')).toBe('progressbar');
    });
  });

  // ==========================================================================
  // Custom Style Class Tests
  // ==========================================================================

  describe('custom style class', () => {
    it('should apply custom styleClass when provided', () => {
      hostComponent.toast.set(createMockToast({ styleClass: 'my-custom-class' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      expect(toastItem.classList.contains('my-custom-class')).toBe(true);
    });

    it('should not add empty styleClass', () => {
      hostComponent.toast.set(createMockToast({ styleClass: '' }));
      fixture.detectChanges();

      const toastItem = fixture.nativeElement.querySelector('toastly-item');
      // Should have standard classes but no extra empty class
      expect(toastItem.className).not.toContain('  ');
    });
  });

  // ==========================================================================
  // Avatar Tests
  // ==========================================================================

  describe('avatar rendering', () => {
    it('should render avatar image when avatarUrl is provided', () => {
      hostComponent.toast.set(createMockToast({ avatarUrl: 'https://example.com/avatar.png' }));
      fixture.detectChanges();

      const avatar = fixture.nativeElement.querySelector('.toastly-item__avatar');
      expect(avatar).not.toBeNull();
      expect(avatar.getAttribute('src')).toBe('https://example.com/avatar.png');
    });

    it('should not render icon when avatar is present', () => {
      hostComponent.toast.set(createMockToast({ avatarUrl: 'https://example.com/avatar.png' }));
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.toastly-item__icon');
      expect(icon).toBeNull();
    });
  });
});
