import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [Navbar],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.scss',
})
export class EmployeeLayout {

}
