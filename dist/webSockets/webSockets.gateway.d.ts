import { OnModuleInit } from '@nestjs/common';
export declare class WebSocketsGateway implements OnModuleInit {
    private server;
    onModuleInit(): void;
    onmessage(body: any): void;
}
