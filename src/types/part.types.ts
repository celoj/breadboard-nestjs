import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

export type SupplierName = 'Arrow' | 'TTI';

@ObjectType()
export class PriceBreak {
  @Field(() => Int)
  breakQuantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  totalPrice: number;
}

@ObjectType()
export class Packaging {
  @Field()
  type: string;

  @Field(() => Int)
  minimumOrderQuantity: number;

  @Field(() => Int)
  quantityAvailable: number;

  @Field(() => Float)
  unitPrice: number;

  @Field()
  supplier: SupplierName;

  @Field(() => [PriceBreak])
  priceBreaks: PriceBreak[];

  @Field({ nullable: true })
  manufacturerLeadTime?: string;
}

@ObjectType()
export class ExportControlInfo {
  @Field(() => String, { nullable: true })
  us?: string;

  @Field(() => String, { nullable: true })
  was?: string;
}

@ObjectType()
export class Specifications {
  @Field(() => String, { nullable: true })
  resistance?: string;

  @Field(() => String, { nullable: true })
  tolerance?: string;

  @Field(() => String, { nullable: true })
  powerRating?: string;

  @Field(() => String, { nullable: true })
  temperatureCoefficient?: string;

  @Field(() => String, { nullable: true })
  composition?: string;

  @Field(() => String, { nullable: true })
  features?: string;

  @Field(() => String, { nullable: true })
  mountingType?: string;

  @Field(() => String, { nullable: true })
  package?: string;

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => String, { nullable: true })
  series?: string;

  @Field(() => String, { nullable: true })
  partStatus?: string;

  @Field(() => String, { nullable: true })
  temperatureRange?: string;

  @Field(() => String, { nullable: true })
  voltage?: string;

  @Field(() => String, { nullable: true })
  capacitance?: string;

  @Field(() => String, { nullable: true })
  inductance?: string;

  @Field(() => String, { nullable: true })
  current?: string;

  @Field(() => String, { nullable: true })
  rohs?: string;

  @Field(() => String, { nullable: true })
  countryOfOrigin?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  dateCode?: string;

  @Field(() => String, { nullable: true })
  hts?: string;

  @Field(() => String, { nullable: true })
  exportInfo?: string;

  @Field(() => String, { nullable: true })
  environmentalInfo?: string;

  @Field(() => ExportControlInfo, { nullable: true })
  exportControlInfo?: ExportControlInfo;

  @Field(() => String, { nullable: true })
  environmental?: string;
}

@ObjectType()
export class AggregatedPart {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  totalStock: number;

  @Field(() => Int)
  manufacturerLeadTime: number;

  @Field()
  manufacturerName: string;

  @Field(() => [Packaging])
  packaging: Packaging[];

  @Field()
  productDoc: string;

  @Field()
  productUrl: string;

  @Field()
  productImageUrl: string;

  @Field(() => Specifications)
  specifications: Specifications;

  @Field(() => [String])
  sourceParts: SupplierName[];
}
