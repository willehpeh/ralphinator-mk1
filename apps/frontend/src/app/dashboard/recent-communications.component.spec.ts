import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RecentCommunicationsComponent } from './recent-communications.component';
import { CommunicationReadModel } from '@angular-nest-starter/shared-types';

describe('RecentCommunicationsComponent', () => {
  const mockCommunications: CommunicationReadModel[] = [
    {
      id: '1',
      type: 'Call',
      subject: 'Discussed project requirements',
      communicationDate: '2025-11-05T10:00:00Z',
      duration: 30,
      notes: 'Client wants to add new features',
      clientId: 'client-1',
      clientName: 'Acme Corp',
      contactId: 'contact-1',
      contactName: 'John Doe',
      projectId: 'project-1',
      projectName: 'Website Redesign',
      followUpRequired: true,
      followUpDate: '2025-11-10T10:00:00Z',
      followUpCompleted: false,
      createdAt: '2025-11-05T10:00:00Z',
      updatedAt: '2025-11-05T10:00:00Z',
    },
    {
      id: '2',
      type: 'Email',
      subject: 'Budget approval needed',
      communicationDate: '2025-11-04T14:30:00Z',
      duration: null,
      notes: 'Sent proposal for review',
      clientId: 'client-2',
      clientName: 'Tech Solutions Ltd',
      contactId: null,
      contactName: null,
      projectId: 'project-2',
      projectName: 'Mobile App Development',
      followUpRequired: false,
      followUpDate: null,
      followUpCompleted: false,
      createdAt: '2025-11-04T14:30:00Z',
      updatedAt: '2025-11-04T14:30:00Z',
    },
    {
      id: '3',
      type: 'Meeting',
      subject: 'Quarterly review',
      communicationDate: '2025-11-03T09:00:00Z',
      duration: 60,
      notes: 'Discussed progress and next steps',
      clientId: 'client-3',
      clientName: 'Global Industries',
      contactId: 'contact-2',
      contactName: 'Jane Smith',
      projectId: null,
      projectName: null,
      followUpRequired: true,
      followUpDate: '2025-11-15T09:00:00Z',
      followUpCompleted: false,
      createdAt: '2025-11-03T09:00:00Z',
      updatedAt: '2025-11-03T09:00:00Z',
    },
  ];

  describe('Empty State', () => {
    it('should display empty state message when no communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No communications yet');
      expect(compiled.textContent).toContain('Log your first client interaction to see it here');
    });

    it('should display empty state icon when no communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const emptyIcon = compiled.querySelector('.empty-icon');
      expect(emptyIcon).toBeDefined();
      expect(emptyIcon).not.toBeNull();
    });

    it('should not display "View All Communications" link when no communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).not.toContain('View All Communications');
    });

    it('should not display communication cards when no communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const communicationCards = compiled.querySelectorAll('.communication-card');
      expect(communicationCards.length).toBe(0);
    });
  });

  describe('Communication List Display', () => {
    it('should display list of communications when communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that all communication subjects are displayed
      expect(compiled.textContent).toContain('Discussed project requirements');
      expect(compiled.textContent).toContain('Budget approval needed');
      expect(compiled.textContent).toContain('Quarterly review');
    });

    it('should display correct number of communication cards', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const communicationCards = compiled.querySelectorAll('.communication-card');
      expect(communicationCards.length).toBe(3);
    });

    it('should display type badges for all communications', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that type badges are displayed
      expect(compiled.textContent).toContain('Call');
      expect(compiled.textContent).toContain('Email');
      expect(compiled.textContent).toContain('Meeting');
    });

    it('should display client names for all communications', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that client names are displayed
      expect(compiled.textContent).toContain('Acme Corp');
      expect(compiled.textContent).toContain('Tech Solutions Ltd');
      expect(compiled.textContent).toContain('Global Industries');
    });

    it('should display "View All Communications" link when communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('View All Communications');
    });

    it('should not display empty state when communications exist', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const emptyState = compiled.querySelector('.empty-state');
      expect(emptyState).toBeNull();
    });
  });

  describe('Type Badge Styling', () => {
    it('should apply correct CSS class for Call type', () => {
      const callCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        type: 'Call',
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [callCommunication]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--call');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Call');
    });

    it('should apply correct CSS class for Email type', () => {
      const emailCommunication: CommunicationReadModel = {
        ...mockCommunications[1],
        type: 'Email',
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [emailCommunication]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--email');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Email');
    });

    it('should apply correct CSS class for Meeting type', () => {
      const meetingCommunication: CommunicationReadModel = {
        ...mockCommunications[2],
        type: 'Meeting',
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [meetingCommunication]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--meeting');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Meeting');
    });

    it('should apply correct CSS class for Chat type', () => {
      const chatCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        type: 'Chat',
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [chatCommunication]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--chat');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Chat');
    });

    it('should apply correct CSS class for Other type', () => {
      const otherCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        type: 'Other',
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [otherCommunication]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--other');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Other');
    });
  });

  describe('Contact Name Display', () => {
    it('should display contact name when contactName exists', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('John Doe');
    });

    it('should not display contact name when contactName is null', () => {
      const communicationWithoutContact: CommunicationReadModel = {
        ...mockCommunications[1],
        contactName: null,
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [communicationWithoutContact]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const metaItems = compiled.querySelectorAll('.meta-item');

      // Should have only 2 meta items (client and project), not 3 (which would include contact)
      // Check that none of the meta items contain the contact's SVG user icon
      const contactIcons = Array.from(metaItems).filter((item: Element) => {
        const svg = item.querySelector('svg');
        return svg && svg.querySelector('circle[cx="12"][cy="7"]');
      });
      expect(contactIcons.length).toBe(0);
    });
  });

  describe('Project Name Display', () => {
    it('should display project name when projectName exists', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Website Redesign');
    });

    it('should not display project name when projectName is null', () => {
      const communicationWithoutProject: CommunicationReadModel = {
        ...mockCommunications[2],
        projectName: null,
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [communicationWithoutProject]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Should not contain the project name
      expect(compiled.textContent).not.toContain('Website Redesign');
      expect(compiled.textContent).not.toContain('Mobile App Development');
    });
  });

  describe('Date Formatting', () => {
    it('should format date as "Today" for current day', () => {
      const today = new Date();
      const todayCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        communicationDate: today.toISOString(),
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', [todayCommunication]);
      fixture.detectChanges();

      expect(component.formatDate(todayCommunication.communicationDate)).toBe('Today');
    });

    it('should format date as "Yesterday" for previous day', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        communicationDate: yesterday.toISOString(),
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', [yesterdayCommunication]);
      fixture.detectChanges();

      expect(component.formatDate(yesterdayCommunication.communicationDate)).toBe('Yesterday');
    });

    it('should format date as "X days ago" for dates within a week', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const recentCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        communicationDate: threeDaysAgo.toISOString(),
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', [recentCommunication]);
      fixture.detectChanges();

      expect(component.formatDate(recentCommunication.communicationDate)).toBe('3 days ago');
    });

    it('should format date with month and day for dates older than a week', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const oldCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        communicationDate: tenDaysAgo.toISOString(),
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', [oldCommunication]);
      fixture.detectChanges();

      const formatted = component.formatDate(oldCommunication.communicationDate);
      // Should be in format like "Oct 26" or "Oct 26, 2024" (if different year)
      expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}(, \d{4})?$/);
    });

    it('should include year when date is from different year', () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const oldYearCommunication: CommunicationReadModel = {
        ...mockCommunications[0],
        communicationDate: lastYear.toISOString(),
      };

      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', [oldYearCommunication]);
      fixture.detectChanges();

      const formatted = component.formatDate(oldYearCommunication.communicationDate);
      // Should include the year when it's different from current year
      expect(formatted).toMatch(/\d{4}$/);
    });
  });

  describe('getBadgeClass Method', () => {
    it('should return lowercase type for badge class', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('communications', []);
      fixture.detectChanges();

      expect(component.getBadgeClass('Call')).toBe('call');
      expect(component.getBadgeClass('Email')).toBe('email');
      expect(component.getBadgeClass('Meeting')).toBe('meeting');
      expect(component.getBadgeClass('Chat')).toBe('chat');
      expect(component.getBadgeClass('Other')).toBe('other');
    });
  });

  describe('Header and Subtitle', () => {
    it('should display section header', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Recent Communications');
    });

    it('should display section subtitle', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', mockCommunications);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Last 10 client interactions');
    });
  });

  describe('Communication Card Structure', () => {
    it('should display all required communication fields', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check type badge
      expect(compiled.textContent).toContain('Call');

      // Check subject
      expect(compiled.textContent).toContain('Discussed project requirements');

      // Check client name
      expect(compiled.textContent).toContain('Acme Corp');

      // Check contact name
      expect(compiled.textContent).toContain('John Doe');

      // Check project name
      expect(compiled.textContent).toContain('Website Redesign');
    });

    it('should have communication header with badge and date', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const communicationHeader = compiled.querySelector('.communication-header');
      expect(communicationHeader).toBeDefined();
      expect(communicationHeader).not.toBeNull();

      const typeBadge = communicationHeader?.querySelector('.type-badge');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();

      const dateElement = communicationHeader?.querySelector('.communication-date');
      expect(dateElement).toBeDefined();
      expect(dateElement).not.toBeNull();
    });

    it('should have communication subject as heading', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const subject = compiled.querySelector('.communication-subject');
      expect(subject).toBeDefined();
      expect(subject).not.toBeNull();
      expect(subject?.textContent?.trim()).toBe('Discussed project requirements');
    });

    it('should have meta section with icons', () => {
      TestBed.configureTestingModule({
        imports: [RecentCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(RecentCommunicationsComponent);
      fixture.componentRef.setInput('communications', [mockCommunications[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const metaSection = compiled.querySelector('.communication-meta');
      expect(metaSection).toBeDefined();
      expect(metaSection).not.toBeNull();

      const icons = metaSection?.querySelectorAll('.icon');
      expect(icons).toBeDefined();
      expect(icons && icons.length).toBeGreaterThan(0);
    });
  });
});
