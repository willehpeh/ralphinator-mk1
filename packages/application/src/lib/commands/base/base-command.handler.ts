import { Inject } from '@nestjs/common';
import { EventSourcedAggregate } from '@angular-nest-starter/domain';
import { IAggregateRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Base class for command handlers that work with event-sourced aggregates.
 * Provides common constructor injection and helper methods for the load-execute-save pattern.
 *
 * @template TCommand - The command type this handler processes
 * @template TAggregate - The aggregate type this handler works with
 * @template TResult - The return type of the command execution (defaults to string for ID)
 */
export abstract class BaseCommandHandler<
  TCommand,
  TAggregate extends EventSourcedAggregate,
  TResult = string
> {
  constructor(
    @Inject(INJECTION_TOKENS.AGGREGATE_REPOSITORY)
    protected readonly aggregateRepository: IAggregateRepository<TAggregate>
  ) {}

  /**
   * Executes the command. Must be implemented by subclasses.
   *
   * @param command - The command to execute
   * @returns The result of the command execution
   */
  abstract execute(command: TCommand): Promise<TResult>;

  /**
   * Helper method to load an aggregate from the event store.
   *
   * @param id - The aggregate ID
   * @param aggregateType - The aggregate class constructor
   * @returns The loaded aggregate
   */
  protected async loadAggregate(
    id: string,
    aggregateType: new () => TAggregate
  ): Promise<TAggregate> {
    return this.aggregateRepository.load(id, aggregateType);
  }

  /**
   * Helper method to save an aggregate to the event store.
   * This persists uncommitted events and publishes them to the event bus.
   *
   * @param aggregate - The aggregate to save
   */
  protected async saveAggregate(aggregate: TAggregate): Promise<void> {
    await this.aggregateRepository.save(aggregate);
  }

  /**
   * Helper method for the common load-execute-save pattern.
   * Loads the aggregate, executes the provided function, and saves the aggregate.
   *
   * @param id - The aggregate ID
   * @param aggregateType - The aggregate class constructor
   * @param executeFn - Function that executes business logic on the aggregate
   * @returns The aggregate ID
   */
  protected async executeOnAggregate(
    id: string,
    aggregateType: new () => TAggregate,
    executeFn: (aggregate: TAggregate) => void
  ): Promise<string> {
    const aggregate = await this.loadAggregate(id, aggregateType);
    executeFn(aggregate);
    await this.saveAggregate(aggregate);
    return id;
  }
}
