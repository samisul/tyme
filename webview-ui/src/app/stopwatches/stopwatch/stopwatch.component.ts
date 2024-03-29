import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { Prefs } from "src/app/prefs/prefs.model";
import { FormattedDatePipe } from "../../ui/pipes/formatted-date.pipe";
import { Stopwatch } from "../stopwatch.model";
import { StopwatchesService } from "../stopwatches.service";
import { StopwatchElapsedPipe } from "./stopwatch-elapsed.pipe";
import { StopwatchStatusPipe } from "./stopwatch-status.pipe";
import { StopwatchStatusService } from "./stopwatch-status.service";

provideVSCodeDesignSystem().register(vsCodeTag);

@Component({
  template: `
    @if ($stopwatch()) {
    <div class="container">
      <div class="row">
        <div class="actions">
          <vscode-button appearance="icon" (click)="onRemove()">
            <span class="icon"><i class="codicon codicon-remove"></i></span>
          </vscode-button>
          <vscode-button appearance="icon" (click)="onEdit()">
            <span class="icon"><i class="codicon codicon-edit"></i></span>
          </vscode-button>
          @if (!$stopwatch().isStopped) {
          <vscode-button appearance="icon" (click)="onStop()">
            <span class="icon"><i class="codicon codicon-stop-circle"></i></span>
          </vscode-button>
          } @if (!$stopwatch().isPaused && !$stopwatch().isStopped) {
          <vscode-button appearance="icon" (click)="onPause()">
            <span class="icon"><i class="codicon codicon-debug-pause"></i></span>
          </vscode-button>
          } @if ($stopwatch().isPaused && !$stopwatch().isStopped) {
          <vscode-button appearance="secondary" (click)="onResume()">
            <span class="icon"><i class="codicon codicon-play-circle"></i></span>
          </vscode-button>
          }
        </div>
        <div class="tags">
          <vscode-tag>{{ $stopwatch() | stopwatchStatus }}</vscode-tag>
          @if($prefs().showPauses){
          <vscode-tag>{{ $stopwatch().pauses }} pauses</vscode-tag>
          }
        </div>
        <h3>
          {{
            $stopwatch().name.length > 21
              ? ($stopwatch().name | slice: 0 : 18) + "..."
              : $stopwatch().name
          }}
        </h3>
      </div>
      <p>
        Elapsed: {{ ($stopwatch() | stopwatchElapsed | async)?.formatted }} | Created at:
        {{ $stopwatch().createdAt | formattedDate }}
      </p>
      @if($stopwatch().desc){
      <div class="row desc">
        <h4>{{ $stopwatch().desc }}</h4>
      </div>
      }
    </div>
    }
  `,
  styles: [
    `
      .tags > :first-child {
        margin-inline-end: 0.3rem;
      }

      .row.desc {
        width: 50%;
        white-space: pre-line;
      }

      .container {
        display: flex;
        flex-direction: column;
        margin-block-end: 3rem;
        align-items: flex-start;
      }

      .container > .row:first-child {
        justify-content: space-between;
      }

      vscode-button {
        margin-inline: 0.3rem;
        width: 42px;
        height: 27px;
      }

      .actions {
        display: flex;
        align-items: center;
      }
    `,
  ],
  imports: [StopwatchStatusPipe, StopwatchElapsedPipe, CommonModule, FormattedDatePipe],
  selector: "app-stopwatch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchComponent {
  private readonly service = inject(StopwatchesService);
  private readonly statusService = inject(StopwatchStatusService);

  $stopwatch = input.required<Stopwatch>({ alias: "stopwatch" });
  $prefs = input.required<Prefs>({ alias: "prefs" });

  onEdit(): void {
    this.service.bufferStopwatch$.next(this.$stopwatch());
  }

  onRemove(): void {
    this.service.remove$(this.$stopwatch()?.id).subscribe();
  }

  onStop(): void {
    this.service.update$(this.statusService.stop([this.$stopwatch()])).subscribe();
  }

  onPause(): void {
    this.service.update$(this.statusService.pause([this.$stopwatch()])).subscribe();
  }

  onResume(): void {
    this.service.update$(this.statusService.resume([this.$stopwatch()])).subscribe();
  }
}
