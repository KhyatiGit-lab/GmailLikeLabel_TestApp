import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { Label } from './Models/label.model';
import { LabelService } from './Services/label.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridModule, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GmailLikeLabel_TestApp-ui';
  labels: Label[] = [];
  newLabel: Label = { name: '', colorHex: '#cccccc', description: '' };
  showLabelForm = false;
  editingLabel: Label | null = null;

  constructor(
    private labelService: LabelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels() {
    this.labelService.getAllLabels().subscribe((data) => {
      this.labels = (data as any).$values || data;
    });
  }

  saveLabel() {
    const labelToSend = {
      id: this.newLabel.id,
      name: this.newLabel.name,
      colorHex: this.newLabel.colorHex,
      description: this.newLabel.description,
    };

    if (!this.newLabel.id) {
      this.labelService.createLabel(labelToSend).subscribe({
        next: () => {
          this.loadLabels();
          this.labelService.notifyLabelChange();
          this.toastr.success(`Label "${labelToSend.name}" created`);

          this.resetForm();
        },
        error: (err) => {
          console.error('Creation failed:', err);
          alert('Creation failed: ' + (err.error?.title || 'Unknown error'));
        },
      });
    } else {
      this.labelService.updateLabel(this.newLabel.id, labelToSend).subscribe({
        next: () => {
          this.loadLabels();
          this.toastr.success(`Label "${labelToSend.name}" updated`);
          this.labelService.notifyLabelChange();
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed: ' + (err.error?.title || 'Unknown error'));
        },
      });
    }
  }

  editLabel(label: Label) {
    this.editingLabel = label;
    this.newLabel = { ...label };
    this.showLabelForm = true;
    this.labelService.notifyLabelChange();
  }

  deleteLabel(id: number) {
    if (confirm('Are you sure you want to delete this label?')) {
      this.labelService.deleteLabel(id).subscribe({
        next: () => {
          this.loadLabels();
          const label = this.labels.find((l) => l.id === id);
          this.toastr.success(`Label "${label?.name}" deleted`);
          this.labelService.notifyLabelChange();
        },
        error: () => alert('Delete failed.'),
      });
    }
  }

  resetForm() {
    this.newLabel = { name: '', description: '', colorHex: '#cccccc' };
    this.editingLabel = null;
  }

  cancelEdit() {
    this.showLabelForm = false;
    this.resetForm();
    this.loadLabels();
  }
}
