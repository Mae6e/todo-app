import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): { [key: string]: string } {
    return { 'welcome to': 'todo app v1' };
  }
}
