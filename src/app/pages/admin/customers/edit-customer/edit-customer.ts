import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 

// Servicios y Modelos
import { CustomersService } from '../../../../services/customers.service';
import { Customer } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.scss'
})
export class EditCustomer implements OnInit {
  editForm!: FormGroup;
  customerId!: number;
  customer!: Customer;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef // Inyectamos ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];
    this.loadCustomer();
  }

  /**
   * Inicializa el formulario SOLO con los campos editables (name, address, phone).
   */
  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(15)]]
    });
  }

  /**
   * Carga los datos del cliente, precarga el formulario y fuerza la detección de cambios.
   */
  loadCustomer(): void {
    this.customersService.getById(this.customerId).subscribe({
      next: (response) => {
        this.customer = response.data;
        
        // Precarga SÓLO los campos editables
        this.editForm.patchValue({
          name: this.customer.name,
          address: this.customer.address,
          phone: this.customer.phone
        });

        this.isLoading = false;
        this.cdr.detectChanges(); // Forzamos la detección de cambios para renderizar correctamente
      },
      error: (err) => {
        console.error('Error cargando cliente', err);
        alert('Error al cargar el cliente');
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzamos la detección de cambios en caso de error
        this.router.navigate(['/admin/customers']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true
    const formValue = this.editForm.value; // Usamos .value porque no hay campos deshabilitados
    const updateData: any = {};

    // Construir el DTO de actualización: solo incluye campos si tienen valor
    // Esto es vital ya que todos los campos son opcionales en el DTO del backend
    if (formValue.name) updateData.name = formValue.name;
    if (formValue.address) updateData.address = formValue.address;
    if (formValue.phone) updateData.phone = formValue.phone;
    
    if (Object.keys(updateData).length === 0) {
        alert('No hay cambios para guardar.');
        this.isSaving = false;
        return;
    }

    this.customersService.update(this.customerId, updateData).subscribe({
      next: () => {
        alert('Cliente actualizado exitosamente');
        this.router.navigate(['/admin/customers']);
      },
      error: (err) => {
        console.error('Error actualizando cliente', err);
        alert('Error al actualizar cliente: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/customers']);
  }
}