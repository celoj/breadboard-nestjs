import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import configuration from './config/configuration';
import { PartAggregatorService } from './services/part-aggregator.service';
import { TTIService } from './services/tti.service';
import { ArrowService } from './services/arrow.service';
import { PartResolver } from './resolvers/part.resolver';

// Module decorator
@Module({
  imports: [
    // Make config available globally
    ConfigModule.forRoot({
      isGlobal: true,
      // Custom config
      load: [configuration],
    }),
    // GraphQL module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
    }),
  ],
  providers: [PartAggregatorService, TTIService, ArrowService, PartResolver],
})
export class AppModule {}
