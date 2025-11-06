import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FollowUpCommunicationsComponent } from './follow-up-communications.component';
import { CommunicationReadModel } from '@angular-nest-starter/shared-types';

describe('FollowUpCommunicationsComponent', () => {
  // Helper function to create a communication with a follow-up date offset
  const createFollowUpCommunication = (
    id: string,
    daysOffset: number,
    overrides?: Partial<CommunicationReadModel>
  ): CommunicationReadModel => {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + daysOffset);

    return {
      id,
      type: 'Call',
      subject: `Follow-up communication ${id}`,
      communicationDate: new Date().toISOString(),
      duration: 30,
      notes: 'Test notes',
      clientId: `client-${id}`,
      clientName: `Client ${id}`,
      contactId: `contact-${id}`,
      contactName: `Contact ${id}`,
      projectId: `project-${id}`,
      projectName: `Project ${id}`,
      followUpRequired: true,
      followUpDate: followUpDate.toISOString(),
      followUpCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  };

  const mockOverdueFollowUps: CommunicationReadModel[] = [
    createFollowUpCommunication('1', -5, {
      type: 'Call',
      subject: 'Urgent client call needed',
      clientName: 'Acme Corp',
    }),
    createFollowUpCommunication('2', -1, {
      type: 'Email',
      subject: 'Proposal follow-up',
      clientName: 'Tech Solutions Ltd',
    }),
  ];

  const mockUpcomingFollowUps: CommunicationReadModel[] = [
    createFollowUpCommunication('3', 1, {
      type: 'Meeting',
      subject: 'Review meeting',
      clientName: 'Global Industries',
    }),
    createFollowUpCommunication('4', 5, {
      type: 'Chat',
      subject: 'Check-in with client',
      clientName: 'Startup Inc',
    }),
  ];

  const mockMixedFollowUps: CommunicationReadModel[] = [
    ...mockOverdueFollowUps,
    ...mockUpcomingFollowUps,
  ];

  describe('Empty State', () => {
    it('should display empty state message when no follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('All caught up!');
      expect(compiled.textContent).toContain('No follow-ups are currently required');
    });

    it('should display empty state icon when no follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const emptyIcon = compiled.querySelector('.empty-icon');
      expect(emptyIcon).toBeDefined();
      expect(emptyIcon).not.toBeNull();
    });

    it('should display "All follow-ups are complete" subtitle when empty', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('All follow-ups are complete');
    });

    it('should not display "View All Communications" link when no follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).not.toContain('View All Communications');
    });

    it('should not display follow-up cards when no follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCards = compiled.querySelectorAll('.follow-up-card');
      expect(followUpCards.length).toBe(0);
    });
  });

  describe('Follow-Up List Display', () => {
    it('should display list of follow-ups when follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      expect(compiled.textContent).toContain('Urgent client call needed');
      expect(compiled.textContent).toContain('Proposal follow-up');
      expect(compiled.textContent).toContain('Review meeting');
      expect(compiled.textContent).toContain('Check-in with client');
    });

    it('should display correct number of follow-up cards', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCards = compiled.querySelectorAll('.follow-up-card');
      expect(followUpCards.length).toBe(4);
    });

    it('should display "View All Communications" link when follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('View All Communications');
    });

    it('should not display empty state when follow-ups exist', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const emptyState = compiled.querySelector('.empty-state');
      expect(emptyState).toBeNull();
    });

    it('should display correct count in subtitle for single follow-up', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [mockMixedFollowUps[0]]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('1 communication requiring follow-up');
    });

    it('should display correct count in subtitle for multiple follow-ups', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('4 communications requiring follow-up');
    });
  });

  describe('Type Badge Display', () => {
    it('should display type badges for all follow-ups', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', mockMixedFollowUps);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const typeBadges = compiled.querySelectorAll('.type-badge');
      expect(typeBadges.length).toBe(4);
    });

    it('should apply correct CSS class for Call type', () => {
      const callFollowUp = createFollowUpCommunication('1', 1, { type: 'Call' });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [callFollowUp]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--call');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Call');
    });

    it('should apply correct CSS class for Email type', () => {
      const emailFollowUp = createFollowUpCommunication('1', 1, { type: 'Email' });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [emailFollowUp]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--email');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Email');
    });

    it('should apply correct CSS class for Meeting type', () => {
      const meetingFollowUp = createFollowUpCommunication('1', 1, { type: 'Meeting' });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [meetingFollowUp]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--meeting');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Meeting');
    });

    it('should apply correct CSS class for Chat type', () => {
      const chatFollowUp = createFollowUpCommunication('1', 1, { type: 'Chat' });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [chatFollowUp]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--chat');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Chat');
    });

    it('should apply correct CSS class for Other type', () => {
      const otherFollowUp = createFollowUpCommunication('1', 1, { type: 'Other' });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [otherFollowUp]);
      fixture.detectChanges();

      const typeBadge = fixture.nativeElement.querySelector('.type-badge--other');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();
      expect(typeBadge?.textContent?.trim()).toBe('Other');
    });
  });

  describe('Urgency Indicators', () => {
    it('should display "overdue" indicator for overdue follow-ups', () => {
      const overdueFollowUp = createFollowUpCommunication('1', -3);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [overdueFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('overdue');
    });

    it('should display correct number of days overdue', () => {
      const overdueFollowUp = createFollowUpCommunication('1', -5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [overdueFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('5 days overdue');
    });

    it('should display singular "day overdue" for 1 day overdue', () => {
      const overdueFollowUp = createFollowUpCommunication('1', -1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [overdueFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('1 day overdue');
    });

    it('should display "days until due" for upcoming follow-ups', () => {
      const upcomingFollowUp = createFollowUpCommunication('1', 3);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [upcomingFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('3 days until due');
    });

    it('should display singular "day until due" for 1 day until', () => {
      const upcomingFollowUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [upcomingFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('1 day until due');
    });

    it('should apply critical urgency class for 3+ days overdue', () => {
      const criticalOverdue = createFollowUpCommunication('1', -5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [criticalOverdue]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const urgencyIndicator = compiled.querySelector('.urgency-indicator--critical');
      expect(urgencyIndicator).not.toBeNull();
    });

    it('should apply warning urgency class for less than 3 days overdue', () => {
      const warningOverdue = createFollowUpCommunication('1', -1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [warningOverdue]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const urgencyIndicator = compiled.querySelector('.urgency-indicator--warning');
      expect(urgencyIndicator).not.toBeNull();
    });

    it('should apply warning urgency class for due within 2 days', () => {
      const dueSoon = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [dueSoon]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const urgencyIndicator = compiled.querySelector('.urgency-indicator--warning');
      expect(urgencyIndicator).not.toBeNull();
    });

    it('should apply normal urgency class for due in more than 2 days', () => {
      const normalFollowUp = createFollowUpCommunication('1', 5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [normalFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const urgencyIndicator = compiled.querySelector('.urgency-indicator--normal');
      expect(urgencyIndicator).not.toBeNull();
    });
  });

  describe('Visual Styling', () => {
    it('should apply overdue class to overdue follow-up cards', () => {
      const overdueFollowUp = createFollowUpCommunication('1', -3);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [overdueFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCard = compiled.querySelector('.follow-up-card');
      expect(followUpCard?.classList.contains('overdue')).toBe(true);
    });

    it('should apply critical data-urgency attribute to critical cards', () => {
      const criticalFollowUp = createFollowUpCommunication('1', -5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [criticalFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCard = compiled.querySelector('.follow-up-card');
      expect(followUpCard?.getAttribute('data-urgency')).toBe('critical');
    });

    it('should apply warning data-urgency attribute to warning cards', () => {
      const warningFollowUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [warningFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCard = compiled.querySelector('.follow-up-card');
      expect(followUpCard?.getAttribute('data-urgency')).toBe('warning');
    });

    it('should apply normal data-urgency attribute to normal cards', () => {
      const normalFollowUp = createFollowUpCommunication('1', 5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [normalFollowUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpCard = compiled.querySelector('.follow-up-card');
      expect(followUpCard?.getAttribute('data-urgency')).toBe('normal');
    });
  });

  describe('Contact Name Display', () => {
    it('should display contact name when contactName exists', () => {
      const followUpWithContact = createFollowUpCommunication('1', 1, {
        contactName: 'John Doe',
      });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUpWithContact]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('John Doe');
    });

    it('should not display contact name when contactName is null', () => {
      const followUpWithoutContact = createFollowUpCommunication('1', 1, {
        contactName: null,
      });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUpWithoutContact]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const metaItems = compiled.querySelectorAll('.meta-item');

      // Check that none of the meta items contain the contact's SVG user icon
      const contactIcons = Array.from(metaItems).filter((item: Element) => {
        const svg = item.querySelector('svg');
        return svg && svg.querySelector('circle[cx="12"][cy="7"]');
      });
      expect(contactIcons.length).toBe(0);
    });
  });

  describe('Follow-Up Card Structure', () => {
    it('should display all required follow-up fields', () => {
      const followUp = createFollowUpCommunication('1', 1, {
        type: 'Call',
        subject: 'Important client call',
        clientName: 'Acme Corp',
        contactName: 'John Doe',
      });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check type badge
      expect(compiled.textContent).toContain('Call');

      // Check subject
      expect(compiled.textContent).toContain('Important client call');

      // Check client name
      expect(compiled.textContent).toContain('Acme Corp');

      // Check contact name
      expect(compiled.textContent).toContain('John Doe');

      // Check follow-up date indicator
      expect(compiled.textContent).toContain('Follow-up:');
    });

    it('should have follow-up header with badge and urgency indicator', () => {
      const followUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const followUpHeader = compiled.querySelector('.follow-up-header');
      expect(followUpHeader).toBeDefined();
      expect(followUpHeader).not.toBeNull();

      const typeBadge = followUpHeader?.querySelector('.type-badge');
      expect(typeBadge).toBeDefined();
      expect(typeBadge).not.toBeNull();

      const urgencyIndicator = followUpHeader?.querySelector('.urgency-indicator');
      expect(urgencyIndicator).toBeDefined();
      expect(urgencyIndicator).not.toBeNull();
    });

    it('should have follow-up subject as heading', () => {
      const followUp = createFollowUpCommunication('1', 1, {
        subject: 'Important follow-up task',
      });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const subject = compiled.querySelector('.follow-up-subject');
      expect(subject).toBeDefined();
      expect(subject).not.toBeNull();
      expect(subject?.textContent?.trim()).toBe('Important follow-up task');
    });

    it('should have meta section with icons', () => {
      const followUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const metaSection = compiled.querySelector('.follow-up-meta');
      expect(metaSection).toBeDefined();
      expect(metaSection).not.toBeNull();

      const icons = metaSection?.querySelectorAll('.icon');
      expect(icons).toBeDefined();
      expect(icons && icons.length).toBeGreaterThan(0);
    });
  });

  describe('getBadgeClass Method', () => {
    it('should return lowercase type for badge class', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      expect(component.getBadgeClass('Call')).toBe('call');
      expect(component.getBadgeClass('Email')).toBe('email');
      expect(component.getBadgeClass('Meeting')).toBe('meeting');
      expect(component.getBadgeClass('Chat')).toBe('chat');
      expect(component.getBadgeClass('Other')).toBe('other');
    });
  });

  describe('formatFollowUpDate Method', () => {
    it('should format date without year for current year', () => {
      const today = new Date();
      const followUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const formatted = component.formatFollowUpDate(followUp.followUpDate!);
      // Should be in format like "Nov 6" (no year)
      expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
    });

    it('should include year when date is from different year', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      const followUp = createFollowUpCommunication('1', 1, {
        followUpDate: nextYear.toISOString(),
      });

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const formatted = component.formatFollowUpDate(followUp.followUpDate!);
      // Should include the year when it's different from current year
      expect(formatted).toMatch(/\d{4}$/);
    });
  });

  describe('enrichedFollowUps Computed Signal', () => {
    it('should calculate daysUntil correctly for future dates', () => {
      const followUp = createFollowUpCommunication('1', 3);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].daysUntil).toBe(3);
      expect(enriched[0].isOverdue).toBe(false);
    });

    it('should calculate daysUntil correctly for past dates', () => {
      const followUp = createFollowUpCommunication('1', -3);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].daysUntil).toBe(-3);
      expect(enriched[0].isOverdue).toBe(true);
    });

    it('should set urgencyLevel to critical for 3+ days overdue', () => {
      const followUp = createFollowUpCommunication('1', -5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].urgencyLevel).toBe('critical');
    });

    it('should set urgencyLevel to warning for less than 3 days overdue', () => {
      const followUp = createFollowUpCommunication('1', -1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].urgencyLevel).toBe('warning');
    });

    it('should set urgencyLevel to warning for due within 2 days', () => {
      const followUp = createFollowUpCommunication('1', 1);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].urgencyLevel).toBe('warning');
    });

    it('should set urgencyLevel to normal for due in more than 2 days', () => {
      const followUp = createFollowUpCommunication('1', 5);

      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      const component = fixture.componentInstance;
      fixture.componentRef.setInput('followUps', [followUp]);
      fixture.detectChanges();

      const enriched = component.enrichedFollowUps();
      expect(enriched[0].urgencyLevel).toBe('normal');
    });
  });

  describe('Header and Subtitle', () => {
    it('should display section header', () => {
      TestBed.configureTestingModule({
        imports: [FollowUpCommunicationsComponent],
      });

      const fixture = TestBed.createComponent(FollowUpCommunicationsComponent);
      fixture.componentRef.setInput('followUps', []);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Follow-Ups Required');
    });
  });
});
