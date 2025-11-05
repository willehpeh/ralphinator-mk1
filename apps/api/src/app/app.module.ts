import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommunicationsModule } from './communications/communications.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ClientsModule, ContactsModule, ProjectsModule, TasksModule, CommunicationsModule, DashboardModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
