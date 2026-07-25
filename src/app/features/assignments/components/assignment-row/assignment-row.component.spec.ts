import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AssignmentRowComponent } from './assignment-row.component';
import { DecoratedAssignment } from '../../models/assignment.model';

function makeAssignment(due: string): DecoratedAssignment {
  return {
    id: 'a1',
    title: 'Board deck',
    context: 'Fundraising',
    due,
    hot: false,
    tasks: [],
    doneCount: 1,
    totalCount: 4,
    percentComplete: 25,
    status: 'In progress',
    taskCountLabel: '1/4',
    tagBg: 'var(--accent-soft)',
    tagColor: 'var(--accent-ink)',
    statusBg: 'var(--accent-soft)',
    statusColor: 'var(--accent-ink)',
    barColor: 'var(--accent)',
    dueColor: 'var(--ink-4)',
  };
}

describe('AssignmentRowComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignmentRowComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('derives the day number and uppercase month abbreviation from the due date', () => {
    const fixture = TestBed.createComponent(AssignmentRowComponent);
    fixture.componentRef.setInput('assignment', makeAssignment('2026-03-05T00:00:00.000Z'));
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance['month']()).toBe('MAR');
    expect(typeof instance['day']()).toBe('number');
  });
});
