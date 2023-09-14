import { Module } from "@nestjs/common";
import { WebSocketsGateway } from "./webSockets.gateway";

@Module({
  imports: [],
  providers: [WebSocketsGateway],
})
export class WebSocketsModule {}
