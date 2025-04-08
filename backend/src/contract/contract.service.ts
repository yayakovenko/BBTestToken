import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    createPublicClient,
    createWalletClient,
    http,
    PublicClient,
    PublicActions,
    getContract,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat, mainnet } from 'viem/chains';

import { ContractError } from '../common';

// @TODO: Move to external common library
import { tokenABI } from './abis';
import { BalanceRequestDto, TokenInfo, TransferFromDto } from './dto';

@Injectable()
export class ContractService implements OnModuleInit {
    private readonly logger = new Logger(ContractService.name);

    private contract: any;
    private chainId: number;
    private tokenAddress: `0x${string}`;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const chain = this.configService.get<string>('ENVIRONMENT') === 'local' ? hardhat : mainnet;
        this.chainId = chain.id;

        const rpcUrl = this.configService.get<string>('RPC_URL');
        this.tokenAddress = this.configService.get<string>('TOKEN_CONTRACT_ADDRESS') as `0x${string}`;

        const publicClient = createPublicClient({
            chain,
            transport: http(rpcUrl),
        }) as PublicClient & PublicActions;

        const privateKey = this.configService.get<string>('PRIVATE_KEY');
        const account = privateKeyToAccount(privateKey as `0x${string}`);

        const walletClient = createWalletClient({
            chain,
            transport: http(rpcUrl),
            account,
        });

        this.contract = getContract({
            address: this.tokenAddress,
            abi: tokenABI,
            client: {
                public: publicClient,
                wallet: walletClient,
            },
        });
    }

    async getTokenInfo(): Promise<TokenInfo> {
        try {
            const [name, symbol, totalSupply] = await Promise.all([
                this.readContract<string>('name'),
                this.readContract<string>('symbol'),
                this.readContract<string>('totalSupply'),
            ]);

            return {
                name,
                symbol,
                totalSupply,
            };
        } catch (error) {
            this.logger.error(`Failed to get token info`, { err: error as Error });
            throw new ContractError(`Failed to get token info`);
        }
    }

    public async getBalance(dto: BalanceRequestDto): Promise<string> {
        const { address } = dto;
        try {
            return await this.readContract<string>('balanceOf', address);
        } catch (error) {
            this.logger.error(`Failed to get balance`, { err: error as Error, dto });
            throw new ContractError(`Failed to get balance`);
        }
    }

    public async getTransferPermitData(): Promise<unknown> {
        const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        const nonce = await this.readContract<string>('nonces', address);

        const domain = {
            name: await this.readContract<string>('name'),
            version: '1',
            chainId: this.chainId,
            verifyingContract: this.tokenAddress
        };
        const types = {
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
            ],
        };

        const value = {
            owner: address,
            spender: owner,
            nonce,
            deadline,
        };

        return {domain, types, value};
    }

    public async transferFrom(transferDto: TransferFromDto): Promise<string> {
        return await this.contract.write.transferFromWithPermit([
            transferDto.owner,
            transferDto.to,
            transferDto.amountInWei,
            transferDto.deadline,
            transferDto.v,
            transferDto.r,
            transferDto.s,
        ]);
    }

    private async readContract<T>(functionName: string, ...args: unknown[]): Promise<T> {
        return (await this.contract.read[functionName](args)) as Promise<T>;
    }
}
