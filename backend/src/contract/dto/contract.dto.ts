import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class TokenInfo {
    @ApiProperty({ type: 'string', nullable: false })
    public readonly name: string;

    @ApiProperty({ type: 'string', nullable: false })
    public readonly symbol: string;

    @ApiProperty({ type: 'string', nullable: false })
    public readonly totalSupply: string;
}

export class BalanceRequestDto {
    @ApiProperty({ type: 'string', example: '0x5FbDB2315678afecb367f032d93F642f64180aa3' })
    @IsEthereumAddress()
    @IsNotEmpty()
    public readonly address: string;
}

export class TransferFromDto {
    @ApiProperty({ type: 'string', example: '0x5FbDB2315678afecb367f032d93F642f64180aa3' })
    @IsEthereumAddress()
    @IsNotEmpty()
    public readonly owner: string;

    @ApiProperty({ type: 'string', example: '0x5FbDB2315678afecb367f032d93F642f64180aa3' })
    @IsEthereumAddress()
    @IsNotEmpty()
    public readonly to: string;

    @ApiProperty({ type: 'string', example: '1000000000000000000' })
    @IsNumberString()
    @IsNotEmpty()
    public readonly amountInWei: string;

    @ApiProperty({ type: 'string', example: '1744120478767' })
    @IsNumber()
    @IsNotEmpty()
    public readonly deadline: number;

    @ApiProperty({ type: 'string', example: '12' })
    @IsNumber()
    @IsNotEmpty()
    public readonly v: number;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    public readonly r: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    public readonly s: string;
}
