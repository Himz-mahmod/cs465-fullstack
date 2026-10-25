import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { History } from './services/history';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Travlr Getaways Admin';
  // Start recording navigation history as soon as the app loads
  private history = inject(History);
}
