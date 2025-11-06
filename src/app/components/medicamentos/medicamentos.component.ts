import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicamentosService } from '../../services/medicamentos.service';
import { AuthService } from '../../services/auth.service';
import { Medicamento } from '../../models/medicamento.model';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  searchTerm: string = '';
  filtroActivo: 'todos' | 'proximos' | 'caducados' = 'todos';
  diasAlerta: number = 30;

  constructor(
    private medicamentosService: MedicamentosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {
    this.medicamentosService.getMedicamentos().subscribe(medicamentos => {
      this.medicamentos = medicamentos;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.medicamentos];

    // Filtro por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(m =>
        m.nombre.toLowerCase().includes(term) ||
        m.lote.toLowerCase().includes(term) ||
        m.proveedor.toLowerCase().includes(term)
      );
    }

    // Filtro por estado de caducidad
    if (this.filtroActivo === 'proximos') {
      resultado = resultado.filter(m =>
        m.diasParaCaducar !== undefined &&
        m.diasParaCaducar <= this.diasAlerta &&
        m.diasParaCaducar >= 0
      );
    } else if (this.filtroActivo === 'caducados') {
      resultado = resultado.filter(m =>
        m.diasParaCaducar !== undefined &&
        m.diasParaCaducar < 0
      );
    }

    // Ordenar por días para caducar (ascendente)
    resultado.sort((a, b) => {
      const diasA = a.diasParaCaducar ?? Infinity;
      const diasB = b.diasParaCaducar ?? Infinity;
      return diasA - diasB;
    });

    this.medicamentosFiltrados = resultado;
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  cambiarFiltro(filtro: 'todos' | 'proximos' | 'caducados'): void {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }

  getEstadoClase(medicamento: Medicamento): string {
    if (medicamento.diasParaCaducar !== undefined) {
      if (medicamento.diasParaCaducar < 0) return 'caducado';
      if (medicamento.diasParaCaducar <= 7) return 'critico';
      if (medicamento.diasParaCaducar <= 30) return 'alerta';
    }
    return 'normal';
  }

  getEstadoTexto(medicamento: Medicamento): string {
    if (medicamento.diasParaCaducar !== undefined) {
      if (medicamento.diasParaCaducar < 0) {
        return `Caducado hace ${Math.abs(medicamento.diasParaCaducar)} días`;
      }
      if (medicamento.diasParaCaducar === 0) {
        return 'Caduca hoy';
      }
      if (medicamento.diasParaCaducar === 1) {
        return 'Caduca mañana';
      }
      return `Caduca en ${medicamento.diasParaCaducar} días`;
    }
    return '';
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
