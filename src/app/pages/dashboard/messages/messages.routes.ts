import { Routes } from '@angular/router';

export const messagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./message-list/message-list.component').then(m => m.MessageListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./chat-room/chat-room.component').then(m => m.ChatRoomComponent)
      }
    ]
  }
]; 