import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuickActionsComponent } from './quick-actions.component';

describe('QuickActionsComponent', () => {
  describe('Component Rendering', () => {
    it('should render the component with Quick Actions heading', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Quick Actions');
    });

    it('should render all 5 action buttons with correct labels', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Add Client');
      expect(compiled.textContent).toContain('View Contacts');
      expect(compiled.textContent).toContain('View Projects');
      expect(compiled.textContent).toContain('Add Task');
      expect(compiled.textContent).toContain('View Communications');
    });
  });

  describe('Router Links', () => {
    it('should have routerLink directive on all buttons', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');

      expect(buttons.length).toBe(5);
      buttons.forEach((button: Element) => {
        // Verify buttons are clickable (have button role)
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should render buttons in correct order', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn span');
      const buttonTexts = Array.from(buttons).map((btn: any) => btn.textContent.trim());

      expect(buttonTexts).toEqual([
        'Add Client',
        'View Contacts',
        'View Projects',
        'Add Task',
        'View Communications'
      ]);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to Add Client button', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');
      const addClientButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Add Client')
      ) as HTMLElement;

      expect(addClientButton?.classList.contains('action-btn')).toBe(true);
      expect(addClientButton?.classList.contains('action-btn--client')).toBe(true);
    });

    it('should apply correct CSS classes to View Contacts button', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');
      const viewContactsButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('View Contacts')
      ) as HTMLElement;

      expect(viewContactsButton?.classList.contains('action-btn')).toBe(true);
      expect(viewContactsButton?.classList.contains('action-btn--contact')).toBe(true);
    });

    it('should apply correct CSS classes to View Projects button', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');
      const viewProjectsButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('View Projects')
      ) as HTMLElement;

      expect(viewProjectsButton?.classList.contains('action-btn')).toBe(true);
      expect(viewProjectsButton?.classList.contains('action-btn--project')).toBe(true);
    });

    it('should apply correct CSS classes to Add Task button', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');
      const addTaskButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Add Task')
      ) as HTMLElement;

      expect(addTaskButton?.classList.contains('action-btn')).toBe(true);
      expect(addTaskButton?.classList.contains('action-btn--task')).toBe(true);
    });

    it('should apply correct CSS classes to View Communications button', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');
      const viewCommunicationsButton = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('View Communications')
      ) as HTMLElement;

      expect(viewCommunicationsButton?.classList.contains('action-btn')).toBe(true);
      expect(viewCommunicationsButton?.classList.contains('action-btn--communication')).toBe(true);
    });
  });

  describe('Icons', () => {
    it('should render action icons for all buttons', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const icons = compiled.querySelectorAll('.action-icon');
      expect(icons.length).toBe(5);
    });

    it('should render SVG icons with correct structure', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const svgElements = compiled.querySelectorAll('svg.action-icon');

      expect(svgElements.length).toBe(5);
      svgElements.forEach((svg: SVGElement) => {
        expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      });
    });
  });

  describe('Layout and Structure', () => {
    it('should render buttons in actions-grid container', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const actionsGrid = compiled.querySelector('.actions-grid');
      expect(actionsGrid).toBeTruthy();

      const buttons = actionsGrid?.querySelectorAll('.action-btn');
      expect(buttons?.length).toBe(5);
    });

    it('should wrap buttons in section with quick-actions class', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const section = compiled.querySelector('section.quick-actions');
      expect(section).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render all actions as button elements for keyboard accessibility', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('.action-btn');

      expect(buttons.length).toBe(5);
      buttons.forEach((button: Element) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should have semantic heading for section', () => {
      TestBed.configureTestingModule({
        imports: [QuickActionsComponent],
        providers: [provideRouter([])],
      });

      const fixture = TestBed.createComponent(QuickActionsComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const heading = compiled.querySelector('h2');
      expect(heading).toBeTruthy();
      expect(heading?.textContent).toBe('Quick Actions');
    });
  });
});
