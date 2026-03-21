import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MqttController {
  @MessagePattern('application/#')
  handleChirpstackEvent(@Payload() message: any) {
    console.log('Received ChirpStack event:', message);
    return { ack: true };
  }

  @MessagePattern('au915_0/gateway/+/command/+')
  handleGatewayCommand(@Payload() message: any) {
    console.log('Received gateway command:', message);
    return { ack: true };
  }
}
