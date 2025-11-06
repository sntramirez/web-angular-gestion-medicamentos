import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicosService } from '../../services/medicos.service';
import { AuthService } from '../../services/auth.service';
import { Medico, MedicoRequest } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  medicosFiltrados: Medico[] = [];
  searchTerm: string = '';
  filtroEstado: 'todos' | 'activo' | 'inactivo' = 'todos';

  // Para el modal de crear/editar
  showModal: boolean = false;
  isEditMode: boolean = false;
  medicoSeleccionado: Medico | null = null;

  medicoForm: MedicoRequest = {
    nombre: '',
    apellidos: '',
    especialidad: '',
    numeroLicencia: '',
    telefono: '',
    email: '',
    estado: 'activo'
  };

  constructor(
    private medicosService: MedicosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.medicosService.getMedicos().subscribe(medicos => {
      this.medicos = medicos;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.medicos];

    // Filtro por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(m =>
        m.nombre.toLowerCase().includes(term) ||
        m.apellidos.toLowerCase().includes(term) ||
        m.especialidad.toLowerCase().includes(term) ||
        m.numeroLicencia.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(m => m.estado === this.filtroEstado);
    }

    this.medicosFiltrados = resultado;
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  cambiarFiltro(filtro: 'todos' | 'activo' | 'inactivo'): void {
    this.filtroEstado = filtro;
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.isEditMode = false;
    this.medicoSeleccionado = null;
    this.medicoForm = {
      nombre: '',
      apellidos: '',
      especialidad: '',
      numeroLicencia: '',
      telefono: '',
      email: '',
      estado: 'activo'
    };
    this.showModal = true;
  }

  abrirModalEditar(medico: Medico): void {
    this.isEditMode = true;
    this.medicoSeleccionado = medico;
    this.medicoForm = {
      nombre: medico.nombre,
      apellidos: medico.apellidos,
      especialidad: medico.especialidad,
      numeroLicencia: medico.numeroLicencia,
      telefono: medico.telefono,
      email: medico.email,
      estado: medico.estado
    };
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.medicoSeleccionado = null;
  }

  guardarMedico(): void {
    if (this.isEditMode && this.medicoSeleccionado) {
      this.medicosService.updateMedico(this.medicoSeleccionado.id, this.medicoForm).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarMedicos();
        },
        error: (error) => console.error('Error al actualizar médico:', error)
      });
    } else {
      this.medicosService.addMedico(this.medicoForm).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarMedicos();
        },
        error: (error) => console.error('Error al crear médico:', error)
      });
    }
  }

  eliminarMedico(medico: Medico): void {
    if (confirm(`¿Está seguro de eliminar al médico ${medico.nombre} ${medico.apellidos}?`)) {
      this.medicosService.deleteMedico(medico.id).subscribe({
        next: () => {
          this.cargarMedicos();
        },
        error: (error) => console.error('Error al eliminar médico:', error)
      });
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
