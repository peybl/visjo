import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  link: string = 'https:...';

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>) { }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  OnCopyClick(inputElement: any): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0,0);
  }

}
