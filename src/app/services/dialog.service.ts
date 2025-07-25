import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogLine {
  speaker?: string;
  text: string;
  expression?: string;
  isFinal?: boolean;
}

export interface Dialog {
  id?: string;
  lines: DialogLine[];
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private currentDialog: Dialog | null = null;
  private currentIndex = 0;

  private currentLineSubject = new BehaviorSubject<DialogLine | null>(null);
  currentLine$ = this.currentLineSubject.asObservable();

  get isActive(): boolean {
    return this.currentDialog !== null;
  }

  get isFinalDialog(): boolean {
    const line = this.currentDialog?.lines[this.currentIndex];
    return line?.isFinal === true;
  }

  get activeDialogId(): string | null {
    console.log(this.currentDialog?.id);
    return this.currentDialog?.id ?? null;
  }

  get fullDialog(): Dialog | null {
    console.log(this.currentDialog);
    return this.currentDialog;
  }

  startDialog(dialogOrLines: Dialog | DialogLine[]) {
    if (Array.isArray(dialogOrLines)) {
      // Se for um array de linhas, cria um Dialog sem ID
      this.currentDialog = { lines: dialogOrLines };
    } else {
      this.currentDialog = dialogOrLines;
    }

    this.currentIndex = 0;
    this.updateCurrentLine();
  }

  nextDialog() {
    if (!this.currentDialog) return;

    if (this.currentIndex < this.currentDialog.lines.length - 1) {
      this.currentIndex++;
      this.updateCurrentLine();
    } else {
      this.endDialog();
    }
  }

  prevDialog() {
    if (!this.currentDialog) return;

    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCurrentLine();
    }
  }

  endDialog() {
    this.currentDialog = null;
    this.currentIndex = 0;
    this.currentLineSubject.next(null);
  }

  private updateCurrentLine() {
    const line = this.currentDialog?.lines[this.currentIndex] ?? null;
    this.currentLineSubject.next(line);
  }
}
