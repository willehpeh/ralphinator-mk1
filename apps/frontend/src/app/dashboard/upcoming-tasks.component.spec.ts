import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { UpcomingTasksComponent } from './upcoming-tasks.component';
import { TaskDto } from '@angular-nest-starter/shared-types';

describe('UpcomingTasksComponent', () => {
  const mockTasks: TaskDto[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      notes: 'Prepare slides',
      priority: 'High',
      status: 'In Progress',
      dueDate: new Date('2025-11-06'),
      clientId: 'client-1',
      projectId: 'project-1',
      createdAt: new Date('2025-11-01'),
    },
    {
      id: '2',
      title: 'Review code changes',
      notes: null,
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date('2025-11-07'),
      clientId: null,
      projectId: 'project-2',
      createdAt: new Date('2025-11-02'),
    },
    {
      id: '3',
      title: 'Update documentation',
      notes: null,
      priority: 'Low',
      status: 'To Do',
      dueDate: new Date('2025-11-10'),
      clientId: 'client-2',
      projectId: null,
      createdAt: new Date('2025-11-03'),
    },
  ];

  describe('Empty State', () => {
    it('should display empty state message when no tasks exist', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No upcoming tasks');
      expect(compiled.textContent).toContain('All tasks are completed or have no due dates');
    });

    it('should not display "View All Tasks" link when no tasks exist', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).not.toContain('View All Tasks');
    });
  });

  describe('Task List Display', () => {
    it('should display list of tasks when tasks exist', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', mockTasks);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that all task titles are displayed
      expect(compiled.textContent).toContain('Complete project proposal');
      expect(compiled.textContent).toContain('Review code changes');
      expect(compiled.textContent).toContain('Update documentation');
    });

    it('should display priority badges for all tasks', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', mockTasks);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that priority badges are displayed
      expect(compiled.textContent).toContain('High');
      expect(compiled.textContent).toContain('Medium');
      expect(compiled.textContent).toContain('Low');
    });

    it('should display "View All Tasks" link when tasks exist', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', mockTasks);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('View All Tasks');
    });
  });

  describe('Priority Badge Styling', () => {
    it('should apply correct CSS class for Low priority', () => {
      const lowPriorityTask: TaskDto = { ...mockTasks[2], priority: 'Low' };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [lowPriorityTask]);
      fixture.detectChanges();

      const priorityBadge = fixture.nativeElement.querySelector('.priority-badge--low');
      expect(priorityBadge).toBeDefined();
      expect(priorityBadge?.textContent?.trim()).toBe('Low');
    });

    it('should apply correct CSS class for Medium priority', () => {
      const mediumPriorityTask: TaskDto = { ...mockTasks[1], priority: 'Medium' };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [mediumPriorityTask]);
      fixture.detectChanges();

      const priorityBadge = fixture.nativeElement.querySelector('.priority-badge--medium');
      expect(priorityBadge).toBeDefined();
      expect(priorityBadge?.textContent?.trim()).toBe('Medium');
    });

    it('should apply correct CSS class for High priority', () => {
      const highPriorityTask: TaskDto = { ...mockTasks[0], priority: 'High' };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [highPriorityTask]);
      fixture.detectChanges();

      const priorityBadge = fixture.nativeElement.querySelector('.priority-badge--high');
      expect(priorityBadge).toBeDefined();
      expect(priorityBadge?.textContent?.trim()).toBe('High');
    });

    it('should apply correct CSS class for Urgent priority', () => {
      const urgentPriorityTask: TaskDto = { ...mockTasks[0], priority: 'Urgent' };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [urgentPriorityTask]);
      fixture.detectChanges();

      const priorityBadge = fixture.nativeElement.querySelector('.priority-badge--urgent');
      expect(priorityBadge).toBeDefined();
      expect(priorityBadge?.textContent?.trim()).toBe('Urgent');
    });
  });

  describe('Project and Client Icons', () => {
    it('should display project icon when projectId exists', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [mockTasks[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const projectElement = compiled.querySelector('.task-project');
      expect(projectElement).toBeDefined();
      expect(projectElement?.textContent?.trim()).toBe('Project');
    });

    it('should display client icon when clientId exists', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [mockTasks[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const clientElement = compiled.querySelector('.task-client');
      expect(clientElement).toBeDefined();
      expect(clientElement?.textContent?.trim()).toBe('Client');
    });

    it('should not display project icon when projectId is null', () => {
      const taskWithoutProject: TaskDto = { ...mockTasks[2], projectId: null };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [taskWithoutProject]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const projectElement = compiled.querySelector('.task-project');
      expect(projectElement).toBeNull();
    });

    it('should not display client icon when clientId is null', () => {
      const taskWithoutClient: TaskDto = { ...mockTasks[1], clientId: null };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [taskWithoutClient]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const clientElement = compiled.querySelector('.task-client');
      expect(clientElement).toBeNull();
    });
  });

  describe('Overdue Task Styling', () => {
    it('should apply overdue styling for tasks past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const overdueTask: TaskDto = { ...mockTasks[0], dueDate: yesterday };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [overdueTask]);
      fixture.detectChanges();

      const taskCard = fixture.nativeElement.querySelector('.task-card--overdue');
      expect(taskCard).toBeDefined();
    });

    it('should not apply overdue styling for tasks due today', () => {
      const today = new Date();
      const taskDueToday: TaskDto = { ...mockTasks[0], dueDate: today };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [taskDueToday]);
      fixture.detectChanges();

      const taskCard = fixture.nativeElement.querySelector('.task-card--overdue');
      expect(taskCard).toBeNull();
    });

    it('should not apply overdue styling for tasks due in the future', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureTask: TaskDto = { ...mockTasks[0], dueDate: tomorrow };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [futureTask]);
      fixture.detectChanges();

      const taskCard = fixture.nativeElement.querySelector('.task-card--overdue');
      expect(taskCard).toBeNull();
    });

    it('should not apply overdue styling for tasks without due date', () => {
      const taskWithoutDueDate: TaskDto = { ...mockTasks[0], dueDate: null };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', [taskWithoutDueDate]);
      fixture.detectChanges();

      const taskCard = fixture.nativeElement.querySelector('.task-card--overdue');
      expect(taskCard).toBeNull();
    });
  });

  describe('Due Date Formatting', () => {
    it('should format overdue tasks correctly', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(0, 0, 0, 0);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const overdueTask: TaskDto = { ...mockTasks[0], dueDate: twoDaysAgo };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [overdueTask]);
      fixture.detectChanges();

      expect(component.formatDueDate(overdueTask.dueDate)).toBe('2 days overdue');
    });

    it('should format single day overdue correctly', () => {
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);
      const overdueTask: TaskDto = { ...mockTasks[0], dueDate: yesterday };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [overdueTask]);
      fixture.detectChanges();

      expect(component.formatDueDate(overdueTask.dueDate)).toBe('1 day overdue');
    });

    it('should format tasks due today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDueToday: TaskDto = { ...mockTasks[0], dueDate: today };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [taskDueToday]);
      fixture.detectChanges();

      expect(component.formatDueDate(taskDueToday.dueDate)).toBe('Due today');
    });

    it('should format tasks due tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const taskDueTomorrow: TaskDto = { ...mockTasks[0], dueDate: tomorrow };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [taskDueTomorrow]);
      fixture.detectChanges();

      expect(component.formatDueDate(taskDueTomorrow.dueDate)).toBe('Due tomorrow');
    });

    it('should format tasks due in 2-7 days', () => {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setHours(0, 0, 0, 0);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      const futureTask: TaskDto = { ...mockTasks[0], dueDate: threeDaysFromNow };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [futureTask]);
      fixture.detectChanges();

      expect(component.formatDueDate(futureTask.dueDate)).toBe('Due in 3 days');
    });

    it('should format tasks due more than 7 days away with date', () => {
      const tenDaysFromNow = new Date();
      tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
      const futureTask: TaskDto = { ...mockTasks[0], dueDate: tenDaysFromNow };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', [futureTask]);
      fixture.detectChanges();

      const formatted = component.formatDueDate(futureTask.dueDate);
      // Should be in format like "Nov 15" or "Nov 15, 2026" (if different year)
      expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}(, \d{4})?$/);
    });

    it('should return empty string for null due date', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      expect(component.formatDueDate(null)).toBe('');
    });
  });

  describe('isOverdue Method', () => {
    it('should return true for tasks past due date', () => {
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);
      const overdueTask: TaskDto = { ...mockTasks[0], dueDate: yesterday };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      expect(component.isOverdue(overdueTask)).toBe(true);
    });

    it('should return false for tasks due today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDueToday: TaskDto = { ...mockTasks[0], dueDate: today };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      expect(component.isOverdue(taskDueToday)).toBe(false);
    });

    it('should return false for tasks due in the future', () => {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureTask: TaskDto = { ...mockTasks[0], dueDate: tomorrow };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      expect(component.isOverdue(futureTask)).toBe(false);
    });

    it('should return false for tasks without due date', () => {
      const taskWithoutDueDate: TaskDto = { ...mockTasks[0], dueDate: null };

      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();

      expect(component.isOverdue(taskWithoutDueDate)).toBe(false);
    });
  });

  describe('Header and Subtitle', () => {
    it('should display section header', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', mockTasks);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Upcoming Tasks');
    });

    it('should display section subtitle', () => {
      TestBed.configureTestingModule({
        imports: [UpcomingTasksComponent],
      });

      const fixture = TestBed.createComponent(UpcomingTasksComponent);
      fixture.componentRef.setInput('tasks', mockTasks);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Next 10 tasks by due date');
    });
  });
});
