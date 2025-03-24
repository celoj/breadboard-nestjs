import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { AggregatedPart, Packaging, PriceBreak } from '../types/part.types';
import * as arrowData from '../../api/myarrow.json';

@Injectable()
export class ArrowService {
  getPartData(partNumber: string): Partial<AggregatedPart> {
    // In a real implementation, this would be an API call
    const results = get(arrowData, 'pricingResponse', []);
    const parts = results.filter((p) => get(p, 'partNumber') === partNumber);

    if (!parts.length) {
      return {} as Partial<AggregatedPart>;
    }

    // Combine data from all warehouses
    const totalStock = parts.reduce(
      (sum: number, part: any) => sum + parseInt(get(part, 'fohQuantity', '0'), 10),
      0,
    );
    const leadTimes = parts
      .map((part) => get(part, 'leadTime.supplierLeadTime', 0))
      .filter((lt) => lt > 0);
    const shortestLeadTime = leadTimes.length ? Math.min(...leadTimes) : 0;

    // Get packaging information from all warehouses
    const packaging: Packaging[] = parts.map((part) => ({
      type: get(part, 'pkg', 'unspecified'),
      minimumOrderQuantity: get(part, 'minOrderQuantity', 0),
      quantityAvailable: parseInt(get(part, 'fohQuantity', '0'), 10),
      unitPrice: parseFloat(get(part, 'resalePrice', '0')),
      supplier: 'Arrow',
      priceBreaks: this.transformPriceBreaks(get(part, 'pricingTier', [])),
      manufacturerLeadTime: `${get(part, 'leadTime.supplierLeadTime', 0)} days`,
    }));

    // Use first part for general information
    const firstPart = parts[0];
    return {
      name: get(firstPart, 'partNumber', ''),
      description: get(firstPart, 'description', ''),
      totalStock,
      manufacturerLeadTime: shortestLeadTime,
      manufacturerName: get(firstPart, 'manufacturer', ''),
      packaging,
      productDoc: this.findUrl(get(firstPart, 'urlData', []), 'Datasheet'),
      productUrl: this.findUrl(get(firstPart, 'urlData', []), 'Part Details'),
      productImageUrl: this.findUrl(
        get(firstPart, 'urlData', []),
        'Image Large',
      ),
      specifications: {
        rohs: get(firstPart, 'euRohs', ''),
        countryOfOrigin: get(firstPart, 'countryOfOrigin', ''),
        dateCode: get(firstPart, 'dateCode', ''),
        exportControlInfo: {
          us: get(firstPart, 'exportControlClassificationNumberUS', ''),
          was: get(firstPart, 'exportControlClassificationNumberWAS', ''),
        },
      },
      sourceParts: ['Arrow'],
    };
  }

  private transformPriceBreaks(breaks: any[]): PriceBreak[] {
    return breaks.map((priceBreak) => ({
      breakQuantity: parseInt(get(priceBreak, 'minQuantity', '0'), 10),
      unitPrice: parseFloat(get(priceBreak, 'resalePrice', '0')),
      totalPrice:
        parseInt(get(priceBreak, 'minQuantity', '0'), 10) *
        parseFloat(get(priceBreak, 'resalePrice', '0')),
    }));
  }

  private findUrl(urlData: any[], type: string): string {
    const urlEntry = urlData.find((entry) => get(entry, 'type') === type);
    return get(urlEntry, 'value', '');
  }
}
