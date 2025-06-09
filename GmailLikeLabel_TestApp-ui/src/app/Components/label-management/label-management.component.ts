import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Label } from '../../Models/label.model';
import { LabelService } from '../../Services/label.service';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { ColDef, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { Email } from '../../Models/email.model';
import { EmailService } from '../../Services/email.service';
ModuleRegistry.registerModules([AllCommunityModule]);
import { ToastrService } from 'ngx-toastr';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-label-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './label-management.component.html',
  styleUrl: './label-management.component.css',
})
export class LabelManagementComponent implements OnInit {
  labels: Label[] = [];
  emails: Email[] = [];
  rowData: Email[] = [];
  newLabel: Label = { name: '', colorHex: '#cccccc', description: '' };
  filteredLabels: Set<number> = new Set();
  editingLabel: Label | null = null;
  selectedLabelFilter: Label | null = null;
  gridApi!: GridApi;
  showAddLabelDropdown: boolean = false;
  showRemoveLabelDropdown: boolean = false;
  columnDefs: ColDef<Email>[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      resizable: false,
    },
    {
      headerName: 'Subject',
      field: 'subject',
      flex: 1,
      resizable: false,
      filter: true,
    },
    {
      headerName: 'Sender',
      field: 'sender',
      flex: 1,
      resizable: false,
      filter: true,
    },
    {
      headerName: 'Date',
      field: 'date',
      flex: 1,
      resizable: false,
      filter: true,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toISOString().split('T')[0];
      },
    },
    {
      headerName: 'Labels',
      field: 'emailLabels',
      flex: 1,
      resizable: false,
      filter: true,
      cellRenderer: (params: ICellRendererParams) => {
        const emailLabels = params.value;
        const rowId = params.node.id;
        const emailId = params.data?.id ?? '';
        const labelsHtml = Array.isArray(emailLabels)
          ? emailLabels
              .map(
                (el) =>
                  `<span class="badge rounded-pill d-inline-flex align-items-center justify-content-between"
                    style="background:${el.label.colorHex}; color:white; padding:4px 10px; margin:2px; gap: 6px;">
                    <span>${el.label.name}</span>
                    <i class="fa-solid fa-circle-xmark text-white remove-label-icon"
                      data-email-id="${params.data.id}"
                      data-label-id="${el.label.id}"
                      style="cursor: pointer;"></i>
                  </span>`
              )
              .join('')
          : '';

        return `
          <div style="position: relative; display: inline-block;">
            ${labelsHtml}
            <button
              id="add-btn-${rowId}"
              data-row-id="${rowId}"
              class="add-label-btn"
            style="background: transparent; border: none; color:rgb(202, 207, 212); cursor: pointer; margin-left: 6px;">
              <i class="fa fa-circle-plus"></i>
            </button>
          </div>
        `;
      },
    },
  ];

  constructor(
    private labelService: LabelService,
    private emailService: EmailService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLabels();
    console.log(this.labels);
    this.loadEmails();
    (window as any).angularComponentRef = this;

    this.labelService.labelChange$.subscribe(() => {
      this.loadLabels();
    });
  }

  loadLabels() {
    this.labelService.getAllLabels().subscribe((data) => {
      this.labels = data;
    });
  }

  loadEmails() {
    this.emailService.getAllEmails().subscribe((data) => {
      this.emails = data;
      this.applyFilters();
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  addLabelToSelected() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (!selectedRows.length) return alert('Select at least one email');

    const labelId = prompt('Enter Label ID to add');
    if (!labelId) return;

    selectedRows.forEach((email) => {
      this.emailService
        .assignLabelsToEmail(email.id, [+labelId])
        .subscribe(() => this.loadEmails());
    });
  }

  removeLabelFromSelected() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (!selectedRows.length) return alert('Select at least one email');

    const labelId = prompt('Enter Label ID to remove');
    if (!labelId) return;

    selectedRows.forEach((email) => {
      this.emailService
        .removeLabelFromEmail(email.id, +labelId)
        .subscribe(() => this.loadEmails());
    });
  }

  toggleAddLabelDropdown() {
    this.showRemoveLabelDropdown = false;
    this.showAddLabelDropdown = !this.showAddLabelDropdown;
  }

  toggleRemoveLabelDropdown() {
    this.showAddLabelDropdown = false;
    this.showRemoveLabelDropdown = !this.showRemoveLabelDropdown;
  }

  assignLabelToSelectedEmails(labelId: number) {
    const selectedRows = this.gridApi?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alert('Please select at least one email.');
      return;
    }
    const label = this.labels.find((l) => l.id === labelId);
    const labelName = label ? label.name : 'Label';
    selectedRows.forEach((email) => {
      this.emailService
        .assignLabelsToEmail(email.id, [labelId])
        .subscribe(() => {
          this.loadEmails();
          this.toastr.success(
            `Applied "${labelName}" label to ${selectedRows.length} items`,
            'Label Applied'
          );
        });
    });

    this.showAddLabelDropdown = false;
  }

  clearFilters(): void {
    this.filteredLabels.clear();
    this.applyFilters();
    this.toastr.info(`All Filters cleared`, 'Filters Reset');
  }

  assignLabelToEmail(emailId: number, labelId: number) {
    this.emailService.assignLabelsToEmail(emailId, [labelId]).subscribe(() => {
      this.loadEmails();
    });
  }

  removeLabelFromSelectedEmails(labelId: number) {
    const selectedRows = this.gridApi?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alert('Please select at least one email.');
      return;
    }
    const label = this.labels.find((l) => l.id === labelId);
    const labelName = label ? label.name : 'Label';
    selectedRows.forEach((email) => {
      this.emailService
        .removeLabelFromEmail(email.id, labelId)
        .subscribe(() => {
          this.loadEmails();
          this.toastr.success(
            `Removed "${labelName}" label from ${selectedRows.length} items`,
            'Label Removed'
          );
        });
    });

    this.showRemoveLabelDropdown = false;
  }

  toggleLabelFilter(label: Label) {
    if (this.filteredLabels.has(label.id!)) {
      this.filteredLabels.delete(label.id!);
      this.toastr.info(
        `Showing items with "${label.name}" label`,
        'Filter Applied'
      );
    } else {
      this.filteredLabels.add(label.id!);
      this.toastr.info(
        `Removing items with "${label.name}" label`,
        'Filter Removed'
      );
    }
    this.applyFilters();
  }

  applyFilters() {
    if (this.filteredLabels.size === 0) {
      this.rowData = [...this.emails];
    } else {
      this.rowData = this.emails.filter((email) =>
        email.emailLabels?.some((el) => this.filteredLabels.has(el.label?.id!))
      );
    }
  }

  onCellClicked(params: any) {
    let target = params.event?.target as HTMLElement;

    while (target && !target.classList.contains('add-label-btn')) {
      target = target.parentElement as HTMLElement;
    }

    if (target?.classList.contains('add-label-btn')) {
      const rowId = target.dataset['rowId'];
      const email = params.data;
      const assignedLabelIds = new Set(
        email.emailLabels?.map((el: any) => el.label.id)
      );
      const availableLabels = this.labels.filter(
        (label) => !assignedLabelIds.has(label.id)
      );

      if (!availableLabels.length) {
        alert('All labels already assigned.');
        return;
      }

      // Remove existing dropdown
      document.getElementById('label-dropdown-floating')?.remove();

      // Create dropdown
      const dropdown = document.createElement('ul');
      dropdown.id = 'label-dropdown-floating';
      dropdown.className = 'dropdown-menu show';
      dropdown.style.position = 'absolute';
      dropdown.style.zIndex = '9999';
      dropdown.style.top = `${
        target.getBoundingClientRect().bottom + window.scrollY
      }px`;
      dropdown.style.left = `${target.getBoundingClientRect().left}px`;
      dropdown.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      dropdown.style.maxHeight = '200px';
      dropdown.style.overflowY = 'auto';

      for (const label of availableLabels) {
        const li = document.createElement('li');
        li.innerHTML = `
        <a href="#" class="dropdown-item d-flex align-items-center gap-2" data-label-id="${label.id}">
          <span class="rounded-circle d-inline-block" style="width: 14px; height: 14px; background-color: ${label.colorHex};"></span>
          ${label.name}
        </a>
      `;
        dropdown.appendChild(li);
      }

      dropdown.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const item = (e.target as HTMLElement).closest('a');
        const labelId = Number(item?.dataset['labelId']);
        if (!labelId) return;
        const labelName =
          this.labels.find((label) => label.id === labelId)?.name || 'Label';
        this.emailService
          .assignLabelsToEmail(email.id, [labelId])
          .subscribe(() => {
            this.loadEmails();
            dropdown.remove();
            this.toastr.success(`Label "${labelName}" Added`, 'Label Added');
          });
      });

      document.body.appendChild(dropdown);
    }
    if (target.classList.contains('remove-label-icon')) {
      const emailId = Number(target.getAttribute('data-email-id'));
      const labelId = Number(target.getAttribute('data-label-id'));

      if (!emailId || !labelId) return;
      const labelName =
        this.labels.find((label) => label.id === labelId)?.name || 'Label';
      this.emailService.removeLabelFromEmail(emailId, labelId).subscribe(() => {
        this.loadEmails();
        this.toastr.success(`Label "${labelName}" removed`, 'Label Removed');
      });
    }
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      // add label to grid
      if (
        !target.closest('[id^="add-btn-"]') &&
        !target.closest('[id^="dropdown-"]')
      ) {
        document.querySelectorAll('[id^="dropdown-"]').forEach((dropdown) => {
          (dropdown as HTMLElement).style.display = 'none';
        });
      }

      // remove label from grid
      if (target.classList.contains('remove-label-icon')) {
        const emailId = Number(target.getAttribute('data-email-id'));
        const labelId = Number(target.getAttribute('data-label-id'));
        const labelName =
          this.labels.find((l) => l.id === labelId)?.name || 'Label';
        if (!emailId || !labelId) return;

        this.emailService
          .removeLabelFromEmail(emailId, labelId)
          .subscribe(() => {
            this.loadEmails();
            this.toastr.success(`Label "${labelName}" removed`);
          });

        return;
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!target.closest('.position-relative')) {
      this.showAddLabelDropdown = false;
      this.showRemoveLabelDropdown = false;
    }

    const dropdown = document.getElementById('label-dropdown-floating');
    if (
      dropdown &&
      !dropdown.contains(target) &&
      !target.closest('.add-label-btn')
    ) {
      dropdown.remove();
    }
  }
}
