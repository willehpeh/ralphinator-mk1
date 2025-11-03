import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [ClientsModule, ContactsModule, ProjectsModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
