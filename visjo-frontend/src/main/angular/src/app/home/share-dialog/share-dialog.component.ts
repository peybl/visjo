import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  link: string = '';

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {
                this.link = this.data.dataKey;
               }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onCopyClick(inputElement: any): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0,0);
  }

}
