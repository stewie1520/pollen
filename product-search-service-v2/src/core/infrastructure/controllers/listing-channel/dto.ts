import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { SaleChannelEnum } from 'src/core/domain/enums';

export class CreateListingChannelInDto {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsEnum(SaleChannelEnum)
  public readonly salesChannel: SaleChannelEnum;

  @IsString()
  @IsNotEmpty()
  public readonly lmsCompanyId: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public readonly listingVariantIds: string[];
}

export class SearchListingChannelInDto {
  @IsString()
  @IsNotEmpty()
  public readonly q: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  public readonly page: number;

  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  public readonly limit: number;
}
