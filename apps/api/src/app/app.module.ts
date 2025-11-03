import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [ClientsModule, ContactsModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
