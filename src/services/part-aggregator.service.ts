import { Injectable } from '@nestjs/common';
import { AggregatedPart, Specifications } from '../types/part.types';
import { TTIService } from './tti.service';
import { ArrowService } from './arrow.service';

@Injectable()
export class PartAggregatorService {
  constructor(
    private readonly ttiService: TTIService,
    private readonly arrowService: ArrowService,
  ) {}

  async getAggregatedPartData(partNumber: string): Promise<AggregatedPart> {
    // Fetch data from all suppliers in parallel
    const [ttiData, arrowData] = await Promise.all([
      this.ttiService.getPartData(partNumber),
      this.arrowService.getPartData(partNumber),
    ]);

    if (!ttiData && !arrowData) {
      return {} as AggregatedPart;
    }

    // Use TTI data as base if available, otherwise use Arrow data
    const baseData = ttiData || arrowData;

    // Combine data from both sources
    return {
      name: baseData.name || '',
      description: baseData.description || '',
      totalStock: this.calculateTotalStock(ttiData, arrowData),
      manufacturerLeadTime: this.calculateShortestLeadTime(ttiData, arrowData),
      manufacturerName: baseData.manufacturerName || '',
      packaging: this.combinePackaging(ttiData, arrowData),
      productDoc: baseData.productDoc || '',
      productUrl: baseData.productUrl || '',
      productImageUrl: baseData.productImageUrl || '',
      specifications: this.combineSpecifications(ttiData, arrowData),
      sourceParts: this.combineSources(ttiData, arrowData),
    };
  }

  private calculateTotalStock(
    ttiData: Partial<AggregatedPart>,
    arrowData: Partial<AggregatedPart>,
  ): number {
    const { totalStock: arrowTotalStock = 0 } = arrowData;
    const { totalStock: ttiTotalStock = 0 } = ttiData;

    return ttiTotalStock + arrowTotalStock;
  }

  private calculateShortestLeadTime(
    ttiData: Partial<AggregatedPart>,
    arrowData: Partial<AggregatedPart>,
  ): number {
    const leadTimes = [
      ttiData?.manufacturerLeadTime ?? 0,
      arrowData?.manufacturerLeadTime ?? 0,
    ].filter((lt) => lt > 0);

    return leadTimes.length ? Math.min(...leadTimes) : 0;
  }

  private combinePackaging(
    ttiData: Partial<AggregatedPart>,
    arrowData: Partial<AggregatedPart>,
  ) {
    return [...(ttiData?.packaging || []), ...(arrowData?.packaging || [])];
  }

  private combineSpecifications(
    ttiData: Partial<AggregatedPart>,
    arrowData: Partial<AggregatedPart>,
  ): Specifications {
    const ttiSpecs = ttiData?.specifications || {};
    const arrowSpecs = arrowData?.specifications || {};

    return {
      resistance: ttiSpecs.resistance || arrowSpecs.resistance,
      tolerance: ttiSpecs.tolerance || arrowSpecs.tolerance,
      powerRating: ttiSpecs.powerRating || arrowSpecs.powerRating,
      temperatureCoefficient: ttiSpecs.temperatureCoefficient || arrowSpecs.temperatureCoefficient,
      composition: ttiSpecs.composition || arrowSpecs.composition,
      features: ttiSpecs.features || arrowSpecs.features,
      mountingType: ttiSpecs.mountingType || arrowSpecs.mountingType,
      package: ttiSpecs.package || arrowSpecs.package,
      size: ttiSpecs.size || arrowSpecs.size,
      series: ttiSpecs.series || arrowSpecs.series,
      partStatus: ttiSpecs.partStatus || arrowSpecs.partStatus,
      temperatureRange: ttiSpecs.temperatureRange || arrowSpecs.temperatureRange,
      voltage: ttiSpecs.voltage || arrowSpecs.voltage,
      capacitance: ttiSpecs.capacitance || arrowSpecs.capacitance,
      inductance: ttiSpecs.inductance || arrowSpecs.inductance,
      current: ttiSpecs.current || arrowSpecs.current,
      rohs: ttiSpecs.rohs || arrowSpecs.rohs,
      countryOfOrigin: ttiSpecs.countryOfOrigin || arrowSpecs.countryOfOrigin,
      category: ttiSpecs.category || arrowSpecs.category,
      dateCode: ttiSpecs.dateCode || arrowSpecs.dateCode,
      hts: ttiSpecs.hts || arrowSpecs.hts,
      exportInfo: ttiSpecs.exportInfo || arrowSpecs.exportInfo,
      environmentalInfo: ttiSpecs.environmentalInfo || arrowSpecs.environmentalInfo,
      exportControlInfo: ttiSpecs.exportControlInfo || arrowSpecs.exportControlInfo,
      environmental: ttiSpecs.environmental || arrowSpecs.environmental,
    };
  }

  private combineSources(
    ttiData: Partial<AggregatedPart>,
    arrowData: Partial<AggregatedPart>,
  ) {
    const sources = new Set<'Arrow' | 'TTI'>();
    if (ttiData) sources.add('TTI');
    if (arrowData) sources.add('Arrow');
    return Array.from(sources);
  }
}
