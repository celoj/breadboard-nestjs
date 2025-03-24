import { Module } from '@nestjs/common';
import { PartResolver } from '../resolvers/part.resolver';
import { PartAggregatorService } from '../services/part-aggregator.service';
import { TTIService } from '../services/tti.service';
import { ArrowService } from '../services/arrow.service';

@Module({
  providers: [PartResolver, PartAggregatorService, TTIService, ArrowService],
})
export class PartModule {}
