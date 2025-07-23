import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { MessageService as ChatService, ChatRoom } from './message.service';

export interface ChatContext {
  type: 'job_application' | 'proposal' | 'contract' | 'project';
  relatedId: number;
  userId: number;
  userName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatInitiationService {
  private baseUrl = `${ApiConst.API_URL}chats/api/chatrooms/`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private chatService: ChatService
  ) {}

  /**
   * Check if current user can initiate chat with target user in given context
   */
  canInitiateChat(context: ChatContext): Observable<{ can_chat: boolean; reason?: string }> {
    return this.http.post<{ can_chat: boolean; reason?: string }>(`${this.baseUrl}can_initiate_chat/`, {
      target_user_id: context.userId,
      context_type: context.type,
      context_id: context.relatedId
    });
  }

  /**
   * Start a contextual chat (job application, proposal, etc.)
   * Returns an observable with the result
   */
  initiateContextualChat(context: ChatContext): Observable<{ success: boolean; message: string; chatRoom?: ChatRoom }> {
    return new Observable(observer => {
      this.canInitiateChat(context).subscribe({
        next: (response) => {
          if (response.can_chat) {
            this.createOrNavigateToChat(context).subscribe({
              next: (chatRoom) => {
                observer.next({
                  success: true,
                  message: `Chat with ${context.userName || 'user'} has been opened.`,
                  chatRoom
                });
                observer.complete();
              },
              error: (error) => {
                console.error('Error creating chat room:', error);
                observer.next({
                  success: false,
                  message: 'Failed to start chat'
                });
                observer.complete();
              }
            });
          } else {
            observer.next({
              success: false,
              message: response.reason || 'You cannot start a chat with this user in this context.'
            });
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Error checking chat permissions:', error);
          observer.next({
            success: false,
            message: 'Failed to check chat permissions'
          });
          observer.complete();
        }
      });
    });
  }

  /**
   * Create or navigate to existing chat room
   */
  private createOrNavigateToChat(context: ChatContext): Observable<ChatRoom> {
    return new Observable(observer => {
      this.chatService.getOrCreateChatRoomWithUser(context.userId).subscribe({
        next: (chatRoom: ChatRoom) => {
          // Navigate to the chat room
          this.router.navigate(['/dashboard/messages', chatRoom.id]);
          observer.next(chatRoom);
          observer.complete();
        },
        error: (error) => {
          console.error('Error creating chat room:', error);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Quick chat initiation for job applicants (for clients)
   */
  chatWithJobApplicant(jobId: number, applicantId: number, applicantName?: string): Observable<{ success: boolean; message: string; chatRoom?: ChatRoom }> {
    const context: ChatContext = {
      type: 'job_application',
      relatedId: jobId,
      userId: applicantId,
      userName: applicantName
    };
    return this.initiateContextualChat(context);
  }

  /**
   * Chat initiation for job poster (for freelancers)
   */
  chatWithJobPoster(jobId: number, clientId: number, clientName?: string): Observable<{ success: boolean; message: string; chatRoom?: ChatRoom }> {
    const context: ChatContext = {
      type: 'job_application',
      relatedId: jobId,
      userId: clientId,
      userName: clientName
    };
    return this.initiateContextualChat(context);
  }

  /**
   * Chat for active contracts
   */
  chatWithContractParty(contractId: number, userId: number, userName?: string): Observable<{ success: boolean; message: string; chatRoom?: ChatRoom }> {
    const context: ChatContext = {
      type: 'contract',
      relatedId: contractId,
      userId: userId,
      userName: userName
    };
    return this.initiateContextualChat(context);
  }

  /**
   * Chat for project discussions
   */
  chatWithProjectParty(projectId: number, userId: number, userName?: string): Observable<{ success: boolean; message: string; chatRoom?: ChatRoom }> {
    const context: ChatContext = {
      type: 'project',
      relatedId: projectId,
      userId: userId,
      userName: userName
    };
    return this.initiateContextualChat(context);
  }
}
