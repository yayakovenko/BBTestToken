import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ContractService } from './contract.service';
import { BalanceRequestDto, TokenInfo, TransferFromDto } from './dto';

@Controller('contract')
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    @Get('info')
    @ApiOperation({ summary: 'Contract info' })
    @ApiOkResponse({ type: TokenInfo })
    public async getTokenInfo(): Promise<TokenInfo> {
        return this.contractService.getTokenInfo();
    }

    @Get('balance')
    @ApiOperation({ summary: 'Balance of address' })
    @ApiOkResponse({ type: String })
    public async getBalance(@Query() address: BalanceRequestDto): Promise<string> {
        return this.contractService.getBalance(address);
    }

    @Post('transfer/permit')
    @ApiOperation({ summary: 'Get data for sign permit' })
    @ApiOkResponse({ type: String })
    async getTransferPermitData(): Promise<unknown> {
        return this.contractService.getTransferPermitData();
    }

    @Post('transfer')
    @ApiOperation({ summary: 'Transfer from with permit' })
    @ApiOkResponse({ type: String })
    async transferFrom(@Body() transferDto: TransferFromDto): Promise<string> {
        return this.contractService.transferFrom(transferDto);
    }
}
