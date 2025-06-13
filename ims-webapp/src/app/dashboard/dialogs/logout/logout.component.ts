import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LogoutComponent>, ) { }

  ngOnInit(): void {
  }
  closeDialog(): void{
    this.dialogRef.close(false);
  }
}
