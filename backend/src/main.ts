import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors';

export class EnvironmentVariables {
    public readonly API_PREFIX: string;

    public readonly SERVER_PORT: number;
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // TODO: Validate
    const configService: ConfigService<EnvironmentVariables, true> = app.get(ConfigService<EnvironmentVariables, true>);
    const apiPrefix = configService.get<string>('API_PREFIX');
    const serverPort = configService.get<string>('SERVER_PORT');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            transform: true,
        }),
    );
    app.setGlobalPrefix(apiPrefix);
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.useGlobalInterceptors(new LoggingInterceptor());

    const config = new DocumentBuilder().setTitle('ERC20 Task').setDescription('ERC20 Task description').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config, {
        include: [AppModule],
        deepScanRoutes: true,
    });

    SwaggerModule.setup('api/docs', app, document);
    await app.listen(serverPort);
}
bootstrap();
