# Developer CRM - Project Requirements

## What to Build

Build a CRM (Customer Relationship Management) system designed for software developers, freelancers, and small development agencies to manage their clients and projects.

## Who It's For

Software developers and small teams who need to track clients, contacts, projects, tasks, and communications in one place.

## Core Capabilities

The system must allow users to:

1. **Manage Clients** - Track companies and individuals you work with, including contact details, status, and notes

2. **Manage Contacts** - Track individual people at client companies with their roles and contact information

3. **Manage Projects** - Track development projects for clients, including status, dates, budgets, and technical details

4. **Manage Tasks** - Create and track action items related to projects and clients with priorities and due dates

5. **Log Communications** - Record all interactions (calls, emails, meetings) with clients and contacts, including follow-up requirements

6. **View Dashboard** - See an overview of active work, upcoming tasks, and recent activity at a glance

## Functional Requirements

### Clients
- Create, update, and view client records
- Track client status (Active, Inactive, Prospect, Past Client)
- Associate multiple contacts with each client
- Associate multiple projects with each client
- View client history and communications
- Search and filter clients

### Contacts  
- Create, update, and view contact records
- Associate contacts with a client
- Track contact details (name, role, email, phone)
- View all contacts for a client
- Search and filter contacts

### Projects
- Create, update, and view project records
- Associate projects with a client
- Track project status (Planning, Active, On Hold, Completed, Cancelled)
- Track dates (start, expected end, actual end)
- Track budget/estimated value
- Associate tasks with projects
- View project timeline and history
- Search and filter projects

### Tasks
- Create, update, and complete tasks
- Associate tasks with projects and/or clients
- Track status (Todo, In Progress, Completed, Cancelled)
- Track priority (Low, Medium, High, Urgent)
- Set and track due dates
- View tasks by various filters (status, priority, due date, project, client)
- Identify overdue tasks

### Communications
- Log communications (calls, emails, meetings, etc.)
- Associate communications with clients, contacts, and projects
- Track communication type and date/time
- Add notes and summaries
- Flag communications requiring follow-up
- Set follow-up dates
- View communication history for clients
- Search and filter communications

### Dashboard
- Display counts of active clients and projects
- Show upcoming and overdue tasks
- Display recent communications
- Show items requiring follow-up
- Provide quick access to common actions

## Key Relationships

- A client can have many contacts
- A client can have many projects
- A client can have many communications
- A project belongs to one client
- A project can have many tasks
- A task can belong to one project (optional)
- A task can relate to one client (optional)
- A communication relates to one client
- A communication can relate to one contact (optional)
- A communication can relate to one project (optional)

## User Interface Requirements

- Responsive web interface
- List views with filtering and sorting
- Detail views showing related data
- Forms for creating and editing records
- Search functionality
- Clear navigation between related entities
- Confirmation for destructive actions

## Constraints

- No authentication required initially (single-user or trusted environment)
- Must be self-contained and runnable locally
- Should focus on core functionality without overengineering

## Success Criteria

The project is complete when a developer can:
- Manage their complete client list
- Track all contacts at client companies
- Monitor project status and progress
- Organize tasks and identify what's due
- Maintain a history of all client communications
- Navigate easily between related information
- Access everything through both an API and web interface
