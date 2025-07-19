import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateListingVariantNameInDto {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}
