/** @format */

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { SendCredentialsDto } from './dto/send-credentials.dto';
import { SendTaskDto } from './dto/send-task.dto';

import { EmailService } from './email.service';

@Controller('email')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  /* ================================================= */
  /* 🧪 TEST: SEND CREDENTIAL EMAIL                    */
  /* ================================================= */

  @Post('test-credentials')
  async sendCredentials(@Body() body: SendCredentialsDto) {
    try {
      const result = await this.emailService.sendEmployeeCredentials(
        body.email,
        body.name,
        body.employeeId,
        body.password,
      );

      return {
        success: true,
        message: 'Credentials email sent successfully',
        smtp: result,
      };
    } catch (error: any) {
      this.logger.error('Credentials Email Failed', error?.message);

      throw new HttpException(
        {
          success: false,
          message: 'Failed to send credentials email',
          error: error?.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* ================================================= */
  /* 🧪 TEST: SEND TASK EMAIL                          */
  /* ================================================= */

  @Post('test-task')
  async sendTask(@Body() body: SendTaskDto) {
    try {
      const result = await this.emailService.sendTaskAssignmentEmail(
        body.email,
        body.name,
        body.title,
        body.description,
        body.deadline,
        body.priority,
      );

      return {
        success: true,
        message: 'Task email sent successfully',
        smtp: result,
      };
    } catch (error: any) {
      this.logger.error('Task Email Failed', error?.message);

      throw new HttpException(
        {
          success: false,
          message: 'Failed to send task email',
          error: error?.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
