import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrls: ['./modal-feedback.component.css']
})
export class ModalFeedbackComponent {
  @Input() title: string = 'Parabéns!';
  @Input() message: string = 'Você ganhou pontos!';
  @Input() image: string = 'assets/lingobot/lingobot-fotogenico-transparente.png';
  @Input() buttonText: string = 'Continuar';
  @Input() isVisible: boolean = false;

  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.onClose.emit();
  }

}
