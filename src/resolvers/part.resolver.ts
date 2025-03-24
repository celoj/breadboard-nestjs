import { Resolver, Query, Args } from '@nestjs/graphql';
import { AggregatedPart } from '../types/part.types';
import { PartAggregatorService } from '../services/part-aggregator.service';

@Resolver(() => AggregatedPart)
export class PartResolver {
  constructor(private readonly partAggregatorService: PartAggregatorService) {}

  @Query(() => AggregatedPart, { nullable: true })
  async aggregatedPart(
    @Args('partNumber') partNumber: string,
  ): Promise<AggregatedPart | null> {
    return this.partAggregatorService.getAggregatedPartData(partNumber);
  }
}
