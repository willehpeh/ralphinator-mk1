import { ProjectDataPayload } from './project-data.payload';

export class CreateProjectCommand {
  constructor(
    public readonly id: string,
    public readonly data: ProjectDataPayload
  ) {}
}
