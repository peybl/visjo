import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/Messages/messages.service';

@Component({
  selector: 'app-messageview',
  templateUrl: './messageview.component.html',
  styleUrls: ['./messageview.component.sass']
})
export class MessageviewComponent implements OnInit {

  constructor(public messageService: MessagesService) { }

  ngOnInit() {
  }

}
