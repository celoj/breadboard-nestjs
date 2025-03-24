import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { AggregatedPart, Packaging, PriceBreak } from '../types/part.types';
import * as ttiData from '../../api/tti.json';

@Injectable()
export class TTIService {
  getPartData(partNumber: string): Partial<AggregatedPart> {
    // In a real implementation, this would be an API call
    const parts = get(ttiData, 'parts', []);
    const part = parts.find((p) => p.manufacturerPartNumber === partNumber);

    if (!part) {
      return {} as Partial<AggregatedPart>;
    }

    const packaging: Packaging = {
      type: get(part, 'packaging', 'unspecified'),
      minimumOrderQuantity: get(part, 'salesMinimum', 0),
      quantityAvailable: get(part, 'availableToSell', 0),
      unitPrice: parseFloat(get(part, 'pricing.vipPrice', '0')),
      supplier: 'TTI',
      priceBreaks: this.transformPriceBreaks(
        get(part, 'pricing.quantityPriceBreaks', []),
      ),
      manufacturerLeadTime: get(part, 'leadTime', ''),
    };

    return {
      name: get(part, 'ttiPartNumber', ''),
      description: get(part, 'description', ''),
      totalStock: get(part, 'availableToSell', 0),
      manufacturerLeadTime: this.parseLeadTime(get(part, 'leadTime', '')),
      manufacturerName: get(part, 'manufacturer', ''),
      packaging: [packaging],
      productDoc: get(part, 'datasheetURL', ''),
      productUrl: get(part, 'buyUrl', ''),
      productImageUrl: get(part, 'imageURL', ''),
      specifications: {
        rohs: get(part, 'roHsStatus', ''),
        category: get(part, 'category', ''),
        hts: get(part, 'hts', ''),
        exportInfo: get(part, 'exportInformation', {}),
        environmental: get(part, 'environmentalInformation', {}),
      },
      sourceParts: ['TTI'],
    };
  }

  private transformPriceBreaks(breaks: any[]): PriceBreak[] {
    return breaks.map((priceBreak) => ({
      breakQuantity: get(priceBreak, 'quantity', 0),
      unitPrice: parseFloat(get(priceBreak, 'price', '0')),
      totalPrice:
        get(priceBreak, 'quantity', 0) *
        parseFloat(get(priceBreak, 'price', '0')),
    }));
  }

  private parseLeadTime(leadTime: string): number {
    const match = leadTime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
