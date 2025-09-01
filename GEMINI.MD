basic_rules=Você não pode apagar nada sem permissão.
response_language=pt-br

current_problem_context=
<!-- Reward Alert -->
<div *ngIf="showRewardAlert" class="reward-alert" [ngClass]="rewardAlertClass">
  <img src="assets/lingobot/itens/gemas.webp" alt="Gemas" class="gem-icon">
  <span class="reward-text">+ {{ currentRewardAmount }}</span>
</div>

