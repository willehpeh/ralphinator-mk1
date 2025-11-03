# Bugs

1. **API Build Error in contacts.controller.ts:31** - UpdateContactDto missing clientId property
   - Error: `Property 'clientId' does not exist on type 'UpdateContactDto'.`
   - Location: `apps/api/src/app/contacts/contacts.controller.ts:31`
   - The UpdateContact endpoint is trying to access `dto.clientId` but the DTO doesn't include this field
